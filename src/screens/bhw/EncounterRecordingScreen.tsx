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
import { usePatientStorage, useEncounterStorage } from '../../hooks/useStorage';
import { Patient, Encounter, SyncStatus, BPCategory as ModelBPCategory } from '../../models';
import { getBPCategory, validateBPReading, BPCategory as CalcBPCategory } from '../../utils/bpCalculator';
import { getPatientFullName } from '../../utils/patient.utils';
import BPInput from '../../components/forms/BPInput';
import BPCategoryDisplay from '../../components/bhw/BPCategoryDisplay';
import FormInput from '../../components/forms/FormInput';

type Props = NativeStackScreenProps<BHWStackParamList, 'EncounterRecording'>;

export default function EncounterRecordingScreen({ route, navigation }: Props) {
  const { t } = useTranslation();
  const { patientId } = route.params;
  const { user } = useAuth();
  const patientStorage = usePatientStorage();
  const encounterStorage = useEncounterStorage();

  const [patient, setPatient] = useState<Patient | null>(null);
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [notes, setNotes] = useState('');
  const [bpError, setBpError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCategory, setShowCategory] = useState(false);

  useEffect(() => {
    loadPatient();
  }, [patientId]);

  // Show category when both values are entered
  useEffect(() => {
    if (systolic && diastolic) {
      const sys = parseInt(systolic);
      const dia = parseInt(diastolic);
      
      if (!isNaN(sys) && !isNaN(dia)) {
        const validation = validateBPReading(sys, dia);
        if (validation.valid) {
          setShowCategory(true);
          setBpError('');
        } else {
          setShowCategory(false);
          setBpError(validation.error || t('encounter.invalidReading'));
        }
      }
    } else {
      setShowCategory(false);
      setBpError('');
    }
  }, [systolic, diastolic]);

  /**
   * Load patient data
   */
  const loadPatient = async () => {
    try {
      const patientData = await patientStorage.getPatient(patientId);
      if (!patientData) {
        Alert.alert(t('common.error'), t('patient.notFound'));
        navigation.goBack();
        return;
      }
      setPatient(patientData);
    } catch (error) {
      console.error('❌ Failed to load patient:', error);
      Alert.alert(t('common.error'), t('patient.loadError'));
    }
  };

  /**
   * Validate and submit encounter
   */
  const handleSubmit = async () => {
    // Validate BP values
    if (!systolic || !diastolic) {
      setBpError(t('encounter.bothValuesRequired'));
      return;
    }

    const sys = parseInt(systolic);
    const dia = parseInt(diastolic);

    if (isNaN(sys) || isNaN(dia)) {
      setBpError(t('encounter.validNumbers'));
      return;
    }

    const validation = validateBPReading(sys, dia);
    if (!validation.valid) {
      setBpError(validation.error || t('encounter.invalidBP'));
      return;
    }

    // Get BP category
    const category = getBPCategory(sys, dia);

    // Show confirmation for critical readings
    if (category === 'Hypertensive Crisis') {
      Alert.alert(
        '🚨 ' + t('encounter.emergency') + ': ' + t('encounter.hypertensiveCrisis'),
        t('encounter.emergencyMessage'),
        [
          { text: t('common.cancel'), style: 'cancel' },
          { text: t('encounter.confirmSave'), onPress: () => saveEncounter(sys, dia), style: 'destructive' },
        ]
      );
      return;
    }

    // Save encounter
    await saveEncounter(sys, dia);
  };

  /**
   * Map calculator BP category to model BP category
   */
  const mapBPCategory = (category: CalcBPCategory): ModelBPCategory => {
    switch (category) {
      case 'Normal':
        return ModelBPCategory.NORMAL;
      case 'Elevated':
        return ModelBPCategory.ELEVATED;
      case 'High Blood Pressure (Stage 1)':
        return ModelBPCategory.HYPERTENSION_STAGE_1;
      case 'High Blood Pressure (Stage 2)':
        return ModelBPCategory.HYPERTENSION_STAGE_2;
      case 'Hypertensive Crisis':
        return ModelBPCategory.HYPERTENSIVE_CRISIS;
      default:
        return ModelBPCategory.NORMAL;
    }
  };

  /**
   * Save encounter to storage
   */
  const saveEncounter = async (sys: number, dia: number) => {
    setLoading(true);

    try {
      const now = new Date();
      const category = getBPCategory(sys, dia);
      const modelCategory = mapBPCategory(category);

      // Create encounter
      const encounter: Encounter = {
        id: `enc_${Date.now()}`,
        patientId: patientId,
        patientUPI: patient?.upi || '',
        encounterDate: now,
        recordedBy: user?.id || '',
        systolic: sys,
        diastolic: dia,
        bpCategory: modelCategory,
        notes: notes.trim() || undefined,
        requiresFollowUp: modelCategory === ModelBPCategory.HYPERTENSIVE_CRISIS || 
                          modelCategory === ModelBPCategory.HYPERTENSION_STAGE_2,
        createdAt: now,
        updatedAt: now,
        createdBy: user?.id || '',
        syncStatus: SyncStatus.PENDING,
      };

      // Save encounter
      await encounterStorage.saveEncounter(encounter);

      // Update patient's last encounter date
      if (patient) {
        const updatedPatient: Patient = {
          ...patient,
          lastEncounterDate: now,
          updatedAt: now,
        };
        await patientStorage.savePatient(updatedPatient);
      }

      Alert.alert(
        t('common.success'),
        t('encounter.savedSuccess'),
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error: any) {
      console.error('❌ Failed to save encounter:', error);
      Alert.alert(t('common.error'), error.message || t('encounter.saveError'));
    } finally {
      setLoading(false);
    }
  };

  /**
   * Clear form
   */
  const handleClear = () => {
    Alert.alert(t('encounter.clearForm'), t('encounter.clearConfirm'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.clear'),
        style: 'destructive',
        onPress: () => {
          setSystolic('');
          setDiastolic('');
          setNotes('');
          setBpError('');
          setShowCategory(false);
        },
      },
    ]);
  };

  if (!patient) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2E7D32" />
      </View>
    );
  }

  const sys = parseInt(systolic);
  const dia = parseInt(diastolic);
  const category = !isNaN(sys) && !isNaN(dia) ? getBPCategory(sys, dia) : 'Normal';

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{t('encounter.recordBP')}</Text>
          <Text style={styles.subtitle}>{getPatientFullName(patient)}</Text>
          <Text style={styles.upi}>UPI: {patient.upi}</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Guidelines */}
          <View style={styles.guidelinesCard}>
            <Text style={styles.guidelinesTitle}>📋 {t('encounter.guidelines')}</Text>
            <Text style={styles.guidelineText}>
              • {t('encounter.guideline1')}{'\n'}
              • {t('encounter.guideline2')}{'\n'}
              • {t('encounter.guideline3')}{'\n'}
              • {t('encounter.guideline4')}
            </Text>
          </View>

          {/* BP Input */}
          <BPInput
            systolicValue={systolic}
            diastolicValue={diastolic}
            onSystolicChange={setSystolic}
            onDiastolicChange={setDiastolic}
            error={bpError}
          />

          {/* Category Display */}
          {showCategory && !isNaN(sys) && !isNaN(dia) && (
            <BPCategoryDisplay
              category={category}
              systolic={sys}
              diastolic={dia}
            />
          )}

          {/* Notes */}
          <FormInput
            label={t('encounter.notesOptional')}
            value={notes}
            onChangeText={setNotes}
            placeholder={t('encounter.notesPlaceholder')}
            multiline
            numberOfLines={4}
          />

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.clearButton]}
              onPress={handleClear}
              disabled={loading}
            >
              <Text style={styles.clearButtonText}>{t('common.clear')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                styles.submitButton,
                loading && styles.buttonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={loading || !systolic || !diastolic}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>{t('encounter.saveReading')}</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 5,
  },
  upi: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
  },
  form: {
    padding: 20,
  },
  guidelinesCard: {
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
  },
  guidelinesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1565C0',
    marginBottom: 10,
  },
  guidelineText: {
    fontSize: 13,
    color: '#1565C0',
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  clearButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  clearButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#2E7D32',
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
