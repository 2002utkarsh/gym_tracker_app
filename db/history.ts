import { Platform } from 'react-native';
import { db } from './index';
import { mockState } from './mock';

export interface RecentWorkout {
    id: number;
    date: string;
    exercise_count: number;
    total_sets: number;
}

export const getRecentWorkouts = (limit: number = 5): RecentWorkout[] => {
    if (Platform.OS === 'web') {
        return mockState.workouts
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, limit)
            .map(w => {
                const workoutSets = mockState.sets.filter(s => s.workout_id === w.id);
                const exerciseCount = new Set(workoutSets.map(s => s.exercise_id)).size;
                return {
                    id: w.id,
                    date: w.date,
                    exercise_count: exerciseCount,
                    total_sets: workoutSets.length
                };
            });
    }

    return db.getAllSync(
        `SELECT w.id, w.date, 
            COUNT(DISTINCT we.exercise_id) as exercise_count,
            COUNT(s.id) as total_sets
     FROM workouts w
     LEFT JOIN workout_exercises we ON w.id = we.workout_id
     LEFT JOIN sets s ON w.id = s.workout_id
     GROUP BY w.id
     ORDER BY w.date DESC
     LIMIT ?`,
        [limit]
    ) as RecentWorkout[];
};

export const getWeeklyWorkoutCount = (): number => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

    if (Platform.OS === 'web') {
        return mockState.workouts.filter(w => w.date >= oneWeekAgo).length;
    }

    const result = db.getAllSync(
        'SELECT COUNT(*) as count FROM workouts WHERE date >= ?',
        [oneWeekAgo]
    ) as { count: number }[];

    return result[0]?.count || 0;
};
