import React, { useState } from 'react';
import {View,Text,StyleSheet,TextInput,TouchableOpacity,ScrollView,Alert,} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { updateHealthProfile } from '@/src/redux/slices/healthProfileSlice';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '@/src/navigation/types';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useAppDispatch } from '@/src/redux/hooks';

type NavigationProp = NativeStackNavigationProp<HomeStackParamList>;

const UpdateHealthProfileScreen = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NavigationProp>();

  const [formData, setFormData] = useState<{
    gender: string;
    age: string;
    height: string;
    weight: string;
    activity_level: string;
    diseases: string;
  }>({
    gender: '',
    age: '',
    height: '',
    weight: '',
    activity_level: '',
    diseases: '',
  });

  const [heightMode, setHeightMode] = useState<'cm' | 'feet'>('cm'); // Toggle for height input mode
  const [feet, setFeet] = useState('');
  const [inches, setInches] = useState('');

  const convertToCm = (feet: number, inches: number) =>
    feet * 30.48 + inches * 2.54;

  const handleSave = async () => {
    const numericAge = parseInt(formData.age, 10);
    if ( numericAge <= 8) {
      Alert.alert('Error', 'Please enter a valid age greater than 8.');
      return;
    }

    let numericHeight = parseFloat(formData.height);
    if (heightMode === 'feet') {
      const numericFeet = parseInt(feet, 10);
      const numericInches = parseInt(inches, 10);
      if (isNaN(numericFeet) || isNaN(numericInches)) {
        Alert.alert('Error', 'Please enter valid feet and inches.');
        return;
      }
      numericHeight = convertToCm(numericFeet, numericInches);
    }

    if ( numericHeight < 120 || numericHeight > 200) {
      Alert.alert('Error', 'Please enter a valid height in the range of 120-200 cm.');
      return;
    }

    const numericWeight = parseFloat(formData.weight);
    if ( numericWeight < 19 || numericWeight > 150) {
      Alert.alert('Error', 'Please enter a valid weight in the range of 19-150 kg.');
      return;
    }

  

    // Filter out empty or unchanged fields
const updatedData = Object.entries(formData)
.filter(([key, value]) => value !== '' && value !== null)
.reduce<Record<string, any>>((acc, [key, value]) => {
  acc[key] = isNaN(Number(value)) ? value : Number(value); // Convert numeric fields
  return acc;
}, {});

if (Object.keys(updatedData).length === 0) {
Alert.alert('No Changes', 'Please update at least one field.');
return;
}

    try {
      console.log(updatedData);
      await dispatch(updateHealthProfile(updatedData)).unwrap();
      Alert.alert('Success', 'Profile updated successfully!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', String(error));
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
<View style={styles.header}>
  <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.backButton}>
    <Ionicons name="arrow-back" size={24} color="#fff" />
  </TouchableOpacity>
  <Text style={styles.headerTitle}>Update Health Profile</Text>
</View> 

      <TextInput
        style={styles.input}
        placeholder="Age"
        keyboardType="numeric"
        placeholderTextColor={'#000'}
        value={formData.age}
        onChangeText={(value) => setFormData({ ...formData, age: value })}
      />
      <View style={styles.heightToggleContainer}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            heightMode === 'cm' ? styles.activeToggle : null,
          ]}
          onPress={() => setHeightMode('cm')}
        >
          <Text style={styles.toggleText}>Centimeters</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            heightMode === 'feet' ? styles.activeToggle : null,
          ]}
          onPress={() => setHeightMode('feet')}
        >
          <Text style={styles.toggleText}>Feet/Inches</Text>
        </TouchableOpacity>
      </View>
      {heightMode === 'cm' ? (
        <TextInput
          style={styles.input}
          placeholder="Height (cm)"
          keyboardType="numeric"
          placeholderTextColor={'#000'}
          value={formData.height}
          onChangeText={(value) => setFormData({ ...formData, height: value })}
        />
      ) : (
        <View style={styles.heightInputContainer}>
          <TextInput
            style={[styles.input, styles.heightInput]}
            placeholder="Feet"
            keyboardType="numeric"
            value={feet}
            placeholderTextColor={'#000'}
            onChangeText={setFeet}
          />
          <TextInput
            style={[styles.input, styles.heightInput]}
            placeholder="Inches"
            keyboardType="numeric"
            value={inches}
            placeholderTextColor={'#000'}
            onChangeText={setInches}
          />
        </View>
      )}
      <TextInput
        style={styles.input}
        placeholder="Weight (kg)"
        placeholderTextColor={'#000'}
        keyboardType="numeric"
        value={formData.weight}
        onChangeText={(value) => setFormData({ ...formData, weight: value })}
      />
      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Activity Level</Text>
        <Picker
          selectedValue={formData.activity_level}
          onValueChange={(value: string) =>
            setFormData({ ...formData, activity_level: value })
          }
          itemStyle={{ color: 'black', fontSize: 16 }} // Apply black color to items
        >
          <Picker.Item label="Sedentary (Little to no exercise )" value="sedentary" />
          <Picker.Item label="Lightly Active(exercise 1-3 days per week)" value="light" />
          <Picker.Item label="Moderately Active(exercise 3-5 days per week)" value="moderate" />
          <Picker.Item label="Very Active(exercise 6-7 days per week)" value="active" />
        </Picker>
      </View>
      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Diseases</Text>
        <Picker
          selectedValue={formData.diseases}
          onValueChange={(value: string) =>
            setFormData({ ...formData, diseases: value })
          }
          itemStyle={{ color: 'black', fontSize: 16 }} // Apply black color to items
        >
          <Picker.Item label="Diabetes" value="diabetes" />
          <Picker.Item label="Hypertension" value="hypertension" />
          <Picker.Item label="Obesity" value="obesity" />
          <Picker.Item label="None" value="" />
        </Picker>
      </View>
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
      
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    padding: 20,
    elevation: 3,
    marginTop:0,
    marginBottom:30,
  },
  backButton: {
    marginRight: 10,
    marginTop:40,
  },
  headerTitle: {
    fontSize: 20,
    marginTop:40,
    fontWeight: 'bold',
    color: '#fff', // Adjust color as needed
  },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
  },
  heightToggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  toggleButton: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
    backgroundColor: '#f9f9f9',
  },
  activeToggle: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  toggleText: {
    color: '#333',
  },
  heightInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  heightInput: {
    width: '48%',
  },
  pickerContainer: { marginBottom: 0 },
  label: { fontSize: 16,fontWeight:'bold', marginBottom: -50, 
    color: '#555', backgroundColor: '#4CAF50',marginVertical: 1,marginHorizontal:1,
    padding: 5,borderRadius: 10, },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
    width:90,
    marginLeft:150,
  },
  cancelButton: { backgroundColor: '#f44336' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

export default UpdateHealthProfileScreen;
