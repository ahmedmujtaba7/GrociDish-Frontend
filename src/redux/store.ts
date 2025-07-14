import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import familyReducer from './slices/familySlice';
import healthProfileReducer from './slices/healthProfileSlice'
import calorieReducer from './slices/calorieSlice'
import roleReducer from './slices/roleSlice'
import familyDetailsReducer from './slices/familyDetailsSlice';
import recipeReducer from './slices/recipeSlice';
import fetchRecommendedRecipes from './slices/recommendationSlice';
import groceryReducer from './slices/grocerySlice';
const store = configureStore({
  reducer: {
    auth: authReducer,
    family: familyReducer, 
    healthProfile: healthProfileReducer,
    calorie: calorieReducer,
    roles: roleReducer,
    familyDetails: familyDetailsReducer,
    recipes: recipeReducer,
    recommendations: fetchRecommendedRecipes,
    grocery: groceryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
