// src/navigation/types.ts
// export type RootStackParamList = {
  
//   HomeNavigator: { screen: keyof HomeStackParamList };
// };
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


export type HomeStackParamList = {
  Login: undefined; // No params for Login
  Signup: undefined; // No params for Signup
  SplashScreen: undefined;
  VerifyCodeScreen: { email: string }; // Params for VerifyCodeScreen
  Home: undefined;
  GenderScreen: undefined;
  FamilySelectionScreen: undefined;
  CreateFamilyScreen: undefined;
  JoinFamilyScreen: undefined;
  ActivityLevelScreen: undefined;
  AgeScreen: undefined;
  DiseasesScreen: undefined;
  HeightScreen: undefined;
  WeightScreen: undefined;
  UpdateHealthProfileForm: undefined;
  ViewHealthProfileScreen: undefined;
  FamilyCodeScreen: undefined;
  UpdatePasswordScreen: undefined;
  AssignGroceryGenerator: undefined;
  AssignRecipeSelector: undefined;
  ViewFamilyScreen: undefined;
  TrackCalories:undefined; //newly added
  RecipeListScreen: undefined;
  RecipeDetailScreen: { recipe: Recipe };
  RecommendedRecipesScreen: undefined;
  SelectedMealsScreen: undefined;
  BudgetInputScreen: undefined;
  GroceryGenerationScreen: undefined;
  ViewGroceryScreen: undefined;
};

