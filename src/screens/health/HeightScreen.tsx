import React, { useState } from 'react';
import {TextInput, Image,View, Text,TouchableWithoutFeedback,Keyboard, StyleSheet  } from 'react-native';
import { useAppDispatch } from '../../redux/hooks';
import { setHeight } from '@/src/redux/slices/healthProfileSlice';
import { useNavigation } from '@react-navigation/native';
import { HomeStackParamList } from '@/src/navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import Ripple from 'react-native-material-ripple';
import { KeyboardAvoidingView, ScrollView, Platform } from 'react-native';

type NavigationProp = NativeStackNavigationProp<HomeStackParamList>;

const HeightScreen = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NavigationProp>();
  const [height, setHeightValue] = useState('');

  const [feet, setFeet] = useState('');         // For feet input
  const [inches, setInches] = useState('');     // For inches input

  const convertToCm = (feet: string, inches: string) => {
    const feetValue = parseFloat(feet);
    const inchesValue = parseFloat(inches);

    // Validate the inputs
    if (isNaN(feetValue) || isNaN(inchesValue)) {
      return NaN;
    }

    // Convert feet and inches to cm (1 foot = 30.48 cm, 1 inch = 2.54 cm)
    const cm = (feetValue * 30.48) + (inchesValue * 2.54);
    return cm;
  };

  const handleNext = () => {
    let numericHeight = parseFloat(height);

    // If height is not in cm, convert feet and inches
    if (!numericHeight) {
      numericHeight = convertToCm(feet, inches);
     // console.log(numericHeight);
    }

    if (isNaN(numericHeight) || numericHeight <= 120 || numericHeight >= 200) {
      alert('Please enter a valid height.');
      return;
    }

    console.log(numericHeight);
    dispatch(setHeight(numericHeight));
    
    navigation.navigate('ActivityLevelScreen');
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
          Your height helps us determine your calorie intake
        </Text>
        <View style={styles.line}></View>

        {/* Height Input Section */}
        <Text style={styles.title}>Enter Your Height</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Enter height in cm"
            value={height}
            onChangeText={setHeightValue}
          />
        </View>

        {/* Or Enter in Feet and Inches */}
        <Text style={styles.subtitle}>Or</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Feet"
            placeholderTextColor={'#000'}
            value={feet}
            onChangeText={setFeet}
          />
          

          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Inches"
            placeholderTextColor={'#000'}
            value={inches}
            onChangeText={setInches}
          />
        
        </View>

        {/* Next Button */}
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
    marginTop:-80,
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
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
    flex: 1,
    marginRight: 10,
  },
  button: {
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 20,
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

export default HeightScreen;
