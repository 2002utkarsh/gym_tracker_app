import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList, Pressable } from 'react-native';
import { Colors, Spacing, BorderRadius, Shadows } from '../constants/theme';

interface Option {
    label: string;
    value: string;
}

interface SelectProps {
    label: string;
    value: string;
    options: Option[];
    onSelect: (value: string) => void;
    placeholder?: string;
    error?: string;
}

export const Select = ({ label, value, options, onSelect, placeholder = 'Select an option', error }: SelectProps) => {
    const [visible, setVisible] = useState(false);

    const selectedOption = options.find(opt => opt.value === value);

    const handleSelect = (val: string) => {
        onSelect(val);
        setVisible(false);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <TouchableOpacity
                style={[styles.selector, error ? styles.selectorError : null]}
                onPress={() => setVisible(true)}
            >
                <Text style={[styles.value, !selectedOption && styles.placeholder]}>
                    {selectedOption ? selectedOption.label : placeholder}
                </Text>
                <Text style={styles.chevron}>▼</Text>
            </TouchableOpacity>
            {error && <Text style={styles.errorText}>{error}</Text>}

            <Modal
                visible={visible}
                transparent
                animationType="fade"
                onRequestClose={() => setVisible(false)}
            >
                <Pressable style={styles.overlay} onPress={() => setVisible(false)}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{label}</Text>
                        <FlatList
                            data={options}
                            keyExtractor={item => item.value}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[
                                        styles.option,
                                        item.value === value && styles.optionSelected
                                    ]}
                                    onPress={() => handleSelect(item.value)}
                                >
                                    <Text
                                        style={[
                                            styles.optionText,
                                            item.value === value && styles.optionTextSelected
                                        ]}
                                    >
                                        {item.label}
                                    </Text>
                                    {item.value === value && (
                                        <Text style={styles.checkmark}>✓</Text>
                                    )}
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: Spacing.md,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.textSecondary,
        marginBottom: Spacing.xs,
    },
    selector: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.background,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: BorderRadius.md,
        padding: Spacing.md,
    },
    selectorError: {
        borderColor: Colors.danger,
    },
    value: {
        fontSize: 16,
        color: Colors.text,
    },
    placeholder: {
        color: Colors.textSecondary,
    },
    chevron: {
        fontSize: 12,
        color: Colors.textSecondary,
    },
    errorText: {
        color: Colors.danger,
        fontSize: 12,
        marginTop: 4,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: Spacing.lg,
    },
    modalContent: {
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.lg,
        padding: Spacing.md,
        maxHeight: '80%',
        ...Shadows.md,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: Spacing.md,
        textAlign: 'center',
        color: Colors.text,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    optionSelected: {
        backgroundColor: Colors.surfaceHighlight,
    },
    optionText: {
        fontSize: 16,
        color: Colors.text,
    },
    optionTextSelected: {
        color: Colors.primary,
        fontWeight: '600',
    },
    checkmark: {
        color: Colors.primary,
        fontSize: 16,
        fontWeight: 'bold',
    },
});
