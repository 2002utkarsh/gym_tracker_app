import { Platform } from 'react-native';
import { db } from './index';
import { mockState } from './mock';
import { getSetsForWorkout, Set } from './set';

export interface ExerciseProgress {
    exercise_id: number;
    exercise_name: string;
    current_sets: Set[];
    previous_sets: Set[];
    weight_change: number; // positive = increased, negative = decreased, 0 = same
    volume_change: number; // total volume change (sets × reps × weight)
    is_pr: boolean; // personal record for max weight
}

export interface WorkoutSummary {
    workout_id: number;
    total_exercises: number;
    total_sets: number;
    total_volume: number; // sum of all (sets × reps × weight)
    duration_minutes: number;
    exercises_progress: ExerciseProgress[];
}

// Get the previous workout that included a specific exercise
const getPreviousWorkoutForExercise = (exerciseId: number, currentWorkoutId: number): number | null => {
    if (Platform.OS === 'web') {
        // Find the most recent workout before current that has this exercise
        const previousWorkouts = mockState.workouts
            .filter(w => w.id < currentWorkoutId)
            .sort((a, b) => b.id - a.id);

        for (const workout of previousWorkouts) {
            const hasExercise = mockState.sets.some(
                s => s.workout_id === workout.id && s.exercise_id === exerciseId
            );
            if (hasExercise) {
                return workout.id;
            }
        }
        return null;
    }

    const result = db.getAllSync(`
        SELECT DISTINCT s.workout_id
        FROM sets s
        WHERE s.exercise_id = ? AND s.workout_id < ?
        ORDER BY s.workout_id DESC
        LIMIT 1
    `, [exerciseId, currentWorkoutId]);

    return result.length > 0 ? result[0].workout_id : null;
};

// Calculate progress for a single exercise
const calculateExerciseProgress = (
    exerciseId: number,
    exerciseName: string,
    currentWorkoutId: number,
    currentSets: Set[]
): ExerciseProgress => {
    const previousWorkoutId = getPreviousWorkoutForExercise(exerciseId, currentWorkoutId);

    let previousSets: Set[] = [];
    if (previousWorkoutId) {
        if (Platform.OS === 'web') {
            previousSets = mockState.sets.filter(
                s => s.workout_id === previousWorkoutId && s.exercise_id === exerciseId
            );
        } else {
            previousSets = db.getAllSync(
                'SELECT * FROM sets WHERE workout_id = ? AND exercise_id = ? ORDER BY set_order',
                [previousWorkoutId, exerciseId]
            ) as Set[];
        }
    }

    // Calculate max weight for both workouts
    const currentMaxWeight = currentSets.length > 0
        ? Math.max(...currentSets.map(s => s.weight))
        : 0;
    const previousMaxWeight = previousSets.length > 0
        ? Math.max(...previousSets.map(s => s.weight))
        : 0;

    // Calculate weight change
    const weight_change = previousSets.length === 0
        ? 0
        : currentMaxWeight - previousMaxWeight;

    // Calculate volume (sets × reps × weight)
    const currentVolume = currentSets.reduce((sum, s) => sum + (s.reps * s.weight), 0);
    const previousVolume = previousSets.reduce((sum, s) => sum + (s.reps * s.weight), 0);
    const volume_change = previousSets.length === 0 ? 0 : currentVolume - previousVolume;

    // Check if this is a PR (personal record)
    const is_pr = previousSets.length > 0 && currentMaxWeight > previousMaxWeight;

    return {
        exercise_id: exerciseId,
        exercise_name: exerciseName,
        current_sets: currentSets,
        previous_sets: previousSets,
        weight_change,
        volume_change,
        is_pr,
    };
};

// Get complete workout summary with all progress data
export const getWorkoutSummary = (workoutId: number): WorkoutSummary => {
    const sets = getSetsForWorkout(workoutId);

    // Group sets by exercise
    const exerciseGroups = sets.reduce((acc, set) => {
        if (!acc[set.exercise_id]) {
            acc[set.exercise_id] = [];
        }
        acc[set.exercise_id].push(set);
        return acc;
    }, {} as Record<number, Set[]>);

    // Get exercise names
    let exerciseNames: Record<number, string> = {};
    if (Platform.OS === 'web') {
        mockState.exercises.forEach(ex => {
            exerciseNames[ex.id] = ex.name;
        });
    } else {
        const exercises = db.getAllSync('SELECT id, name FROM exercises');
        exercises.forEach((ex: any) => {
            exerciseNames[ex.id] = ex.name;
        });
    }

    // Calculate progress for each exercise
    const exercises_progress: ExerciseProgress[] = Object.entries(exerciseGroups).map(
        ([exerciseId, exerciseSets]) => {
            const exId = Number(exerciseId);
            return calculateExerciseProgress(
                exId,
                exerciseNames[exId] || 'Unknown',
                workoutId,
                exerciseSets
            );
        }
    );

    // Calculate totals
    const total_volume = sets.reduce((sum, s) => sum + (s.reps * s.weight), 0);

    return {
        workout_id: workoutId,
        total_exercises: Object.keys(exerciseGroups).length,
        total_sets: sets.length,
        total_volume,
        duration_minutes: 0, // We can calculate this later if we track start/end time
        exercises_progress,
    };
};
