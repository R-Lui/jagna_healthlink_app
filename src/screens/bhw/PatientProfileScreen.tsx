import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { BHWStackParamList } from '../../types/navigation.types';
import { usePatientStorage, useEncounterStorage } from '../../hooks/useStorage';
import { Patient, Encounter } from '../../models';
import { calculateAge, formatDate } from '../../utils/helpers';
import EncounterListItem from '../../components/bhw/EncounterListItem';
import EmptyState from '../../components/common/EmptyState';

type Props = NativeStackScreenProps<BHWStackParamList, 'PatientProfile'>;

export default function PatientProfileScreen({ route, navigation }: Props) {
  const { t } = useTranslation();
  const { patientId } = route.params;
  const patientStorage = usePatientStorage();
  const encounterStorage = useEncounterStorage();

  const [patient, setPatient] = useState<Patient | null>(null);
  const [encounters, setEncounters] = useState<Encounter[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPatientData();
  }, [patientId]);

  /**
   * Load patient and encounter data
   */
  const loadPatientData = async () => {
    try {
      setLoading(true);

      // Load patient
      const patientData = await patientStorage.getPatient(patientId);
      if (!patientData) {
        Alert.alert(t('common.error'), t('patient.notFound'));
        navigation.goBack();
        return;
      }
      setPatient(patientData);

      // Load encounters
      const encounterData = await encounterStorage.getPatientEncounters(patientId);
      // Sort by date descending (newest first)
      encounterData.sort(
        (a: Encounter, b: Encounter) => new Date(b.encounterDate).getTime() - new Date(a.encounterDate).getTime()
      );
      setEncounters(encounterData);

      console.log(`✅ Loaded patient ${patientData.upi} with ${encounterData.length} encounters`);
    } catch (error) {
      console.error('❌ Failed to load patient data:', error);
      Alert.alert(t('common.error'), t('patient.loadError'));
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle pull to refresh
   */
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadPatientData();
    setRefreshing(false);
  }, [patientId]);

  /**
   * Navigate to record encounter
   */
  const handleRecordEncounter = () => {
    navigation.navigate('EncounterRecording', { patientId });
  };

  /**
   * Handle encounter press (for future detail view)
   */
  const handleEncounterPress = (encounter: Encounter) => {
    // TODO: Implement encounter detail view in future
    console.log('Encounter pressed:', encounter.id);
  };

  if (loading || !patient) {
    return (
      <View style={styles.loadingContainer}>
        <Text>{t('common.loading')}...</Text>
      </View>
    );
  }

  const age = calculateAge(patient.dateOfBirth);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Patient Header */}
        <View style={styles.header}>
          <View style={styles.patientInfo}>
            <Text style={styles.name}>
              {patient.lastName}, {patient.firstName} {patient.middleName}
            </Text>
            <Text style={styles.upi}>UPI: {patient.upi}</Text>
          </View>
        </View>

        {/* Patient Details Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('patient.personalInformation')}</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{t('patient.age')}:</Text>
            <Text style={styles.infoValue}>{age} {t('patient.yearsOld')}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{t('patient.sex')}:</Text>
            <Text style={styles.infoValue}>{patient.sex}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{t('patient.birthdate')}:</Text>
            <Text style={styles.infoValue}>{formatDate(patient.dateOfBirth)}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{t('patient.barangay')}:</Text>
            <Text style={styles.infoValue}>{patient.barangay}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{t('patient.purok')}:</Text>
            <Text style={styles.infoValue}>{patient.purok || 'N/A'}</Text>
          </View>

          {patient.phoneNumber && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{t('patient.contact')}:</Text>
              <Text style={styles.infoValue}>{patient.phoneNumber}</Text>
            </View>
          )}

          {patient.notes && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{t('patient.notes')}:</Text>
              <Text style={styles.infoValue}>{patient.notes}</Text>
            </View>
          )}
        </View>

        {/* Record Encounter Button */}
        <TouchableOpacity style={styles.recordButton} onPress={handleRecordEncounter}>
          <Text style={styles.recordButtonText}>+ {t('encounter.recordNew')}</Text>
        </TouchableOpacity>

        {/* Encounter History */}
        <View style={styles.encounterSection}>
          <Text style={styles.sectionTitle}>
            {t('encounter.history')} ({encounters.length})
          </Text>
          
          {encounters.length === 0 ? (
            <EmptyState
              icon="📋"
              title={t('encounter.noEncounters')}
              message={t('encounter.recordFirstBP')}
            />
          ) : (
            encounters.map((encounter) => (
              <EncounterListItem
                key={encounter.id}
                encounter={encounter}
                onPress={handleEncounterPress}
              />
            ))
          )}
        </View>
      </ScrollView>
    </View>
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
    paddingBottom: 20,
  },
  header: {
    backgroundColor: '#2E7D32',
    padding: 20,
    paddingVertical: 40,
  },
  patientInfo: {
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  upi: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginTop: -20,
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 14,
    color: '#999',
    width: 140,
  },
  infoValue: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  recordButton: {
    backgroundColor: '#2E7D32',
    marginHorizontal: 15,
    marginTop: 20,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  recordButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  encounterSection: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 15,
    marginBottom: 10,
  },
});
