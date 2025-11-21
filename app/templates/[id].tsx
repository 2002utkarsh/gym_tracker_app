import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getTemplate, getTemplateExercises, deleteTemplate, TemplateExercise } from '../../db/template';
import { createWorkout } from '../../db/workout';
import { addWorkoutExercise } from '../../db/workout_exercise';
import { Button } from '../../components/Button';
import { Colors, Spacing, BorderRadius, Shadows } from '../../constants/theme';

export default function TemplateDetailScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const [template, setTemplate] = useState<any>(null);
    const [exercises, setExercises] = useState<TemplateExercise[]>([]);

    useEffect(() => {
        if (id) {
            const t = getTemplate(Number(id));
            const e = getTemplateExercises(Number(id));
            setTemplate(t);
            setExercises(e);
        }
    }, [id]);

    const handleStartWorkout = () => {
        const workoutId = createWorkout();
        exercises.forEach(ex => {
            addWorkoutExercise(workoutId, ex.exercise_id);
        });
        router.replace(`/workout/${workoutId}`);
    };

    const handleDelete = () => {
        Alert.alert(
            'Delete Template',
            'Are you sure you want to delete this template?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        deleteTemplate(Number(id));
                        router.back();
                    }
                }
            ]
        );
    };

    if (!template) {
        return (
            <View style={styles.container}>
                <Text style={styles.error}>Template not found</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.title}>{template.name}</Text>
            {template.description && (
                <Text style={styles.description}>{template.description}</Text>
            )}

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Exercises ({exercises.length})</Text>
                {exercises.map((ex, index) => (
                    <View key={ex.id} style={styles.exerciseItem}>
                        <Text style={styles.exerciseNumber}>{index + 1}</Text>
                        <Text style={styles.exerciseName}>{ex.exercise_name}</Text>
                    </View>
                ))}
            </View>

            {exercises.length > 0 && (
                <Button
                    title="Start Workout from Template"
                    onPress={handleStartWorkout}
                    style={styles.button}
                />
            )}

            <Button
                title="Delete Template"
                variant="danger"
                onPress={handleDelete}
                style={styles.button}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    content: {
        padding: Spacing.lg,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 8,
    },
    description: {
        fontSize: 16,
        color: Colors.textSecondary,
        marginBottom: Spacing.lg,
    },
    section: {
        marginBottom: Spacing.xl,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.text,
        marginBottom: Spacing.md,
    },
    exerciseItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.surface,
        padding: Spacing.md,
        borderRadius: BorderRadius.md,
        marginBottom: Spacing.sm,
        ...Shadows.sm,
    },
    exerciseNumber: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.primary,
        marginRight: Spacing.md,
        width: 24,
    },
    exerciseName: {
        fontSize: 16,
        color: Colors.text,
        flex: 1,
    },
    button: {
        marginBottom: Spacing.md,
    },
    error: {
        fontSize: 16,
        color: Colors.textSecondary,
        textAlign: 'center',
        marginTop: Spacing.xl,
    },
});
