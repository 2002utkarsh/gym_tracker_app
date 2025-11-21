import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Spacing, BorderRadius, Shadows } from '../constants/theme';

interface TemplateCardProps {
    id: number;
    name: string;
    description: string | null;
    onPress: () => void;
}

export const TemplateCard = ({ name, description, onPress }: TemplateCardProps) => {
    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <View style={styles.content}>
                <Text style={styles.name}>{name}</Text>
                {description && <Text style={styles.description}>{description}</Text>}
            </View>
            <View style={styles.iconContainer}>
                <Text style={styles.icon}>›</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.lg,
        padding: Spacing.md,
        marginBottom: Spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        ...Shadows.sm,
    },
    content: {
        flex: 1,
    },
    name: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.text,
        marginBottom: 4,
    },
    description: {
        fontSize: 14,
        color: Colors.textSecondary,
    },
    iconContainer: {
        marginLeft: Spacing.md,
    },
    icon: {
        fontSize: 24,
        color: Colors.textSecondary,
        fontWeight: 'bold',
    },
});
