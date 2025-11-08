/**
 * AsyncStorage Implementation of Storage Service
 * Provides offline-first data storage using AsyncStorage
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Patient, Encounter, User, SyncQueueItem, SyncStatus } from '../../models';
import { STORAGE_KEYS } from '../../utils/constants';
import { IStorageService } from './storage.interface';

class AsyncStorageService implements IStorageService {
  // ==================== USER OPERATIONS ====================

  async saveUser(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
      console.log('✅ User saved to storage');
    } catch (error) {
      console.error('❌ Error saving user:', error);
      throw error;
    }
  }

  async getUser(userId: string): Promise<User | null> {
    try {
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      if (!userData) return null;
      const user = JSON.parse(userData);
      return user.uid === userId ? user : null;
    } catch (error) {
      console.error('❌ Error getting user:', error);
      return null;
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('❌ Error getting current user:', error);
      return null;
    }
  }

  async clearUser(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
      console.log('✅ User cleared from storage');
    } catch (error) {
      console.error('❌ Error clearing user:', error);
      throw error;
    }
  }

  // ==================== PATIENT OPERATIONS ====================

  async savePatient(patient: Patient): Promise<void> {
    try {
      // Save individual patient
      await AsyncStorage.setItem(
        `${STORAGE_KEYS.PATIENTS}:${patient.id}`,
        JSON.stringify(patient)
      );

      // Update patients index
      const patientsIndex = await this.getPatientsIndex();
      if (!patientsIndex.includes(patient.id)) {
        patientsIndex.push(patient.id);
        await AsyncStorage.setItem(
          STORAGE_KEYS.PATIENTS,
          JSON.stringify(patientsIndex)
        );
      }

      // Add to sync queue if pending
      if (patient.syncStatus === SyncStatus.PENDING) {
        await this.addToSyncQueue({
          id: `patient_${patient.id}`,
          entityType: 'patient',
          entityId: patient.id,
          operation: 'create', // Assume create for new pending items
          data: patient,
          status: SyncStatus.PENDING,
          createdAt: new Date(),
          attemptCount: 0,
        });
      }

      console.log(`✅ Patient ${patient.id} saved to storage`);
    } catch (error) {
      console.error('❌ Error saving patient:', error);
      throw error;
    }
  }

  async getPatient(patientId: string): Promise<Patient | null> {
    try {
      const patientData = await AsyncStorage.getItem(
        `${STORAGE_KEYS.PATIENTS}:${patientId}`
      );
      return patientData ? JSON.parse(patientData) : null;
    } catch (error) {
      console.error('❌ Error getting patient:', error);
      return null;
    }
  }

  async getPatientByUpi(upi: string): Promise<Patient | null> {
    try {
      const allPatients = await this.getAllPatients();
      return allPatients.find((patient) => patient.upi === upi) || null;
    } catch (error) {
      console.error('❌ Error getting patient by UPI:', error);
      return null;
    }
  }

  async getAllPatients(): Promise<Patient[]> {
    try {
      const patientsIndex = await this.getPatientsIndex();
      const patients = await Promise.all(
        patientsIndex.map((id) => this.getPatient(id))
      );
      return patients.filter((p) => p !== null) as Patient[];
    } catch (error) {
      console.error('❌ Error getting all patients:', error);
      return [];
    }
  }

  async searchPatients(searchTerm: string): Promise<Patient[]> {
    try {
      const allPatients = await this.getAllPatients();
      const term = searchTerm.toLowerCase();
      return allPatients.filter(
        (patient) =>
          patient.firstName.toLowerCase().includes(term) ||
          patient.lastName.toLowerCase().includes(term) ||
          patient.upi.toLowerCase().includes(term)
      );
    } catch (error) {
      console.error('❌ Error searching patients:', error);
      return [];
    }
  }

  async deletePatient(patientId: string): Promise<void> {
    try {
      // Remove patient data
      await AsyncStorage.removeItem(`${STORAGE_KEYS.PATIENTS}:${patientId}`);

      // Update patients index
      const patientsIndex = await this.getPatientsIndex();
      const updatedIndex = patientsIndex.filter((id) => id !== patientId);
      await AsyncStorage.setItem(
        STORAGE_KEYS.PATIENTS,
        JSON.stringify(updatedIndex)
      );

      console.log(`✅ Patient ${patientId} deleted from storage`);
    } catch (error) {
      console.error('❌ Error deleting patient:', error);
      throw error;
    }
  }

  // ==================== ENCOUNTER OPERATIONS ====================

  async saveEncounter(encounter: Encounter): Promise<void> {
    try {
      // Save individual encounter
      await AsyncStorage.setItem(
        `${STORAGE_KEYS.ENCOUNTERS}:${encounter.id}`,
        JSON.stringify(encounter)
      );

      // Update encounters index
      const encountersIndex = await this.getEncountersIndex();
      if (!encountersIndex.includes(encounter.id)) {
        encountersIndex.push(encounter.id);
        await AsyncStorage.setItem(
          STORAGE_KEYS.ENCOUNTERS,
          JSON.stringify(encountersIndex)
        );
      }

      // Add to sync queue if pending
      if (encounter.syncStatus === SyncStatus.PENDING) {
        await this.addToSyncQueue({
          id: `encounter_${encounter.id}`,
          entityType: 'encounter',
          entityId: encounter.id,
          operation: 'create', // Assume create for new pending items
          data: encounter,
          status: SyncStatus.PENDING,
          createdAt: new Date(),
          attemptCount: 0,
        });
      }

      console.log(`✅ Encounter ${encounter.id} saved to storage`);
    } catch (error) {
      console.error('❌ Error saving encounter:', error);
      throw error;
    }
  }

  async getEncounter(encounterId: string): Promise<Encounter | null> {
    try {
      const encounterData = await AsyncStorage.getItem(
        `${STORAGE_KEYS.ENCOUNTERS}:${encounterId}`
      );
      return encounterData ? JSON.parse(encounterData) : null;
    } catch (error) {
      console.error('❌ Error getting encounter:', error);
      return null;
    }
  }

  async getPatientEncounters(patientId: string): Promise<Encounter[]> {
    try {
      const allEncounters = await this.getAllEncounters();
      return allEncounters
        .filter((encounter) => encounter.patientId === patientId)
        .sort(
          (a, b) =>
            new Date(b.encounterDate).getTime() - new Date(a.encounterDate).getTime()
        );
    } catch (error) {
      console.error('❌ Error getting patient encounters:', error);
      return [];
    }
  }

  async getAllEncounters(): Promise<Encounter[]> {
    try {
      const encountersIndex = await this.getEncountersIndex();
      const encounters = await Promise.all(
        encountersIndex.map((id) => this.getEncounter(id))
      );
      return encounters.filter((e) => e !== null) as Encounter[];
    } catch (error) {
      console.error('❌ Error getting all encounters:', error);
      return [];
    }
  }

  async deleteEncounter(encounterId: string): Promise<void> {
    try {
      // Remove encounter data
      await AsyncStorage.removeItem(`${STORAGE_KEYS.ENCOUNTERS}:${encounterId}`);

      // Update encounters index
      const encountersIndex = await this.getEncountersIndex();
      const updatedIndex = encountersIndex.filter((id) => id !== encounterId);
      await AsyncStorage.setItem(
        STORAGE_KEYS.ENCOUNTERS,
        JSON.stringify(updatedIndex)
      );

      console.log(`✅ Encounter ${encounterId} deleted from storage`);
    } catch (error) {
      console.error('❌ Error deleting encounter:', error);
      throw error;
    }
  }

  // ==================== SYNC QUEUE OPERATIONS ====================

  async addToSyncQueue(item: SyncQueueItem): Promise<void> {
    try {
      const queue = await this.getSyncQueue();
      
      // Check if item already exists
      const existingIndex = queue.findIndex((i) => i.id === item.id);
      if (existingIndex >= 0) {
        queue[existingIndex] = item;
      } else {
        queue.push(item);
      }

      await AsyncStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify(queue));
      console.log(`✅ Item ${item.id} added to sync queue`);
    } catch (error) {
      console.error('❌ Error adding to sync queue:', error);
      throw error;
    }
  }

  async getSyncQueue(): Promise<SyncQueueItem[]> {
    try {
      const queueData = await AsyncStorage.getItem(STORAGE_KEYS.SYNC_QUEUE);
      return queueData ? JSON.parse(queueData) : [];
    } catch (error) {
      console.error('❌ Error getting sync queue:', error);
      return [];
    }
  }

  async removeSyncQueueItem(itemId: string): Promise<void> {
    try {
      const queue = await this.getSyncQueue();
      const updatedQueue = queue.filter((item) => item.id !== itemId);
      await AsyncStorage.setItem(
        STORAGE_KEYS.SYNC_QUEUE,
        JSON.stringify(updatedQueue)
      );
      console.log(`✅ Item ${itemId} removed from sync queue`);
    } catch (error) {
      console.error('❌ Error removing sync queue item:', error);
      throw error;
    }
  }

  async clearSyncQueue(): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify([]));
      console.log('✅ Sync queue cleared');
    } catch (error) {
      console.error('❌ Error clearing sync queue:', error);
      throw error;
    }
  }

  // ==================== UTILITY OPERATIONS ====================

  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
      console.log('✅ All storage cleared');
    } catch (error) {
      console.error('❌ Error clearing storage:', error);
      throw error;
    }
  }

  async getStorageInfo(): Promise<{
    patients: number;
    encounters: number;
    syncQueue: number;
  }> {
    try {
      const [patients, encounters, syncQueue] = await Promise.all([
        this.getAllPatients(),
        this.getAllEncounters(),
        this.getSyncQueue(),
      ]);

      return {
        patients: patients.length,
        encounters: encounters.length,
        syncQueue: syncQueue.length,
      };
    } catch (error) {
      console.error('❌ Error getting storage info:', error);
      return { patients: 0, encounters: 0, syncQueue: 0 };
    }
  }

  /**
   * Get last sync timestamp
   */
  async getLastSyncTime(): Promise<Date | null> {
    try {
      const value = await AsyncStorage.getItem(STORAGE_KEYS.LAST_SYNC);
      return value ? new Date(value) : null;
    } catch (error) {
      console.error('Failed to get last sync time:', error);
      return null;
    }
  }

  /**
   * Set last sync timestamp
   */
  async setLastSyncTime(date: Date): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.LAST_SYNC, date.toISOString());
    } catch (error) {
      console.error('Failed to set last sync time:', error);
      throw error;
    }
  }

  // ==================== PRIVATE HELPER METHODS ====================

  private async getPatientsIndex(): Promise<string[]> {
    try {
      const indexData = await AsyncStorage.getItem(STORAGE_KEYS.PATIENTS);
      return indexData ? JSON.parse(indexData) : [];
    } catch (error) {
      return [];
    }
  }

  private async getEncountersIndex(): Promise<string[]> {
    try {
      const indexData = await AsyncStorage.getItem(STORAGE_KEYS.ENCOUNTERS);
      return indexData ? JSON.parse(indexData) : [];
    } catch (error) {
      return [];
    }
  }
}

// Export singleton instance
export const storageService = new AsyncStorageService();
