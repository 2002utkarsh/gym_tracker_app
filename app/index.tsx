import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Platform, Pressable } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { getRecentWorkouts, RecentWorkout, getWeeklyWorkoutCount } from '../db/history';
import { deleteWorkout } from '../db/workout';
import { getUser, User } from '../db/user';
import { Button } from '../components/Button';
import { Colors, Spacing, BorderRadius, Shadows } from '../constants/theme';

export default function HomeScreen() {
    const router = useRouter();
    const [recentWorkouts, setRecentWorkouts] = useState<RecentWorkout[]>([]);
    const [weeklyCount, setWeeklyCount] = useState(0);
    const [user, setUser] = useState<User | null>(null);

    const loadData = useCallback(() => {
        setRecentWorkouts(getRecentWorkouts());
        setWeeklyCount(getWeeklyWorkoutCount());
        setUser(getUser());
    }, []);

    useFocusEffect(
        useCallback(() => {
            const currentUser = getUser();
            if (!currentUser) {
                router.replace('/profile');
            } else {
                loadData();
            }
        }, [loadData])
    );

    const handleDelete = (id: number) => {
        console.log('Delete requested for:', id);
        const confirmDelete = () => {
            console.log('Confirmed delete for:', id);
            deleteWorkout(id);
            loadData();
        };

        if (Platform.OS === 'web') {
            if (window.confirm('Are you sure you want to delete this workout?')) {
                confirmDelete();
            }
        } else {
            Alert.alert(
                'Delete Workout',
                'Are you sure you want to delete this workout?',
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Delete',
                        style: 'destructive',
                        onPress: confirmDelete,
                    },
                ]
            );
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Welcome back,</Text>
                    <Text style={styles.username}>{user?.name || 'Athlete'}</Text>
                </View>
                <View style={styles.dateBadge}>
                    <Text style={styles.dateText}>
                        {new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </Text>
                </View>
            </View>

            <View style={styles.statsCard}>
                <View>
                    <Text style={styles.statsLabel}>Workouts this week</Text>
                    <Text style={styles.statsValue}>{weeklyCount}</Text>
                </View>
                <View style={styles.statsIcon}>
                    <Text style={{ fontSize: 24 }}>🔥</Text>
                </View>
            </View>

            <View style={styles.actionsRow}>
                <View style={styles.actionButtonWrapper}>
                    <Button
                        title="Start Workout"
                        onPress={() => router.push('/workout/new')}
                        style={styles.actionButton}
                    />
                </View>
                <View style={styles.actionButtonWrapper}>
                    <Button
                        title="Plan Workout"
                        variant="secondary"
                        onPress={() => router.push('/templates')}
                        style={styles.actionButton}
                    />
                </View>
            </View>

            <Text style={styles.sectionTitle}>Recent Activity</Text>

            {!recentWorkouts || recentWorkouts.length === 0 ? (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyStateText}>No workouts yet. Start one today!</Text>
                </View>
            ) : (
                recentWorkouts.map((workout) => (
                    <Pressable
                        key={workout.id}
                        style={styles.card}
                        onPress={() => router.push(`/workout/summary/${workout.id}`)}
                    >
                        <View style={styles.cardHeader}>
                            <Text style={styles.cardDate}>{formatDate(workout.date)}</Text>
                            <View style={styles.actionsContainer}>
                                <Pressable
                                    onPress={(e) => {
                                        e.stopPropagation();
                                        router.push(`/workout/${workout.id}`);
                                    }}
                                    style={[styles.iconButton, styles.editButton]}
                                >
                                    <Text style={styles.editButtonText}>✎</Text>
                                </Pressable>
                                <Pressable
                                    onPress={(e) => {
                                        e.stopPropagation();
                                        handleDelete(workout.id);
                                    }}
                                    style={[styles.iconButton, styles.deleteButton]}
                                >
                                    <Text style={styles.deleteButtonText}>✕</Text>
                                </Pressable>
                            </View>
                        </View>

                        <View style={styles.cardStats}>
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>{workout.exercise_count}</Text>
                                <Text style={styles.statLabel}>Exercises</Text>
                            </View>
                            <View style={styles.statSeparator} />
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>{workout.total_sets}</Text>
                                <Text style={styles.statLabel}>Sets</Text>
                            </View>
                        </View>
                    </Pressable>
                ))
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: Spacing.lg,
        backgroundColor: Colors.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.xl,
    },
    greeting: {
        fontSize: 16,
        color: Colors.textSecondary,
    },
    username: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.text,
    },
    dateBadge: {
        backgroundColor: Colors.surfaceHighlight,
        paddingVertical: Spacing.xs,
        paddingHorizontal: Spacing.md,
        borderRadius: BorderRadius.round,
    },
    dateText: {
        color: Colors.primary,
        fontWeight: '600',
    },
    statsCard: {
        backgroundColor: Colors.primary,
        borderRadius: BorderRadius.lg,
        padding: Spacing.lg,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.xl,
        ...Shadows.md,
    },
    statsLabel: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 14,
        marginBottom: 4,
    },
    statsValue: {
        color: '#fff',
        fontSize: 32,
        fontWeight: 'bold',
    },
    statsIcon: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionsRow: {
        flexDirection: 'row',
        gap: Spacing.md,
        marginBottom: Spacing.xl,
    },
    actionButtonWrapper: {
        flex: 1,
    },
    actionButton: {
        height: 50,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: Spacing.md,
    },
    card: {
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.lg,
        padding: Spacing.md,
        marginBottom: Spacing.md,
        ...Shadows.sm,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    cardDate: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
    },
    actionsContainer: {
        flexDirection: 'row',
        gap: Spacing.sm,
    },
    iconButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    editButton: {
        backgroundColor: Colors.surfaceHighlight,
    },
    editButtonText: {
        color: Colors.primary,
        fontSize: 16,
    },
    deleteButton: {
        backgroundColor: '#FEE2E2',
    },
    deleteButtonText: {
        color: Colors.danger,
        fontSize: 14,
        fontWeight: 'bold',
    },
    cardStats: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.background,
        borderRadius: BorderRadius.md,
        padding: Spacing.sm,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statSeparator: {
        width: 1,
        height: '80%',
        backgroundColor: Colors.border,
    },
    statValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.text,
    },
    statLabel: {
        fontSize: 12,
        color: Colors.textSecondary,
    },
    emptyState: {
        alignItems: 'center',
        padding: Spacing.xl,
    },
    emptyStateText: {
        color: Colors.textSecondary,
        fontSize: 16,
    },
});
