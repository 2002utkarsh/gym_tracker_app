import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useState, useCallback } from 'react';
import { getUser, User } from '../db/user';
import { getRecentWorkouts, RecentWorkout } from '../db/history';
import { deleteWorkout } from '../db/workout';
import { Button } from '../components/Button';
import { Colors, Spacing, BorderRadius, Shadows } from '../constants/theme';

export default function HomeScreen() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [recentWorkouts, setRecentWorkouts] = useState<RecentWorkout[]>([]);
    const [error, setError] = useState<string | null>(null);

    useFocusEffect(
        useCallback(() => {
            try {
                const loadedUser = getUser();
                if (!loadedUser) {
                    router.replace('/profile');
                } else {
                    setUser(loadedUser);
                    const workouts = getRecentWorkouts();
                    setRecentWorkouts(workouts);
                }
            } catch (e: any) {
                setError(e.message || 'Unknown error');
            }
        }, [])
    );

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={{ color: 'red', padding: 20 }}>Error: {error}</Text>
            </View>
        );
    }

    if (!user) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Welcome back,</Text>
                    <Text style={styles.name}>{user.name}</Text>
                </View>
                <TouchableOpacity onPress={() => router.push('/profile')} style={styles.profileButton}>
                    <Text style={styles.profileButtonText}>Profile</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                    <Text style={styles.statValue}>{user.weight} kg</Text>
                    <Text style={styles.statLabel}>Weight</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statValue}>{recentWorkouts ? recentWorkouts.length : 0}</Text>
                    <Text style={styles.statLabel}>Workouts</Text>
                </View>
            </View>

            <View style={styles.actionContainer}>
                <Button
                    title="Start New Workout"
                    onPress={() => router.push('/workout/new')}
                    style={styles.mainButton}
                />
                <Button
                    title="Plan Workout"
                    variant="outline"
                    onPress={() => router.push('/templates')}
                    style={styles.secondaryButton}
                />
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Recent Activity</Text>
                {!recentWorkouts || recentWorkouts.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyStateText}>No workouts yet. Start one today!</Text>
                    </View>
                ) : (
                    recentWorkouts.map((workout) => {
                        if (!workout) return null;

                        const handleDelete = () => {
                            Alert.alert(
                                'Delete Workout',
                                'Are you sure you want to delete this workout?',
                                [
                                    { text: 'Cancel', style: 'cancel' },
                                    {
                                        text: 'Delete',
                                        style: 'destructive',
                                        onPress: () => {
                                            deleteWorkout(workout.id);
                                            const updatedWorkouts = getRecentWorkouts();
                                            setRecentWorkouts(updatedWorkouts);
                                        }
                                    }
                                ]
                            );
                        };

                        return (
                            <View key={workout.id} style={styles.workoutCardContainer}>
                                <TouchableOpacity
                                    style={styles.workoutCard}
                                    onPress={() => router.push(`/workout/summary/${workout.id}`)}
                                >
                                    <View style={styles.workoutHeader}>
                                        <Text style={styles.workoutDate}>
                                            {new Date(workout.date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                                        </Text>
                                        <Text style={styles.workoutSets}>{workout.total_sets} sets</Text>
                                    </View>
                                    <Text style={styles.workoutExercises}>{workout.exercise_count} Exercises</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.deleteButton}
                                    onPress={handleDelete}
                                >
                                    <Text style={styles.deleteButtonText}>✕</Text>
                                </TouchableOpacity>
                            </View>
                        );
                    })
                )}
            </View>
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
    name: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.text,
    },
    profileButton: {
        paddingVertical: Spacing.xs,
        paddingHorizontal: Spacing.md,
        backgroundColor: Colors.surfaceHighlight,
        borderRadius: BorderRadius.round,
    },
    profileButtonText: {
        color: Colors.primary,
        fontWeight: '600',
        fontSize: 14,
    },
    statsContainer: {
        flexDirection: 'row',
        gap: Spacing.md,
        marginBottom: Spacing.xl,
    },
    statCard: {
        flex: 1,
        backgroundColor: Colors.surface,
        padding: Spacing.md,
        borderRadius: BorderRadius.lg,
        alignItems: 'center',
        ...Shadows.sm,
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.primary,
        marginBottom: Spacing.xs,
    },
    statLabel: {
        fontSize: 14,
        color: Colors.textSecondary,
    },
    actionContainer: {
        marginBottom: Spacing.xl,
    },
    mainButton: {
        marginBottom: Spacing.sm,
        ...Shadows.md,
    },
    secondaryButton: {
        marginTop: Spacing.xs,
    },
    section: {
        gap: Spacing.md,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: Spacing.xs,
    },
    emptyState: {
        padding: Spacing.xl,
        alignItems: 'center',
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.lg,
        borderStyle: 'dashed',
        borderWidth: 2,
        borderColor: Colors.border,
    },
    emptyStateText: {
        color: Colors.textSecondary,
        fontSize: 16,
    },
    workoutCardContainer: {
        flexDirection: 'row',
        marginBottom: Spacing.sm,
        alignItems: 'center',
    },
    workoutCard: {
        flex: 1,
        backgroundColor: Colors.surface,
        padding: Spacing.md,
        borderRadius: BorderRadius.md,
        ...Shadows.sm,
    },
    workoutHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: Spacing.xs,
    },
    workoutDate: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
    },
    workoutSets: {
        fontSize: 14,
        color: Colors.secondary,
        fontWeight: '500',
    },
    workoutExercises: {
        fontSize: 14,
        color: Colors.textSecondary,
    },
    deleteButton: {
        marginLeft: Spacing.sm,
        width: 40,
        height: 40,
        borderRadius: BorderRadius.round,
        backgroundColor: Colors.danger,
        justifyContent: 'center',
        alignItems: 'center',
        ...Shadows.sm,
    },
    deleteButtonText: {
        color: Colors.textLight,
        fontSize: 18,
        fontWeight: 'bold',
    },
});
