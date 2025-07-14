import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { HomeStackParamList } from '@/src/navigation/types';

type SplashScreenNavigationProp = NativeStackNavigationProp<HomeStackParamList>;

const SplashScreen: React.FC = () => {
  const navigation = useNavigation<SplashScreenNavigationProp>();
  const scaleAnim = useRef(new Animated.Value(1)).current; // Logo scaling animation

  useEffect(() => {
    // Logo scaling animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.4,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 10000,
          useNativeDriver: true,
        }),
      ])
    ).start();
    

    // Navigate to the next screen after 10 seconds
    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* Gradient Frame */}
      <LinearGradient
        colors={['#56ab2f', '#a8e063']}
        style={styles.frame}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.innerContainer}>
          {/* Logo with Scaling Animation */}
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <Image
              source={require('../../../assets/images/r.png')}
              style={styles.logo}
            />
          </Animated.View>
          <View style={styles.line} />
          {/* Tagline */}
          <Text style={styles.tagline}>
            GrociDish: Personalized Grocery and Meal Planning App with Nutritional Management
          </Text>

          {/* Footer */}
          <View style={styles.footer}>
            <View style={styles.line}></View>
            <Text style={styles.footerText}>
              By using this app, you accept our{' '}
              <Text style={styles.linkText}>Terms and Conditions</Text>.
            </Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  frame: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20, // Curved borders
    padding: 15, // Space between frame and content
  },
  innerContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: '#fff', // Background inside the gradient frame
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
  },
  logo: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
    marginBottom: 0,
    marginTop: -180,
  },
  tagline: {
    fontSize: 16,
    fontWeight: 'bold',
    fontStyle: 'italic',
    textAlign: 'center',
    color: '#7393B3',
    marginHorizontal: 20,
    marginBottom: 0,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    width: '80%',
    alignItems: 'center',
  },
  line: {
    width: '80%',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 10,
  },
  footerText: {
    fontSize: 12,
    color: '#555',
    textAlign: 'center',
  },
  linkText: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});

export default SplashScreen;
