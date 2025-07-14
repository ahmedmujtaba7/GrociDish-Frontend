// src/navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAppSelector } from '../redux/hooks';
import HomeNavigator from './HomeNavigator';

const AppNavigator = () => {
  const { token } = useAppSelector((state) => state.auth); // Pull token from Redux state
  console.log("token: ",token);
  const isAuthenticated = !!token; // Check if the user is authenticated
  console.log("we are in app navigator", isAuthenticated);
  return (
    <NavigationContainer>
      <HomeNavigator />
    </NavigationContainer>
  );
};

export default AppNavigator;
