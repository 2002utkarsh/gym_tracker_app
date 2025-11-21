import { Platform } from 'react-native';
import { db } from './index';
import { mockState } from './mock';

export interface WorkoutTemplate {
    id: number;
    name: string;
    description: string | null;
    created_at: string;
}

export interface TemplateExercise {
    id: number;
    template_id: number;
    exercise_id: number;
    exercise_name?: string;
    order_index: number;
}

export const createTemplate = (name: string, description: string | null = null): number => {
    const created_at = new Date().toISOString();
    if (Platform.OS === 'web') {
        const newId = mockState.templates.length + 1;
        mockState.templates.push({ id: newId, name, description, created_at });
        return newId;
    }
    const result = db.runSync(
        'INSERT INTO workout_templates (name, description, created_at) VALUES (?, ?, ?)',
        [name, description, created_at]
    );
    return result.lastInsertRowId;
};

export const getTemplates = (): WorkoutTemplate[] => {
    if (Platform.OS === 'web') {
        return mockState.templates;
    }
    return db.getAllSync('SELECT * FROM workout_templates ORDER BY created_at DESC') as WorkoutTemplate[];
};

export const getTemplate = (id: number): WorkoutTemplate | null => {
    if (Platform.OS === 'web') {
        return mockState.templates.find(t => t.id === id) || null;
    }
    const result = db.getAllSync('SELECT * FROM workout_templates WHERE id = ?', [id]);
    if (result.length > 0) {
        return result[0] as WorkoutTemplate;
    }
    return null;
};

export const deleteTemplate = (id: number) => {
    if (Platform.OS === 'web') {
        mockState.templates = mockState.templates.filter(t => t.id !== id);
        mockState.templateExercises = mockState.templateExercises.filter(te => te.template_id !== id);
        return;
    }
    db.runSync('DELETE FROM template_exercises WHERE template_id = ?', [id]);
    db.runSync('DELETE FROM workout_templates WHERE id = ?', [id]);
};

export const addExerciseToTemplate = (templateId: number, exerciseId: number, orderIndex: number) => {
    if (Platform.OS === 'web') {
        const newId = mockState.templateExercises.length + 1;
        mockState.templateExercises.push({
            id: newId,
            template_id: templateId,
            exercise_id: exerciseId,
            order_index: orderIndex
        });
        return newId;
    }
    const result = db.runSync(
        'INSERT INTO template_exercises (template_id, exercise_id, order_index) VALUES (?, ?, ?)',
        [templateId, exerciseId, orderIndex]
    );
    return result.lastInsertRowId;
};

export const getTemplateExercises = (templateId: number): TemplateExercise[] => {
    if (Platform.OS === 'web') {
        const templateExercises = mockState.templateExercises.filter(te => te.template_id === templateId);
        return templateExercises.map(te => {
            const exercise = mockState.exercises.find(e => e.id === te.exercise_id);
            return {
                ...te,
                exercise_name: exercise?.name
            };
        });
    }
    const result = db.getAllSync(`
        SELECT te.*, e.name as exercise_name
        FROM template_exercises te
        JOIN exercises e ON te.exercise_id = e.id
        WHERE te.template_id = ?
        ORDER BY te.order_index
    `, [templateId]);
    return result as TemplateExercise[];
};

export const removeExerciseFromTemplate = (templateExerciseId: number) => {
    if (Platform.OS === 'web') {
        mockState.templateExercises = mockState.templateExercises.filter(te => te.id !== templateExerciseId);
        return;
    }
    db.runSync('DELETE FROM template_exercises WHERE id = ?', [templateExerciseId]);
};
