import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BHWStackParamList } from '../types/navigation.types';

import BHWDashboardScreen from '../screens/bhw/BHWDashboardScreen';
import PatientListScreen from '../screens/bhw/PatientListScreen';
import PatientProfileScreen from '../screens/bhw/PatientProfileScreen';
import PatientRegistrationScreen from '../screens/bhw/PatientRegistrationScreen';
import EncounterRecordingScreen from '../screens/bhw/EncounterRecordingScreen';
import SettingsScreen from '../screens/shared/SettingsScreen';

const Stack = createNativeStackNavigator<BHWStackParamList>();

export default function BHWNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#2E7D32',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="BHWDashboard" 
        component={BHWDashboardScreen}
        options={{ title: 'BHW Dashboard' }}
      />
      <Stack.Screen 
        name="PatientList" 
        component={PatientListScreen}
        options={{ title: 'Patient List' }}
      />
      <Stack.Screen 
        name="PatientProfile" 
        component={PatientProfileScreen}
        options={{ title: 'Patient Profile' }}
      />
      <Stack.Screen 
        name="PatientRegistration" 
        component={PatientRegistrationScreen}
        options={{ title: 'Register Patient' }}
      />
      <Stack.Screen 
        name="EncounterRecording" 
        component={EncounterRecordingScreen}
        options={{ title: 'Record Encounter' }}
      />
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
    </Stack.Navigator>
  );
}
