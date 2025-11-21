import { Platform } from 'react-native';
import { db } from './index';
import { mockState } from './mock';

export interface Exercise {
    id: number;
    name: string;
    muscle_group: string;
    is_custom: number;
}

export const getExercises = (): Exercise[] => {
    if (Platform.OS === 'web') {
        return mockState.exercises;
    }
    return db.getAllSync('SELECT * FROM exercises ORDER BY name ASC') as Exercise[];
};

export const addExercise = (name: string, muscleGroup: string): number => {
    if (Platform.OS === 'web') {
        const newId = mockState.exercises.length + 1;
        mockState.exercises.push({ id: newId, name, muscle_group: muscleGroup, is_custom: 1 });
        return newId;
    }
    const result = db.runSync(
        'INSERT INTO exercises (name, muscle_group, is_custom) VALUES (?, ?, 1)',
        [name, muscleGroup]
    );
    return result.lastInsertRowId;
};
