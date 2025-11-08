/**
 * Data Synchronization Service
 * Handles sync between local storage and Firebase
 */

import { storageService } from '../storage';
import { firestoreService } from '../firebase';
import { Patient, Encounter, SyncStatus, SyncQueueItem, SyncOperation } from '../../models';
import NetInfo from '@react-native-community/netinfo';

export interface SyncResult {
  success: boolean;
  patientsSynced: number;
  encountersSynced: number;
  errors: string[];
}

class SyncService {
  private isSyncing = false;

  /**
   * Check if device is online
   */
  async isOnline(): Promise<boolean> {
    const state = await NetInfo.fetch();
    console.log('NetInfo state:', {
      isConnected: state.isConnected,
      isInternetReachable: state.isInternetReachable,
      type: state.type,
    });
    
    // Consider online if connected, even if isInternetReachable is null
    // (isInternetReachable can be null on some platforms/simulators)
    return state.isConnected === true && state.isInternetReachable !== false;
  }

  /**
   * Perform full sync (push local changes, pull remote changes)
   */
  async performFullSync(userId: string): Promise<SyncResult> {
    if (this.isSyncing) {
      throw new Error('Sync already in progress');
    }

    console.log('🔄 Starting full sync...');
    this.isSyncing = true;

    const result: SyncResult = {
      success: false,
      patientsSynced: 0,
      encountersSynced: 0,
      errors: [],
    };

    try {
      // Check internet connection
      const online = await this.isOnline();
      if (!online) {
        throw new Error('No internet connection');
      }

      // Step 1: Push local changes to Firebase
      await this.pushLocalChanges(userId, result);

      // Step 2: Pull remote changes from Firebase
      await this.pullRemoteChanges(userId, result);

      result.success = true;
      console.log('✅ Sync completed successfully', result);
      return result;
    } catch (error: any) {
      console.error('❌ Sync failed:', error);
      result.errors.push(error.message || 'Unknown error');
      return result;
    } finally {
      this.isSyncing = false;
    }
  }

  /**
   * Push local changes to Firebase
   */
  private async pushLocalChanges(userId: string, result: SyncResult): Promise<void> {
    console.log('📤 Pushing local changes...');

    // Get sync queue
    const queue = await storageService.getSyncQueue();
    console.log(`Found ${queue.length} items in sync queue`);

    for (const item of queue) {
      try {
        await this.processSyncQueueItem(item);
        await storageService.removeSyncQueueItem(item.id);

        if (item.entityType === 'patient') {
          result.patientsSynced++;
        } else if (item.entityType === 'encounter') {
          result.encountersSynced++;
        }
      } catch (error: any) {
        console.error(`Failed to sync ${item.entityType} ${item.entityId}:`, error);
        result.errors.push(`${item.entityType} ${item.entityId}: ${error.message}`);
      }
    }
  }

  /**
   * Process a single sync queue item
   */
  private async processSyncQueueItem(item: SyncQueueItem): Promise<void> {
    switch (item.entityType) {
      case 'patient':
        await this.syncPatient(item);
        break;
      case 'encounter':
        await this.syncEncounter(item);
        break;
      default:
        throw new Error(`Unknown entity type: ${item.entityType}`);
    }
  }

  /**
   * Sync a patient to Firebase
   */
  private async syncPatient(item: SyncQueueItem): Promise<void> {
    const patient = await storageService.getPatient(item.entityId);
    if (!patient) {
      console.warn(`Patient ${item.entityId} not found in local storage`);
      return;
    }

    switch (item.operation) {
      case SyncOperation.CREATE:
      case SyncOperation.UPDATE:
        await firestoreService.savePatient(patient);
        // Update local sync status
        await storageService.savePatient({
          ...patient,
          syncStatus: SyncStatus.SYNCED,
          lastSyncedAt: new Date(),
        });
        console.log(`✅ Patient ${patient.upi} synced to Firebase`);
        break;

      case SyncOperation.DELETE:
        await firestoreService.deletePatient(patient.id);
        console.log(`✅ Patient ${patient.upi} deleted from Firebase`);
        break;
    }
  }

  /**
   * Sync an encounter to Firebase
   */
  private async syncEncounter(item: SyncQueueItem): Promise<void> {
    const encounter = await storageService.getEncounter(item.entityId);
    if (!encounter) {
      console.warn(`Encounter ${item.entityId} not found in local storage`);
      return;
    }

    switch (item.operation) {
      case SyncOperation.CREATE:
      case SyncOperation.UPDATE:
        await firestoreService.saveEncounter(encounter);
        // Update local sync status
        await storageService.saveEncounter({
          ...encounter,
          syncStatus: SyncStatus.SYNCED,
          lastSyncedAt: new Date(),
        });
        console.log(`✅ Encounter ${encounter.id} synced to Firebase`);
        break;

      case SyncOperation.DELETE:
        await firestoreService.deleteEncounter(encounter.id);
        console.log(`✅ Encounter ${encounter.id} deleted from Firebase`);
        break;
    }
  }

