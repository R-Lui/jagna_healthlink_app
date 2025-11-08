/**
 * Storage Service Interface
 * Defines the contract for local data storage
 */

import { Patient, Encounter, User, SyncQueueItem } from '../../models';

export interface IStorageService {
  // User operations
  saveUser(user: User): Promise<void>;
  getUser(userId: string): Promise<User | null>;
  getCurrentUser(): Promise<User | null>;
  clearUser(): Promise<void>;

  // Patient operations
  savePatient(patient: Patient): Promise<void>;
  getPatient(patientId: string): Promise<Patient | null>;
  getPatientByUpi(upi: string): Promise<Patient | null>;
  getAllPatients(): Promise<Patient[]>;
  searchPatients(searchTerm: string): Promise<Patient[]>;
  deletePatient(patientId: string): Promise<void>;

  // Encounter operations
  saveEncounter(encounter: Encounter): Promise<void>;
  getEncounter(encounterId: string): Promise<Encounter | null>;
  getPatientEncounters(patientId: string): Promise<Encounter[]>;
  getAllEncounters(): Promise<Encounter[]>;
  deleteEncounter(encounterId: string): Promise<void>;

  // Sync queue operations
  addToSyncQueue(item: SyncQueueItem): Promise<void>;
  getSyncQueue(): Promise<SyncQueueItem[]>;
  removeSyncQueueItem(itemId: string): Promise<void>;
  clearSyncQueue(): Promise<void>;

  // Utility operations
  clear(): Promise<void>;
  getStorageInfo(): Promise<{ patients: number; encounters: number; syncQueue: number }>;
}
