import React, { useEffect } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@/src/redux/hooks';
import { getFamilyCode } from '@/src/redux/slices/familySlice';
import { RootState } from '@/src/redux/store';
import * as Clipboard from 'expo-clipboard';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '@/src/navigation/types';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

type NavigationProp = NativeStackNavigationProp<HomeStackParamList>;

const FamilyCodeScreen = () => {
  const dispatch = useAppDispatch();
  const { code, isLoading, error } = useSelector((state: RootState) => state.family);

  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    dispatch(getFamilyCode());
  }, [dispatch]);

  const copyToClipboard = async () => {
    if (code) {
      await Clipboard.setStringAsync(code);
      Alert.alert('Copied!', 'Family code copied to clipboard!');
    }
  };

  return (
    <View style={styles.container}>
     <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Family Code</Text>
      </View>
<View style={styles.container2}>
      {/* Content */}
      {isLoading ? (
        <ActivityIndicator size="large" color="#4CAF50" />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <View style={styles.content}>
           <Image source={require('../../../assets/images/r.png')} style={styles.logo} />
          <Text style={styles.codeLabel}>Your Family Code:</Text>
          <View style={styles.codeContainer}>
            <Text style={styles.code}>{code}</Text>
          </View>
          <TouchableOpacity style={styles.copyButton} onPress={copyToClipboard}>
            <Ionicons name="copy" size={20} color="#fff" style={styles.copyIcon} />
            <Text style={styles.copyButtonText}>Copy Code</Text>
          </TouchableOpacity>
        </View>
      )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  container2: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    padding: 20,
    elevation: 3,
    marginTop:0
  },
  
  logo: {
    width: 300,
    height: 300,
    resizeMode: 'contain', // Ensures the logo scales correctly
    alignSelf: 'center',   // Centers the logo horizontally
    marginBottom: 20,
    marginTop: -300,
  },
  
  backButton: {
    marginRight: 10,
    marginTop:40,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop:40,
    color: '#fff', // Adjust color as needed
  },


  backButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 5,
    fontWeight: 'bold',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  codeLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  codeContainer: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    elevation: 3,
    marginBottom: 20,
  },
  code: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    elevation: 5,
  },
  copyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  copyIcon: {
    marginRight: 5,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default FamilyCodeScreen;
