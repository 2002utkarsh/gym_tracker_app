import { Stack } from "expo-router";
import { useEffect } from "react";
import { initDatabase } from "../db";
import { Colors } from "../constants/theme";

export default function RootLayout() {
    useEffect(() => {
        try {
            initDatabase();
        } catch (e) {
            console.error("Database init error:", e);
        }
    }, []);

    return (
        <Stack
            screenOptions={{
                headerStyle: {
                    backgroundColor: Colors.surface,
                },
                headerTintColor: Colors.primary,
                headerTitleStyle: {
                    fontWeight: "bold",
                },
                contentStyle: {
                    backgroundColor: Colors.background,
                },
            }}
        >
            <Stack.Screen name="index" options={{ title: "Home" }} />
            <Stack.Screen name="profile" options={{ title: "Profile" }} />
            <Stack.Screen name="workout/new" options={{ title: "New Workout" }} />
            <Stack.Screen name="workout/[id]" options={{ title: 'Active Workout' }} />
            <Stack.Screen name="workout/select-exercise" options={{ title: 'Select Exercise' }} />
            <Stack.Screen name="workout/summary/[id]" options={{ title: 'Workout Summary' }} />
            <Stack.Screen name="templates/index" options={{ title: 'Workout Templates' }} />
            <Stack.Screen name="templates/create" options={{ title: 'Create Template' }} />
            <Stack.Screen name="templates/[id]" options={{ title: 'Template Details' }} />
        </Stack>
    );
}
