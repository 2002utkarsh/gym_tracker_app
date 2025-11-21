import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { Set, getLastWorkoutStats, addSet } from '../db/set';
import { WorkoutExercise } from '../db/workout_exercise';
import { Button } from './Button';
import { Colors, Spacing, BorderRadius, Shadows } from '../constants/theme';

interface ExerciseCardProps {
    workoutExercise: WorkoutExercise;
    currentSets: Set[];
    onSetAdded: () => void;
}

export const ExerciseCard = ({ workoutExercise, currentSets, onSetAdded }: ExerciseCardProps) => {
    const [weight, setWeight] = useState('');
    const [reps, setReps] = useState('');
    const [lastStats, setLastStats] = useState<Set[] | null>(null);

    useEffect(() => {
        const stats = getLastWorkoutStats(workoutExercise.exercise_id, workoutExercise.workout_id);
        setLastStats(stats);
    }, []);

    const handleAddSet = () => {
        if (!weight || !reps) return;

        addSet(
            workoutExercise.workout_id,
            workoutExercise.exercise_id,
            parseFloat(weight),
            parseInt(reps),
            currentSets.length + 1
        );

        setWeight(currentSets.length > 0 ? currentSets[currentSets.length - 1].weight.toString() : weight);
        setReps(''); // Clear reps but keep weight as convenience
        onSetAdded();
    };

    return (
        <View style={styles.card}>
            <Text style={styles.title}>{workoutExercise.exercise_name}</Text>

            {lastStats && lastStats.length > 0 && (
                <View style={styles.lastStats}>
                    <Text style={styles.lastStatsTitle}>Last time:</Text>
                    {lastStats.map((s, i) => (
                        <Text key={i} style={styles.lastStatsText}>
                            Set {i + 1}: {s.weight}kg x {s.reps}
                        </Text>
                    ))}
                </View>
            )}

            <View style={styles.headerRow}>
                <Text style={styles.colHeader}>Set</Text>
                <Text style={styles.colHeader}>kg</Text>
                <Text style={styles.colHeader}>Reps</Text>
            </View>

            {currentSets.map((set, index) => (
                <View key={set.id} style={styles.row}>
                    <Text style={styles.colText}>{index + 1}</Text>
                    <Text style={styles.colText}>{set.weight}</Text>
                    <Text style={styles.colText}>{set.reps}</Text>
                </View>
            ))}

            <View style={styles.inputRow}>
                <Text style={styles.colText}>{currentSets.length + 1}</Text>
                <TextInput
                    style={styles.input}
                    value={weight}
                    onChangeText={setWeight}
                    keyboardType="numeric"
                    placeholder="kg"
                    placeholderTextColor={Colors.textSecondary}
                />
                <TextInput
                    style={styles.input}
                    value={reps}
                    onChangeText={setReps}
                    keyboardType="numeric"
                    placeholder="Reps"
                    placeholderTextColor={Colors.textSecondary}
                />
            </View>

            <Button title="Log Set" onPress={handleAddSet} />
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.lg,
        padding: Spacing.md,
        marginBottom: Spacing.md,
        ...Shadows.sm,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: Spacing.md,
        color: Colors.text,
    },
    lastStats: {
        backgroundColor: Colors.surfaceHighlight,
        padding: Spacing.sm,
        borderRadius: BorderRadius.sm,
        marginBottom: Spacing.md,
    },
    lastStatsTitle: {
        fontSize: 12,
        fontWeight: '600',
        color: Colors.primary,
        marginBottom: 4,
    },
    lastStatsText: {
        fontSize: 12,
        color: Colors.textSecondary,
    },
    headerRow: {
        flexDirection: 'row',
        marginBottom: Spacing.sm,
        paddingHorizontal: 4,
    },
    row: {
        flexDirection: 'row',
        marginBottom: Spacing.sm,
        paddingHorizontal: 4,
        alignItems: 'center',
    },
    colHeader: {
        flex: 1,
        fontWeight: '600',
        fontSize: 14,
        textAlign: 'center',
        color: Colors.textSecondary,
    },
    colText: {
        flex: 1,
        textAlign: 'center',
        fontSize: 16,
        color: Colors.text,
    },
    inputRow: {
        flexDirection: 'row',
        marginBottom: Spacing.md,
        alignItems: 'center',
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: BorderRadius.sm,
        padding: Spacing.sm,
        marginHorizontal: 4,
        textAlign: 'center',
        backgroundColor: Colors.background,
        color: Colors.text,
    },
});
