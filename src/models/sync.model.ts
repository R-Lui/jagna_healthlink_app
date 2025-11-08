/**
 * Sync Model Definitions
 * Handles offline-first data synchronization
 */

import { SyncStatus } from './base.types';

// Sync operations enum
export enum SyncOperation {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
}

// Sync queue item
export interface SyncQueueItem {
  id: string;
  entityType: 'patient' | 'encounter' | 'user';
  entityId: string;
  operation: 'create' | 'update' | 'delete';
  data: any;
  status: SyncStatus;
  createdAt: Date;
  lastAttemptAt?: Date;
  attemptCount: number;
  errorMessage?: string;
}

// Sync statistics
export interface SyncStats {
  totalPending: number;
  totalSynced: number;
  totalErrors: number;
  lastSyncAt?: Date;
  lastSuccessfulSyncAt?: Date;
}

// Sync result
export interface SyncResult {
  success: boolean;
  syncedCount: number;
  failedCount: number;
  errors: SyncError[];
}

// Sync error
export interface SyncError {
  entityId: string;
  entityType: string;
  operation: string;
  errorMessage: string;
  timestamp: Date;
}
