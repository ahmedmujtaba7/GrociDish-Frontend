import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '@/src/navigation/types';
import React, { useState,useEffect } from 'react';
import { Button,View, Text, TextInput, TouchableOpacity, StyleSheet, TouchableWithoutFeedback,Keyboard, Alert, ActivityIndicator,Animated} from 'react-native';

import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { joinFamily } from '../../redux/slices/familySlice';
import { useNavigation } from '@react-navigation/native';
import Ripple from 'react-native-material-ripple';
import { LinearGradient } from 'expo-linear-gradient';
import { Octicons } from '@expo/vector-icons';

import  { Easing,useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { KeyboardAvoidingView, ScrollView, Platform } from 'react-native';

type NavigationProp = NativeStackNavigationProp<HomeStackParamList>;


const JoinFamilyScreen = () => {
  const [joinCode, setJoinCode] = useState('');
  const { isLoading,error } = useAppSelector((state) => state.family);
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NavigationProp>();
 

  const handleJoinFamily = async () => {
    if (joinCode.trim().length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-character alphanumeric code.');

      return;
    }

    try {
      await dispatch(joinFamily(joinCode)).unwrap();
      Alert.alert('Success', 'Successfully joined the family!');
      navigation.navigate('GenderScreen');
    } catch (err: any) {
      Alert.alert('Error', err || 'Failed to join family.');
    }
  };

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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    style={{ flex: 1 }}
  >
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
  
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        {/* Rotating Icon */}
        <Animated.Image
          source={require('../../../assets/images/u.png')}
          style={[styles.logo, animatedLogoStyle]}
        />

        <Text style={styles.title}>Join Your Family</Text>
        <Text style={styles.subtitle}>
          Add verification code of your Family to Join
        </Text>

        <View style={styles.inputContainer}>
          <Octicons name="key" size={20} color="#05668d" style={styles.icon} />
          <TextInput
            style={styles.input}
        placeholder="Enter 6-Character long family code"
        placeholderTextColor="#999"
        value={joinCode}
        onChangeText={setJoinCode}
        keyboardType="default"
        maxLength={6}
          />
        </View>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <Ripple
          rippleColor="#fff"
          rippleContainerBorderRadius={10}
          rippleDuration={600}
          onPress={handleJoinFamily}
          style={styles.button}
          disabled={isLoading}
        >
          <LinearGradient colors={['#56ab2f', '#a8e063']} style={styles.gradient}>
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>{isLoading ? 'Joining...' : 'Join Family'}</Text>
            )}
          </LinearGradient>
        </Ripple>
        
        <TouchableOpacity onPress={() => navigation.navigate('FamilySelectionScreen')}>
          <Text style={styles.goBackText}>Go back</Text>
        </TouchableOpacity>
      </View>
      </View>
           </ScrollView>
    </KeyboardAvoidingView>
   
    </TouchableWithoutFeedback>
  );//added filzah go back
};

 

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
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  email: {
    color: '#05668d',
    fontWeight: 'bold',
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
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
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
export default JoinFamilyScreen;
