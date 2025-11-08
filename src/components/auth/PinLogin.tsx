/**
 * PIN Login Component
 * For BHW users
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';

export default function PinLogin() {
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const { signInWithPin } = useAuth();
  const { t } = useTranslation();

  const handleLogin = async () => {
    if (!username.trim()) {
      Alert.alert(t('common.error'), t('auth.enterUsername'));
      return;
    }

    if (!pin.trim() || pin.length !== 4) {
      Alert.alert(t('common.error'), t('auth.pinMustBe4Digits'));
      return;
    }

    setLoading(true);
    try {
      await signInWithPin(username, pin);
      // Navigation will be handled automatically by RootNavigator
    } catch (error: any) {
      Alert.alert(t('auth.loginError'), error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('auth.bhwLogin')}</Text>
      <Text style={styles.subtitle}>{t('auth.forBHWs')}</Text>

      <TextInput
        style={styles.input}
        placeholder={t('auth.usernameEmail')}
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        keyboardType="email-address"
        editable={!loading}
      />

      <TextInput
        style={styles.input}
        placeholder={t('auth.fourDigitPin')}
        value={pin}
        onChangeText={setPin}
        secureTextEntry
        keyboardType="numeric"
        maxLength={4}
        editable={!loading}
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>{t('auth.signIn')}</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.linkButton}>
        <Text style={styles.linkText}>
          Contact your CVIF coordinator if you forgot your PIN
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#2E7D32',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  linkButton: {
    marginTop: 15,
    alignItems: 'center',
  },
  linkText: {
    color: '#2E7D32',
    fontSize: 12,
    textAlign: 'center',
  },
});
