import { Platform } from 'react-native';
import { db } from './index';
import { mockState } from './mock';

export interface Workout {
    id: number;
    date: string;
    notes: string | null;
}

export const createWorkout = (): number => {
    const date = new Date().toISOString();
    if (Platform.OS === 'web') {
        const newId = mockState.workouts.length + 1;
        mockState.workouts.push({ id: newId, date, notes: null });
        return newId;
    }
    const result = db.runSync('INSERT INTO workouts (date) VALUES (?)', [date]);
    return result.lastInsertRowId;
};

export const getWorkout = (id: number): Workout | null => {
    if (Platform.OS === 'web') {
        return mockState.workouts.find(w => w.id === id) || null;
    }
    const result = db.getAllSync('SELECT * FROM workouts WHERE id = ?', [id]);
    if (result.length > 0) {
        return result[0] as Workout;
    }
    return null;
};

export function deleteWorkout(workoutId: number): void {
    if (Platform.OS === 'web') {
        // Delete from mock state
        // Delete sets for this workout
        mockState.sets = mockState.sets.filter((s: any) => s.workout_id !== workoutId);
        // Delete workout exercises
        mockState.workoutExercises = mockState.workoutExercises.filter((we: any) => we.workout_id !== workoutId);
        // Delete workout
        mockState.workouts = mockState.workouts.filter((w: any) => w.id !== workoutId);
        return;
    }

    // Delete from native database
    db.withTransactionSync(() => {
        // Delete sets (via workout_exercises)
        db.runSync(`
            DELETE FROM sets 
            WHERE workout_exercise_id IN (
                SELECT id FROM workout_exercises WHERE workout_id = ?
            )
        `, [workoutId]);

        // Delete workout exercises
        db.runSync('DELETE FROM workout_exercises WHERE workout_id = ?', [workoutId]);

        // Delete workout
        db.runSync('DELETE FROM workouts WHERE id = ?', [workoutId]);
    });
}
