import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CVIFStackParamList } from '../types/navigation.types';

import CVIFDashboardScreen from '../screens/cvif/CVIFDashboardScreen';
import BHWManagementScreen from '../screens/cvif/BHWManagementScreen';
import CreateBHWScreen from '../screens/cvif/CreateBHWScreen';
import BHWDetailsScreen from '../screens/cvif/BHWDetailsScreen';
import BulkOnboardingScreen from '../screens/cvif/BulkOnboardingScreen';
import SyncStatusScreen from '../screens/cvif/SyncStatusScreen';
import SettingsScreen from '../screens/shared/SettingsScreen';

const Stack = createNativeStackNavigator<CVIFStackParamList>();

export default function CVIFNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1565C0',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="CVIFDashboard" 
        component={CVIFDashboardScreen}
        options={{ title: 'CVIF Dashboard' }}
      />
      <Stack.Screen 
        name="BHWManagement" 
        component={BHWManagementScreen}
        options={{ title: 'BHW Management' }}
      />
      <Stack.Screen 
        name="CreateBHW" 
        component={CreateBHWScreen}
        options={{ title: 'Create BHW' }}
      />
      <Stack.Screen 
        name="BHWDetails" 
        component={BHWDetailsScreen}
        options={{ title: 'BHW Details' }}
      />
      <Stack.Screen 
        name="BulkOnboarding" 
        component={BulkOnboardingScreen}
        options={{ title: 'Bulk Onboarding' }}
      />
      <Stack.Screen 
        name="SyncStatus" 
        component={SyncStatusScreen}
        options={{ title: 'Sync Status' }}
      />
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
    </Stack.Navigator>
  );
}
