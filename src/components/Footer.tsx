import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { HomeStackParamList } from '@/src/navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type HomeNavigationProp = NativeStackNavigationProp<HomeStackParamList>;

const Footer = () => {
  const navigation = useNavigation<HomeNavigationProp>();

  return ( // Add return statement here
    <View style={styles.footer}>
        <TouchableOpacity onPress={() =>  { navigation.navigate('ViewFamilyScreen') }}>
          <Image source={require('../../assets/images/icon1.png')} style={styles.navIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { navigation.navigate('RecipeListScreen') }}>
          <Image source={require('../../assets/images/rec.png')} style={styles.navIcon2} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { navigation.navigate('SelectedMealsScreen') }}>
          <Image source={require('../../assets/images/icon2.png')} style={styles.navIcon2} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { navigation.navigate('ViewGroceryScreen') }}>
          <Image source={require('../../assets/images/icon3.png')} style={styles.navIcon} />
        </TouchableOpacity>
      
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#4CAF50',
    height:90,
    marginBottom:-50,
  },
  navIcon: {
    width: 40,
    height: 35,
    resizeMode: 'contain',
  },
  navIcon2: {
    width: 60,
    height: 40,
    resizeMode: 'contain',
  },
});

export default Footer;
