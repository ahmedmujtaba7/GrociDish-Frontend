import React from 'react';
import { Image,View, Text,TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '@/src/navigation/types';
import { useAppDispatch } from '../../redux/hooks';
import { logout } from '../../redux/slices/authSlice';
import { resetFamilyState } from '../../redux/slices/familySlice';

type HomeNavigationProp = NativeStackNavigationProp<HomeStackParamList>;

const FamilySelectionScreen = () => {
  const navigation = useNavigation<HomeNavigationProp>();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
    dispatch(resetFamilyState());
    navigation.navigate('Login');
  };


return (
    
  <View style={styles.container}>
  {/* Add Logo */}
  <Image source={require('../../../assets/images/u.png')} style={styles.logo} />

  {/* Add Title */}
  <Text style={styles.title}>Select One Option</Text>

  

  {/* Add Horizontal Line */}
  <View style={styles.line} />

  {/* Gender Buttons */}
 
  <View style={styles.buttonContainer}>

<TouchableOpacity
style={[styles.button, styles.maleButton]}
onPress={() => navigation.navigate('JoinFamilyScreen')}
>

<Text style={styles.buttonText}>Join Family</Text>
</TouchableOpacity>
  <TouchableOpacity
style={[styles.button, styles.femaleButton]}
onPress={() =>   navigation.navigate('CreateFamilyScreen')}
>

<Text style={styles.buttonText}>Create Family</Text>
</TouchableOpacity>
</View>
<View style={styles.buttonContainer2}>
<TouchableOpacity
style={[styles.button1, styles.Button1]}
onPress={() => {handleLogout() }} >

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
    width: 180,
    height: 180,
    resizeMode: 'contain',
    marginBottom: 20,
    marginTop:-150,
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
    flexDirection: 'column',
    justifyContent: "space-between",
    width: '80%',
    height: '20%',
  },
  buttonContainer2: {
    flexDirection: 'column',
    justifyContent: "space-between",
    width: '50%',
    height: '10%',
    marginBottom:-60,
  },
  button: {
    flex: 1,
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginHorizontal: 10,
    marginBottom:20,
  },
  button1: {
    flex: 1,
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom:30,
  },
  maleButton: {
    backgroundColor: '#56ab2f',
  },
  femaleButton: {
    backgroundColor: '#a8e063',
  },
  Button1: {
    backgroundColor: 'red',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FamilySelectionScreen;
