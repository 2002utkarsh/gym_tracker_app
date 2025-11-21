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
            <View>
                <Text style={styles.name}>{name}</Text>
                {description && <Text style={styles.description}>{description}</Text>}
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
        ...Shadows.sm,
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
});
