import { Platform } from 'react-native';
import { db } from './index';
import { mockState } from './mock';

export interface User {
    id: number;
    name: string;
    weight: number;
    height: number;
    goal: string;
    unit: string;
}

export const getUser = (): User | null => {
    if (Platform.OS === 'web') {
        return mockState.user;
    }
    const result = db.getAllSync('SELECT * FROM users LIMIT 1');
    if (result.length > 0) {
        return result[0] as User;
    }
    return null;
};

export const createUser = (name: string, weight: number, height: number, goal: string, unit: string = 'kg') => {
    if (Platform.OS === 'web') {
        mockState.user = { id: 1, name, weight, height, goal, unit };
        return;
    }
    db.runSync(
        'INSERT INTO users (name, weight, height, goal, unit) VALUES (?, ?, ?, ?, ?)',
        [name, weight, height, goal, unit]
    );
};

export const updateUser = (id: number, name: string, weight: number, height: number, goal: string, unit: string) => {
    if (Platform.OS === 'web') {
        if (mockState.user) {
            mockState.user = { ...mockState.user, name, weight, height, goal, unit };
        }
        return;
    }
    db.runSync(
        'UPDATE users SET name = ?, weight = ?, height = ?, goal = ?, unit = ? WHERE id = ?',
        [name, weight, height, goal, unit, id]
    );
};
