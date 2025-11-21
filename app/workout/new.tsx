import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { createWorkout } from '../../db/workout';
import { View, ActivityIndicator } from 'react-native';
import { Colors } from '../../constants/theme';

export default function NewWorkoutScreen() {
    const router = useRouter();

    useEffect(() => {
        const workoutId = createWorkout();
        router.replace(`/workout/${workoutId}`);
    }, []);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background }}>
            <ActivityIndicator size="large" color={Colors.primary} />
        </View>
    );
}
