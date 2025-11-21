import React, { useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle, Animated } from 'react-native';
import { Colors, BorderRadius, Spacing } from '../constants/theme';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'danger' | 'outline';
    size?: 'small' | 'medium' | 'large';
    loading?: boolean;
    disabled?: boolean;
    style?: ViewStyle;
}

export const Button = ({ title, onPress, variant = 'primary', size = 'medium', loading = false, disabled = false, style }: ButtonProps) => {
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

    const getPadding = () => {
        switch (size) {
            case 'small': return { paddingVertical: Spacing.xs, paddingHorizontal: Spacing.md };
            case 'large': return { paddingVertical: Spacing.md + 4, paddingHorizontal: Spacing.xl };
            default: return { paddingVertical: Spacing.md, paddingHorizontal: Spacing.lg };
        }
    };

    const getFontSize = () => {
        switch (size) {
            case 'small': return 14;
            case 'large': return 18;
            default: return 16;
        }
    };

    return (
        <TouchableOpacity
            style={[
                styles.button,
                { backgroundColor: getBackgroundColor() },
                getBorder(),
                getPadding(),
                style
            ]}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.8}
        >
            {loading ? (
                <ActivityIndicator color={getTextColor()} />
            ) : (
                <Text style={[styles.text, { color: getTextColor(), fontSize: getFontSize() }]}>{title}</Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        borderRadius: BorderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: Spacing.sm,
    },
    text: {
        fontWeight: '600',
        letterSpacing: 0.5,
    },
});
