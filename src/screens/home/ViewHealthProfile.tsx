import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { fetchHealthProfile } from '@/src/redux/slices/healthProfileSlice';
import { RootState, AppDispatch } from '@/src/redux/store';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '@/src/navigation/types';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '@/src/redux/hooks';


type NavigationProp = NativeStackNavigationProp<HomeStackParamList>;

const ViewHealthProfileScreen = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NavigationProp>();

  const { gender, age, height, weight, activity_level, diseases, isLoading, error } = useAppSelector(
    (state: RootState) => state.healthProfile
  );

  useEffect(() => {
    dispatch(fetchHealthProfile());
  }, [dispatch]);

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Health Profile</Text>
      </View>

      {/* Display Profile Attributes */}
      <View style={styles.content}>
        <View style={styles.attributeContainer}>
          <View style={styles.attributeRow}>
            <MaterialIcons name="person-outline" size={24} color="#4CAF50" />
            <Text style={styles.attribute}>
              <Text style={styles.attributeLabel}>Gender:</Text> {gender}
            </Text>
          </View>
          <View style={styles.attributeRow}>
            <Ionicons name="calendar-outline" size={24} color="#4CAF50" />
            <Text style={styles.attribute}>
              <Text style={styles.attributeLabel}>Age:</Text> {age}
            </Text>
          </View>
          <View style={styles.attributeRow}>
            <Ionicons name="resize-outline" size={24} color="#4CAF50" />
            <Text style={styles.attribute}>
              <Text style={styles.attributeLabel}>Height:</Text> {height} cm
            </Text>
          </View>
          <View style={styles.attributeRow}>
            <Ionicons name="scale-outline" size={24} color="#4CAF50" />
            <Text style={styles.attribute}>
              <Text style={styles.attributeLabel}>Weight:</Text> {weight} kg
            </Text>
          </View>
          <View style={styles.attributeRow}>
            <MaterialIcons name="fitness-center" size={24} color="#4CAF50" />
            <Text style={styles.attribute}>
              <Text style={styles.attributeLabel}>Activity Level:</Text> {activity_level}
            </Text>
          </View>
          <View style={styles.attributeRow}>
            <Ionicons name="alert-circle-outline" size={24} color="#4CAF50" />
            <Text style={styles.attribute}>
              <Text style={styles.attributeLabel}>Disease:</Text>{' '}
              {diseases.join(', ') || 'None'}
            </Text>
          </View>
        </View>

        {/* Update Profile Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('UpdateHealthProfileForm')}
        >
          <Text style={styles.buttonText}>Update Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    padding: 20,
    elevation: 3,
    marginTop:-60,
  },
  backButton: {
    marginRight: 10,
    marginTop:40,
  },
  headerTitle: {
    marginTop:40,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  attributeContainer: {
    marginBottom: 20,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  attributeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  attribute: {
    fontSize: 16,
    marginLeft: 10,
    color: '#333',
  },
  attributeLabel: {
    fontWeight: 'bold',
    color: '#555',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F4F9',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F4F9',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
});

export default ViewHealthProfileScreen;
