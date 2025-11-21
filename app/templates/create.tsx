import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Modal, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { createTemplate, addExerciseToTemplate } from '../../db/template';
import { getExercises, Exercise, addExercise } from '../../db/exercise';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { Colors, Spacing, BorderRadius, Shadows } from '../../constants/theme';

export default function CreateTemplateScreen() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [allExercises, setAllExercises] = useState<Exercise[]>([]);
    const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
    const [showExercisePicker, setShowExercisePicker] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newExerciseName, setNewExerciseName] = useState('');
    const [newExerciseMuscle, setNewExerciseMuscle] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        setAllExercises(getExercises());
    }, []);

    const filteredExercises = allExercises.filter(e =>
        e.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAddExercise = (exercise: Exercise) => {
        if (!selectedExercises.find(e => e.id === exercise.id)) {
            setSelectedExercises([...selectedExercises, exercise]);
        }
        setShowExercisePicker(false);
        setSearchQuery('');
    };

    const handleRemoveExercise = (exerciseId: number) => {
        setSelectedExercises(selectedExercises.filter(e => e.id !== exerciseId));
    };

    const handleCreateCustomExercise = () => {
        if (newExerciseName.trim()) {
            const muscle = newExerciseMuscle.trim() || 'Other';
            const newId = addExercise(newExerciseName.trim(), muscle);
            const updatedExercises = getExercises();
            setAllExercises(updatedExercises);

            const newExercise = updatedExercises.find(e => e.id === newId);
            if (newExercise) {
                setSelectedExercises([...selectedExercises, newExercise]);
            }

            setShowAddModal(false);
            setShowExercisePicker(false);
            setNewExerciseName('');
            setNewExerciseMuscle('');
        }
    };

    const handleQuickCreate = () => {
        if (searchQuery.trim()) {
            const newId = addExercise(searchQuery.trim(), 'Other');
            const updatedExercises = getExercises();
            setAllExercises(updatedExercises);

            const newExercise = updatedExercises.find(e => e.id === newId);
            if (newExercise) {
                setSelectedExercises([...selectedExercises, newExercise]);
            }

            setShowExercisePicker(false);
            setSearchQuery('');
        }
    };

    const handleCreate = () => {
        if (!name.trim()) {
            return;
        }

        const templateId = createTemplate(name.trim(), description.trim() || null);

        selectedExercises.forEach((exercise, index) => {
            addExerciseToTemplate(templateId, exercise.id, index);
        });

        router.back();
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.title}>Create Workout Template</Text>

            <Input
                label="Template Name"
                value={name}
                onChangeText={setName}
                placeholder="e.g., Upper Body Day"
            />

            <Input
                label="Description (Optional)"
                value={description}
                onChangeText={setDescription}
                placeholder="e.g., Push exercises for chest and shoulders"
                multiline
                numberOfLines={3}
                style={styles.descriptionInput}
            />

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Exercises ({selectedExercises.length})</Text>

                {selectedExercises.map((exercise, index) => (
                    <View key={exercise.id} style={styles.exerciseItem}>
                        <Text style={styles.exerciseNumber}>{index + 1}</Text>
                        <View style={styles.exerciseInfo}>
                            <Text style={styles.exerciseName}>{exercise.name}</Text>
                            {exercise.is_custom === 1 && (
                                <View style={styles.customBadge}>
                                    <Text style={styles.customBadgeText}>Custom</Text>
                                </View>
                            )}
                        </View>
                        <TouchableOpacity onPress={() => handleRemoveExercise(exercise.id)}>
                            <Text style={styles.removeButton}>✕</Text>
                        </TouchableOpacity>
                    </View>
                ))}

                <Button
                    title="+ Add Exercise"
                    variant="secondary"
                    onPress={() => setShowExercisePicker(!showExercisePicker)}
                    style={styles.addButton}
                />
            </View>

            {showExercisePicker && (
                <View style={styles.picker}>
                    <Text style={styles.pickerTitle}>Select Exercise</Text>

                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search exercises..."
                        placeholderTextColor={Colors.textSecondary}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />

                    <Button
                        title="➕ Create New Exercise"
                        variant="outline"
                        onPress={() => setShowAddModal(true)}
                        style={styles.createExerciseButton}
                    />

                    <FlatList
                        data={filteredExercises}
                        keyExtractor={item => item.id.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.pickerItem}
                                onPress={() => handleAddExercise(item)}
                            >
                                <View style={styles.pickerItemContent}>
                                    <View style={styles.pickerItemInfo}>
                                        <Text style={styles.pickerItemName}>{item.name}</Text>
                                        <Text style={styles.pickerItemMuscle}>{item.muscle_group}</Text>
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
                            searchQuery.length > 0 ? (
                                <View style={styles.emptyState}>
                                    <Text style={styles.emptyText}>No exercises found</Text>
                                    <Button
                                        title={`Create "${searchQuery}"`}
                                        variant="secondary"
                                        onPress={handleQuickCreate}
                                        style={{ marginTop: Spacing.sm }}
                                    />
                                </View>
                            ) : null
                        }
                        style={styles.pickerList}
                        nestedScrollEnabled={true}
                        scrollEnabled={true}
                    />
                </View>
            )}

            <Button
                title="Create Template"
                onPress={handleCreate}
                disabled={!name.trim() || selectedExercises.length === 0}
                style={styles.createButton}
            />

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
                                onPress={handleCreateCustomExercise}
                                disabled={!newExerciseName.trim()}
                                style={styles.modalButton}
                            />
                        </View>
                    </View>
                </View>
            </Modal>
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
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: Spacing.lg,
    },
    descriptionInput: {
        minHeight: 80,
        textAlignVertical: 'top',
    },
    section: {
        marginTop: Spacing.lg,
        marginBottom: Spacing.lg,
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
        borderRadius: BorderRadius.md,
        marginBottom: Spacing.sm,
        ...Shadows.sm,
    },
    exerciseNumber: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.primary,
        marginRight: Spacing.md,
        width: 24,
    },
    exerciseInfo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    exerciseName: {
        fontSize: 16,
        color: Colors.text,
        flex: 1,
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
    removeButton: {
        fontSize: 20,
        color: Colors.danger,
        paddingHorizontal: Spacing.sm,
    },
    addButton: {
        marginTop: Spacing.sm,
    },
    picker: {
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.md,
        padding: Spacing.md,
        marginBottom: Spacing.lg,
        ...Shadows.md,
    },
    pickerTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
        marginBottom: Spacing.sm,
    },
    searchInput: {
        padding: Spacing.md,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: BorderRadius.md,
        marginBottom: Spacing.sm,
        fontSize: 16,
        backgroundColor: Colors.background,
        color: Colors.text,
    },
    createExerciseButton: {
        marginBottom: Spacing.md,
    },
    pickerList: {
        maxHeight: 300,
    },
    pickerItem: {
        padding: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    pickerItemContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    pickerItemInfo: {
        flex: 1,
    },
    pickerItemName: {
        fontSize: 16,
        color: Colors.text,
        marginBottom: 4,
    },
    pickerItemMuscle: {
        fontSize: 14,
        color: Colors.textSecondary,
    },
    emptyState: {
        padding: Spacing.lg,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 14,
        color: Colors.textSecondary,
        marginBottom: Spacing.sm,
    },
    createButton: {
        marginTop: Spacing.lg,
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
        ...Shadows.lg,
    },
    modalTitle: {
        fontSize: 20,
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
        gap: Spacing.md,
        marginTop: Spacing.md,
    },
    modalButton: {
        flex: 1,
    },
});
