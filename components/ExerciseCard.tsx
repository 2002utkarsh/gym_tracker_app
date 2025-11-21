import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Set, getLastWorkoutStats, addSet, updateSet } from '../db/set';
import { WorkoutExercise } from '../db/workout_exercise';
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

        // Haptic feedback on set completion
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        setWeight(currentSets.length > 0 ? currentSets[currentSets.length - 1].weight.toString() : weight);
        setReps('');
        onSetAdded();
    };

    const handleUpdateSet = (id: number, newWeight: string, newReps: string) => {
        if (!newWeight || !newReps) return;
        updateSet(id, parseFloat(newWeight), parseFloat(newReps));
        onSetAdded();
    };

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <Text style={styles.title}>{workoutExercise.exercise_name}</Text>
            </View>

            {lastStats && lastStats.length > 0 && (
                <View style={styles.lastStats}>
                    <Text style={styles.lastStatsTitle}>Previous Best:</Text>
                    <Text style={styles.lastStatsText}>
                        {lastStats[0].weight}kg x {lastStats[0].reps}
                    </Text>
                </View>
            )}

            <View style={styles.tableHeader}>
                <Text style={[styles.colHeader, styles.colSet]}>SET</Text>
                <Text style={[styles.colHeader, styles.colKg]}>KG</Text>
                <Text style={[styles.colHeader, styles.colReps]}>REPS</Text>
                <View style={styles.colAction} />
            </View>

            {currentSets.map((set, index) => (
                <View key={set.id} style={styles.row}>
                    <View style={styles.setBadge}>
                        <Text style={styles.setText}>{index + 1}</Text>
                    </View>
                    <TextInput
                        style={[styles.input, styles.colKg, styles.existingInput]}
                        defaultValue={set.weight.toString()}
                        onEndEditing={(e) => handleUpdateSet(set.id, e.nativeEvent.text, set.reps.toString())}
                        keyboardType="numeric"
                    />
                    <TextInput
                        style={[styles.input, styles.colReps, styles.existingInput]}
                        defaultValue={set.reps.toString()}
                        onEndEditing={(e) => handleUpdateSet(set.id, set.weight.toString(), e.nativeEvent.text)}
                        keyboardType="numeric"
                    />
                    <View style={styles.colAction}>
                        <Text style={styles.checkMark}>✓</Text>
                    </View>
                </View>
            ))}

            <View style={styles.inputRow}>
                <View style={styles.setBadge}>
                    <Text style={styles.setText}>{currentSets.length + 1}</Text>
                </View>
                <TextInput
                    style={[styles.input, styles.colKg]}
                    value={weight}
                    onChangeText={setWeight}
                    keyboardType="numeric"
                    placeholder="-"
                    placeholderTextColor={Colors.textSecondary}
                />
                <TextInput
                    style={[styles.input, styles.colReps]}
                    value={reps}
                    onChangeText={setReps}
                    keyboardType="numeric"
                    placeholder="-"
                    placeholderTextColor={Colors.textSecondary}
                />
                <TouchableOpacity
                    style={[styles.addButton, (!weight || !reps) && styles.addButtonDisabled]}
                    onPress={handleAddSet}
                    disabled={!weight || !reps}
                >
                    <Text style={styles.addButtonText}>+</Text>
                </TouchableOpacity>
            </View>
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.text,
    },
    lastStats: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.surfaceHighlight,
        padding: Spacing.xs,
        borderRadius: BorderRadius.sm,
        marginBottom: Spacing.md,
        alignSelf: 'flex-start',
    },
    lastStatsTitle: {
        fontSize: 12,
        color: Colors.textSecondary,
        marginRight: Spacing.xs,
    },
    lastStatsText: {
        fontSize: 12,
        fontWeight: '600',
        color: Colors.primary,
    },
    tableHeader: {
        flexDirection: 'row',
        marginBottom: Spacing.sm,
        paddingHorizontal: Spacing.xs,
        alignItems: 'center',
    },
    colHeader: {
        fontSize: 12,
        fontWeight: '700',
        color: Colors.textSecondary,
        textAlign: 'center',
    },
    row: {
        flexDirection: 'row',
        marginBottom: Spacing.sm,
        paddingHorizontal: Spacing.xs,
        alignItems: 'center',
        height: 40,
    },
    inputRow: {
        flexDirection: 'row',
        paddingHorizontal: Spacing.xs,
        alignItems: 'center',
        height: 40,
    },
    colSet: { width: 40, alignItems: 'center' },
    colKg: { flex: 1, textAlign: 'center' },
    colReps: { flex: 1, textAlign: 'center' },
    colAction: { width: 40, alignItems: 'center', justifyContent: 'center' },

    setBadge: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: Colors.surfaceHighlight,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    setText: {
        fontSize: 12,
        fontWeight: '600',
        color: Colors.textSecondary,
    },
    input: {
        height: 40,
        backgroundColor: Colors.background,
        borderRadius: BorderRadius.md,
        textAlign: 'center',
        fontSize: 16,
        color: Colors.text,
        marginHorizontal: Spacing.xs,
    },
    existingInput: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: 'transparent', // Invisible border unless focused (can add focus style if needed)
    },
    addButton: {
        width: 40,
        height: 40,
        borderRadius: BorderRadius.md,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: Spacing.xs,
    },
    addButtonDisabled: {
        backgroundColor: Colors.border,
    },
    addButtonText: {
        color: Colors.textLight,
        fontSize: 24,
        fontWeight: '400',
        marginTop: -2,
    },
    checkMark: {
        color: Colors.secondary,
        fontSize: 18,
        fontWeight: 'bold',
    },
});
