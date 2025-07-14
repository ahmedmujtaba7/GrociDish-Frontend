import React, { useState,useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, TouchableWithoutFeedback,Keyboard, Alert, ActivityIndicator,Animated} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { verifyCode } from '../../redux/slices/authSlice';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../navigation/types';
import Ripple from 'react-native-material-ripple';
import { LinearGradient } from 'expo-linear-gradient';
import { Octicons } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import  { Easing,useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useDispatch } from 'react-redux';
import { resetError } from '../../redux/slices/authSlice'; // Adjust the path to your slice file
import { KeyboardAvoidingView, ScrollView, Platform } from 'react-native';

type VerifyCodeScreenNavigationProp = NativeStackNavigationProp<HomeStackParamList>;

const VerifyCodeScreen = () => {
  const [code, setCode] = useState('');
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state: any) => state.auth);
  const navigation = useNavigation<VerifyCodeScreenNavigationProp>();
  const route = useRoute();
  const dispatch1 = useDispatch();
 const { email } = route.params as { email: string }; //--add this must


  const handleVerifyCode = async () => {
    if (!code) {
      Alert.alert('Error', 'Please enter the verification code!');
      return;
    }

    const result = await dispatch(verifyCode({ email, code }));

    if (verifyCode.fulfilled.match(result)) {
      Alert.alert('Success', 'Verification successful!', [
        { text: 'OK', onPress: () => navigation.navigate('Login')},
      ]);
    }
    else{
      Alert.alert('Error', 'Verification failed!');
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
            'Please Enter the Verification Code sent on your Email by the GrociDish Team'
          )
        }
        style={styles.helpButton}
      >
        <Ionicons name="help-circle" size={24} color="black" />
      </Ripple>
    ),
  });
}, [navigation]);

useEffect(() => {
  const unsubscribe = navigation.addListener('blur', () => {
    dispatch1(resetError()); // Clear error when leaving the screen
  });

  return unsubscribe;
}, [navigation, dispatch1]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <View style={styles.container}>
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
      <View style={styles.innerContainer}>
        {/* Rotating Icon */}
        <Animated.Image
          source={require('../../../assets/images/r.png')}
          style={[styles.logo, animatedLogoStyle]}
        />

        <Text style={styles.title}>Verify Your Email</Text>
        <Text style={styles.subtitle}>
          A verification code has been sent to <Text style={styles.email}>{email}</Text>
        </Text>

        <View style={styles.inputContainer}>
          <Octicons name="key" size={20} color="#05668d" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Enter Verification Code"
            placeholderTextColor="#999"
            keyboardType="numeric"
            value={code}
            onChangeText={setCode}
            autoFocus
          />
        </View>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <Ripple
          rippleColor="#fff"
          rippleContainerBorderRadius={10}
          rippleDuration={600}
          onPress={handleVerifyCode}
          style={styles.button}
          disabled={isLoading}
        >
          <LinearGradient colors={['#56ab2f', '#a8e063']} style={styles.gradient}>
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Verify</Text>
            )}
          </LinearGradient>
        </Ripple>
      </View>
      </ScrollView>
      </KeyboardAvoidingView>
    </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  innerContainer: {
    flex: 1,
    padding: 40,
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
    color: '#fff',
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
    width: 300,
    height: 250,
    marginBottom: 0,
    marginTop:-300,
    resizeMode: 'contain',
  },
  helpButton: {
    marginRight: 20,
  },
});

export default VerifyCodeScreen;
