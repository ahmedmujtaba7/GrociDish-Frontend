import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchRecipes, updateRecipePreference } from '../../redux/slices/recipeSlice';

import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { HomeStackParamList } from '@/src/navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import DropDownPicker from 'react-native-dropdown-picker';

type NavigationProp = NativeStackNavigationProp<HomeStackParamList>;

const RecipeListScreen = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NavigationProp>();
  const { recipes, loading } = useAppSelector((state) => state.recipes);

  // **Filter & Pagination states**
  const [category, setCategory] = useState('');
  const [ingredientType, setIngredientType] = useState('');
  const [disease, setDisease] = useState('');
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  const [openCategory, setOpenCategory] = useState(false);
 
  const [categoryItems, setCategoryItems] = useState([
    { label: 'Category', value: '' },
    { label: 'Breakfast', value: 'BREAKFAST' },
    { label: 'Lunch/Dinner', value: 'LUNCH/DINNER' }
  ]);
  
  const [openIngredient, setOpenIngredient] = useState(false);

  const [ingredientItems, setIngredientItems] = useState([
    { label: 'Ingredient Type', value: '' },
    { label: 'Meat', value: 'Meat' },
    { label: 'Vegetable', value: 'Vegetable' },
    { label: 'Pulse-Based', value: 'Pulse-Based' },
    { label: 'Other', value: 'Other' }
  ]);
  
  const [openDisease, setOpenDisease] = useState(false);
 
  const [diseaseItems, setDiseaseItems] = useState([
    { label: 'Health Concern', value: '' },
    { label: 'Diabetes', value: 'diabetes' },
    { label: 'Hypertension', value: 'hypertension' }
  ]);
  

  // **Fetch recipes with filters & pagination**
  useEffect(() => {
    dispatch(fetchRecipes({ page, category, ingredientType, disease }));
  }, [page, category, ingredientType, disease]);

  // **Handle like/dislike button click**
  const handlePreference = async (recipeId: number, newPreference: 'LIKE' | 'DISLIKE') => {
    const recipe = recipes.find((r) => r.id === recipeId);
    if (!recipe) return;
  
    const updatedPreference = recipe.preference === newPreference ? 'REMOVE' : newPreference;
    
    console.log("Sending API Request:", { recipeId, preference: updatedPreference });
  
    dispatch(updateRecipePreference({ recipeId, preference: updatedPreference }))
      .unwrap()
      .then((res) => console.log("API Response:", res))
      .catch((err) => console.error("API Error:", err));
  };
  


  // **Function to load more recipes**
  const loadMoreRecipes = () => {
    if (!loadingMore) {
      setLoadingMore(true);
      setPage((prevPage) => prevPage + 1);
      setLoadingMore(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Discover Delicious Recipes</Text>

      {/* Dropdowns for filtering */}
      <View style={styles.filterContainer}>
      <DropDownPicker
    open={openCategory}
    value={category}
    items={categoryItems}
    setOpen={setOpenCategory}
    setValue={setCategory}
    setItems={setCategoryItems}
    placeholder="Select Category"
    style={styles.dropdown}
    dropDownContainerStyle={styles.dropdownContainer}
    onChangeValue={() => setPage(1)}
  />

  <DropDownPicker
    open={openIngredient}
    value={ingredientType}
    items={ingredientItems}
    setOpen={setOpenIngredient}
    setValue={setIngredientType}
    setItems={setIngredientItems}
    placeholder="Select Ingredient Type"
    style={styles.dropdown}
    dropDownContainerStyle={styles.dropdownContainer1}
    onChangeValue={() => setPage(1)}
  />

  <DropDownPicker
    open={openDisease}
    value={disease}
    items={diseaseItems}
    setOpen={setOpenDisease}
    setValue={setDisease}
    setItems={setDiseaseItems}
    placeholder="Select Health Concern"
    style={styles.dropdown}
    dropDownContainerStyle={styles.dropdownContainer2}
    onChangeValue={() => setPage(1)}
  />
      </View>

      {loading && page === 1 ? (
        <ActivityIndicator size="large" color="#4CAF50" />
      ) : (
        <FlatList
          data={recipes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={{ uri: item.picture }} style={styles.image} />
              <View style={styles.infoContainer}>
                <Text style={styles.title}>{item.name}</Text>
                <View style={styles.iconContainer}>
                <TouchableOpacity onPress={() => handlePreference(item.id, 'LIKE')}>
                <AntDesign name="like2" size={24} color={item.preference === 'LIKE' ? '#4CAF50' : '#BDBDBD'} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handlePreference(item.id, 'DISLIKE')}>
                  <AntDesign name="dislike2" size={24} color={item.preference === 'DISLIKE' ? '#F44336' : '#BDBDBD'} />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate('RecipeDetailScreen', { recipe: item })}>
                  <Text style={styles.link}>View Details</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          onEndReached={loadMoreRecipes} // **Trigger pagination when scrolling down**
          onEndReachedThreshold={0.5} // **Loads when user is halfway through the list**
          ListFooterComponent={loadingMore ? <ActivityIndicator size="small" color="#4CAF50" /> : null}
        />
      )}
    </View>
  );
};

export default RecipeListScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#F7FFF7' },
  header: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', color: '#2E7D32', marginTop:55},
  
  picker: { height: 150, color: '#2E7D32', marginBottom: 50,marginTop:-70 },
  card: { backgroundColor: 'white', padding: 15, borderRadius: 15, marginBottom: 10, flexDirection: 'row', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 2 }, shadowRadius: 5, elevation: 5 },
  image: { width: 80, height: 80, borderRadius: 10, marginRight: 15 },
  infoContainer: { flex: 1 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#2E7D32' },
  iconContainer: { flexDirection: 'row', marginVertical: 5 },
  link: { color: '#388E3C', fontSize: 14, fontWeight: 'bold' },
  filterContainer: { backgroundColor: '#E8F5E9', padding: 10, borderRadius: 10, marginTop: 10 },
  dropdown: { backgroundColor: '#FFF', borderColor: '#4CAF50', height: 60 },
  dropdownContainer: { backgroundColor: '#F1F8E9' ,marginTop:90},
  dropdownContainer1: { backgroundColor: '#F1F8E9' ,marginTop:55},
  dropdownContainer2: { backgroundColor: '#F1F8E9' ,marginTop:0}
});
