import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { CVIFStackParamList } from '../../types/navigation.types';
import { authService, firestoreService } from '../../services/firebase';
import { BHW, UserRole, SyncStatus } from '../../models';
import { JAGNA_BARANGAYS } from '../../utils/upiGenerator';
import FormInput from '../../components/forms/FormInput';
import FormPicker from '../../components/forms/FormPicker';
import { useAuth } from '../../context/AuthContext';

type Props = NativeStackScreenProps<CVIFStackParamList, 'CreateBHW'>;

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  pin?: string;
  barangay?: string;
  purok?: string;
  phoneNumber?: string;
}

export default function CreateBHWScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const { user: currentUser } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pin, setPin] = useState('');
  const [barangay, setBarangay] = useState('');
  const [purok, setPurok] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const purokOptions = Array.from({ length: 8 }, (_, i) => ({
    label: `Purok ${i + 1}`,
    value: `${i + 1}`,
  }));

  const barangayOptions = JAGNA_BARANGAYS.map((b) => ({
    label: b,
    value: b,
  }));

  /**
   * Validate form
   */
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!pin.trim()) {
      newErrors.pin = '4-digit PIN is required';
    } else if (!/^\d{4}$/.test(pin)) {
      newErrors.pin = 'PIN must be exactly 4 digits';
    }

    if (!barangay) {
      newErrors.barangay = 'Barangay is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      // Create Firebase Auth user
      const userCredential = await authService.createUserWithEmail(email, password);
      const userId = userCredential.user.uid;

      // Create BHW user document
      const bhwUser: BHW = {
        id: userId,
        email,
        role: UserRole.BHW,
        firstName,
        lastName,
        phoneNumber: phoneNumber || undefined,
        isActive: true,
        barangay,
        purok: purok || undefined,
        pin,
        totalPatientsRegistered: 0,
        totalEncountersRecorded: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: currentUser?.id || userId,
        syncStatus: SyncStatus.SYNCED,
      };

      // Save to Firestore
      await firestoreService.saveUser(bhwUser);

      Alert.alert(
        t('common.success'),
        `${t('bhw.creationSuccess')}\n\n${t('auth.loginCredentials')}:\n${t('auth.email')}: ${email}\n${t('bhw.pin')}: ${pin}\n\n${t('bhw.shareCredentials')}`,
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error: any) {
      console.error('❌ Failed to create BHW:', error);
      Alert.alert(
        t('common.error'),
        error.message || t('bhw.creationError')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{t('bhw.createAccount')}</Text>
          <Text style={styles.subtitle}>{t('bhw.registerNew')}</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Note Card */}
          <View style={styles.noteCard}>
            <Text style={styles.noteTitle}>📝 {t('bhw.accountInfo')}</Text>
            <Text style={styles.noteText}>
              {t('bhw.shareInstructions')}
            </Text>
          </View>

          <FormInput
            label={t('patient.firstName') + ' *'}
            value={firstName}
            onChangeText={setFirstName}
            error={errors.firstName}
            placeholder={t('patient.enterFirstName')}
          />

          <FormInput
            label={t('patient.lastName') + ' *'}
            value={lastName}
            onChangeText={setLastName}
            error={errors.lastName}
            placeholder={t('patient.enterLastName')}
          />

          <FormInput
            label={t('auth.email') + ' *'}
            value={email}
            onChangeText={setEmail}
            error={errors.email}
            placeholder="bhw@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <FormInput
            label={t('auth.password') + ' *'}
            value={password}
            onChangeText={setPassword}
            error={errors.password}
            placeholder={t('auth.passwordMinLength')}
            secureTextEntry
          />

          <FormInput
            label={t('bhw.fourDigitPIN') + ' *'}
            value={pin}
            onChangeText={setPin}
            error={errors.pin}
            placeholder="1234"
            keyboardType="number-pad"
            maxLength={4}
          />

          <FormPicker
            label={t('patient.barangay') + ' *'}
            value={barangay}
            onValueChange={setBarangay}
            items={barangayOptions}
            error={errors.barangay}
          />

          <FormPicker
            label={t('patient.purok') + ' ' + t('patient.optional')}
            value={purok}
            onValueChange={setPurok}
            items={purokOptions}
            error={errors.purok}
          />

          <FormInput
            label={t('patient.phoneNumber') + ' ' + t('patient.optional')}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            error={errors.phoneNumber}
            placeholder="09XXXXXXXXX"
            keyboardType="phone-pad"
          />

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, loading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>{t('bhw.createAccount')}</Text>
            )}
          </TouchableOpacity>
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
  },
  header: {
    backgroundColor: '#1565C0',
    padding: 20,
    paddingVertical: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  form: {
    padding: 20,
  },
  noteCard: {
    backgroundColor: '#E3F2FD',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1565C0',
    marginBottom: 10,
  },
  noteText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 22,
  },
  submitButton: {
    backgroundColor: '#1565C0',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
