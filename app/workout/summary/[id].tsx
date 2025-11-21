import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getWorkoutSummary, WorkoutSummary } from '../../../db/progress';
import { getWorkout } from '../../../db/workout';
import { Button } from '../../../components/Button';
import { ExerciseProgressCard } from '../../../components/ExerciseProgressCard';
import { ProgressChart } from '../../../components/ProgressChart';
import { Colors, Spacing, BorderRadius, Shadows } from '../../../constants/theme';

export default function WorkoutSummaryScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const [summary, setSummary] = useState<WorkoutSummary | null>(null);
    const [workout, setWorkout] = useState<any>(null);
    const [prExpanded, setPrExpanded] = useState(false);

    useEffect(() => {
        if (id) {
            const workoutData = getWorkout(Number(id));
            const summaryData = getWorkoutSummary(Number(id));
            setWorkout(workoutData);
            setSummary(summaryData);
        }
    }, [id]);

    if (!summary || !workout) {
        return (
            <View style={styles.container}>
                <Text>Loading summary...</Text>
            </View>
        );
    }

    const prCount = summary.exercises_progress.filter(e => e.is_pr).length;
    const improvedCount = summary.exercises_progress.filter(e => e.weight_change > 0).length;

    // Prepare chart data (volume per exercise)
    const chartLabels = summary.exercises_progress.map(e => {
        const name = e.exercise_name.split(' ')[0]; // First word only for compact labels
        return name.length > 8 ? name.substring(0, 8) : name;
    });
    const chartData = summary.exercises_progress.map(e =>
        e.current_sets.reduce((sum, s) => sum + (s.reps * s.weight), 0)
    );
    const previousChartData = summary.exercises_progress.map(e =>
        e.previous_sets.reduce((sum, s) => sum + (s.reps * s.weight), 0)
    );

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title}>Workout Complete! 🎉</Text>
                    <Text style={styles.date}>
                        {new Date(workout.date).toLocaleDateString(undefined, {
                            weekday: 'long',
                            month: 'short',
                            day: 'numeric'
                        })}
                    </Text>
                </View>

                <View style={styles.summaryCards}>
                    <View style={styles.summaryCard}>
                        <Text style={styles.summaryValue}>{summary.total_exercises}</Text>
                        <Text style={styles.summaryLabel}>Exercises</Text>
                    </View>
                    <View style={styles.summaryCard}>
                        <Text style={styles.summaryValue}>{summary.total_sets}</Text>
                        <Text style={styles.summaryLabel}>Total Sets</Text>
                    </View>
                    <View style={styles.summaryCard}>
                        <Text style={styles.summaryValue}>{Math.round(summary.total_volume)}</Text>
                        <Text style={styles.summaryLabel}>Volume</Text>
                    </View>
                </View>

                {prCount > 0 && (
                    <TouchableOpacity
                        style={styles.achievement}
                        onPress={() => setPrExpanded(!prExpanded)}
                        activeOpacity={0.7}
                    >
                        <View style={styles.achievementHeader}>
                            <Text style={styles.achievementIcon}>🏆</Text>
                            <Text style={styles.achievementText}>
                                {prCount} Personal Record{prCount > 1 ? 's' : ''}!
                            </Text>
                            <Text style={styles.expandIcon}>{prExpanded ? '▼' : '▶'}</Text>
                        </View>
                        {prExpanded && (
                            <View style={styles.prDetails}>
                                {summary.exercises_progress
                                    .filter(e => e.is_pr)
                                    .map(e => {
                                        const currentMax = Math.max(...e.current_sets.map(s => s.weight));
                                        const previousMax = Math.max(...e.previous_sets.map(s => s.weight));
                                        return (
                                            <View key={e.exercise_id} style={styles.prItem}>
                                                <Text style={styles.prExerciseName}>{e.exercise_name}</Text>
                                                <Text style={styles.prWeightChange}>
                                                    {previousMax}kg → {currentMax}kg (+{e.weight_change}kg)
                                                </Text>
                                            </View>
                                        );
                                    })}
                            </View>
                        )}
                    </TouchableOpacity>
                )}

                {improvedCount > 0 && (
                    <View style={styles.achievement}>
                        <Text style={styles.achievementIcon}>💪</Text>
                        <Text style={styles.achievementText}>
                            Increased weight on {improvedCount} exercise{improvedCount > 1 ? 's' : ''}
                        </Text>
                    </View>
                )}

                {summary.exercises_progress.length > 0 && chartData.length > 0 && (
                    <ProgressChart
                        data={chartData}
                        previousData={previousChartData}
                        labels={chartLabels}
                        title="Volume Comparison"
                        showComparison={true}
                    />
                )}

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Exercise Performance</Text>
                    {summary.exercises_progress.map(progress => (
                        <ExerciseProgressCard key={progress.exercise_id} progress={progress} />
                    ))}
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <Button
                    title="Back to Home"
                    onPress={() => router.replace('/')}
                    size="large"
                />
            </View>
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
        paddingBottom: 100,
    },
    header: {
        marginBottom: Spacing.lg,
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 4,
        textAlign: 'center',
    },
    date: {
        fontSize: 16,
        color: Colors.textSecondary,
    },
    summaryCards: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: Spacing.lg,
    },
    summaryCard: {
        flex: 1,
        backgroundColor: Colors.surface,
        padding: Spacing.md,
        borderRadius: 12,
        alignItems: 'center',
        marginHorizontal: 4,
        ...Shadows.sm,
    },
    summaryValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.primary,
        marginBottom: 4,
    },
    summaryLabel: {
        fontSize: 12,
        color: Colors.textSecondary,
    },
    achievement: {
        flexDirection: 'column',
        backgroundColor: Colors.secondary + '15',
        padding: Spacing.md,
        borderRadius: 12,
        marginBottom: Spacing.sm,
    },
    achievementHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    achievementIcon: {
        fontSize: 24,
        marginRight: Spacing.sm,
    },
    achievementText: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.secondary,
        flex: 1,
    },
    expandIcon: {
        fontSize: 14,
        color: Colors.secondary,
        marginLeft: Spacing.sm,
    },
    prDetails: {
        marginTop: Spacing.md,
        paddingTop: Spacing.md,
        borderTopWidth: 1,
        borderTopColor: Colors.secondary + '30',
    },
    prItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.sm,
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.sm,
        marginBottom: Spacing.xs,
    },
    prExerciseName: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.text,
        flex: 1,
    },
    prWeightChange: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.secondary,
    },
    section: {
        marginTop: Spacing.lg,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: Spacing.md,
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
        ...Shadows.md,
    },
});
