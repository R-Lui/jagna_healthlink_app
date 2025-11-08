/**
 * Test utilities for storage service
 * Use these to test storage operations manually
 */

import { storageService } from '../asyncstorage.service';
import { Patient, Encounter, Sex, BPCategory, SyncStatus } from '../../../models';

export async function testStorageOperations() {
  console.log('🧪 Testing Storage Operations...\n');

  try {
    // Test 1: Save and retrieve patient
    console.log('Test 1: Save and retrieve patient');
    const testPatient: Patient = {
      id: 'test-patient-1',
      upi: 'JAG-CAN-2024-0001',
      firstName: 'Juan',
      middleName: 'Santos',
      lastName: 'Dela Cruz',
      dateOfBirth: new Date('1980-05-15'),
      age: 44,
      sex: Sex.MALE,
      barangay: 'Canjulao',
      purok: 'Purok 1',
      phoneNumber: '09123456789',
      registeredBy: 'bhw-001',
      registrationDate: new Date(),
      isHighRisk: false,
      totalEncounters: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'bhw-001',
      syncStatus: SyncStatus.PENDING,
    };

    await storageService.savePatient(testPatient);
    const retrievedPatient = await storageService.getPatient('test-patient-1');
    console.log('✅ Patient saved and retrieved:', retrievedPatient?.firstName);

    // Test 2: Save and retrieve encounter
    console.log('\nTest 2: Save and retrieve encounter');
    const testEncounter: Encounter = {
      id: 'test-encounter-1',
      patientId: 'test-patient-1',
      patientUPI: 'JAG-CAN-2024-0001',
      encounterDate: new Date(),
      recordedBy: 'bhw-001',
      systolic: 120,
      diastolic: 80,
      bpCategory: BPCategory.NORMAL,
      requiresFollowUp: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'bhw-001',
      syncStatus: SyncStatus.PENDING,
    };

    await storageService.saveEncounter(testEncounter);
    const retrievedEncounter = await storageService.getEncounter('test-encounter-1');
    console.log('✅ Encounter saved and retrieved:', retrievedEncounter?.bpCategory);

    // Test 3: Get all patients
    console.log('\nTest 3: Get all patients');
    const allPatients = await storageService.getAllPatients();
    console.log(`✅ Total patients: ${allPatients.length}`);

    // Test 4: Search patients
    console.log('\nTest 4: Search patients');
    const searchResults = await storageService.searchPatients('Juan');
    console.log(`✅ Search results: ${searchResults.length} found`);

    // Test 5: Get patient encounters
    console.log('\nTest 5: Get patient encounters');
    const patientEncounters = await storageService.getPatientEncounters('test-patient-1');
    console.log(`✅ Patient encounters: ${patientEncounters.length}`);

    // Test 6: Storage info
    console.log('\nTest 6: Get storage info');
    const storageInfo = await storageService.getStorageInfo();
    console.log('✅ Storage info:', storageInfo);

    console.log('\n✅ All storage tests passed!');
    return true;
  } catch (error) {
    console.error('❌ Storage test failed:', error);
    return false;
  }
}
