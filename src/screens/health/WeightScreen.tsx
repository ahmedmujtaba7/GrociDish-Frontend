import React, { useState } from 'react';
import {TextInput, Image,View, Text,TouchableWithoutFeedback,Keyboard, StyleSheet  } from 'react-native';
import { useAppDispatch } from '../../redux/hooks';
import { setWeight } from '@/src/redux/slices/healthProfileSlice';
import { useNavigation } from '@react-navigation/native';
import { HomeStackParamList } from '@/src/navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import Ripple from 'react-native-material-ripple';
import { KeyboardAvoidingView, ScrollView, Platform } from 'react-native';

type NavigationProp = NativeStackNavigationProp<HomeStackParamList>;

const WeightScreen = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NavigationProp>();
  const [weight, setWeightValue] = useState('');

  const handleNext = () => {
    const numericWeight = parseFloat(weight);
    if (isNaN(numericWeight) || numericWeight <= 19 || numericWeight>=150) { //added conditions filzah
      alert('Please enter a valid weight in kg.');
      return;
    }
    dispatch(setWeight(numericWeight));
    navigation.navigate('HeightScreen');
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
        Your weight helps us determine your calorie intake 
      </Text>
      <View style={styles.line}></View>

      {/* weight Input Section */}
      <Text style={styles.title}>Enter Your Weight (in kg)</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="Enter your Weight"
        placeholderTextColor="#000"
        value={weight}
        onChangeText={setWeightValue}
      />

<Ripple
        rippleColor="#fff"
        rippleContainerBorderRadius={10}
        rippleDuration={600}
        onPress={handleNext}
        style={styles.button}
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
  marginTop:-140,
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
},
button: {
  width: '100%',
  borderRadius: 10,
  overflow: 'hidden',
},

errorText: {
  color: '#ff6b6b',
  marginBottom: 10,
  textAlign: 'center',
},

loginText: {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#05668d',
  textAlign: 'center',
},
  haveAccountText: {
    fontSize: 16,
    color: '#000',
    marginVertical: 10,
    textAlign: 'center',
  },
  rippleButton: {
    width: '100%',
    borderRadius: 10,
    marginBottom:70,
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


export default WeightScreen;
