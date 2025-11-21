import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { ExerciseProgress } from '../db/progress';
import { Colors, Spacing, BorderRadius, Shadows } from '../constants/theme';

interface ExerciseProgressCardProps {
    progress: ExerciseProgress;
}

export const ExerciseProgressCard = ({ progress }: ExerciseProgressCardProps) => {
    const [expanded, setExpanded] = useState(false);

    const getWeightChangeIcon = () => {
        if (progress.previous_sets.length === 0) return '🆕';
        if (progress.weight_change > 0) return '↑';
        if (progress.weight_change < 0) return '↓';
        return '→';
    };

    const getWeightChangeColor = () => {
        if (progress.weight_change > 0) return Colors.secondary;
        if (progress.weight_change < 0) return Colors.danger;
        return Colors.textSecondary;
    };

    const getWeightChangeText = () => {
        if (progress.previous_sets.length === 0) return 'First time!';
        if (progress.weight_change > 0) return `+${progress.weight_change}kg`;
        if (progress.weight_change < 0) return `${progress.weight_change}kg`;
        return 'Same weight';
    };

    const maxWeight = Math.max(...progress.current_sets.map(s => s.weight));
    const totalVolume = progress.current_sets.reduce((sum, s) => sum + (s.reps * s.weight), 0);
    const previousMaxWeight = progress.previous_sets.length > 0
        ? Math.max(...progress.previous_sets.map(s => s.weight))
        : 0;

    return (
        <View style={styles.card}>
            <TouchableOpacity onPress={() => setExpanded(!expanded)} activeOpacity={0.7}>
                <View style={styles.header}>
                    <View style={styles.titleRow}>
                        <Text style={styles.name}>{progress.exercise_name}</Text>
                        <Text style={styles.expandIcon}>{expanded ? '▼' : '▶'}</Text>
                    </View>
                    {progress.is_pr && (
                        <View style={styles.prBadge}>
                            <Text style={styles.prText}>🏆 PR!</Text>
                        </View>
                    )}
                </View>

                <View style={styles.statsRow}>
                    <View style={styles.stat}>
                        <Text style={styles.statLabel}>Sets</Text>
                        <Text style={styles.statValue}>{progress.current_sets.length}</Text>
                    </View>
                    <View style={styles.stat}>
                        <Text style={styles.statLabel}>Max Weight</Text>
                        <Text style={styles.statValue}>{maxWeight}kg</Text>
                    </View>
                    <View style={styles.stat}>
                        <Text style={styles.statLabel}>Volume</Text>
                        <Text style={styles.statValue}>{totalVolume}</Text>
                    </View>
                </View>

                {progress.previous_sets.length > 0 && (
                    <View style={[styles.changeRow, { backgroundColor: getWeightChangeColor() + '15' }]}>
                        <Text style={styles.changeIcon}>{getWeightChangeIcon()}</Text>
                        <Text style={[styles.changeText, { color: getWeightChangeColor() }]}>
                            {getWeightChangeText()}
                        </Text>
                        {progress.volume_change !== 0 && (
                            <Text style={[styles.volumeChange, { color: getWeightChangeColor() }]}>
                                {progress.volume_change > 0 ? '+' : ''}{progress.volume_change} volume
                            </Text>
                        )}
                    </View>
                )}

                {progress.previous_sets.length === 0 && (
                    <View style={styles.firstTime}>
                        <Text style={styles.firstTimeText}>🎉 First time doing this exercise!</Text>
                    </View>
                )}
            </TouchableOpacity>

            {expanded && (
                <View style={styles.expandedContent}>
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Today's Sets</Text>
                        {progress.current_sets.map((set, index) => (
                            <View key={index} style={styles.setRow}>
                                <Text style={styles.setNumber}>Set {set.set_order}</Text>
                                <Text style={styles.setText}>{set.weight}kg × {set.reps} reps</Text>
                                <Text style={styles.setVolume}>{set.weight * set.reps} vol</Text>
                            </View>
                        ))}
                    </View>

                    {progress.previous_sets.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Last Time</Text>
                            {progress.previous_sets.map((set, index) => (
                                <View key={index} style={styles.setRow}>
                                    <Text style={styles.setNumber}>Set {set.set_order}</Text>
                                    <Text style={[styles.setText, styles.previousText]}>
                                        {set.weight}kg × {set.reps} reps
                                    </Text>
                                    <Text style={[styles.setVolume, styles.previousText]}>
                                        {set.weight * set.reps} vol
                                    </Text>
                                </View>
                            ))}
                        </View>
                    )}

                    {progress.is_pr && (
                        <View style={styles.prDetails}>
                            <Text style={styles.prDetailsText}>
                                🏆 Personal Record! Previous best: {previousMaxWeight}kg → New: {maxWeight}kg
                            </Text>
                        </View>
                    )}
                </View>
            )}
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
        marginBottom: Spacing.sm,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    name: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.text,
        flex: 1,
    },
    expandIcon: {
        fontSize: 14,
        color: Colors.textSecondary,
        marginLeft: Spacing.sm,
    },
    prBadge: {
        backgroundColor: Colors.secondary,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: BorderRadius.sm,
        alignSelf: 'flex-start',
    },
    prText: {
        color: Colors.textLight,
        fontSize: 12,
        fontWeight: 'bold',
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: Spacing.sm,
    },
    stat: {
        alignItems: 'center',
    },
    statLabel: {
        fontSize: 12,
        color: Colors.textSecondary,
        marginBottom: 4,
    },
    statValue: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.text,
    },
    changeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.sm,
        borderRadius: BorderRadius.sm,
        marginTop: Spacing.sm,
    },
    changeIcon: {
        fontSize: 20,
        marginRight: Spacing.sm,
    },
    changeText: {
        fontSize: 14,
        fontWeight: '600',
        flex: 1,
    },
    volumeChange: {
        fontSize: 12,
        fontWeight: '500',
    },
    firstTime: {
        backgroundColor: Colors.primary + '15',
        padding: Spacing.sm,
        borderRadius: BorderRadius.sm,
        marginTop: Spacing.sm,
    },
    firstTimeText: {
        fontSize: 14,
        color: Colors.primary,
        textAlign: 'center',
        fontWeight: '500',
    },
    expandedContent: {
        marginTop: Spacing.md,
        paddingTop: Spacing.md,
        borderTopWidth: 1,
        borderTopColor: Colors.border,
    },
    section: {
        marginBottom: Spacing.md,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.text,
        marginBottom: Spacing.sm,
    },
    setRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 6,
        paddingHorizontal: Spacing.sm,
        backgroundColor: Colors.background,
        borderRadius: BorderRadius.sm,
        marginBottom: 4,
    },
    setNumber: {
        fontSize: 14,
        color: Colors.textSecondary,
        width: 50,
    },
    setText: {
        fontSize: 14,
        color: Colors.text,
        flex: 1,
    },
    setVolume: {
        fontSize: 14,
        color: Colors.textSecondary,
        width: 60,
        textAlign: 'right',
    },
    previousText: {
        color: Colors.textSecondary,
    },
    prDetails: {
        backgroundColor: Colors.secondary + '15',
        padding: Spacing.sm,
        borderRadius: BorderRadius.sm,
    },
    prDetailsText: {
        fontSize: 13,
        color: Colors.secondary,
        fontWeight: '500',
    },
});
