import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard, ActivityIndicator, StyleSheet } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { generateGroceryList } from '../../redux/slices/grocerySlice';
import { useNavigation } from '@react-navigation/native';
import { HomeStackParamList } from '@/src/navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type HomeNavigationProp = NativeStackNavigationProp<HomeStackParamList>;

const GroceryInputScreen = () => {
  const [budget, setBudget] = useState('');
  const dispatch = useAppDispatch();
  const navigation = useNavigation<HomeNavigationProp>();
  const { loading } = useAppSelector((state) => state.grocery);

  const handleGenerateGrocery = async () => {
    if (!budget || isNaN(Number(budget)) || Number(budget) <= 0) {
      if(Number(budget) <20000 || Number(budget) >100000) {
      alert('Please enter a valid budget amount.');
      return;
      }
    }

    const result = await dispatch(generateGroceryList(Number(budget))).unwrap();
    if (result) {
      navigation.navigate('GroceryGenerationScreen');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <View style={styles.container}>
      <Text style={styles.title}>Enter Your Budget</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter budget (PKR)"
        keyboardType="numeric"
        value={budget}
        onChangeText={setBudget}
      />
      <TouchableOpacity
        style={[styles.button, loading && styles.disabledButton]}
        onPress={handleGenerateGrocery}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>Generate Grocery List</Text>}
      </TouchableOpacity>
    </View>
    </TouchableWithoutFeedback>
  );
};

export default GroceryInputScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F7FFF7' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#2E7D32', marginBottom: 20 },
  input: { width: '80%', padding: 10, borderColor: '#4CAF50', borderWidth: 1, borderRadius: 8, marginBottom: 20 },
  button: { backgroundColor: '#4CAF50', padding: 15, borderRadius: 8, width: '80%', alignItems: 'center' },
  disabledButton: { backgroundColor: '#BDBDBD' },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});
