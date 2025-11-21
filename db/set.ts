import { Platform } from 'react-native';
import { db } from './index';
import { mockState } from './mock';

export interface Set {
    id: number;
    workout_id: number;
    exercise_id: number;
    weight: number;
    reps: number;
    set_order: number;
}

export const addSet = (workoutId: number, exerciseId: number, weight: number, reps: number, order: number) => {
    if (Platform.OS === 'web') {
        const newId = mockState.sets.length + 1;
        mockState.sets.push({
            id: newId,
            workout_id: workoutId,
            exercise_id: exerciseId,
            weight,
            reps,
            set_order: order
        });
        return;
    }
    db.runSync(
        'INSERT INTO sets (workout_id, exercise_id, weight, reps, set_order) VALUES (?, ?, ?, ?, ?)',
        [workoutId, exerciseId, weight, reps, order]
    );
};

export const getSetsForWorkout = (workoutId: number): Set[] => {
    if (Platform.OS === 'web') {
        return mockState.sets
            .filter(s => s.workout_id === workoutId)
            .sort((a, b) => a.set_order - b.set_order);
    }
    return db.getAllSync(
        'SELECT * FROM sets WHERE workout_id = ? ORDER BY set_order ASC',
        [workoutId]
    ) as Set[];
};

export const getLastWorkoutStats = (exerciseId: number, currentWorkoutId: number): Set[] | null => {
    if (Platform.OS === 'web') {
        // Find last workout for this exercise
        const workoutsWithExercise = mockState.workouts
            .filter(w => w.id !== currentWorkoutId &&
                mockState.sets.some(s => s.workout_id === w.id && s.exercise_id === exerciseId))
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        if (workoutsWithExercise.length > 0) {
            const lastWorkoutId = workoutsWithExercise[0].id;
            return getSetsForWorkout(lastWorkoutId);
        }
        return null;
    }
    // Find the last workout ID where this exercise was performed, excluding the current one
    const result = db.getAllSync(
        `SELECT w.id
     FROM workouts w
     JOIN sets s ON w.id = s.workout_id
     WHERE s.exercise_id = ? AND w.id != ?
     ORDER BY w.date DESC
     LIMIT 1`,
        [exerciseId, currentWorkoutId]
    );

    if (result.length > 0) {
        // @ts-ignore
        const lastWorkoutId = result[0].id;
        return getSetsForWorkout(lastWorkoutId);
    }
    return null;
};
