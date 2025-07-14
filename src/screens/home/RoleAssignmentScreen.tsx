import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '@/src/redux/hooks';
import { fetchFamilyMembers, assignRole } from '@/src/redux/slices/roleSlice';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '@/src/navigation/types';
import { Ionicons } from '@expo/vector-icons';

type RoleAssignmentProps = {
  role: 'grocery_generator' | 'recipe_selector'; // Determines the role being assigned
};

type HomeNavigationProp = NativeStackNavigationProp<HomeStackParamList>;

const RoleAssignmentScreen: React.FC<RoleAssignmentProps> = ({ role }) => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<HomeNavigationProp>();

  const { familyMembers, isLoading, error } = useAppSelector((state) => state.roles);

  const [selectedMemberName, setSelectedMemberName] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchFamilyMembers());
  }, [dispatch]);

  const handleAssignRole = async () => {
    if (!selectedMemberName) {
      Alert.alert('Error', 'Please select a family member.');
      return;
    }

    try {
      await dispatch(assignRole({ name: selectedMemberName, role })).unwrap();
      Alert.alert('Success', 'Role assigned successfully!');
      navigation.navigate('Home');
    } catch (err: any) {
      Alert.alert('Error', err || 'Failed to assign role');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          Assign {role === 'grocery_generator' ? 'Grocery Generator' : 'Recipe Selector'}
        </Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#4CAF50" />
        ) : error ? (
          <Text style={styles.error}>{error}</Text>
        ) : (
          <FlatList
            data={familyMembers}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.memberItem,
                  selectedMemberName === item.name && styles.selectedMemberItem,
                ]}
                onPress={() => setSelectedMemberName(item.name)}
              >
                <View style={styles.memberDetails}>
                  <Ionicons
                    name={selectedMemberName === item.name ? 'checkmark-circle' : 'person-circle'}
                    size={24}
                    color={selectedMemberName === item.name ? '#4CAF50' : '#888'}
                    style={styles.memberIcon}
                  />
                  <Text
                    style={[
                      styles.memberText,
                      selectedMemberName === item.name && styles.selectedMemberText,
                    ]}
                  >
                    {item.name}
                  </Text>
                </View>
                {selectedMemberName === item.name && (
                  <Text style={styles.roleText}>
                    {role === 'grocery_generator' ? 'Grocery Generator' : 'Recipe Selector'}
                  </Text>
                )}
              </TouchableOpacity>
            )}
          />
        )}
        <TouchableOpacity style={styles.saveButton} onPress={handleAssignRole}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
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
  content: {
    flex: 1,
    padding: 20,
  },
  error: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginVertical: 10,
  },
  memberItem: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  memberDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberIcon: {
    marginRight: 10,
  },
  selectedMemberItem: {
    backgroundColor: '#E8F5E9',
    borderColor: '#4CAF50',
    borderWidth: 1,
  },
  memberText: {
    fontSize: 16,
    color: '#333',
  },
  selectedMemberText: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  roleText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default RoleAssignmentScreen;
