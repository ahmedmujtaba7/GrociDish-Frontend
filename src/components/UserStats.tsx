import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { ProgressChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const getBMIStatus = (bmi: number) => {
  if (bmi < 18.5) return 'Underweight';
  if (bmi >= 18.5 && bmi <= 24.9) return 'Normal weight';
  if (bmi >= 25 && bmi <= 29.9) return 'Overweight';
  return 'Obese';
};

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
  const bmiStatus = getBMIStatus(stats.bmi);

  return (
    <View style={styles.card}>
      {/* Main Progress Chart for Calories */}
      <View style={styles.mainChartContainer}>
        <ProgressChart
          data={{
            labels: ['Today'], // Optional
            data: [calorieProgress], // Progress value as fraction (0-1)
          }}
          width={screenWidth - 50}
          height={200}
          strokeWidth={10}
          radius={60}
          chartConfig={{
            backgroundColor: '#e0e0e0',
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            color: () => `#4caf50`,
            strokeWidth: 2,
          }}
          hideLegend={true}
        />
        <Text style={styles.percentageText}>
          {Math.round(calorieProgress * 100)}%
        </Text>
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
              width={screenWidth / 3 - 20}
              height={120}
              strokeWidth={6}
              radius={40}
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
              width={screenWidth / 3 - 20}
              height={120}
              strokeWidth={6}
              radius={40}
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
              width={screenWidth / 3 - 20}
              height={120}
              strokeWidth={6}
              radius={40}
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

      {/* BMI Information */}
      <View style={styles.statsContainer}>
        <Text style={styles.title}>Body Mass Index (BMI)</Text>
        <Text style={styles.stat}>Your BMI: {stats.bmi}</Text>
        <Text style={styles.bmiStatus}>{bmiStatus}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    elevation: 5,
    padding: 20,
    marginVertical: 20,
    marginHorizontal: 10,
  },
  mainChartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  macroChartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  macroChart: {
    alignItems: 'center',
    flex: 1,
  },
  chartWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentageText: {
    position: 'absolute',
    fontSize: 20,
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
    marginTop: 10,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#555',
  },
  statsContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  stat: {
    fontSize: 16,
    textAlign: 'center',
    color: '#4caf50',
    fontWeight: 'bold',
  },
  bmiStatus: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 5,
    color: '#333',
    fontWeight: '600',
  },
});

export default UserStats;
