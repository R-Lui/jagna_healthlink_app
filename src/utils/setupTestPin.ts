/**
 * Setup Test PIN Utility
 * Creates a test BHW user for development/testing
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from './constants';
import { User, UserRole, SyncStatus } from '../models';

/**
 * Setup a test BHW user with PIN
 * Username: bhw_test@test.com
 * PIN: 1234
 */
export async function setupTestBHWUser() {
  try {
    const testPin = '1234';
    // Simple hash for development (reverse string)
    const hashedPin = testPin.split('').reverse().join('');

    const testBHW: User = {
      id: 'test-bhw-001',
      email: 'bhw_test@test.com',
      role: UserRole.BHW,
      firstName: 'Test',
      lastName: 'BHW',
      phoneNumber: '09123456789',
      isActive: true,
      barangay: 'Poblacion (Pondol)',
      purok: '1',
      pin: hashedPin,
      assignedBy: 'test-cvif-001',
      totalPatientsRegistered: 0,
      totalEncountersRecorded: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'test-cvif-001',
      syncStatus: SyncStatus.SYNCED,
    };

    // Get existing users or create new array
    const existingUsersJson = await AsyncStorage.getItem(STORAGE_KEYS.BHW_USERS);
    let users: User[] = existingUsersJson ? JSON.parse(existingUsersJson) : [];

    // Check if test user already exists
    const existingIndex = users.findIndex(u => u.id === testBHW.id);
    if (existingIndex >= 0) {
      // Update existing
      users[existingIndex] = testBHW;
    } else {
      // Add new
      users.push(testBHW);
    }

    // Save to storage
    await AsyncStorage.setItem(STORAGE_KEYS.BHW_USERS, JSON.stringify(users));

    console.log('✅ Test BHW user created successfully');
    console.log('Username:', testBHW.email);
    console.log('PIN:', testPin);

    return testBHW;
  } catch (error) {
    console.error('❌ Error setting up test BHW user:', error);
    throw error;
  }
}
