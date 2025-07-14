import React from 'react';
import { Image,View, Text,TouchableOpacity, StyleSheet } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { toggleDisease, createHealthProfile } from '@/src/redux/slices/healthProfileSlice';
import { useNavigation } from '@react-navigation/native';
import { HomeStackParamList } from '@/src/navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type NavigationProp = NativeStackNavigationProp<HomeStackParamList>;

const DiseasesScreen = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NavigationProp>();
  const { gender, age, weight, height, activity_level, diseases, isLoading } =
    useAppSelector((state) => state.healthProfile);

  const handleDiseaseToggle = (disease: string) => {
    
    dispatch(toggleDisease(disease));
  };

  const handleSubmit = async () => {
    const profileData = { gender, age, weight, height, activity_level, diseases };
 
    try {
      const result = await dispatch(createHealthProfile(profileData)).unwrap();
      console.log("result is",result);
      navigation.navigate('Home');
    } catch (error) {
      alert(error || 'Failed to submit profile');
    }
  };

return (
    
  <View style={styles.container}>
  {/* Add Logo */}
  <Image source={require('../../../assets/images/u.png')} style={styles.logo} />

  {/* Add Title */}
  <Text style={styles.title}>Select Your Disease</Text>

  {/* Add Subtitle */}
  <Text style={styles.subtitle}>
  Sharing your medical conditions helps us create a personalized nutrition plan better
  </Text>

  {/* Add Horizontal Line */}
  <View style={styles.line} />

  {/* Gender Buttons */}
 
  <View style={styles.buttonContainer}>
  <TouchableOpacity
style={[styles.button, styles.maleButton]}
onPress={() =>handleDiseaseToggle('diabetes')}>

<Text style={styles.buttonText}>Diabetes</Text>
</TouchableOpacity>
<TouchableOpacity
style={[styles.button, styles.femaleButton]}
onPress={() => handleDiseaseToggle('obesity')}
>

<Text style={styles.buttonText}>Obesity</Text>
</TouchableOpacity>
<TouchableOpacity
style={[styles.button, styles.maleButton]}
onPress={() => handleDiseaseToggle('hypertension')}
>

<Text style={styles.buttonText}>Hypertension(high blood pressure)</Text>
</TouchableOpacity>
  <TouchableOpacity
style={[styles.button, styles.femaleButton]}
onPress={() =>  console.log("no disease")}
>

<Text style={styles.buttonText}>None</Text>
</TouchableOpacity>
</View>
<View style={styles.buttonContainer2}>
<TouchableOpacity
style={[styles.button1, styles.Button1]}
onPress={() => {handleSubmit()}} disabled={isLoading}
>

<Text style={styles.buttonText}>Submit Profile</Text>
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
    marginTop:-20,
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
    width: '100%',
    height: '40%',
  },
  buttonContainer2: {
    flexDirection: 'column',
    justifyContent: "space-between",
    width: '100%',
    height: '10%',
    marginBottom:-20,
  },
  button: {
    flex: 1,
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginHorizontal: 10,
    marginBottom:10,
  },
  button1: {
    flex: 1,
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom:20,
  },
  maleButton: {
    backgroundColor: '#56ab2f',
  },
  femaleButton: {
    backgroundColor: '#a8e063',
  },
  Button1: {
    backgroundColor: '#7393B3',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DiseasesScreen;
