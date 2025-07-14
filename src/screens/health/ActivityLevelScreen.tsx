import React from 'react';
import { Image,View, Text,TouchableOpacity, StyleSheet } from 'react-native';
import { useAppDispatch } from '../../redux/hooks';
import { setActivityLevel } from '@/src/redux/slices/healthProfileSlice';
import { useNavigation } from '@react-navigation/native';
import { HomeStackParamList } from '@/src/navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Ionicons from '@expo/vector-icons/Ionicons';

type NavigationProp = NativeStackNavigationProp<HomeStackParamList>;

const ActivityLevelScreen = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NavigationProp>();

  const handleActivitySelect = (level: string) => {
    dispatch(setActivityLevel(level));
    navigation.navigate('DiseasesScreen');
  };

  return (
    
      <View style={styles.container}>
      {/* Add Logo */}
      <Image source={require('../../../assets/images/u.png')} style={styles.logo} />
  
      {/* Add Title */}
      <Text style={styles.title}>Select Your Activity Level</Text>
  
      {/* Add Subtitle */}
      <Text style={styles.subtitle}>
        Your Calories will be adjusted based on your physical activity level.
      </Text>
  
      {/* Add Horizontal Line */}
      <View style={styles.line} />
  
      {/* Gender Buttons */}
     
      <View style={styles.buttonContainer}>
      <TouchableOpacity
  style={[styles.button, styles.maleButton]}
  onPress={() => handleActivitySelect('sedentary')}>
  <Ionicons name="man-outline" size={20} color="#fff"  />
  <Text style={styles.buttonText}>Sedentary (Little to no exercise )</Text>
</TouchableOpacity>
<TouchableOpacity
  style={[styles.button, styles.femaleButton]}
  onPress={() => handleActivitySelect('light')}
>
  <Ionicons name="walk-outline" size={20} color="#fff"  />
  <Text style={styles.buttonText}>Lightly Active (exercise 1-3 days per week)</Text>
</TouchableOpacity>
<TouchableOpacity
  style={[styles.button, styles.maleButton]}
  onPress={() => handleActivitySelect('moderate')}
>
  <Ionicons name="accessibility-outline" size={20} color="#fff"  />
  <Text style={styles.buttonText}>Moderately Active (exercise 3-5 days per week)</Text>
</TouchableOpacity>
      <TouchableOpacity
  style={[styles.button, styles.femaleButton]}
  onPress={() => handleActivitySelect('active')}
>
  <Ionicons name="bicycle-outline" size={20} color="#fff"  />
  <Text style={styles.buttonText}>Very Active (exercise 6-7 days per week)</Text>
</TouchableOpacity>
</View>
</View>
   

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 20,
    marginTop:-50,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#7393B3',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  line: {
    height: 1,
    width: '80%',
    backgroundColor: '#ccc',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: "space-between",
    width: '109%',
    height: '40%',
  },
  button: {
    flex: 1,
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginHorizontal: 10,
    marginBottom:10,
  },
  maleButton: {
    backgroundColor: '#56ab2f',
  },
  femaleButton: {
    backgroundColor: '#a8e063',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});


export default ActivityLevelScreen;
