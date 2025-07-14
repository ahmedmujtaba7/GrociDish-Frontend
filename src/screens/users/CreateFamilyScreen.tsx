import React, { useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, TouchableWithoutFeedback,Keyboard, Alert, ActivityIndicator,Animated} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { createFamily } from '../../redux/slices/familySlice';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '@/src/navigation/types';

import * as Clipboard from 'expo-clipboard';
import  { Easing,useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';



type NavigationProp = NativeStackNavigationProp<HomeStackParamList>;

const CreateFamilyScreen = () => {
  const { isLoading, code, error } = useAppSelector((state) => state.family);
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NavigationProp>();
  
  useEffect(() => {
    const initializeFamily = async () => {
      try {
        await dispatch(createFamily()).unwrap();
      } catch (err: any) {
        Alert.alert('Error', err || 'Failed to create family.');
      }
    };
    initializeFamily();
  }, [dispatch]);

  const logoScale = useSharedValue(0);
  useEffect(() => {
    logoScale.value = withTiming(1, {
      duration: 1500,
      easing: Easing.inOut(Easing.ease),
    });
  }, []);

  const animatedLogoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
  }));
return (

  <View style={styles.container}>
    <View style={styles.innerContainer}>
      {/* Rotating Icon */}
      <Animated.Image
        source={require('../../../assets/images/u.png')}
        style={[styles.logo, animatedLogoStyle]}
      />

      <Text style={styles.title}>Create Family</Text>
      <Text style={styles.subtitle}>
        Copy your Family Code and share it with your Family Members
      </Text>

      <View style={styles.line} />

      {isLoading && <Text>Loading...</Text>}
      {error && <Text style={styles.errorText}>{error}</Text>}
      {code && (
        <>
          <Text style={styles.title2}>Your Family Code: {code}</Text>
       
      <View style={styles.buttonContainer}>
          <TouchableOpacity
style={[styles.button, styles.femaleButton]}
onPress={() => Clipboard.setStringAsync(code)}
>

<Text style={styles.buttonText}>Copy Code</Text>
</TouchableOpacity>

<TouchableOpacity style={[styles.button, styles.maleButton]} 
onPress={() => navigation.navigate('GenderScreen')}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity></View>
      </>
       )}
    
    </View>
  </View>
);
}; //added back button

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    innerContainer: {
      flex: 1,
      padding: 30,
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#7393B3',
      marginBottom: 10,
      textAlign: 'center',
    },
    title2: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#7393G2',
      marginBottom: 10,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 16,
      color: '#666',
      marginBottom: 20,
      textAlign: 'center',
    },
  
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 10,
      marginBottom: 15,
      padding: 12,
      backgroundColor: '#fff',
    },
    icon: {
      marginRight: 10,
    },
    input: {
      flex: 1,
      color: '#000',
    },
    button: {
      flex: 1,
      borderRadius: 10,
      padding: 15,
      alignItems: 'center',
      marginHorizontal: 10,
      marginBottom:30,
    },
    buttonContainer: {
      flexDirection: 'column',
      justifyContent: "space-between",
      width: '80%',
      height: '20%',
    },
    button1: {
      flex: 1,
      borderRadius: 10,
      padding: 15,
      alignItems: 'center',
      marginBottom:10,
    },
    maleButton: {
      backgroundColor: '#7393B3',
    },
    femaleButton: {
      backgroundColor: '#a8e063',
    },
    line: {
      height: 1,
      width: '80%',
      backgroundColor: '#ccc',
      marginBottom: 20,
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
    errorText: {
      color: '#ff6b6b',
      marginBottom: 10,
      textAlign: 'center',
    },
    goBackText: {
      fontSize: 16,
      color: '#05668d',
      marginTop: 20,
      textDecorationLine: 'underline',
    },
    logo: {
      width: 150,
      height: 150,
      marginBottom: 0,
      marginTop:-40,
      resizeMode: 'contain',
    },
    helpButton: {
      marginRight: 20,
    },
  });

export default CreateFamilyScreen;
