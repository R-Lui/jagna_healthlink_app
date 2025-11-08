/**
 * Navigation Type Definitions
 * Defines all navigation routes and their parameters
 */

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';

// Root Stack (Authentication)
export type RootStackParamList = {
  Login: undefined;
  RoleSelection: undefined;
  BHWHome: undefined;
  CVIFHome: undefined;
};

// BHW Stack
export type BHWStackParamList = {
  BHWDashboard: undefined;
  PatientList: undefined;
  PatientProfile: { patientId: string };
  PatientRegistration: undefined;
  EncounterRecording: { patientId: string };
  Settings: undefined;
};

// CVIF Stack
export type CVIFStackParamList = {
  CVIFDashboard: undefined;
  BHWManagement: undefined;
  CreateBHW: undefined;
  BHWDetails: { bhwId: string };
  BulkOnboarding: undefined;
  SyncStatus: undefined;
  Settings: undefined;
};

// Navigation prop types for screens
export type RootStackNavigationProp<T extends keyof RootStackParamList> = 
  NativeStackNavigationProp<RootStackParamList, T>;

export type BHWStackNavigationProp<T extends keyof BHWStackParamList> = 
  NativeStackNavigationProp<BHWStackParamList, T>;

export type CVIFStackNavigationProp<T extends keyof CVIFStackParamList> = 
  NativeStackNavigationProp<CVIFStackParamList, T>;

// Route prop types for screens
export type BHWStackRouteProp<T extends keyof BHWStackParamList> = 
  RouteProp<BHWStackParamList, T>;

export type CVIFStackRouteProp<T extends keyof CVIFStackParamList> = 
  RouteProp<CVIFStackParamList, T>;
