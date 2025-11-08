/**
 * Storage Test Button Component
 * Temporary component for testing storage operations
 */

import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { storageService } from '../../services/storage';
import { Patient, Encounter, Sex, SyncStatus, BPCategory } from '../../models';
import { generateUPI } from '../../utils/patient.utils';

export default function StorageTestButton() {
  const [testing, setTesting] = useState(false);

  const runTests = async () => {
    setTesting(true);
    try {
      console.log('🧪 Starting storage tests...');
      
      // Test 1: Save a test patient
      const testPatient: Patient = {
        id: 'test-patient-001',
        upi: generateUPI('Poblacion', 1, 2024),
        firstName: 'Test',
        middleName: 'Storage',
        lastName: 'Patient',
        dateOfBirth: new Date('1990-01-01'),
        age: 34,
        sex: Sex.MALE,
        phoneNumber: '09123456789',
        barangay: 'Poblacion',
        purok: 'Purok 1',
        streetAddress: '123 Test Street',
        registeredBy: 'test-bhw-001',
        registrationDate: new Date(),
        isHighRisk: false,
        totalEncounters: 0,
        notes: 'Test patient for storage',
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'test-bhw-001',
        syncStatus: SyncStatus.PENDING,
      };

      await storageService.savePatient(testPatient);
      console.log('✅ Patient saved');

      // Test 2: Retrieve the patient
      const retrieved = await storageService.getPatient(testPatient.id);
      if (!retrieved) {
        throw new Error('Failed to retrieve patient');
      }
      console.log('✅ Patient retrieved');

      // Test 3: Search patients
      const searchResults = await storageService.searchPatients('Test');
      if (searchResults.length === 0) {
        throw new Error('Search failed');
      }
      console.log('✅ Patient search works');

      // Test 4: Save an encounter
      const testEncounter: Encounter = {
        id: 'test-encounter-001',
        patientId: testPatient.id,
        patientUPI: testPatient.upi,
        encounterDate: new Date(),
        recordedBy: 'test-bhw-001',
        systolic: 120,
        diastolic: 80,
        bpCategory: BPCategory.NORMAL,
        heartRate: 72,
        temperature: 36.5,
        weight: 70,
        notes: 'Test encounter - Home Visit',
        requiresFollowUp: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'test-bhw-001',
        syncStatus: SyncStatus.PENDING,
      };

      await storageService.saveEncounter(testEncounter);
      console.log('✅ Encounter saved');

      // Test 5: Get encounters for patient
      const encounters = await storageService.getPatientEncounters(testPatient.id);
      if (encounters.length === 0) {
        throw new Error('Failed to retrieve encounters');
      }
      console.log('✅ Encounter retrieval works');

      Alert.alert(
        'Tests Passed ✅',
        'All storage operations are working correctly!\n\n' +
        `• Patient saved and retrieved\n` +
        `• Search working\n` +
        `• Encounter saved\n` +
        `• Total patients: ${searchResults.length}\n` +
        `• Total encounters: ${encounters.length}`
      );

    } catch (error: any) {
      console.error('❌ Test error:', error);
      Alert.alert('Tests Failed ❌', error.message || 'Check console for details');
    } finally {
      setTesting(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, testing && styles.buttonDisabled]}
        onPress={runTests}
        disabled={testing}
      >
        <Text style={styles.buttonText}>
          {testing ? 'Testing Storage...' : 'Test Storage Operations'}
        </Text>
      </TouchableOpacity>
      <Text style={styles.hint}>
        Creates test patient and encounter, verifies storage
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  button: {
    backgroundColor: '#FF9800',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  hint: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
});
