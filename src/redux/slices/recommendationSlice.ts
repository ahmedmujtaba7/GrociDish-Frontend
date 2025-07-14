import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Recipe {
  id: number;
  name: string;
  ingredients: object;
  directions: string;
  category: string;
  ingredientType: string;
  foodType: string;
  caloriesPerServing: string;
  carbohydrates: string;
  proteins: string;
  fats: string;
  picture: string;
  disease: string;
}

interface RecommendationState {
  recommendations: {
    BREAKFAST: Recipe[];
    LUNCH: Recipe[];
    DINNER: Recipe[];
    DISEASE_SPECIFIC: Recipe[];
  };
  currentIndex: {
    BREAKFAST: number;
    LUNCH: number;
    DINNER: number;
    DISEASE_SPECIFIC: number;
  };
  loading: boolean;
  error: string | null;
  buttonsDisabled: boolean;
}

const initialState: RecommendationState = {
  recommendations: { BREAKFAST: [], LUNCH: [], DINNER: [], DISEASE_SPECIFIC: [] },
  currentIndex: { BREAKFAST: 0, LUNCH: 0, DINNER: 0, DISEASE_SPECIFIC: 0 },
  loading: false,
  error: null,
  buttonsDisabled: false,
};

// **Fetch Recommended Recipes**
export const fetchRecommendedRecipes = createAsyncThunk(
  'recommendations/fetchRecommendedRecipes',
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) throw new Error('User not authenticated');

      const response = await axiosInstance.post('/recipes/recipeRecommendation', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response.data.data.data);
      return response.data.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch recommendations');
    }
  }
);

// **Store All Selected Meals API**
export const selectMeal = createAsyncThunk(
  'recommendations/selectMeal',
  async (meals: { recipeId: number; mealType: string }[], { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) throw new Error('User not authenticated');
      await axiosInstance.post('/recipes/storeSelectedMeal', { meals }, { headers: { Authorization: `Bearer ${token}` } });

      // Store meal selection time to disable buttons
      await AsyncStorage.setItem('lastMealSelection', new Date().getTime().toString());

      return true; // Success
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to select meal');
    }
  }
);

const recommendationSlice = createSlice({
  name: 'recommendations',
  initialState,
  reducers: {
    nextRecipe: (state, action) => {
      const mealType = action.payload as keyof RecommendationState['recommendations']; // 👈 Fixed this line
      const currentIndex = state.currentIndex[mealType];
      const totalRecipes = state.recommendations[mealType].length;
    
      state.currentIndex[mealType] = (currentIndex + 1) % totalRecipes;
    },
    previousRecipe: (state, action) => {
      const mealType = action.payload as keyof RecommendationState['recommendations']; // 👈 Fixed this line
      const currentIndex = state.currentIndex[mealType];
      const totalRecipes = state.recommendations[mealType].length;
    
      state.currentIndex[mealType] = (currentIndex - 1 + totalRecipes) % totalRecipes;
    },
    setButtonDisabled: (state, action) => {
      state.buttonsDisabled = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecommendedRecipes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecommendedRecipes.fulfilled, (state, action) => {
        state.loading = false;
        state.recommendations = action.payload;
      })
      .addCase(fetchRecommendedRecipes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(selectMeal.fulfilled, (state) => {
        state.buttonsDisabled = true; // Disable both buttons for 24 hours
      });
  },
});

export const { nextRecipe, previousRecipe, setButtonDisabled } = recommendationSlice.actions;
export default recommendationSlice.reducer;
