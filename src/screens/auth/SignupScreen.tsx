import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Image } from 'react-native';
import { useAppDispatch, useAppSelector } from '@/src/redux/hooks'; // Custom hooks
import { registerUser, resetError } from '../../redux/slices/authSlice';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../navigation/types'; // Add this file to define your navigation types
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, Octicons } from '@expo/vector-icons'; // For the eye icon
import Ionicons from '@expo/vector-icons/Ionicons';
import Ripple from 'react-native-material-ripple';
import Animated, { Easing, useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { KeyboardAvoidingView, ScrollView, Platform } from 'react-native';


type SignupScreenNavigationProp = NativeStackNavigationProp<HomeStackParamList>;

const SignupScreen = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state: any) => state.auth);
  const navigation = useNavigation<SignupScreenNavigationProp>();

  const logoScale = useSharedValue(1);

  useEffect(() => {
    logoScale.value = withTiming(1.2, {
      duration: 3000,
      easing: Easing.inOut(Easing.ease),
    });
  }, []);

  const animatedLogoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
  }));

  const handleSignup = async () => {
    if (!username || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'All fields are required!');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      Alert.alert(
        'Error',
        'Password must be at least 8 characters long, include 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character'
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    const result = await dispatch(registerUser({ username, email, password }));

    if (registerUser.fulfilled.match(result)) {
      Alert.alert('Success', 'User registered successfully!', [
        { text: 'OK', onPress: () => navigation.navigate('VerifyCodeScreen', { email }) },
      ]);
     
    }
    else{
        Alert.alert('Sign Up Failed');
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Ripple
          rippleColor="rgb(0,0,0)"
          rippleOpacity={0.05}
          rippleDuration={300}
          rippleCentered={true}
          rippleFades={false}
          rippleContainerBorderRadius={70}
          onPressIn={() =>
            Alert.alert(
              'What we aim to do:',
              'Our app is designed to help you and your family manage grocery needs, health goals, and recipes tailored for better well-being.'
            )
          }
          style={styles.helpButton}
        >
          <Ionicons name="help-circle" size={24} color="white" />
        </Ripple>
      ),
    });
  }, [navigation]);

return (
  <View style={styles.gradientBackground}>
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View style={styles.innerContainer}>
          <Animated.Image
            source={require('../../../assets/images/u.png')}
            style={[styles.logo, animatedLogoStyle]}
          />
          <Text style={styles.title}>Create an Account</Text>

          <View style={styles.inputContainer}>
            <Octicons name="person" size={20} color="#05668d" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="#000"
              value={username}
              onChangeText={setUsername}
            />
          </View>

          <View style={styles.inputContainer}>
            <Octicons name="mail" size={20} color="#05668d" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#000"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.passwordContainer}>
            <Octicons name="shield-lock" size={20} color="#05668d" style={styles.icon} />
            <TextInput
              style={styles.passwordInput}
              placeholder="Password"
              placeholderTextColor="#000"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              onPressIn={() => setShowPassword(true)}
              onPressOut={() => setShowPassword(false)}
            >
              <MaterialIcons
                name={showPassword ? 'visibility' : 'visibility-off'}
                size={24}
                color="#05668d"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.passwordContainer}>
            <Octicons name="shield-lock" size={20} color="#05668d" style={styles.icon} />
            <TextInput
              style={styles.passwordInput}
              placeholder="Confirm Password"
              placeholderTextColor="#000"
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity
              onPressIn={() => setShowConfirmPassword(true)}
              onPressOut={() => setShowConfirmPassword(false)}
            >
              <MaterialIcons
                name={showConfirmPassword ? 'visibility' : 'visibility-off'}
                size={24}
                color="#05668d"
              />
            </TouchableOpacity>
          </View>

          {error && <Text style={styles.errorText}>{error}</Text>}

          <Ripple
            rippleColor="#fff"
            rippleContainerBorderRadius={10}
            rippleDuration={600}
            onPress={handleSignup}
            style={styles.button}
          >
            <LinearGradient colors={['#56ab2f', '#a8e063']} style={styles.gradient}>
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Sign Up</Text>
              )}
            </LinearGradient>
          </Ripple>

          <Text style={styles.haveAccountText}>Already have an account?</Text>
          <Ripple
            rippleColor="#fff"
            rippleContainerBorderRadius={10}
            rippleDuration={600}
            style={styles.rippleButton}
            onPress={() => navigation.navigate('Login')}
          >
            <LinearGradient colors={['#56ab2f', '#a8e063']} style={styles.gradient}>
              <Text style={styles.buttonText}>Sign In</Text>
            </LinearGradient>
          </Ripple>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  </View>
);
}

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
    backgroundColor: '#fff',
  },
 
    innerContainer: {
      flex: 1,
      padding: 30,
      justifyContent: 'center',
      alignItems: 'center',
    },
    logo: {
      width: 200,
      height: 100,
      marginBottom: 0,
      marginTop:-10,
      resizeMode: 'contain',
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#7393B3',
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
    input: {
      flex: 1,
      color: '#000',
    },
    icon: {
      marginRight: 10,
    },
    passwordContainer: {
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
    passwordInput: {
      flex: 1,
      color: '#000',
    },
    button: {
      width: '100%',
      borderRadius: 10,
      overflow: 'hidden',
    },
    
    errorText: {
      color: '#fff',
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
        marginBottom: 20,
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
      helpButton: {
        marginRight: 20,
      },
    });
export default SignupScreen;
