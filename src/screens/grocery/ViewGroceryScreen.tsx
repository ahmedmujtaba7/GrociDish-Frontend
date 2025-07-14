import React, { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchGroceryList } from '../../redux/slices/grocerySlice';
import { useNavigation } from '@react-navigation/native';

const ViewGroceryScreen = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const { groceryList, loading, error } = useAppSelector((state) => state.grocery);

  useEffect(() => {
    dispatch(fetchGroceryList());
  }, [dispatch]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
        <TouchableOpacity style={styles.button} onPress={() => dispatch(fetchGroceryList())}>
          <Text style={styles.buttonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!groceryList) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>No grocery list found.</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Grocery List (PKR {groceryList.budget})</Text>

      {Object.entries(groceryList.grocery_list).map(([category, items]: [string, any]) => (
        <View key={category} style={styles.category}>
          <Text style={styles.categoryTitle}>{category}</Text>
          {Object.entries(items).map(([itemName, details]: [string, any]) => (
            <View key={itemName} style={styles.item}>
              <Text style={styles.itemName}>{itemName.replace(/_/g, ' ')}</Text>
              <Text style={styles.details}>{details.Brand}</Text>
              <Text style={styles.details}>{details.Quantity}</Text>
              <Text style={styles.price}>PKR {details["Estimated Price (PKR)"]}</Text>
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
};

export default ViewGroceryScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7FFF7', padding: 50 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#2E7D32', textAlign: 'center', marginBottom: 15 },
  category: { marginBottom: 20 },
  categoryTitle: { fontSize: 20, fontWeight: 'bold', color: '#388E3C', marginBottom: 10 },
  item: { backgroundColor: 'white', padding: 10, borderRadius: 8, marginBottom: 8, elevation: 2 },
  itemName: { fontSize: 16, fontWeight: 'bold', color: '#2E7D32' },
  details: { fontSize: 14, color: '#555' },
  price: { fontSize: 16, fontWeight: 'bold', color: '#E53935' },
  button: { backgroundColor: '#4CAF50', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 20 },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  error: { fontSize: 18, color: 'red', textAlign: 'center' },
});
