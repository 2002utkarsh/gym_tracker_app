import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { getWorkout, Workout } from '../../db/workout';
import { getWorkoutExercises, WorkoutExercise } from '../../db/workout_exercise';
import { getSetsForWorkout, Set } from '../../db/set';
import { Button } from '../../components/Button';
import { ExerciseCard } from '../../components/ExerciseCard';
import { Colors, Spacing } from '../../constants/theme';

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
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.date}>
                {new Date(workout.date).toLocaleDateString(undefined, {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })}
            </Text>

            {exercises.map(ex => (
                <ExerciseCard
                    key={ex.id}
                    workoutExercise={ex}
                    currentSets={sets.filter(s => s.exercise_id === ex.exercise_id)}
                    onSetAdded={handleSetAdded}
                />
            ))}

            <Button
                title="Add Exercise"
                variant="secondary"
                onPress={() => router.push({ pathname: '/workout/select-exercise', params: { workoutId: id } })}
                style={{ marginBottom: Spacing.xl }}
            />

            <View style={styles.spacer} />

            <Button
                title="Finish Workout"
                onPress={() => router.push(`/workout/summary/${id}`)}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: Spacing.lg,
        backgroundColor: Colors.background,
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: Colors.background,
    },
    date: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: Spacing.lg,
        color: Colors.text,
    },
    spacer: {
        height: 20,
    },
});
