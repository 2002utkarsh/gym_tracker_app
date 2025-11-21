import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { Colors, Spacing, BorderRadius } from '../constants/theme';

interface ProgressChartProps {
    data: number[];
    previousData?: number[];
    labels: string[];
    title: string;
    showComparison?: boolean;
}

export const ProgressChart = ({ data, previousData, labels, title, showComparison = false }: ProgressChartProps) => {
    const screenWidth = Dimensions.get('window').width - (Spacing.lg * 2);

    // If we have previous data, create a stacked chart
    const chartData = showComparison && previousData ? {
        labels: labels,
        datasets: [
            {
                data: data,
                color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`, // Current - primary color
            },
            {
                data: previousData,
                color: (opacity = 1) => `rgba(148, 163, 184, ${opacity})`, // Previous - gray
            }
        ],
        legend: ['Today', 'Last Time']
    } : {
        labels: labels,
        datasets: [{ data: data }]
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            {showComparison && previousData && (
                <View style={styles.legendContainer}>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendBox, { backgroundColor: Colors.primary }]} />
                        <Text style={styles.legendText}>Today</Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendBox, { backgroundColor: '#94a3b8' }]} />
                        <Text style={styles.legendText}>Last Time</Text>
                    </View>
                </View>
            )}
            <BarChart
                data={chartData}
                width={screenWidth}
                height={220}
                yAxisLabel=""
                yAxisSuffix=""
                chartConfig={{
                    backgroundColor: Colors.surface,
                    backgroundGradientFrom: Colors.surface,
                    backgroundGradientTo: Colors.surface,
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(100, 116, 139, ${opacity})`,
                    style: {
                        borderRadius: BorderRadius.md,
                    },
                    propsForBackgroundLines: {
                        strokeDasharray: '',
                        stroke: Colors.border,
                        strokeWidth: 1,
                    },
                }}
                style={styles.chart}
                fromZero
                showBarTops={false}
                withInnerLines={true}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: Spacing.lg,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.text,
        marginBottom: Spacing.sm,
    },
    legendContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: Spacing.sm,
        gap: Spacing.lg,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    legendBox: {
        width: 16,
        height: 16,
        borderRadius: 4,
        marginRight: 6,
    },
    legendText: {
        fontSize: 12,
        color: Colors.textSecondary,
    },
    chart: {
        borderRadius: BorderRadius.md,
    },
});
