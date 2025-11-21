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
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title}>{template.name}</Text>
                    {template.description && (
                        <Text style={styles.description}>{template.description}</Text>
                    )}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Exercises ({exercises.length})</Text>
                    {exercises.map((ex, index) => (
                        <View key={ex.id} style={styles.exerciseItem}>
                            <View style={styles.exerciseNumberContainer}>
                                <Text style={styles.exerciseNumber}>{index + 1}</Text>
                            </View>
                            <Text style={styles.exerciseName}>{ex.exercise_name}</Text>
                        </View>
                    ))}
                </View>

                <Button
                    title="Delete Template"
                    variant="danger"
                    onPress={handleDelete}
                    style={styles.deleteButton}
                />
            </ScrollView>

            {exercises.length > 0 && (
                <View style={styles.footer}>
                    <Button
                        title="Start Workout"
                        onPress={handleStartWorkout}
                        size="large"
                    />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    content: {
        padding: Spacing.lg,
        paddingBottom: 100, // Space for footer
    },
    header: {
        marginBottom: Spacing.xl,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: Spacing.sm,
    },
    description: {
        fontSize: 16,
        color: Colors.textSecondary,
        lineHeight: 24,
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
        borderRadius: BorderRadius.lg,
        marginBottom: Spacing.sm,
        ...Shadows.sm,
    },
    exerciseNumberContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: Colors.surfaceHighlight,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.md,
    },
    exerciseNumber: {
        fontSize: 14,
        fontWeight: 'bold',
        color: Colors.primary,
    },
    exerciseName: {
        fontSize: 16,
        fontWeight: '500',
        color: Colors.text,
        flex: 1,
    },
    deleteButton: {
        marginTop: Spacing.lg,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: Colors.surface,
        padding: Spacing.lg,
        borderTopWidth: 1,
        borderTopColor: Colors.border,
        ...Shadows.md, // Add shadow for separation
    },
    error: {
        fontSize: 16,
        color: Colors.textSecondary,
        textAlign: 'center',
        marginTop: Spacing.xl,
    },
});
