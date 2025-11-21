import React from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps } from 'react-native';
import { Colors, BorderRadius, Spacing } from '../constants/theme';

interface InputProps extends TextInputProps {
    label: string;
    error?: string;
}

export const Input = ({ label, error, style, ...props }: InputProps) => {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                style={[
                    styles.input,
                    error ? styles.inputError : null,
                    style
                ]}
                placeholderTextColor={Colors.textSecondary}
                {...props}
            />
            {error && <Text style={styles.error}>{error}</Text>}
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
        marginBottom: Spacing.xs,
        color: Colors.text,
    },
    input: {
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: BorderRadius.md,
        padding: Spacing.md,
        fontSize: 16,
        backgroundColor: Colors.surface,
        color: Colors.text,
    },
    inputError: {
        borderColor: Colors.danger,
    },
    error: {
        color: Colors.danger,
        fontSize: 12,
        marginTop: Spacing.xs,
    },
});
