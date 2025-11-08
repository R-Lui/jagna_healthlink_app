/**
 * Patient Model Definition
 * Represents a patient in the system with UPI
 */

import { Sex, BaseEntity } from './base.types';

export interface Patient extends BaseEntity {
  // Unique Patient Identifier (UPI)
  upi: string; // Format: JAG-BBB-YYYY-NNNN
  
  // Personal Information
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth: Date;
  age: number; // Calculated from dateOfBirth
  sex: Sex;
  
  // Contact Information
  phoneNumber?: string;
  
  // Address
  barangay: string;
  purok?: string;
  streetAddress?: string;
  
  // Registration Info
  registeredBy: string; // BHW user ID
  registrationDate: Date;
  
  // Health Status
  isHighRisk: boolean;
  lastEncounterDate?: Date;
  totalEncounters: number;
  
  // Latest BP Reading (for quick access)
  latestSystolic?: number;
  latestDiastolic?: number;
  latestBPCategory?: string;
  
  // Notes
  notes?: string;
}

// Patient creation input (without auto-generated fields)
export interface PatientInput {
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth: Date;
  sex: Sex;
  phoneNumber?: string;
  barangay: string;
  purok?: string;
  streetAddress?: string;
  notes?: string;
}
