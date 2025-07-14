import React, { useState,useEffect } from 'react';
import { View, Text,TouchableOpacity, TextInput, Button,ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { loginUser, hasFamily, getUserRole, hasHealthProfile, logout } from '../../redux/slices/authSlice';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '@/src/navigation/types';
import { MaterialIcons,Octicons } from '@expo/vector-icons'; // For the eye icon 
import Ionicons from '@expo/vector-icons/Ionicons';
import Animated, { Easing, useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import Ripple from 'react-native-material-ripple';
import { KeyboardAvoidingView, ScrollView, Platform } from 'react-native';

type NavigationProp = NativeStackNavigationProp<HomeStackParamList>;

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Toggle for password visibility
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const navigation = useNavigation<NavigationProp>();


  // Logo animation (scale and fade in)
  const logoScale = useSharedValue(0);
  useEffect(() => {
    logoScale.value = withTiming(1.2, {
      duration: 1500,
      easing: Easing.inOut(Easing.ease),
    });
  }, []);

  const animatedLogoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
  }));


  const handleLogin = async () => {

    if ( !email || !password ) {
      Alert.alert('Error', 'All fields are required!');
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }
    try {
      await dispatch(loginUser({ email, password })).unwrap();
  
      const familyStatus  = (await dispatch(hasFamily()).unwrap());
      console.log("Family status:", familyStatus);
      if (familyStatus) {
        const healthProfileStatus  = (await dispatch(hasHealthProfile()).unwrap());
        console.log("Health profile status:", healthProfileStatus);
        if (healthProfileStatus) {
          const role = await dispatch(getUserRole()).unwrap();
          console.log("User role:", role);
  
          if (role.is_owner || role.is_grocery_generator || role.is_recipe_selector) {
            console.log("Navigating to HomeScreen");
            console.log("Current routes:", navigation.getState()?.routes);
            navigation.navigate('Home');
          } else {
            navigation.navigate('Home');
          }
        } else {
          console.log("Navigating to GenderScreen");
          navigation.navigate('GenderScreen');
        }
      } else {
        console.log("Navigating to FamilySelectionScreen");
        navigation.navigate('FamilySelectionScreen');
      }
    } catch (error: any) {
     // console.error("Error in handleLogin:", error);
      Alert.alert('Error', error.message || 'Login process failed Wrong Credentials');
    }
  };
  
// Set header options to add the Help button with ripple effect
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
        <Ionicons name="help-circle" size={24} color="black" />
      </Ripple>
    ),
  });
}, [navigation]);
  return (
    <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    style={{ flex: 1 }}
  >
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
   
      <View  style={styles.gradientBackground}>

      <View style={styles.innerContainer}>
        <Animated.Image
          source={require('../../../assets/images/u.png')}
          style={[styles.logo, animatedLogoStyle]}
        />
        


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

        
  

        {error && <Text style={styles.errorText2}>{error}</Text>}
  

        <Ripple
          rippleColor="#fff"
          rippleContainerBorderRadius={10}
          rippleDuration={600}
          onPress={handleLogin}
          style={styles.button}
        >
          <LinearGradient colors={['#56ab2f', '#a8e063']} style={styles.gradient}>
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Log In</Text>
            )}
          </LinearGradient>
        </Ripple>
        <Text style={styles.haveAccountText}>Don't have an account?</Text>

  {/* Ripple Button for "Go to Login" */}
  <Ripple
    rippleColor="#fff"
    rippleContainerBorderRadius={10}
    rippleDuration={600}
    style={styles.rippleButton}
    onPress={() => navigation.navigate('Signup')}
  >
    <LinearGradient colors={['#56ab2f', '#a8e063']} style={styles.gradient}>
      <Text style={styles.buttonText}>Sign Up</Text>
    </LinearGradient>
  </Ripple>
      </View>
      </View>
      </ScrollView>
      </KeyboardAvoidingView>
  
  );
};

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
    width: 150,
    height: 150,
    marginBottom: 0,
    marginTop:-70,
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
    color: '#ff6b6b',
    marginBottom: 10,
    textAlign: 'center',
  },
  errorText2: {
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
export default LoginScreen;