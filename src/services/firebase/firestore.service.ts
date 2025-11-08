/**
 * Firestore Service
 * Handles all Firestore database operations
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  QueryConstraint,
  Timestamp,
} from 'firebase/firestore';
import { getFirebaseFirestore } from './firebase.init';
import { Patient, Encounter, User } from '../../models';

class FirestoreService {
  private db = getFirebaseFirestore();

  // ==================== COLLECTION REFERENCES ====================

  private get usersCollection() {
    return collection(this.db, 'users');
  }

  private get patientsCollection() {
    return collection(this.db, 'patients');
  }

  private get encountersCollection() {
    return collection(this.db, 'encounters');
  }

  // ==================== USER OPERATIONS ====================

  async saveUser(user: User): Promise<void> {
    try {
      const userRef = doc(this.usersCollection, user.id);
      await setDoc(userRef, this.serializeData(user));
      console.log('✅ User saved to Firestore:', user.id);
    } catch (error) {
      console.error('❌ Error saving user:', error);
      throw error;
    }
  }

  async getUser(userId: string): Promise<User | null> {
    try {
      const userRef = doc(this.usersCollection, userId);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        return this.deserializeData(userDoc.data()) as User;
      }
      return null;
    } catch (error) {
      console.error('❌ Error getting user:', error);
      throw error;
    }
  }

  async updateUser(userId: string, data: Partial<User>): Promise<void> {
    try {
      const userRef = doc(this.usersCollection, userId);
      await updateDoc(userRef, this.serializeData(data));
      console.log('✅ User updated:', userId);
    } catch (error) {
      console.error('❌ Error updating user:', error);
      throw error;
    }
  }

  async getUsers(filters?: { role?: string }): Promise<User[]> {
    try {
      const constraints: QueryConstraint[] = [];

      if (filters?.role) {
        constraints.push(where('role', '==', filters.role));
      }

      const q = constraints.length > 0
        ? query(this.usersCollection, ...constraints)
        : query(this.usersCollection);

      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => this.deserializeData(doc.data()) as User);
    } catch (error) {
      console.error('❌ Error getting users:', error);
      throw error;
    }
  }

  // ==================== PATIENT OPERATIONS ====================

  async savePatient(patient: Patient): Promise<void> {
    try {
      const patientRef = doc(this.patientsCollection, patient.id);
      await setDoc(patientRef, this.serializeData(patient));
      console.log('✅ Patient saved to Firestore:', patient.id);
    } catch (error) {
      console.error('❌ Error saving patient:', error);
      throw error;
    }
  }

  async getPatient(patientId: string): Promise<Patient | null> {
    try {
      const patientRef = doc(this.patientsCollection, patientId);
      const patientDoc = await getDoc(patientRef);
      if (patientDoc.exists()) {
        return this.deserializeData(patientDoc.data()) as Patient;
      }
      return null;
    } catch (error) {
      console.error('❌ Error getting patient:', error);
      throw error;
    }
  }

  async getAllPatients(barangay?: string): Promise<Patient[]> {
    try {
      let q;
      if (barangay) {
        q = query(
          this.patientsCollection,
          where('barangay', '==', barangay),
          orderBy('lastName')
        );
      } else {
        q = query(this.patientsCollection, orderBy('lastName'));
      }
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => this.deserializeData(doc.data()) as Patient);
    } catch (error) {
      console.error('❌ Error getting patients:', error);
      throw error;
    }
  }

  async updatePatient(patientId: string, data: Partial<Patient>): Promise<void> {
    try {
      const patientRef = doc(this.patientsCollection, patientId);
      await updateDoc(patientRef, this.serializeData(data));
      console.log('✅ Patient updated:', patientId);
    } catch (error) {
      console.error('❌ Error updating patient:', error);
      throw error;
    }
  }

  async deletePatient(patientId: string): Promise<void> {
    try {
      const patientRef = doc(this.patientsCollection, patientId);
      await deleteDoc(patientRef);
      console.log('✅ Patient deleted:', patientId);
    } catch (error) {
      console.error('❌ Error deleting patient:', error);
      throw error;
    }
  }

  // ==================== ENCOUNTER OPERATIONS ====================

  async saveEncounter(encounter: Encounter): Promise<void> {
    try {
      const encounterRef = doc(this.encountersCollection, encounter.id);
      await setDoc(encounterRef, this.serializeData(encounter));
      console.log('✅ Encounter saved to Firestore:', encounter.id);
    } catch (error) {
      console.error('❌ Error saving encounter:', error);
      throw error;
    }
  }

  async getEncounter(encounterId: string): Promise<Encounter | null> {
    try {
      const encounterRef = doc(this.encountersCollection, encounterId);
      const encounterDoc = await getDoc(encounterRef);
      if (encounterDoc.exists()) {
        return this.deserializeData(encounterDoc.data()) as Encounter;
      }
      return null;
    } catch (error) {
      console.error('❌ Error getting encounter:', error);
      throw error;
    }
  }

  async getPatientEncounters(patientId: string, limitCount?: number): Promise<Encounter[]> {
    try {
      const constraints: QueryConstraint[] = [
        where('patientId', '==', patientId),
        orderBy('encounterDate', 'desc')
      ];
      
      if (limitCount) {
        constraints.push(limit(limitCount));
      }
      
      const q = query(this.encountersCollection, ...constraints);
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => this.deserializeData(doc.data()) as Encounter);
    } catch (error) {
      console.error('❌ Error getting patient encounters:', error);
      throw error;
    }
  }

  async updateEncounter(encounterId: string, data: Partial<Encounter>): Promise<void> {
    try {
      const encounterRef = doc(this.encountersCollection, encounterId);
      await updateDoc(encounterRef, this.serializeData(data));
      console.log('✅ Encounter updated:', encounterId);
    } catch (error) {
      console.error('❌ Error updating encounter:', error);
      throw error;
    }
  }

  async deleteEncounter(encounterId: string): Promise<void> {
    try {
      const encounterRef = doc(this.encountersCollection, encounterId);
      await deleteDoc(encounterRef);
      console.log('✅ Encounter deleted:', encounterId);
    } catch (error) {
      console.error('❌ Error deleting encounter:', error);
      throw error;
    }
  }

  // ==================== UTILITY METHODS ====================

  /**
   * Generic method to get a document from any collection
   */
  async getDocument<T>(collectionName: string, documentId: string): Promise<T | null> {
    try {
      const docRef = doc(this.db, collectionName, documentId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return this.deserializeData(docSnap.data()) as T;
      }
      return null;
    } catch (error) {
      console.error(`❌ Error getting document from ${collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Serialize data for Firestore (convert Dates to Timestamps)
   */
  private serializeData(data: any): any {
    if (data === null || data === undefined) {
      return data;
    }

    if (data instanceof Date) {
      return Timestamp.fromDate(data);
    }

    if (Array.isArray(data)) {
      return data.map(item => this.serializeData(item));
    }

    if (typeof data === 'object') {
      const serialized: any = {};
      for (const key in data) {
        serialized[key] = this.serializeData(data[key]);
      }
      return serialized;
    }

    return data;
  }

  /**
   * Get patients with optional filters
   */
  async getPatients(filters?: { updatedAfter?: Date }): Promise<Patient[]> {
    try {
      const constraints: QueryConstraint[] = [];

      if (filters?.updatedAfter) {
        constraints.push(where('updatedAt', '>', Timestamp.fromDate(filters.updatedAfter)));
      }

      const q = constraints.length > 0 
        ? query(this.patientsCollection, ...constraints)
        : query(this.patientsCollection);

      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => this.deserializeData(doc.data()) as Patient);
    } catch (error) {
      console.error('Failed to get patients:', error);
      throw error;
    }
  }

  /**
   * Get encounters with optional filters
   */
  async getEncounters(filters?: { updatedAfter?: Date }): Promise<Encounter[]> {
    try {
      const constraints: QueryConstraint[] = [];

      if (filters?.updatedAfter) {
        constraints.push(where('updatedAt', '>', Timestamp.fromDate(filters.updatedAfter)));
      }

      const q = constraints.length > 0
        ? query(this.encountersCollection, ...constraints)
        : query(this.encountersCollection);

      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => this.deserializeData(doc.data()) as Encounter);
    } catch (error) {
      console.error('Failed to get encounters:', error);
      throw error;
    }
  }

  /**
   * Deserialize data from Firestore (convert Timestamps to Dates)
   */
  private deserializeData(data: any): any {
    if (data === null || data === undefined) {
      return data;
    }

    if (data instanceof Timestamp) {
      return data.toDate();
    }

    if (Array.isArray(data)) {
      return data.map(item => this.deserializeData(item));
    }

    if (typeof data === 'object') {
      const deserialized: any = {};
      for (const key in data) {
        deserialized[key] = this.deserializeData(data[key]);
      }
      return deserialized;
    }

    return data;
  }

  /**
   * Check Firestore connection
   */
  async testConnection(): Promise<boolean> {
    try {
      // Try to get a document (even if it doesn't exist)
      const testRef = doc(this.db, 'test', 'connection');
      await getDoc(testRef);
      console.log('✅ Firestore connection successful');
      return true;
    } catch (error) {
      console.error('❌ Firestore connection failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const firestoreService = new FirestoreService();
