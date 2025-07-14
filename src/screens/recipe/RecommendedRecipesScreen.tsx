import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ActivityIndicator, StyleSheet, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchRecommendedRecipes, selectMeal, setButtonDisabled } from '../../redux/slices/recommendationSlice';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '@/src/navigation/types';

type NavigationProp = NativeStackNavigationProp<HomeStackParamList>;
type MealType = 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'DISEASE_SPECIFIC';

const RecommendedRecipesScreen = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NavigationProp>();
  const { recommendations, loading, error, buttonsDisabled } = useAppSelector((state) => state.recommendations);

  const [storedRecommendations, setStoredRecommendations] = useState<any>(null);
  const [selectMealDisabled, setSelectMealDisabled] = useState(false);
  const [loadingStorage, setLoadingStorage] = useState(true);

  useEffect(() => {
    const loadStoredData = async () => {
      try {
        const storedData = await AsyncStorage.getItem('recommendedRecipes');
        const storedTimestamp = await AsyncStorage.getItem('recommendationTimestamp');
        const lastMealSelection = await AsyncStorage.getItem('lastMealSelection');
        const now = new Date().getTime();

        // Disable buttons if last selection was less than 24 hours ago
        if (lastMealSelection && now - parseInt(lastMealSelection, 10) < 24 * 60 * 60 * 1000) {
          setSelectMealDisabled(true);
          dispatch(setButtonDisabled(true));
        }

        // Use stored recommendations if available and valid
        if (storedData && storedTimestamp && now - parseInt(storedTimestamp, 10) < 24 * 60 * 60 * 1000) {
          setStoredRecommendations(JSON.parse(storedData));
          setLoadingStorage(false);
          return;
        }

        // Fetch new recommendations if no valid stored data
        regenerateRecommendations();
      } catch (error) {
        console.error('Error loading stored recommendations:', error);
        regenerateRecommendations();
      }
    };

    loadStoredData();
  }, []);

  // **Regenerate Recommendations**
  const regenerateRecommendations = async () => {
    dispatch(fetchRecommendedRecipes()).then((action) => {
      if (fetchRecommendedRecipes.fulfilled.match(action)) {
        AsyncStorage.setItem('recommendedRecipes', JSON.stringify(action.payload));
        AsyncStorage.setItem('recommendationTimestamp', new Date().getTime().toString());
        setStoredRecommendations(action.payload);
      }
    });
  };

  // **Select Meal API Call**
  const handleSelectMeal = async () => {
    if (selectMealDisabled) return;

    const selectedMeals = Object.entries(storedRecommendations).flatMap(([mealType, recipes]) =>
      (recipes as any[]).map((recipe) => ({
        recipeId: recipe.id,
        mealType: mealType,
      }))
    );

    dispatch(selectMeal(selectedMeals)).then(() => {
      AsyncStorage.setItem('lastMealSelection', new Date().getTime().toString());
      setSelectMealDisabled(true);
      dispatch(setButtonDisabled(true));
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Recommended Meals</Text>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, selectMealDisabled && styles.disabledButton]} 
          onPress={handleSelectMeal}
          disabled={selectMealDisabled}
        >
          <Text style={styles.buttonText}>✅ Select Meal</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, buttonsDisabled && styles.disabledButton]} 
          onPress={regenerateRecommendations}
          disabled={buttonsDisabled}
        >
          <Text style={styles.buttonText}>🔄 Regenerate Recipes</Text>
        </TouchableOpacity>
      </View>

      {loadingStorage ? (
        <ActivityIndicator size="large" color="#4CAF50" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
          <View style={styles.recipesContainer}>
            {Object.keys(storedRecommendations).map((mealType) => (
              <RecipeSection key={mealType} mealType={mealType as MealType} recipes={storedRecommendations[mealType]} navigation={navigation} />
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

// **Recipe Section Component**
const RecipeSection = ({ mealType, recipes, navigation }: { mealType: MealType; recipes: any[]; navigation: NavigationProp }) => (
  <>
    <Text style={styles.sectionTitle}>{mealType}</Text>
    {recipes.map((recipe, index) => (
  <RecipeCard key={`${mealType}-${recipe.id}-${index}`} recipe={recipe} navigation={navigation} />
))}
  </>
);

// **Recipe Card Component**
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

export default RecommendedRecipesScreen;

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
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 15 },
  button: { backgroundColor: '#4CAF50', padding: 12, borderRadius: 10 ,marginTop:20},
  disabledButton: { backgroundColor: '#BDBDBD' },
  buttonText: { color: 'white', fontWeight: 'bold' },
  detailsButton: { backgroundColor: '#E8F5E9', paddingVertical: 5, paddingHorizontal: 15, borderRadius: 8, marginTop: 8 },
  detailsText: { color: '#388E3C', fontWeight: 'bold' },
  scrollViewContainer: { flexGrow: 1, alignItems: 'center' },
});
