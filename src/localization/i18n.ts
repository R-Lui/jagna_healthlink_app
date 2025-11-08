/**
 * i18next Configuration
 * Setup internationalization with Visayan and English
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ceb from './translations/ceb.json';
import en from './translations/en.json';

const LANGUAGE_KEY = '@jagna_health/language';

// Available languages
export const languages = {
  ceb: { name: 'Binisaya', nativeName: 'Binisaya' },
  en: { name: 'English', nativeName: 'English' },
};

/**
 * Get stored language preference
 */
const getStoredLanguage = async (): Promise<string> => {
  try {
    const stored = await AsyncStorage.getItem(LANGUAGE_KEY);
    return stored || 'ceb'; // Default to Visayan
  } catch (error) {
    console.error('Failed to get stored language:', error);
    return 'ceb';
  }
};

/**
 * Store language preference
 */
export const setStoredLanguage = async (language: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(LANGUAGE_KEY, language);
  } catch (error) {
    console.error('Failed to store language:', error);
  }
};

/**
 * Initialize i18next
 */
export const initializeI18n = async (): Promise<void> => {
  const storedLanguage = await getStoredLanguage();

  await i18n
    .use(initReactI18next)
    .init({
      resources: {
        ceb: { translation: ceb },
        en: { translation: en },
      },
      lng: storedLanguage,
      fallbackLng: 'ceb',
      interpolation: {
        escapeValue: false, // React already escapes
      },
      compatibilityJSON: 'v4', // Important for React Native
    });

  console.log(`✅ i18n initialized with language: ${storedLanguage}`);
};

export default i18n;
