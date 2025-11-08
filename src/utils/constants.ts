/**
 * Constants
 * Application-wide constants
 */

// Barangays in Jagna
export const BARANGAYS = [
  'Alejawan',
  'Balili',
  'Boctol',
  'Buyog',
  'Bunga Ilaya',
  'Bunga Mar',
  'Cabungaan',
  'Calabacita',
  'Cambugason',
  'Can-ipol',
  'Canjulao',
  'Cantagay',
  'Cantuyoc',
  'Can-uba',
  'Can-upao',
  'Faraon',
  'Ipil',
  'Kinagbaan',
  'Laca',
  'Larapan',
  'Lonoy',
  'Looc',
  'Malbog',
  'Mayana',
  'Naatang',
  'Nausok',
  'Odiong',
  'Pagina',
  'Pangdan',
  'Poblacion (Pondol)',
  'Tejero',
  'Tubod Mar',
  'Tubod Monte',
];

// Puroks: Each barangay has a varied number of puroks.
// Strategy: Use a default list for UI, but allow manual entry or dynamic loading per barangay if data is available.
export const DEFAULT_PUROKS = [
  'Purok 1',
  'Purok 2',
  'Purok 3',
  'Purok 4',
  'Purok 5',
  'Purok 6',
  'Purok 7',
  'Purok 8',
];

// Blood Pressure Thresholds (AHA Guidelines)
export const BP_THRESHOLDS = {
  NORMAL: {
    systolic: { max: 120 },
    diastolic: { max: 80 },
  },
  ELEVATED: {
    systolic: { min: 120, max: 129 },
    diastolic: { max: 80 },
  },
  HYPERTENSION_STAGE_1: {
    systolic: { min: 130, max: 139 },
    diastolic: { min: 80, max: 89 },
  },
  HYPERTENSION_STAGE_2: {
    systolic: { min: 140 },
    diastolic: { min: 90 },
  },
  HYPERTENSIVE_CRISIS: {
    systolic: { min: 180 },
    diastolic: { min: 120 },
  },
};

// App Colors
export const COLORS = {
  primary: '#2E7D32', // Green for BHW
  secondary: '#1565C0', // Blue for CVIF
  philos: '#6A1B9A', // Purple for PHILOS
  
  // BP Category Colors
  bpNormal: '#4CAF50',
  bpElevated: '#FF9800',
  bpStage1: '#F57C00',
  bpStage2: '#E65100',
  bpCrisis: '#C62828',
  
  // Status Colors
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',
  
  // Neutral Colors
  text: '#333333',
  textSecondary: '#666666',
  textLight: '#999999',
  background: '#F5F5F5',
  white: '#FFFFFF',
  border: '#E0E0E0',
};

// Validation Rules
export const VALIDATION = {
  PIN_LENGTH: 6,
  MIN_PASSWORD_LENGTH: 8,
  MIN_AGE: 0,
  MAX_AGE: 120,
  MIN_SYSTOLIC: 50,
  MAX_SYSTOLIC: 250,
  MIN_DIASTOLIC: 30,
  MAX_DIASTOLIC: 150,
  MIN_HEART_RATE: 40,
  MAX_HEART_RATE: 200,
  MIN_TEMPERATURE: 35,
  MAX_TEMPERATURE: 42,
  MIN_WEIGHT: 1,
  MAX_WEIGHT: 300,
};

// Storage Keys
export const STORAGE_KEYS = {
  USER: '@jhl_user',
  USER_DATA: '@jhl_user_data',
  AUTH_TOKEN: '@jhl_auth_token',
  PATIENTS: '@jhl_patients',
  ENCOUNTERS: '@jhl_encounters',
  SYNC_QUEUE: '@jhl_sync_queue',
  LAST_SYNC: '@jhl_last_sync',
  LANGUAGE: '@jhl_language',
  OFFLINE_PATIENTS: '@jhl_offline_patients',
  OFFLINE_ENCOUNTERS: '@jhl_offline_encounters',
  PIN: '@jhl_pin',
  CURRENT_USER: '@jhl_current_user',
  BHW_USERS: '@jhl_bhw_users',
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  DISPLAY_WITH_TIME: 'MMM dd, yyyy hh:mm a',
  ISO: "yyyy-MM-dd'T'HH:mm:ss",
  SHORT: 'MM/dd/yyyy',
};
