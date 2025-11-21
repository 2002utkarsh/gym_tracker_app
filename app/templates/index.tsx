import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { getTemplates, WorkoutTemplate } from '../../db/template';
import { Button } from '../../components/Button';
import { TemplateCard } from '../../components/TemplateCard';
import { Colors, Spacing } from '../../constants/theme';

export default function TemplatesScreen() {
    const router = useRouter();
    const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);

    const loadTemplates = () => {
        setTemplates(getTemplates());
    };

    useFocusEffect(
        React.useCallback(() => {
            loadTemplates();
        }, [])
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Workout Templates</Text>
            <Text style={styles.subtitle}>Create reusable workout routines</Text>

            <Button
                title="Create New Template"
                onPress={() => router.push('/templates/create')}
                style={styles.createButton}
            />

            <FlatList
                data={templates}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                    <TemplateCard
                        id={item.id}
                        name={item.name}
                        description={item.description}
                        onPress={() => router.push(`/templates/${item.id}`)}
                    />
                )}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Text style={styles.emptyText}>No templates yet</Text>
                        <Text style={styles.emptySubtext}>Create your first workout template to get started</Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: Spacing.lg,
        backgroundColor: Colors.background,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 16,
        color: Colors.textSecondary,
        marginBottom: Spacing.lg,
    },
    createButton: {
        marginBottom: Spacing.lg,
    },
    empty: {
        marginTop: Spacing.xl,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 18,
        color: Colors.textSecondary,
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        color: Colors.textSecondary,
    },
});
