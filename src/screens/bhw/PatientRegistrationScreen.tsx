import React, { useState, useEffect } from 'react';
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
import { BHWStackParamList } from '../../types/navigation.types';
import { useAuth } from '../../context/AuthContext';
import { usePatientStorage } from '../../hooks/useStorage';
import { Patient, Sex, SyncStatus, isBHW } from '../../models';
import { generateCompositeUPI, JAGNA_BARANGAYS } from '../../utils/upiGenerator';
import { calculateAge } from '../../utils/patient.utils';
import FormInput from '../../components/forms/FormInput';
import FormPicker from '../../components/forms/FormPicker';
import FormDatePicker from '../../components/forms/FormDatePicker';

type Props = NativeStackScreenProps<BHWStackParamList, 'PatientRegistration'>;

interface FormErrors {
  firstName?: string;
  lastName?: string;
  birthdate?: string;
  sex?: string;
  barangay?: string;
  purok?: string;
  contactNumber?: string;
}

export default function PatientRegistrationScreen({ navigation }: Props) {
  const { user } = useAuth();
  const patientStorage = usePatientStorage();
  const { t } = useTranslation();

  // Form state
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [sex, setSex] = useState<Sex | ''>('');
  const [barangay, setBarangay] = useState(user && isBHW(user) ? user.barangay : '');
  const [purok, setPurok] = useState(user && isBHW(user) ? user.purok || '' : '');
  const [customPurok, setCustomPurok] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [notes, setNotes] = useState('');

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  // Purok options
  const purokOptions = [
    { label: 'Purok 1', value: '1' },
    { label: 'Purok 2', value: '2' },
    { label: 'Purok 3', value: '3' },
    { label: 'Purok 4', value: '4' },
    { label: 'Purok 5', value: '5' },
    { label: 'Purok 6', value: '6' },
    { label: 'Purok 7', value: '7' },
    { label: 'Purok 8', value: '8' },
  ];

  // Set default custom purok if not selected
  useEffect(() => {
    if (!purok) {
      // Find last purok number
      const lastNum = purokOptions.length > 0 ? parseInt(purokOptions[purokOptions.length - 1].value) : 8;
      setCustomPurok(`Purok ${lastNum + 1}`);
    }
  }, [purok]);

  // Barangay options
  const barangayOptions = JAGNA_BARANGAYS.map((b) => ({
    label: b,
    value: b,
  }));

  // Sex options
  const sexOptions = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
  ];

  /**
   * Validate form fields
   */
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Required fields
    if (!firstName.trim()) {
      newErrors.firstName = t('patient.firstNameRequired');
    }
    if (!lastName.trim()) {
      newErrors.lastName = t('patient.lastNameRequired');
    }
    if (!sex) {
      newErrors.sex = t('patient.sexRequired');
    }
    if (!barangay) {
      newErrors.barangay = t('patient.barangayRequired');
    }
    if (!purok && !customPurok.trim()) {
      newErrors.purok = t('patient.purokRequired');
    }

    // Validate birthdate (must be in the past)
    if (dateOfBirth >= new Date()) {
      newErrors.birthdate = t('patient.birthdatePast');
    }

    // Validate contact number (Philippine mobile format)
    if (phoneNumber.trim()) {
      const phoneRegex = /^09\d{9}$/;
      if (!phoneRegex.test(phoneNumber.replace(/\s/g, ''))) {
        newErrors.contactNumber = t('patient.invalidPhone');
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   */
    const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert(t('patient.validationError'), t('patient.fixErrors'));
      return;
    }

    setLoading(true);

    try {
      // Generate UPI
      const upi = generateCompositeUPI(lastName, firstName, dateOfBirth);
      console.log('✅ Generated UPI:', upi);

      // Check for duplicate UPI
      const existingPatient = await patientStorage.getPatientByUpi(upi);
      if (existingPatient) {
        Alert.alert(
          t('patient.duplicateWarning'),
          t('patient.duplicateMessage', { upi }),
          [
            { text: t('common.cancel'), style: 'cancel' },
            {
              text: t('patient.continueAnyway'),
              onPress: () => savePatient(upi),
            },
          ]
        );
        setLoading(false);
        return;
      }

      await savePatient(upi);
    } catch (error) {
      console.error('❌ Failed to submit form:', error);
      Alert.alert(t('common.error'), t('patient.registrationError'));
      setLoading(false);
    }
  };

  /**
   * Save patient to storage
   */
  const savePatient = async (upi: string) => {
    try {
      const newPatient: Patient = {
        id: `patient_${Date.now()}`,
        upi,
        firstName: firstName.trim(),
        middleName: middleName.trim(),
        lastName: lastName.trim(),
        dateOfBirth,
        age: calculateAge(dateOfBirth),
        sex: sex as Sex,
        barangay,
        purok: purok || customPurok.trim().replace(/purok\s*/i, '').trim(),
        phoneNumber: phoneNumber.trim(),
        streetAddress: streetAddress.trim(),
        notes: notes.trim(),
        registeredBy: user?.id || '',
        registrationDate: new Date(),
        isHighRisk: false,
        totalEncounters: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: user?.id || '',
        syncStatus: SyncStatus.PENDING,
      };

      await patientStorage.savePatient(newPatient);
      console.log('✅ Patient saved successfully:', {
        upi,
        id: newPatient.id,
        name: `${newPatient.firstName} ${newPatient.lastName}`,
        barangay: newPatient.barangay,
        purok: newPatient.purok,
      });

      Alert.alert(
        t('common.success') + '! 🎉',
        t('patient.registrationSuccess') + `\n\nUPI: ${upi}\n\n` + t('encounter.canRecordBP'),
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      throw error;
    }
  };

  /**
   * Reset form
   */
  const handleReset = () => {
    Alert.alert(t('patient.resetForm'), t('patient.resetConfirm'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('patient.reset'),
        style: 'destructive',
        onPress: () => {
          setFirstName('');
          setMiddleName('');
          setLastName('');
          setDateOfBirth(new Date());
          setSex('');
          setBarangay(user && isBHW(user) ? user.barangay : '');
          setPurok(user && isBHW(user) ? user.purok || '' : '');
          setPhoneNumber('');
          setStreetAddress('');
          setNotes('');
          setErrors({});
        },
      },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{t('patient.registerNew')}</Text>
          <Text style={styles.subtitle}>{t('patient.fillInformation')}</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Personal Information */}
          <Text style={styles.sectionTitle}>{t('patient.personalInformation')}</Text>

          <FormInput
            label={t('patient.firstName')}
            value={firstName}
            onChangeText={setFirstName}
            error={errors.firstName}
            required
            placeholder={t('patient.enterFirstName')}
            autoCapitalize="words"
          />

          <FormInput
            label={t('patient.middleName') + ' ' + t('patient.optional')}
            value={middleName}
            onChangeText={setMiddleName}
            placeholder={t('patient.enterMiddleName')}
            autoCapitalize="words"
          />

          <FormInput
            label={t('patient.lastName')}
            value={lastName}
            onChangeText={setLastName}
            error={errors.lastName}
            required
            placeholder={t('patient.enterLastName')}
            autoCapitalize="words"
          />

          <FormDatePicker
            label={t('patient.birthdate')}
            value={dateOfBirth}
            onValueChange={setDateOfBirth}
            error={errors.birthdate}
            required
            maximumDate={new Date()}
          />

          <FormPicker
            label={t('patient.sex')}
            value={sex}
            onValueChange={(value) => setSex(value as Sex)}
            items={sexOptions}
            error={errors.sex}
            required
          />

          {/* Location */}
          <Text style={styles.sectionTitle}>{t('patient.location')}</Text>

          <FormPicker
            label={t('patient.barangay')}
            value={barangay}
            onValueChange={setBarangay}
            items={barangayOptions}
            error={errors.barangay}
            required
          />

          <FormPicker
            label={t('patient.purok')}
            value={purok}
            onValueChange={setPurok}
            items={purokOptions}
            error={errors.purok}
            required
          />
          <FormInput
            label={t('patient.customPurok')}
            value={customPurok}
            onChangeText={setCustomPurok}
            placeholder={t('patient.enterCustomPurok')}
            autoCapitalize="words"
          />

          <FormInput
            label={t('patient.streetAddress')}
            value={streetAddress}
            onChangeText={setStreetAddress}
            placeholder={t('patient.enterStreetAddress')}
            multiline
            numberOfLines={2}
          />

          {/* Contact Information */}
          <Text style={styles.sectionTitle}>{t('patient.contactInformation')}</Text>

          <FormInput
            label={t('patient.contactNumber')}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            error={errors.contactNumber}
            placeholder={t('patient.enterPhoneNumber')}
            keyboardType="phone-pad"
            maxLength={11}
          />

          {/* Notes */}
          <Text style={styles.sectionTitle}>{t('patient.additionalNotes')}</Text>

          <FormInput
            label={t('patient.notes')}
            value={notes}
            onChangeText={setNotes}
            placeholder={t('patient.enterNotes')}
            multiline
            numberOfLines={4}
          />

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={handleReset}
              disabled={loading}
            >
              <Text style={styles.secondaryButtonText}>{t('patient.reset')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.primaryButtonText}>{t('patient.register')}</Text>
              )}
            </TouchableOpacity>
          </View>
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
    backgroundColor: '#2E7D32',
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 30,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#2E7D32',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#2E7D32',
  },
  secondaryButtonText: {
    color: '#2E7D32',
    fontSize: 16,
    fontWeight: '600',
  },
});
