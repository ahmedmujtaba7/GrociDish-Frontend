import React, { useEffect, useState } from 'react';
import {View,Text,StyleSheet,TextInput,TouchableOpacity,ScrollView,Alert,SafeAreaView} from 'react-native';;
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { getUserRole, Role } from '@/src/redux/slices/authSlice';
import { fetchCalorieStats } from '@/src/redux/slices/calorieSlice';
import UserStats from '@/src/components/UserStats';
import { useNavigation } from '@react-navigation/native';
import { HomeStackParamList } from '@/src/navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

type HomeNavigationProp = NativeStackNavigationProp<HomeStackParamList>;



 

const TrackCalories = () => {
 /* const dummyStats = {
    calories_consumed_per_day: 1200,
    required_calories: 2000,
    consumed_fats: 50,
    required_fats: 70,
    consumed_carbs: 180,
    required_carbs: 250,
    consumed_proteins: 60,
    required_proteins: 80,
    bmi: 23.5, // Example BMI value
  }; <UserStats stats={dummyStats} />dummy stats*/
  const dispatch = useAppDispatch();
  const navigation = useNavigation<HomeNavigationProp>();

  // Local state for role
  const [userRole, setUserRole] = useState<Role | null>(null);

  // Redux state for calorie data
  const { calories, isLoading, error } = useAppSelector((state) => state.calorie);

  return (

      <ScrollView contentContainerStyle={styles.container}>
<View style={styles.header}>
  <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.backButton}>
    <Ionicons name="arrow-back" size={24} color="#fff" />
  </TouchableOpacity>
  <Text style={styles.headerTitle}>Calorie Tracking</Text>
</View> 
       
        {!isLoading && !error && calories && (
            <UserStats stats={calories} />
          )}
      </ScrollView>
   
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F9',
  },
  scrollContent: {
    padding: 0,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    padding: 30,
    elevation: 3,
    marginTop:0,
    marginBottom:30,
  },
  backButton: {
    marginRight: 10,
    marginTop:40,
  },
  headerTitle: {
    fontSize: 20,
    marginTop:40,
    fontWeight: 'bold',
    color: '#fff', // Adjust color as needed
  },
});

export default TrackCalories;
