import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, BorderRadius, Shadows } from '../constants/theme';

interface FloatingActionButtonProps {
    onPress: () => void;
    label: string;
    icon?: string;
}

export const FloatingActionButton = ({ onPress, label, icon }: FloatingActionButtonProps) => {
    return (
        <TouchableOpacity style={styles.fab} onPress={onPress} activeOpacity={0.8}>
            {icon && <Text style={styles.icon}>{icon}</Text>}
            <Text style={styles.label}>{label}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: Colors.primary,
        borderRadius: BorderRadius.round,
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.lg,
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
        ...Shadows.md,
        elevation: 8,
    },
    icon: {
        fontSize: 20,
        color: Colors.textLight,
    },
    label: {
        color: Colors.textLight,
        fontSize: 16,
        fontWeight: '600',
    },
});
