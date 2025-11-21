import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { getWorkout, Workout } from '../../db/workout';
import { getWorkoutExercises, WorkoutExercise } from '../../db/workout_exercise';
import { getSetsForWorkout, Set } from '../../db/set';
import { Button } from '../../components/Button';
import { ExerciseCard } from '../../components/ExerciseCard';
import { Colors, Spacing, Shadows } from '../../constants/theme';

export default function WorkoutScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [workout, setWorkout] = useState<Workout | null>(null);
    const [exercises, setExercises] = useState<WorkoutExercise[]>([]);
    const [sets, setSets] = useState<Set[]>([]);
    const [loading, setLoading] = useState(true);

    const loadData = useCallback(() => {
        if (!id) return;
        const w = getWorkout(Number(id));
        const e = getWorkoutExercises(Number(id));
        const s = getSetsForWorkout(Number(id));

        setWorkout(w);
        setExercises(e);
        setSets(s);
        setLoading(false);
    }, [id]);

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [loadData])
    );

    const handleSetAdded = () => {
        loadData(); // Refresh sets
    };

    if (loading) {
        return <ActivityIndicator style={styles.loading} color={Colors.primary} />;
    }

    if (!workout) {
        return (
            <View style={styles.container}>
                <Text style={{ color: Colors.text }}>Workout not found</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.container}
            >
                <View style={styles.header}>
                    <View>
                        <Text style={styles.headerTitle}>Active Workout</Text>
                        <Text style={styles.date}>
                            {new Date(workout.date).toLocaleDateString(undefined, {
                                weekday: 'long',
                                month: 'short',
                                day: 'numeric'
                            })}
                        </Text>
                    </View>
                    {/* Placeholder for timer or other header actions */}
                </View>

                <FlatList
                    data={exercises}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item }) => (
                        <ExerciseCard
                            workoutExercise={item}
                            currentSets={sets.filter(s => s.exercise_id === item.exercise_id)}
                            onSetAdded={handleSetAdded}
                        />
                    )}
                    contentContainerStyle={styles.listContent}
                    ListFooterComponent={
                        <Button
                            title="+ Add Exercise"
                            variant="secondary"
                            onPress={() => router.push({ pathname: '/workout/select-exercise', params: { workoutId: id } })}
                            style={styles.addExerciseButton}
                        />
                    }
                />

                <View style={styles.footer}>
                    <Button
                        title="Finish Workout"
                        size="large"
                        onPress={() => router.push(`/workout/summary/${id}`)}
                        style={styles.finishButton}
                    />
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    container: {
        flex: 1,
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: Colors.background,
    },
    header: {
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
        backgroundColor: Colors.background,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    headerTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.primary,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    date: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.text,
    },
    listContent: {
        padding: Spacing.md,
        paddingBottom: 100, // Space for footer
    },
    addExerciseButton: {
        marginTop: Spacing.md,
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: Colors.primary,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: Colors.surface,
        padding: Spacing.md,
        paddingBottom: Platform.OS === 'ios' ? Spacing.xl : Spacing.md,
        borderTopWidth: 1,
        borderTopColor: Colors.border,
        ...Shadows.md,
    },
    finishButton: {
        width: '100%',
    },
});
