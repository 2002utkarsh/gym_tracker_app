import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { getUser, createUser, updateUser, User } from '../db/user';

export default function ProfileScreen() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [name, setName] = useState('');
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [goal, setGoal] = useState('');

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

    const handleSave = () => {
        if (!name || !weight || !height || !goal) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        try {
            if (user) {
                updateUser(user.id, name, parseFloat(weight), parseFloat(height), goal);
                Alert.alert('Success', 'Profile updated!');
                router.back();
            } else {
                createUser(name, parseFloat(weight), parseFloat(height), goal);
                // Navigate to home and replace history so they can't go back to empty profile
                router.replace('/');
            }
        } catch (e) {
            console.error(e);
            Alert.alert('Error', 'Failed to save profile');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>{user ? 'Edit Profile' : 'Create Profile'}</Text>

            <Input
                label="Name"
                value={name}
                onChangeText={setName}
                placeholder="John Doe"
            />

            <Input
                label="Weight (kg)"
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"
                placeholder="75.5"
            />

            <Input
                label="Height (cm)"
                value={height}
                onChangeText={setHeight}
                keyboardType="numeric"
                placeholder="180"
            />

            <Input
                label="Main Goal"
                value={goal}
                onChangeText={setGoal}
                placeholder="Strength, Hypertrophy..."
            />

            <View style={styles.spacer} />

            <Button title="Save Profile" onPress={handleSave} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 24,
        textAlign: 'center',
    },
    spacer: {
        height: 20,
    },
});
