import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppDispatch } from '../redux/hooks';
import { logout } from '@/src/redux/slices/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HomeStackParamList } from '@/src/navigation/types';
import { Ionicons } from '@expo/vector-icons';

type HomeNavigationProp = NativeStackNavigationProp<HomeStackParamList>;

const Header = () => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const navigation = useNavigation<HomeNavigationProp>();
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      dispatch(logout());
      navigation.replace('Login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const handleNavigation = (screen: keyof HomeStackParamList) => {
    setIsMenuVisible(false);
    navigation.navigate(screen as any);
  };

  return (
    <SafeAreaView>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/images/r.png')} // Replace with your logo file path
            style={styles.logoImage}
          />
          <Text style={styles.logoText}>GrociDish</Text>
        </View>
        <TouchableOpacity onPress={() => setIsMenuVisible(true)} style={styles.logoText}>
          <Ionicons name="menu" size={28} color="white"/>
        </TouchableOpacity>
      </View>

      <Modal
        visible={isMenuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsMenuVisible(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setIsMenuVisible(false)}
        >
          <View style={styles.menu}>
            <View style={styles.menuHeader}>
              <Image
                source={require('../../assets/images/r.png')} // Replace with your logo file path
                style={styles.menuLogoImage}
              />
              <Text style={styles.menuLogoText}>GrociDish</Text>
            </View>
           
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavigation('UpdatePasswordScreen')}
            >
              <Ionicons name="lock-closed-outline" size={20} color="#4CAF50" />
              <Text style={styles.menuText}>Update Password</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavigation('FamilyCodeScreen')}
            >
              <Ionicons name="people-outline" size={20} color="#4CAF50" />
              <Text style={styles.menuText}>Family Code</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavigation('ViewHealthProfileScreen')}
            >
              <Ionicons name="fitness-outline" size={20} color="#4CAF50" />
              <Text style={styles.menuText}>View Health Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavigation('UpdateHealthProfileForm')}
            >
              <Ionicons name="create-outline" size={20} color="#4CAF50" />
              <Text style={styles.menuText}>Update Health Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavigation('TrackCalories')}
            >
              <Ionicons name="analytics-outline" size={20} color="#4CAF50" />
              <Text style={styles.menuText}>Track Calories</Text>
            </TouchableOpacity>


            <TouchableOpacity
              style={[styles.menuItem, styles.logoutButton]}
              onPress={handleLogout}
            >
              <Ionicons name="log-out-outline" size={20} color="white" />
              <Text style={[styles.menuText, styles.logoutText]}>Logout</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    elevation: 3,
    marginTop:-60,
    padding:25,
    
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',

  },
  logoImage: {
    width: 40,
    height: 40,
    marginRight: 10,
    marginTop:20,
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginTop:30,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  menu: {
    width: '60%',
    height:"79%",
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginTop: 100,
    marginRight: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 10,
    marginBottom: 10,
  },
  menuLogoImage: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  menuLogoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  menuText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#4CAF50',
  },
  logoutButton: {
    backgroundColor: '#f44336',
    borderRadius: 10,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop:70,
  },
  logoutText: {
    color: 'white',
  },
});

export default Header;
