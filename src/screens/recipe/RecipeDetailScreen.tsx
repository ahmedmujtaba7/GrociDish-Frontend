import React, { useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; // For Icons

// Define Ingredient type
interface Ingredient {
  [key: string]: number; // dynamic key with a number value representing grams or milliliters
}

const RecipeDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { recipe } = route.params as { recipe: any };

  // State for selected serving size
  const [servingSize, setServingSize] = useState(1);

  // Function to convert units if above 1000
  const convertAmount = (amount: number, unit: string) => {
    if (unit === 'g' && amount >= 1000) {
      return { value: (amount / 1000).toFixed(2), unit: 'kg' };
    }
    if (unit === 'ml' && amount >= 1000) {
      return { value: (amount / 1000).toFixed(2), unit: 'L' };
    }
    return { value: amount.toFixed(2), unit: unit };
  };

  // Adjust ingredients based on serving size
  const adjustedIngredients = recipe.ingredients.map((ingredient: Ingredient) => {
    const ingredientName = Object.keys(ingredient)[0];
    let ingredientAmount = Object.values(ingredient)[0] * servingSize;
// Always round UP to the nearest 0.05 increment
ingredientAmount = Math.ceil(ingredientAmount / 0.05) * 0.05;

// Ensure it's not rounded to zero for small values
if (ingredientAmount < 0.15 || ingredientAmount == 0) {
  ingredientAmount = Object.values(ingredient)[0] * servingSize;
}



    // Here, we're assuming the unit is either "g" or "ml". You can modify this logic if the units differ.
    const unit = ingredientName.toLowerCase().includes('water') ? 'ml' : 'g'; // Assuming some ingredients might be in ml.

    const converted = convertAmount(ingredientAmount, unit);
    return { name: ingredientName, amount: converted.value, unit: converted.unit };
  });

  return (
    <ScrollView style={styles.container}>
      {/* Recipe Image */}
      <Image source={{ uri: recipe.picture }} style={styles.image} />

      {/* Recipe Title */}
      <Text style={styles.title}>{recipe.name}</Text>

      {/* Recipe Info Card */}
      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Ionicons name="fast-food-outline" size={20} color="#2E7D32" />
          <Text style={styles.infoText}>Category: {recipe.category}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="leaf-outline" size={20} color="#2E7D32" />
          <Text style={styles.infoText}>Ingredient Type: {recipe.ingredientType}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="restaurant-outline" size={20} color="#2E7D32" />
          <Text style={styles.infoText}>Food Type: {recipe.foodType}</Text>
        </View>
      </View>

      {/* Serving Size Adjustment */}
      <View style={styles.servingSizeContainer}>
        <Text style={styles.sectionTitle}>Serving Size</Text>
        <View style={styles.servingSizeBox}>
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => setServingSize(servingSize > 1 ? servingSize - 1 : 1)}
          >
            <Text style={styles.buttonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.servingSizeText}>{servingSize}</Text>
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => setServingSize(servingSize + 1)}
          >
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Nutritional Info */}
      <View style={styles.nutritionCard}>
        <Text style={styles.sectionTitle}>Nutritional Information</Text>
        <View style={styles.nutrientRow}>
          <Text style={styles.nutrientLabel}>Calories:</Text>
          <Text style={styles.nutrientValue}>{(recipe.caloriesPerServing * servingSize).toFixed(2)} kcal</Text>
        </View>
        <View style={styles.nutrientRow}>
          <Text style={styles.nutrientLabel}>Carbs:</Text>
          <Text style={styles.nutrientValue}>{(recipe.carbohydrates * servingSize).toFixed(2)}g</Text>
        </View>
        <View style={styles.nutrientRow}>
          <Text style={styles.nutrientLabel}>Proteins:</Text>
          <Text style={styles.nutrientValue}>{(recipe.proteins * servingSize).toFixed(2)}g</Text>
        </View>
        <View style={styles.nutrientRow}>
          <Text style={styles.nutrientLabel}>Fats:</Text>
          <Text style={styles.nutrientValue}>{(recipe.fats * servingSize).toFixed(2)}g</Text>
          
        </View>
      </View>

      {/* Ingredients List */}
      <Text style={styles.sectionTitle}>Ingredients</Text>
      <View style={styles.ingredientList}>
        {adjustedIngredients.map((ingredient:any, index:any) => (
          <View key={index} style={styles.ingredientRow}>
            <Ionicons name="checkmark-circle-outline" size={18} color="#388E3C" />
            <Text style={styles.ingredientText}>
              {ingredient.name} - {ingredient.amount}{ingredient.unit}
            </Text>
          </View>
        ))}
      </View>

      {/* Directions */}
      <Text style={styles.sectionTitle}>Directions</Text>
      <View style={styles.directionsBox}>
        <Text style={styles.directions}>{recipe.directions}</Text>
      </View>

      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={20} color="white" />
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default RecipeDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F7FFF7',
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 15,
    marginTop: 30,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2E7D32',
    textAlign: 'center',
    marginBottom: 10,
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 5,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  infoText: {
    fontSize: 16,
    color: '#388E3C',
    marginLeft: 8,
  },
  nutritionCard: {
    backgroundColor: '#E8F5E9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 10,
  },
  nutrientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  nutrientLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E7D32',
  },
  nutrientValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  ingredientList: {
    backgroundColor: '#FAFAFA',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  ingredientText: {
    fontSize: 16,
    color: '#388E3C',
    marginLeft: 8,
  },
  directionsBox: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  directions: {
    fontSize: 16,
    lineHeight: 24,
    color: '#4E4E4E',
  },
  backButton: {
    marginTop: 10,
    marginBottom: 30,
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  servingSizeContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  servingSizeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  servingSizeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#388E3C',
  },
});

