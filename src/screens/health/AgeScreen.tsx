import React, { useState } from 'react';
import {TextInput,Image,View,Text,TouchableWithoutFeedback,Keyboard,StyleSheet,} from 'react-native';
import { useAppDispatch } from '../../redux/hooks';
import { setAge } from '@/src/redux/slices/healthProfileSlice';
import { useNavigation } from '@react-navigation/native';
import { HomeStackParamList } from '@/src/navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import Ripple from 'react-native-material-ripple';
import { KeyboardAvoidingView, ScrollView, Platform } from 'react-native';

type NavigationProp = NativeStackNavigationProp<HomeStackParamList>;

const AgeScreen = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NavigationProp>();

  const [age, setAgeValue] = useState('');

  const handleNext = () => {
    const numericAge = parseInt(age, 10);
    if (isNaN(numericAge) || numericAge <= 0 || numericAge<=8) { //added a condition padding 
      alert('Please enter a valid age.');
      return;
    }
    dispatch(setAge(numericAge));
    navigation.navigate('WeightScreen');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
         <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    style={{ flex: 1 }}
  >
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
      <View style={styles.container}>
        {/* Header Section */}
        <Image source={require('../../../assets/images/u.png')} style={styles.logo} />
        <Text style={styles.subtitle}>
          Your age helps us determine calorie intake and weight goals.
        </Text>
        <View style={styles.line}></View>

        {/* Age Input Section */}
        <Text style={styles.title}>Enter Your Age</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="Enter your age"
          placeholderTextColor="#000"
          value={age}
          onChangeText={setAgeValue}
        />

        {/* Next Button */}
        <Ripple
          rippleColor="#fff"
          rippleContainerBorderRadius={10}
          rippleDuration={600}
          onPress={handleNext}
          style={styles.rippleButton}
        >
          <LinearGradient colors={['#56ab2f', '#a8e063']} style={styles.gradient}>
            <Text style={styles.buttonText}>Next</Text>
          </LinearGradient>
        </Ripple>
</View>      
      </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
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
    marginTop: -140,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 15,
  },
  line: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginVertical: 20,
    width: '60%',
    alignSelf: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#7393B3',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
    width: '80%',
    textAlign: 'center',
  },
  rippleButton: {
    width: '80%',
    borderRadius: 10,
    overflow: 'hidden', // Ensures ripple effect stays within the button
  },
  gradient: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AgeScreen;
