import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation.types';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../models';

import LoginScreen from '../screens/auth/LoginScreen';
import RoleSelectionScreen from '../screens/auth/RoleSelectionScreen';
import BHWNavigator from './BHWNavigator';
import CVIFNavigator from './CVIFNavigator';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { user, loading } = useAuth();

  // Show loading screen while checking auth state
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2E7D32" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        // Not authenticated - show login
        <Stack.Screen name="Login" component={LoginScreen} />
      ) : (
        // Authenticated - route based on user role
        <>
          {user.role === UserRole.BHW && (
            <Stack.Screen name="BHWApp" component={BHWNavigator} />
          )}
          {user.role === UserRole.CVIF && (
            <Stack.Screen name="CVIFApp" component={CVIFNavigator} />
          )}
          {user.role === UserRole.PHILOS && (
            <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
          )}
        </>
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
});
