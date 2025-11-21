import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Select } from '../components/Select';
import { getUser, createUser, updateUser, User } from '../db/user';
import { Colors, Spacing, BorderRadius } from '../constants/theme';

const GOAL_OPTIONS = [
    { label: 'Strength', value: 'Strength' },
    { label: 'Hypertrophy (Muscle Growth)', value: 'Hypertrophy' },
    { label: 'Endurance', value: 'Endurance' },
    { label: 'Weight Loss', value: 'Weight Loss' },
    { label: 'General Fitness', value: 'General Fitness' },
];

export default function ProfileScreen() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [name, setName] = useState('');
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [goal, setGoal] = useState('');
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        const existingUser = getUser();
        if (existingUser) {
            setUser(existingUser);
            setName(existingUser.name);
            setWeight(existingUser.weight.toString());
            setHeight(existingUser.height.toString());
            setGoal(existingUser.goal);
        }
    }, []);

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!name.trim()) newErrors.name = 'Name is required';
        if (!weight.trim()) newErrors.weight = 'Weight is required';
        if (!height.trim()) newErrors.height = 'Height is required';
        if (!goal) newErrors.goal = 'Please select a goal';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (!validate()) {
            Alert.alert('Missing Information', 'Please fill in all required fields.');
            return;
        }

        try {
            if (user) {
                updateUser(user.id, name, parseFloat(weight), parseFloat(height), goal);
                Alert.alert('Success', 'Profile updated!');
                router.back();
            } else {
                createUser(name, parseFloat(weight), parseFloat(height), goal);
                router.replace('/');
            }
        } catch (e) {
            console.error(e);
            Alert.alert('Error', 'Failed to save profile');
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.headerContainer}>
                    <Text style={styles.header}>{user ? 'Edit Profile' : 'Create Profile'}</Text>
                    <Text style={styles.subHeader}>Tell us about yourself to personalize your experience.</Text>
                </View>

                <View style={styles.form}>
                    <Input
                        label="Name"
                        value={name}
                        onChangeText={(text) => {
                            setName(text);
                            if (errors.name) setErrors({ ...errors, name: '' });
                        }}
                        placeholder="John Doe"
                        error={errors.name}
                    />

                    <View style={styles.row}>
                        <View style={styles.halfInput}>
                            <Input
                                label="Weight (kg)"
                                value={weight}
                                onChangeText={(text) => {
                                    setWeight(text);
                                    if (errors.weight) setErrors({ ...errors, weight: '' });
                                }}
                                keyboardType="numeric"
                                placeholder="75.5"
                                error={errors.weight}
                            />
                        </View>
                        <View style={styles.halfInput}>
                            <Input
                                label="Height (cm)"
                                value={height}
                                onChangeText={(text) => {
                                    setHeight(text);
                                    if (errors.height) setErrors({ ...errors, height: '' });
                                }}
                                keyboardType="numeric"
                                placeholder="180"
                                error={errors.height}
                            />
                        </View>
                    </View>

                    <Select
                        label="Main Goal"
                        value={goal}
                        options={GOAL_OPTIONS}
                        onSelect={(val) => {
                            setGoal(val);
                            if (errors.goal) setErrors({ ...errors, goal: '' });
                        }}
                        placeholder="Select your goal"
                        error={errors.goal}
                    />
                </View>

                <View style={styles.spacer} />

                <Button title="Save Profile" onPress={handleSave} size="large" />
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: Spacing.lg,
        backgroundColor: Colors.background,
    },
    headerContainer: {
        marginBottom: Spacing.xl,
        alignItems: 'center',
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: Spacing.xs,
    },
    subHeader: {
        fontSize: 16,
        color: Colors.textSecondary,
        textAlign: 'center',
    },
    form: {
        gap: Spacing.md,
    },
    row: {
        flexDirection: 'row',
        gap: Spacing.md,
    },
    halfInput: {
        flex: 1,
    },
    spacer: {
        height: 40,
    },
});
