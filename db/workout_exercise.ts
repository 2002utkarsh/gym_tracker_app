import { Platform } from 'react-native';
import { db } from './index';
import { mockState } from './mock';

export interface WorkoutExercise {
    id: number;
    workout_id: number;
    exercise_id: number;
    exercise_name: string; // Joined field
}

export const addWorkoutExercise = (workoutId: number, exerciseId: number) => {
    if (Platform.OS === 'web') {
        const existing = mockState.workoutExercises.find(
            we => we.workout_id === workoutId && we.exercise_id === exerciseId
        );
        if (!existing) {
            mockState.workoutExercises.push({
                id: mockState.workoutExercises.length + 1,
                workout_id: workoutId,
                exercise_id: exerciseId
            });
        }
        return;
    }
    // Check if already exists
    const existing = db.getAllSync(
        'SELECT * FROM workout_exercises WHERE workout_id = ? AND exercise_id = ?',
        [workoutId, exerciseId]
    );

    if (existing.length === 0) {
        db.runSync(
            'INSERT INTO workout_exercises (workout_id, exercise_id) VALUES (?, ?)',
            [workoutId, exerciseId]
        );
    }
};

export const getWorkoutExercises = (workoutId: number): WorkoutExercise[] => {
    if (Platform.OS === 'web') {
        return mockState.workoutExercises
            .filter(we => we.workout_id === workoutId)
            .map(we => {
                const exercise = mockState.exercises.find(e => e.id === we.exercise_id);
                return {
                    ...we,
                    exercise_name: exercise ? exercise.name : 'Unknown'
                };
            });
    }
    return db.getAllSync(
        `SELECT we.id, we.workout_id, we.exercise_id, e.name as exercise_name 
     FROM workout_exercises we 
     JOIN exercises e ON we.exercise_id = e.id 
     WHERE we.workout_id = ?`,
        [workoutId]
    ) as WorkoutExercise[];
};
