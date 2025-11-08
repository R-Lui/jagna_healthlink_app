/**
 * Language Switcher Component
 * Toggle between Visayan and English
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { setStoredLanguage } from '../../localization/i18n';

export default function LanguageSwitcher() {
  const { t, i18n } = useTranslation();

  const changeLanguage = async (lang: string) => {
    try {
      await i18n.changeLanguage(lang);
      await setStoredLanguage(lang);
      Alert.alert(t('common.success'), t('settings.languageChanged'));
    } catch (error) {
      console.error('Failed to change language:', error);
      Alert.alert(t('common.error'), 'Failed to change language');
    }
  };

  const currentLang = i18n.language;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{t('settings.selectLanguage')}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.languageButton,
            currentLang === 'ceb' && styles.languageButtonActive,
          ]}
          onPress={() => changeLanguage('ceb')}
        >
          <Text
            style={[
              styles.languageText,
              currentLang === 'ceb' && styles.languageTextActive,
            ]}
          >
            Binisaya
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.languageButton,
            currentLang === 'en' && styles.languageButtonActive,
          ]}
          onPress={() => changeLanguage('en')}
        >
          <Text
            style={[
              styles.languageText,
              currentLang === 'en' && styles.languageTextActive,
            ]}
          >
            English
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  languageButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    alignItems: 'center',
  },
  languageButtonActive: {
    borderColor: '#2E7D32',
    backgroundColor: '#E8F5E9',
  },
  languageText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  languageTextActive: {
    color: '#2E7D32',
  },
});
