/**
 * Base Type Definitions
 * Shared enums and types used across all models
 */

// User Roles
export enum UserRole {
  BHW = 'BHW',
  CVIF = 'CVIF',
  PHILOS = 'PHILOS',
}

// Patient Demographics
export enum Sex {
  MALE = 'Male',
  FEMALE = 'Female',
}

// Data Sync Status
export enum SyncStatus {
  PENDING = 'pending',
  SYNCED = 'synced',
  ERROR = 'error',
}

// Blood Pressure Categories (AHA Guidelines)
export enum BPCategory {
  NORMAL = 'Normal',
  ELEVATED = 'Elevated',
  HYPERTENSION_STAGE_1 = 'Hypertension Stage 1',
  HYPERTENSION_STAGE_2 = 'Hypertension Stage 2',
  HYPERTENSIVE_CRISIS = 'Hypertensive Crisis',
}

// Base entity interface
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string; // User ID who created the record
  syncStatus: SyncStatus;
  lastSyncedAt?: Date;
}

// Timestamp interface for Firestore
export interface FirestoreTimestamp {
  seconds: number;
  nanoseconds: number;
}
