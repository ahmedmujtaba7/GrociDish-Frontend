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
  preference?: 'LIKE' | 'DISLIKE' | null; // Added preference field
}

interface RecipeState {
  recipes: Recipe[];
  loading: boolean;
  error: string | null;
}

const initialState: RecipeState = {
  recipes: [],
  loading: false,
  error: null,
};

// **Fetch recipes with pagination**
export const fetchRecipes = createAsyncThunk(
  'recipes/fetchRecipes',
  async ({ page = 1, limit = 10, category, ingredientType, disease }: 
         { page?: number, limit?: number, category?: string, ingredientType?: string, disease?: string }, { getState }) => {
    try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) throw new Error('User not authenticated, please log in');
        const response = await axiosInstance.get(`/recipes/getRecipe`, {
        params: { page, limit, category, ingredientType, disease },
      });

      // **Append new recipes instead of replacing (for infinite scroll)**
      const { recipes } = (getState() as { recipes: RecipeState }).recipes;
      return page === 1 ? response.data.data : [...recipes, ...response.data.data];
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch recipes');
    }
  }
);

// **Update recipe preference (Like/Dislike/Remove)**
export const updateRecipePreference = createAsyncThunk(
  'recipes/updateRecipePreference',
  async ({ recipeId, preference }: { recipeId: number; preference: 'LIKE' | 'DISLIKE' | 'REMOVE' }) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) throw new Error('User not authenticated');

      console.log("🔹 Sending API Request:", { recipeId, preference });

      const response = await axiosInstance.post(
        `/recipes/updatePreference`, 
          { recipeId, preference }, 
          { headers: { Authorization: `Bearer ${token}` } }
        );

      console.log("✅ API Response:", response.data);
      return { recipeId, preference: preference === 'REMOVE' ? null : preference };
    } catch (error: any) {
      console.error("❌ API Error:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to update preference');
    }
  }
);


const recipeSlice = createSlice({
  name: 'recipes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecipes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecipes.fulfilled, (state, action) => {
        state.loading = false;
        state.recipes = action.payload;
      })
      .addCase(fetchRecipes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Something went wrong';
      })
      .addCase(updateRecipePreference.fulfilled, (state, action) => {
        const { recipeId, preference } = action.payload;
        state.recipes = state.recipes.map((recipe) =>
          recipe.id === recipeId ? { ...recipe, preference } : recipe
        );
      });
  },
});

export default recipeSlice.reducer;