  /**
   * Pull remote changes from Firebase
   */
  private async pullRemoteChanges(userId: string, result: SyncResult): Promise<void> {
    console.log('📥 Pulling remote changes...');

    try {
      // Get last sync timestamp
      const lastSync = await storageService.getLastSyncTime();
      console.log('Last sync:', lastSync);

      // Fetch updated patients
      const remotePatients = await firestoreService.getPatients(
        lastSync ? { updatedAfter: lastSync } : undefined
      );
      console.log(`Found ${remotePatients.length} updated patients`);

      for (const remotePatient of remotePatients) {
        const localPatient = await storageService.getPatient(remotePatient.id);

        if (!localPatient) {
          // New patient from server
          await storageService.savePatient({
            ...remotePatient,
            syncStatus: SyncStatus.SYNCED,
            lastSyncedAt: new Date(),
          });
          result.patientsSynced++;
          console.log(`📥 New patient ${remotePatient.upi} pulled from server`);
        } else if (localPatient.syncStatus === SyncStatus.SYNCED) {
          // Update if local is synced (server wins)
          const resolved = this.resolvePatientConflict(localPatient, remotePatient);
          await storageService.savePatient(resolved);
          result.patientsSynced++;
        } else {
          // Local has pending changes, don't overwrite
          console.log(`⚠️ Skipping patient ${remotePatient.upi} - local changes pending`);
        }
      }

      // Fetch updated encounters
      const remoteEncounters = await firestoreService.getEncounters(
        lastSync ? { updatedAfter: lastSync } : undefined
      );
      console.log(`Found ${remoteEncounters.length} updated encounters`);

      for (const remoteEncounter of remoteEncounters) {
        const localEncounter = await storageService.getEncounter(remoteEncounter.id);

        if (!localEncounter) {
          // New encounter from server
          await storageService.saveEncounter({
            ...remoteEncounter,
            syncStatus: SyncStatus.SYNCED,
            lastSyncedAt: new Date(),
          });
          result.encountersSynced++;
          console.log(`📥 New encounter ${remoteEncounter.id} pulled from server`);
        } else if (localEncounter.syncStatus === SyncStatus.SYNCED) {
          // Update if local is synced (server wins)
          const resolved = this.resolveEncounterConflict(localEncounter, remoteEncounter);
          await storageService.saveEncounter(resolved);
          result.encountersSynced++;
        } else {
          // Local has pending changes, don't overwrite
          console.log(`⚠️ Skipping encounter ${remoteEncounter.id} - local changes pending`);
        }
      }

      // Update last sync time
      await storageService.setLastSyncTime(new Date());
    } catch (error) {
      console.error('❌ Failed to pull remote changes:', error);
      throw error;
    }
  }

  /**
   * Resolve patient conflict (server wins if local is synced)
   */
  private resolvePatientConflict(local: Patient, remote: Patient): Patient {
    // If local has pending changes, keep local
    if (local.syncStatus === SyncStatus.PENDING) {
      console.log(`⚠️ Keeping local changes for patient ${local.upi} (pending sync)`);
      return local;
    }

    // Otherwise, use remote (server wins)
    console.log(`📥 Using remote version for patient ${remote.upi}`);
    return {
      ...remote,
      syncStatus: SyncStatus.SYNCED,
      lastSyncedAt: new Date(),
    };
  }

  /**
   * Resolve encounter conflict (server wins if local is synced)
   */
  private resolveEncounterConflict(local: Encounter, remote: Encounter): Encounter {
    // If local has pending changes, keep local
    if (local.syncStatus === SyncStatus.PENDING) {
      console.log(`⚠️ Keeping local changes for encounter ${local.id} (pending sync)`);
      return local;
    }

    // Otherwise, use remote (server wins)
    console.log(`📥 Using remote version for encounter ${remote.id}`);
    return {
      ...remote,
      syncStatus: SyncStatus.SYNCED,
      lastSyncedAt: new Date(),
    };
  }

  /**
   * Get sync status
   */
  async getSyncStatus(): Promise<{
    pendingPatients: number;
    pendingEncounters: number;
    lastSyncTime: Date | null;
    isOnline: boolean;
  }> {
    // Rebuild sync queue from pending items (in case they were created before queue logic)
    await this.rebuildSyncQueue();

    const patients = await storageService.getAllPatients();
    const encounters = await storageService.getAllEncounters();
    const lastSyncTime = await storageService.getLastSyncTime();
    const isOnline = await this.isOnline();

    return {
      pendingPatients: patients.filter((p) => p.syncStatus === SyncStatus.PENDING).length,
      pendingEncounters: encounters.filter((e) => e.syncStatus === SyncStatus.PENDING).length,
      lastSyncTime,
      isOnline,
    };
  }

  /**
   * Rebuild sync queue from pending items
   * Useful for fixing items that were created before sync queue logic
   */
  private async rebuildSyncQueue(): Promise<void> {
    const patients = await storageService.getAllPatients();
    const encounters = await storageService.getAllEncounters();
    const queue = await storageService.getSyncQueue();

    // Get IDs already in queue
    const queuedIds = new Set(queue.map(item => item.entityId));

    // Add pending patients not in queue
    for (const patient of patients) {
      if (patient.syncStatus === SyncStatus.PENDING && !queuedIds.has(patient.id)) {
        await storageService.addToSyncQueue({
          id: `patient_${patient.id}`,
          entityType: 'patient',
          entityId: patient.id,
          operation: 'create',
          data: patient,
          status: SyncStatus.PENDING,
          createdAt: new Date(),
          attemptCount: 0,
        });
        console.log(`📝 Added patient ${patient.id} to sync queue`);
      }
    }

    // Add pending encounters not in queue
    for (const encounter of encounters) {
      if (encounter.syncStatus === SyncStatus.PENDING && !queuedIds.has(encounter.id)) {
        await storageService.addToSyncQueue({
          id: `encounter_${encounter.id}`,
          entityType: 'encounter',
          entityId: encounter.id,
          operation: 'create',
          data: encounter,
          status: SyncStatus.PENDING,
          createdAt: new Date(),
          attemptCount: 0,
        });
        console.log(`📝 Added encounter ${encounter.id} to sync queue`);
      }
    }
  }
}

export const syncService = new SyncService();
