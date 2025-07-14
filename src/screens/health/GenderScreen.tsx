import React from 'react';
import { Image,View, Text,TouchableOpacity, StyleSheet } from 'react-native';
import { useAppDispatch } from '../../redux/hooks';
import { setGender } from '@/src/redux/slices/healthProfileSlice';
import { useNavigation } from '@react-navigation/native';
import { HomeStackParamList } from '@/src/navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Ionicons from '@expo/vector-icons/Ionicons';

type NavigationProp = NativeStackNavigationProp<HomeStackParamList>;

const GenderScreen = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NavigationProp>();

  
  const handleGenderSelect = (gender: string) => {
    dispatch(setGender(gender));
    navigation.navigate('AgeScreen');
  };

  return (
    <View style={styles.container}>
      {/* Add Logo */}
      <Image source={require('../../../assets/images/u.png')} style={styles.logo} />
  
      {/* Add Title */}
      <Text style={styles.title}>Select Gender</Text>
  
      {/* Add Subtitle */}
      <Text style={styles.subtitle}>
        Your gender helps us determine calorie intake and weight goals.
      </Text>
  
      {/* Add Horizontal Line */}
      <View style={styles.line} />
  
      {/* Gender Buttons */}
      <View style={styles.buttonContainer}>
        
      <TouchableOpacity
  style={[styles.button, styles.maleButton]}
  onPress={() => handleGenderSelect('male')}
>
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <Ionicons name="male" size={20} color="#fff" />
    <Text style={styles.buttonText}> Male</Text>
  </View>
</TouchableOpacity>

<TouchableOpacity
  style={[styles.button, styles.femaleButton]}
  onPress={() => handleGenderSelect('female')}
>
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <Ionicons name="female" size={20} color="#fff" />
    <Text style={styles.buttonText}> Female</Text>
  </View>
</TouchableOpacity>

      </View>
      <View style={styles.buttonContainer2}>
<TouchableOpacity
style={[styles.button1, styles.Button1]}
onPress={() => {navigation.navigate('Login') }} >

<Text style={styles.buttonText}>Logout</Text>
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
      marginTop:-140,
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
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '80%',
    },
    button: {
      flex: 1,
      borderRadius: 10,
      padding: 15,
      alignItems: 'center',
      marginHorizontal: 10,
    },
    buttonContainer2: {
      flexDirection: 'column',
      justifyContent: "space-between",
      width: '50%',
      height: '10%',
      marginBottom:-60,
      marginTop:30,
    },
   
    button1: {
      flex: 1,
      borderRadius: 10,
      padding: 15,
      alignItems: 'center',
      marginBottom:30,
    },
    Button1: {
      backgroundColor: 'red',
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

export default GenderScreen;
