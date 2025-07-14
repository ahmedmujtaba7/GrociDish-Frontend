import React, { useEffect, useState } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, SafeAreaView, 
  TouchableOpacity, Image, Dimensions 
} from 'react-native';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { getUserRole, Role } from '@/src/redux/slices/authSlice';
import { fetchCalorieStats } from '@/src/redux/slices/calorieSlice';
import Header from '@/src/components/Header';
import Footer from '@/src/components/Footer';
import UserStats2 from '@/src/components/UserStats2';
import { useNavigation } from '@react-navigation/native';
import { HomeStackParamList } from '@/src/navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const screenWidth = Dimensions.get('window').width;
const cardSize = screenWidth / 2 - 25; // Makes 2 cards fit in 1 row with spacing

type HomeNavigationProp = NativeStackNavigationProp<HomeStackParamList>;

const HomeScreen = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<HomeNavigationProp>();

  const [userRole, setUserRole] = useState<Role | null>(null);
  const { calories, isLoading, error } = useAppSelector((state) => state.calorie);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const role = await dispatch(getUserRole()).unwrap();
        setUserRole(role);
      } catch (err) {
        console.error('Error fetching user role:', err);
      }
    };
    fetchRole();
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchCalorieStats()).unwrap();
  }, [dispatch]);

  const handleRecipeNavigation = () => {
    if (userRole?.is_recipe_selector) {
      navigation.navigate('RecommendedRecipesScreen');
    } else {
      navigation.navigate('SelectedMealsScreen');
    }
  };

  const handleGroceryNavigation = () => {
    if (userRole?.is_grocery_generator) {
      navigation.navigate('BudgetInputScreen');
    }
  };

  const renderCard = (text: string, imageSrc: any, onPress: () => void) => (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.cardContent}>
        <Image source={imageSrc} style={styles.cardImage} />
        <Text style={styles.cardText}>{text}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Header />
        <ScrollView contentContainerStyle={styles.content}>
          {isLoading && <Text style={styles.loadingText}>Loading...</Text>}
          {error && <Text style={styles.error}>{error}</Text>}
          {!isLoading && !error && calories && <UserStats2 stats={calories} />}

          <View style={styles.roleButtons}>
            {userRole?.is_grocery_generator && 
              renderCard('Generate Grocery List', require('../../../assets/images/groc.jpg'), handleGroceryNavigation)}
            {userRole?.is_recipe_selector && 
              renderCard('Select Today\'s Meals', require('../../../assets/images/3.jpg'), handleRecipeNavigation)}

            {userRole?.is_owner && (
              <>
                {renderCard('Assign Grocery Generator', require('../../../assets/images/2.jpg'), () => navigation.navigate('AssignGroceryGenerator'))}
                {renderCard('Assign Recipe Selector', require('../../../assets/images/1.jpg'), () => navigation.navigate('AssignRecipeSelector'))}
                {renderCard('Complete Family Profile', require('../../../assets/images/5.png'), () => console.log('View Family'))}
              </>
            )}
          </View>
        </ScrollView>
        <Footer />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  container: {
    flex: 1,
    padding: 0,
  },
  content: {
    paddingBottom: 20,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#888',
    textAlign: 'center',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  roleButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: 10,
  },
  card: {
    width: cardSize,
    height: 100,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 5,
    marginBottom: 15,
    marginLeft: 10, // Reduce horizontal gap
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2, // Outline thickness
    borderColor: '#4CAF50', // Outline color
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 10,
  },
  cardText: {
    flexShrink: 1,
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
