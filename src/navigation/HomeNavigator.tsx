import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeStackParamList } from './types';
import HomeScreen from '../screens/home/HomeScreen';
import FamilySelectionScreen from '../screens/users/FamilySelectionScreen';
import CreateFamilyScreen from '../screens/users/CreateFamilyScreen';
import JoinFamilyScreen from '../screens/users/JoinFamilyScreen';
import ActivityLevelScreen from '../screens/health/ActivityLevelScreen';
import WeightScreen from '../screens/health/WeightScreen';
import HeightScreen from '../screens/health/HeightScreen';  
import GenderScreen from '../screens/health/GenderScreen';
import AgeScreen from '../screens/health/AgeScreen';
import DiseasesScreen from '../screens/health/DiseasesScreen';
import UpdateHealthProfileForm from '../screens/home/UpdateHealthProfileForm';
import ViewHealthProfileScreen from '../screens/home/ViewHealthProfile';
import FamilyCodeScreen from '../screens/home/FamilyCodeScreen';
import UpdatePasswordScreen from '../screens/auth/UpdatePasswordScreen';
import RoleAssignmentScreen from '../screens/home/RoleAssignmentScreen';
import ViewFamilyScreen from '../screens/home/ViewFamilyScreen';
import TrackCalories from '../screens/home/Trackcalories'; //added by filzah
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import VerifyCodeScreen from '../screens/auth/VerifyCodeScreen';
import SplashScreen from '../screens/auth/Splash';
import RecipeDetailScreen from '../screens/recipe/RecipeDetailScreen';
import RecipeListScreen from '../screens/recipe/RecipeListScreen';
import RecommendedRecipesScreen from '../screens/recipe/RecommendedRecipesScreen';
import SelectedMealsScreen from '../screens/recipe/SelectedMealsScreen';
import GenerateGroceryScreen from '../screens/grocery/GenerateGroceryScreen';
import BudgetInputScreen from '../screens/grocery/BudgetInputScreen';
import ViewGroceryScreen from '../screens/grocery/ViewGroceryScreen';

const HomeStack = createNativeStackNavigator<HomeStackParamList>();

const HomeNavigator = () => {
  console.log("we are in home stack");
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }} initialRouteName="SplashScreen">
      <HomeStack.Screen name="Login" component={LoginScreen} />
      <HomeStack.Screen name="SplashScreen" component={SplashScreen} />
      <HomeStack.Screen name="Signup" component={SignupScreen} />
      <HomeStack.Screen name="VerifyCodeScreen" component={VerifyCodeScreen} />
      <HomeStack.Screen name="Home" component={HomeScreen} />
      <HomeStack.Screen name="GenderScreen" component={GenderScreen} />
      <HomeStack.Screen name="ViewHealthProfileScreen" component={ViewHealthProfileScreen} />
      <HomeStack.Screen name="FamilySelectionScreen" component={FamilySelectionScreen} />
      <HomeStack.Screen name="CreateFamilyScreen" component={CreateFamilyScreen} />
      <HomeStack.Screen name="JoinFamilyScreen" component={JoinFamilyScreen} />
      <HomeStack.Screen name="AgeScreen" component={AgeScreen} />
      <HomeStack.Screen name="WeightScreen" component={WeightScreen} />
      <HomeStack.Screen name="HeightScreen" component={HeightScreen} />
      <HomeStack.Screen name="ActivityLevelScreen" component={ActivityLevelScreen} />
      <HomeStack.Screen name="DiseasesScreen" component={DiseasesScreen} />
      <HomeStack.Screen name="UpdateHealthProfileForm" component={UpdateHealthProfileForm} />
      <HomeStack.Screen name="FamilyCodeScreen" component={FamilyCodeScreen} />
      <HomeStack.Screen name="UpdatePasswordScreen" component={UpdatePasswordScreen} />
      <HomeStack.Screen name="ViewFamilyScreen" component={ViewFamilyScreen} />
      <HomeStack.Screen name="TrackCalories" component={TrackCalories}/> 
      <HomeStack.Screen name="RecipeListScreen" component={RecipeListScreen} />
      <HomeStack.Screen name="RecipeDetailScreen" component={RecipeDetailScreen} />
      <HomeStack.Screen name="AssignGroceryGenerator">
        {() => <RoleAssignmentScreen role="grocery_generator" />}
      </HomeStack.Screen>
      <HomeStack.Screen name="AssignRecipeSelector">
        {() => <RoleAssignmentScreen role="recipe_selector" />}
      </HomeStack.Screen>
      <HomeStack.Screen name="RecommendedRecipesScreen" component={RecommendedRecipesScreen} />
      <HomeStack.Screen name="SelectedMealsScreen" component={SelectedMealsScreen} />
      <HomeStack.Screen name="BudgetInputScreen" component={BudgetInputScreen} />
      <HomeStack.Screen name="GroceryGenerationScreen" component={GenerateGroceryScreen} />
      <HomeStack.Screen name="ViewGroceryScreen" component={ViewGroceryScreen} />
    </HomeStack.Navigator>
  );
};

export default HomeNavigator;
