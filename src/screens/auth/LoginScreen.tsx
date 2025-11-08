import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { RootStackParamList } from '../../types/navigation.types';
import EmailPasswordLogin from '../../components/auth/EmailPasswordLogin';
import PinLogin from '../../components/auth/PinLogin';
import StorageTestButton from '../../components/common/StorageTestButton';
import FirebaseTestButton from '../../components/common/FirebaseTestButton';
import SetupTestUserButton from '../../components/common/SetupTestUserButton';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

type LoginMode = 'email' | 'pin' | 'test';

export default function LoginScreen({ navigation }: Props) {
  const [mode, setMode] = useState<LoginMode>('email');
  const { t } = useTranslation();

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Jagna HealthLink</Text>
          <Text style={styles.tagline}>{t('auth.communityHealthSystem')}</Text>
        </View>

        {/* Mode Selector */}
        <View style={styles.modeSelector}>
          <TouchableOpacity
            style={[
              styles.modeButton,
              mode === 'email' && styles.modeButtonActive,
            ]}
            onPress={() => setMode('email')}
          >
            <Text
              style={[
                styles.modeButtonText,
                mode === 'email' && styles.modeButtonTextActive,
              ]}
            >
              {t('auth.emailPasswordLogin')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.modeButton,
              mode === 'pin' && styles.modeButtonActive,
            ]}
            onPress={() => setMode('pin')}
          >
            <Text
              style={[
                styles.modeButtonText,
                mode === 'pin' && styles.modeButtonTextActive,
              ]}
            >
              {t('auth.bhwPin')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.modeButton,
              mode === 'test' && styles.modeButtonActive,
            ]}
            onPress={() => setMode('test')}
          >
            <Text
              style={[
                styles.modeButtonText,
                mode === 'test' && styles.modeButtonTextActive,
              ]}
            >
              Dev Tools
            </Text>
          </TouchableOpacity>
        </View>

        {/* Login Form Container */}
        <View style={styles.formContainer}>
          {mode === 'email' && <EmailPasswordLogin />}
          {mode === 'pin' && <PinLogin />}
          {mode === 'test' && (
            <View style={styles.testContainer}>
              <Text style={styles.testTitle}>Development Tools</Text>
              <SetupTestUserButton />
              <StorageTestButton />
              <FirebaseTestButton />
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 5,
  },
  tagline: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  modeSelector: {
    flexDirection: 'row',
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    padding: 4,
    marginBottom: 20,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  modeButtonActive: {
    backgroundColor: '#2E7D32',
  },
  modeButtonText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
      textAlign: 'center',
  },
  modeButtonTextActive: {
    color: '#fff',
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 20,
  },
  testContainer: {
    padding: 20,
  },
  testTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
});
