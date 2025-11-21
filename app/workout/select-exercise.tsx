import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Modal } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getExercises, Exercise, addExercise } from '../../db/exercise';
import { addWorkoutExercise } from '../../db/workout_exercise';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Colors, Spacing, BorderRadius, Shadows } from '../../constants/theme';

export default function SelectExerciseScreen() {
    const router = useRouter();
    const { workoutId } = useLocalSearchParams();
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [search, setSearch] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [newExerciseName, setNewExerciseName] = useState('');
    const [newExerciseMuscle, setNewExerciseMuscle] = useState('');

    useEffect(() => {
        setExercises(getExercises());
    }, []);

    const filteredExercises = exercises.filter(e =>
        e.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleSelect = (exerciseId: number) => {
        addWorkoutExercise(Number(workoutId), exerciseId);
        router.back();
    };

    const handleAddNew = () => {
        if (newExerciseName.trim()) {
            const muscle = newExerciseMuscle.trim() || 'Other';
            const newId = addExercise(newExerciseName.trim(), muscle);
            setExercises(getExercises()); // Refresh list
            setShowAddModal(false);
            setNewExerciseName('');
            setNewExerciseMuscle('');
            handleSelect(newId); // Automatically select the new exercise
        }
    };

    const handleQuickAdd = () => {
        if (search.trim()) {
            const newId = addExercise(search.trim(), 'Other');
            setExercises(getExercises());
            handleSelect(newId);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.search}
                placeholder="Search exercises..."
                placeholderTextColor={Colors.textSecondary}
                value={search}
                onChangeText={setSearch}
            />

            <Button
                title="➕ Create New Exercise"
                variant="secondary"
                onPress={() => setShowAddModal(true)}
                style={styles.addButton}
            />

            <FlatList
                data={filteredExercises}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.item} onPress={() => handleSelect(item.id)}>
                        <View style={styles.itemContent}>
                            <View style={styles.itemInfo}>
                                <Text style={styles.itemText}>{item.name}</Text>
                                <Text style={styles.muscleText}>{item.muscle_group}</Text>
                            </View>
                            {item.is_custom === 1 && (
                                <View style={styles.customBadge}>
                                    <Text style={styles.customBadgeText}>Custom</Text>
                                </View>
                            )}
                        </View>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Text style={styles.emptyText}>No exercises found.</Text>
                        {search.length > 0 && (
                            <Button
                                title={`Create "${search}"`}
                                onPress={handleQuickAdd}
                                variant="secondary"
                                style={{ marginTop: Spacing.md }}
                            />
                        )}
                    </View>
                }
            />

            {/* Add Exercise Modal */}
            <Modal
                visible={showAddModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowAddModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Create New Exercise</Text>

                        <Input
                            label="Exercise Name"
                            placeholder="e.g., Incline Bench Press"
                            value={newExerciseName}
                            onChangeText={setNewExerciseName}
                            style={styles.input}
                        />

                        <Input
                            label="Muscle Group (Optional)"
                            placeholder="e.g., Chest, Back, Legs"
                            value={newExerciseMuscle}
                            onChangeText={setNewExerciseMuscle}
                            style={styles.input}
                        />

                        <View style={styles.modalButtons}>
                            <Button
                                title="Cancel"
                                variant="outline"
                                onPress={() => {
                                    setShowAddModal(false);
                                    setNewExerciseName('');
                                    setNewExerciseMuscle('');
                                }}
                                style={styles.modalButton}
                            />
                            <Button
                                title="Create"
                                onPress={handleAddNew}
                                disabled={!newExerciseName.trim()}
                                style={styles.modalButton}
                            />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: Spacing.lg,
        backgroundColor: Colors.background,
    },
    search: {
        padding: Spacing.md,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: BorderRadius.md,
        marginBottom: Spacing.sm,
        fontSize: 16,
        backgroundColor: Colors.surface,
        color: Colors.text,
    },
    addButton: {
        marginBottom: Spacing.md,
    },
    item: {
        padding: Spacing.md,
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.md,
        marginBottom: Spacing.sm,
        ...Shadows.sm,
    },
    itemContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemInfo: {
        flex: 1,
    },
    itemText: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
        marginBottom: 4,
    },
    muscleText: {
        color: Colors.textSecondary,
        fontSize: 14,
    },
    customBadge: {
        backgroundColor: Colors.primary + '20',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: BorderRadius.sm,
    },
    customBadgeText: {
        color: Colors.primary,
        fontSize: 12,
        fontWeight: '600',
    },
    empty: {
        marginTop: Spacing.xl,
        alignItems: 'center',
    },
    emptyText: {
        color: Colors.textSecondary,
        fontSize: 16,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: Spacing.lg,
    },
    modalContent: {
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.lg,
        padding: Spacing.xl,
        width: '100%',
        maxWidth: 400,
        ...Shadows.md,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: Spacing.lg,
        textAlign: 'center',
    },
    input: {
        marginBottom: Spacing.md,
    },
    modalButtons: {
        flexDirection: 'row',
        gap: Spacing.sm,
        marginTop: Spacing.md,
    },
    modalButton: {
        flex: 1,
    },
});
