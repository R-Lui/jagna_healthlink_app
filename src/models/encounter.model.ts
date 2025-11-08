/**
 * Encounter Model Definition
 * Represents a blood pressure reading encounter
 */

import { BPCategory, BaseEntity } from './base.types';

export interface Encounter extends BaseEntity {
  // Patient Reference
  patientId: string;
  patientUPI: string; // Denormalized for easier querying
  
  // Encounter Details
  encounterDate: Date;
  recordedBy: string; // BHW user ID
  
  // Blood Pressure Reading
  systolic: number; // mmHg
  diastolic: number; // mmHg
  bpCategory: BPCategory; // Calculated from BP values
  
  // Additional Vitals (optional)
  heartRate?: number; // beats per minute
  temperature?: number; // Celsius
  weight?: number; // kg
  
  // Clinical Notes
  symptoms?: string[];
  notes?: string;
  
  // Follow-up
  requiresFollowUp: boolean;
  followUpDate?: Date;
  followUpNotes?: string;
}

// Encounter creation input
export interface EncounterInput {
  patientId: string;
  systolic: number;
  diastolic: number;
  heartRate?: number;
  temperature?: number;
  weight?: number;
  symptoms?: string[];
  notes?: string;
  requiresFollowUp: boolean;
  followUpDate?: Date;
  followUpNotes?: string;
}

// Encounter statistics
export interface EncounterStats {
  totalEncounters: number;
  normalCount: number;
  elevatedCount: number;
  hypertensionStage1Count: number;
  hypertensionStage2Count: number;
  hypertensiveCrisisCount: number;
  averageSystolic: number;
  averageDiastolic: number;
  lastEncounterDate?: Date;
}
