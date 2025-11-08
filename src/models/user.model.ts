/**
 * User Model Definitions
 * BHW, CVIF, and PHILOS user types
 */

import { UserRole, BaseEntity } from './base.types';

// Base User Interface
export interface BaseUser extends BaseEntity {
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  isActive: boolean;
  lastLoginAt?: Date;
}

// Barangay Health Worker
export interface BHW extends BaseUser {
  role: UserRole.BHW;
  barangay: string;
  purok?: string;
  pin: string; // 6-digit PIN for quick authentication
  assignedBy?: string; // CVIF user ID who registered this BHW
  totalPatientsRegistered: number;
  totalEncountersRecorded: number;
}

// CVIF Student
export interface CVIFStudent extends BaseUser {
  role: UserRole.CVIF;
  studentId: string;
  course?: string;
  yearLevel?: string;
  totalBHWsManaged: number;
}

// PHILOS Coordinator (Web-only)
export interface PHILOSCoordinator extends BaseUser {
  role: UserRole.PHILOS;
  organization: string;
  position: string;
  permissions: string[]; // Array of permission keys
}

// Union type for all user types
export type User = BHW | CVIFStudent | PHILOSCoordinator;

// Type guard functions
export function isBHW(user: User): user is BHW {
  return user.role === UserRole.BHW;
}

export function isCVIF(user: User): user is CVIFStudent {
  return user.role === UserRole.CVIF;
}

export function isPHILOS(user: User): user is PHILOSCoordinator {
  return user.role === UserRole.PHILOS;
}
