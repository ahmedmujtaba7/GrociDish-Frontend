
import React, { useEffect } from 'react';
import {View,Text,FlatList,StyleSheet,TouchableOpacity,} from 'react-native';
import { useAppDispatch, useAppSelector } from '@/src/redux/hooks';
import { fetchFamilyDetails } from '@/src/redux/slices/familyDetailsSlice';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '@/src/navigation/types';


type NavigationProp = NativeStackNavigationProp<HomeStackParamList>;

const ViewFamilyScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NavigationProp>();

  const { familyDetails, isLoading, error } = useAppSelector(
    (state) => state.familyDetails
  );

  useEffect(() => {
    dispatch(fetchFamilyDetails());
  }, [dispatch]);

  const renderHeader = () => (
    <View>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Family Details</Text>
      </View>
      <Text style={styles.memberCount}>
        Member count: {familyDetails?.member_count}
      </Text>
      <Text
        style={[
          styles.memberCount2,
          familyDetails?.is_complete ? styles.completeStatus : styles.incompleteStatus,
        ]}
      >
        Family Status: {familyDetails?.is_complete ? 'Complete' : 'Incomplete'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {isLoading ? (
        <Text style={styles.loadingText}>Loading family details...</Text>
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlatList
          data={familyDetails?.members}
          keyExtractor={(item) => item.id.toString()}
          ListHeaderComponent={renderHeader}
          renderItem={({ item, index }) => (
            <TouchableOpacity>
            <View style={styles.memberCard}>
              <Text style={styles.memberText}>
                {index + 1}. {item.name}
              </Text>
              <View style={styles.rolesContainer}>
                {item.is_owner && <Text style={[styles.roleBadge, styles.ownerBadge]}>Owner</Text>}
                {item.is_grocery_generator && (
                  <Text style={[styles.roleBadge, styles.groceryBadge]}>
                    Grocery Generator
                  </Text>
                )}
                {item.is_recipe_selector && (
                  <Text style={[styles.roleBadge, styles.recipeBadge]}>
                    Recipe Selector
                  </Text>
                )}
              </View>
            </View>
             </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
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
  headerTitle: {
    marginTop:40,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  memberCount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#555',
    marginLeft:20,
    marginTop:30,
  },
  memberCount2: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#555',
    marginLeft:20,
    marginTop:10,
    marginBottom:20,
  },
  completeStatus: {
    color: '#4CAF50', // Green for complete
    fontWeight: 'bold',
  },
  incompleteStatus: {
    color: '#F44336', // Red for incomplete
    fontWeight: 'bold',
  },
  loadingText: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginTop: 20,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  memberCard: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  memberText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  rolesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  roleBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 5,
    marginTop: 5,
    color: '#fff',
  },
  ownerBadge: {
    backgroundColor: '#FFD700', // Gold
  },
  groceryBadge: {
    backgroundColor: '#4CAF50', // Green
  },
  recipeBadge: {
    backgroundColor: '#2196F3', // Blue
  },
});

export default ViewFamilyScreen;
