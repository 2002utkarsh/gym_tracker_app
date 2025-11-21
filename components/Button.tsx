import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { Colors, BorderRadius, Spacing } from '../constants/theme';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'danger' | 'outline';
    loading?: boolean;
    disabled?: boolean;
    style?: ViewStyle;
}

export const Button = ({ title, onPress, variant = 'primary', loading = false, disabled = false, style }: ButtonProps) => {
    const getBackgroundColor = () => {
        if (disabled) return Colors.border;
        switch (variant) {
            case 'primary': return Colors.primary;
            case 'secondary': return Colors.surfaceHighlight;
            case 'danger': return Colors.danger;
            case 'outline': return 'transparent';
            default: return Colors.primary;
        }
    };

    const getTextColor = () => {
        if (disabled) return Colors.textSecondary;
        switch (variant) {
            case 'primary': return Colors.textLight;
            case 'secondary': return Colors.text;
            case 'danger': return Colors.textLight;
            case 'outline': return Colors.primary;
            default: return Colors.textLight;
        }
    };

    const getBorder = () => {
        if (variant === 'outline') return { borderWidth: 1, borderColor: Colors.primary };
        return {};
    };

    return (
        <TouchableOpacity
            style={[
                styles.button,
                { backgroundColor: getBackgroundColor() },
                getBorder(),
                style
            ]}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.8}
        >
            {loading ? (
                <ActivityIndicator color={getTextColor()} />
            ) : (
                <Text style={[styles.text, { color: getTextColor() }]}>{title}</Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.lg,
        borderRadius: BorderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: Spacing.sm,
    },
    text: {
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
});
