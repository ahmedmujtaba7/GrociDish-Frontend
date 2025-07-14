import React, { useState } from 'react';
import {Image,View,Text,TextInput,TouchableOpacity,TouchableWithoutFeedback,Keyboard,StyleSheet,Alert,ActivityIndicator,} from 'react-native';
import { useAppDispatch, useAppSelector } from '@/src/redux/hooks';
import { updatePassword } from '@/src/redux/slices/authSlice';
import { RootState } from '@/src/redux/store';
import { useNavigation } from '@react-navigation/native';
import { HomeStackParamList } from '@/src/navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import Ripple from 'react-native-material-ripple';
import { KeyboardAvoidingView, ScrollView, Platform } from 'react-native';

type NavigationProp = NativeStackNavigationProp<HomeStackParamList>;

const UpdatePasswordScreen = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state: RootState) => state.auth);
  const navigation = useNavigation<NavigationProp>();

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handleSave = async () => {
    if (!passwordRegex.test(newPassword)) {
      Alert.alert(
        'Error',
        'Password must be at least 8 characters long, include 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character'
      );
      return;
    }//added filzah

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New password and confirm password do not match');
      return;
    }

    try {
      const resultAction = await dispatch(updatePassword({ oldPassword, newPassword }));
      if (updatePassword.fulfilled.match(resultAction)) {
        Alert.alert('Success', 'Password updated successfully');
        navigation.navigate('Home');
      } else {
        Alert.alert('Error', resultAction.payload as string);
      }
    } catch (err) {
      Alert.alert('Error', 'Something went wrong');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
         <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    style={{ flex: 1 }}
  >
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
    <View style={styles.gradientBackground}>
       {/* Add Logo */}
       
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Ionicons name="arrow-back" size={24} color="#fff" style={styles.backButton} />
        </TouchableOpacity>
        
        <Text style={styles.headerText}>Update Password</Text>
      </View>
      <Image source={require('../../../assets/images/r.png')} style={styles.logo} />
      <View style={styles.innerContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Old Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.input}
              secureTextEntry={!showOldPassword}
              value={oldPassword}
              onChangeText={setOldPassword}
              placeholder="Enter old password"
              placeholderTextColor="#000"
            />
            <TouchableOpacity
              onPressIn={() => setShowOldPassword(true)}
              onPressOut={() => setShowOldPassword(false)}
            >
              <MaterialIcons
                name={showOldPassword ? 'visibility' : 'visibility-off'}
                size={24}
                color="#05668d"
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>New Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.input}
              secureTextEntry={!showNewPassword}
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Enter new password"
              placeholderTextColor="#000"
            />
            <TouchableOpacity
              onPressIn={() => setShowNewPassword(true)}
              onPressOut={() => setShowNewPassword(false)}
            >
              <MaterialIcons
                name={showNewPassword ? 'visibility' : 'visibility-off'}
                size={24}
                color="#05668d"
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Confirm New Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.input}
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm new password"
              placeholderTextColor="#000"
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
        </View>

        {isLoading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <Ripple style={styles.button} onPress={handleSave}>
            <LinearGradient colors={['#56ab2f', '#a8e063']} style={styles.gradient}>
              <Text style={styles.buttonText}>Save</Text>
            </LinearGradient>
          </Ripple>
        )}

        {error && <Text style={styles.error}>{error}</Text>}
      </View>
    </View>
    </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
    backgroundColor: '#fff',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    padding: 20,
    elevation: 3,
    marginTop:0
  },
  backButton: {
    marginRight: 10,
    marginTop:40,
  },
  headerText: {
    marginTop:40,
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 16,
    color:"#fff",
  },
  logo: {
    width: 300,
    height: 300,
    resizeMode: 'contain', // Ensures the logo scales correctly
    alignSelf: 'center',   // Centers the logo horizontally
    marginBottom: 20,
    marginTop: -50,
  },
  
  innerContainer: {
    flex: 1,
    padding: 20,
    marginTop:-100,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  inputContainer: {
    marginBottom: 16,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    color: '#000',
  },
  button: {
    width: '100%',
    marginTop: 20,
    borderRadius: 8,
    overflow: 'hidden',
  },
  gradient: {
    padding: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
});

export default UpdatePasswordScreen;
