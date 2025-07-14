import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { ProgressChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const UserStats = ({ stats }: { stats: any }) => {
  const calorieProgress = Math.min(
    Number(stats.calories_consumed_per_day) / Number(stats.required_calories),
    1
  );
  const fatProgress = Math.min(
    Number(stats.consumed_fats) / Number(stats.required_fats),
    1
  );
  const carbProgress = Math.min(
    Number(stats.consumed_carbs) / Number(stats.required_carbs),
    1
  );
  const proteinProgress = Math.min(
    Number(stats.consumed_proteins) / Number(stats.required_proteins),
    1
  );

  return (
    <View style={styles.card}>
      {/* Main Progress Chart for Calories */}
      <View style={styles.mainChartContainer}>
        <View style={styles.chartWrapper}>
          <ProgressChart
            data={{
              labels: ['Today'], // Optional
              data: [calorieProgress], // Progress value as fraction (0-1)
            }}
            width={screenWidth - 40}  // Reduced width for better compactness
            height={160}
            strokeWidth={8}
            radius={50}
            chartConfig={{
              backgroundColor: '#e0e0e0',
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              color: () => `#4caf50`,  // Green for Calories
              strokeWidth: 2,
            }}
            hideLegend={true}
          />
          <Text style={styles.percentageText}>
            {Math.round(calorieProgress * 100)}%
          </Text>
        </View>
        <Text style={styles.chartLabel}>
          {stats.calories_consumed_per_day} / {stats.required_calories} Calories
        </Text>
      </View>

      {/* Smaller Progress Charts for Fats, Carbs, Proteins */}
      <View style={styles.macroChartContainer}>
        <View style={styles.macroChart}>
          <View style={styles.chartWrapper}>
            <ProgressChart
              data={{
                data: [fatProgress],
              }}
              width={(screenWidth - 50) / 3}  // Reduced width for smaller charts
              height={100}
              strokeWidth={6}
              radius={30}
              chartConfig={{
                backgroundColor: '#e0e0e0',
                backgroundGradientFrom: '#fff',
                backgroundGradientTo: '#fff',
                color: () => `#ff9800`, // Orange for Fats
              }}
              hideLegend={true}
            />
            <Text style={styles.percentageTextSmall}>
              {Math.round(fatProgress * 100)}%
            </Text>
          </View>
          <Text style={styles.chartLabel}>
            {stats.consumed_fats} / {stats.required_fats} Fats (g)
          </Text>
        </View>

        <View style={styles.macroChart}>
          <View style={styles.chartWrapper}>
            <ProgressChart
              data={{
                data: [carbProgress],
              }}
              width={(screenWidth - 50) / 3}  // Reduced width for smaller charts
              height={100}
              strokeWidth={6}
              radius={30}
              chartConfig={{
                backgroundColor: '#e0e0e0',
                backgroundGradientFrom: '#fff',
                backgroundGradientTo: '#fff',
                color: () => `#2196f3`, // Blue for Carbs
              }}
              hideLegend={true}
            />
            <Text style={styles.percentageTextSmall}>
              {Math.round(carbProgress * 100)}%
            </Text>
          </View>
          <Text style={styles.chartLabel}>
            {stats.consumed_carbs} / {stats.required_carbs} Carbs (g)
          </Text>
        </View>

        <View style={styles.macroChart}>
          <View style={styles.chartWrapper}>
            <ProgressChart
              data={{
                data: [proteinProgress],
              }}
              width={(screenWidth - 50) / 3}  // Reduced width for smaller charts
              height={100}
              strokeWidth={6}
              radius={30}
              chartConfig={{
                backgroundColor: '#e0e0e0',
                backgroundGradientFrom: '#fff',
                backgroundGradientTo: '#fff',
                color: () => `#9c27b0`, // Purple for Proteins
              }}
              hideLegend={true}
            />
            <Text style={styles.percentageTextSmall}>
              {Math.round(proteinProgress * 100)}%
            </Text>
          </View>
          <Text style={styles.chartLabel}>
            {stats.consumed_proteins} / {stats.required_proteins} Proteins (g)
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    elevation: 4,
    padding: 15,
    marginHorizontal: 10,
    marginBottom: 15,
    marginTop:0,
  },
  mainChartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  macroChartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  macroChart: {
    alignItems: 'center',
    flex: 1,
  },
  chartWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 50, // Circular border around each progress circle
    padding: 5,
  },
  percentageText: {
    position: 'absolute',
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4caf50',
  },
  percentageTextSmall: {
    position: 'absolute',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  chartLabel: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    color: '#555',
  },
});

export default UserStats;
