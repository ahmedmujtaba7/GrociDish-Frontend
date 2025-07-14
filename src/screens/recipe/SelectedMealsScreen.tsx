import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '@/src/navigation/types';

type NavigationProp = NativeStackNavigationProp<HomeStackParamList>;
type MealType = 'BREAKFAST' | 'LUNCH/DINNER' | 'DISEASE_SPECIFIC';

const SelectedMealsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [selectedMeals, setSelectedMeals] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSelectedMeals = async () => {
      try {
        const storedData = await AsyncStorage.getItem('recommendedRecipes');
        if (storedData) {
          setSelectedMeals(JSON.parse(storedData));
        }
      } catch (error) {
        console.error('Error fetching selected meals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSelectedMeals();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Selected Meals</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#4CAF50" />
      ) : selectedMeals ? (
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
          <View style={styles.recipesContainer}>
            {Object.keys(selectedMeals).map((mealType) => (
              <RecipeSection key={mealType} mealType={mealType as MealType} recipes={selectedMeals[mealType]} navigation={navigation} />
            ))}
          </View>
        </ScrollView>
      ) : (
        <Text style={styles.error}>No meals selected yet.</Text>
      )}
    </View>
  );
};

// ✅ **Recipe Section Component**
const RecipeSection = ({ mealType, recipes, navigation }: { mealType: MealType; recipes: any[]; navigation: NavigationProp }) => (
  <>
    <Text style={styles.sectionTitle}>{mealType}</Text>
    {recipes.map((recipe) => (
      <RecipeCard key={recipe.id} recipe={recipe} navigation={navigation} />
    ))}
  </>
);

// ✅ **Recipe Card Component**
const RecipeCard = ({ recipe, navigation }: { recipe: any; navigation: NavigationProp }) => (
  <View style={styles.card}>
    <Image source={{ uri: recipe.picture }} style={styles.image} />
    <Text style={styles.title}>{recipe.name}</Text>

    <TouchableOpacity 
      style={styles.detailsButton} 
      onPress={() => navigation.navigate('RecipeDetailScreen', { recipe })}
    >
      <Text style={styles.detailsText}>View Details</Text>
    </TouchableOpacity>
  </View>
);

export default SelectedMealsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: '#F7FFF7' },
  header: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', color: '#2E7D32', marginTop: 50 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#2E7D32', marginTop: 15, marginBottom: 5, textAlign: 'center' },
  error: { color: 'red', textAlign: 'center', fontSize: 16 },
  recipesContainer: { alignItems: 'center', paddingBottom: 20 },
  card: { 
    backgroundColor: 'white', 
    padding: 12, 
    borderRadius: 15, 
    marginBottom: 10,
    shadowColor: '#000', 
    shadowOpacity: 0.1, 
    shadowOffset: { width: 0, height: 2 }, 
    shadowRadius: 5, 
    elevation: 5, 
    width: 250, 
    alignItems: 'center' 
  },
  image: { width: 230, height: 150, borderRadius: 10 },
  title: { fontSize: 16, fontWeight: 'bold', color: '#2E7D32', textAlign: 'center', marginTop: 5 },
  detailsButton: { backgroundColor: '#E8F5E9', paddingVertical: 5, paddingHorizontal: 15, borderRadius: 8, marginTop: 8 },
  detailsText: { color: '#388E3C', fontWeight: 'bold' },
  scrollViewContainer: { flexGrow: 1, alignItems: 'center' },
});
