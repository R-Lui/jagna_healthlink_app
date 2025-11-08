/**
 * Patient Utility Functions
 */

import { Patient, PatientInput, Sex } from '../models';

/**
 * Generate Unique Patient Identifier (UPI)
 * Format: JAG-BBB-YYYY-NNNN
 * Example: JAG-POB-2025-0001
 */
export function generateUPI(
  barangay: string,
  sequenceNumber: number,
  year: number = new Date().getFullYear()
): string {
  // Get barangay code (first 3 letters, uppercase)
  const barangayCode = barangay.substring(0, 3).toUpperCase();
  
  // Pad sequence number to 4 digits
  const paddedSequence = sequenceNumber.toString().padStart(4, '0');
  
  return `JAG-${barangayCode}-${year}-${paddedSequence}`;
}

/**
 * Calculate age from date of birth
 */
export function calculateAge(dateOfBirth: Date): number {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

/**
 * Get patient full name
 */
export function getPatientFullName(patient: Patient): string {
  const parts = [
    patient.firstName,
    patient.middleName,
    patient.lastName,
  ].filter(Boolean);
  
  return parts.join(' ');
}

/**
 * Get patient initials
 */
export function getPatientInitials(patient: Patient): string {
  const firstInitial = patient.firstName.charAt(0);
  const lastInitial = patient.lastName.charAt(0);
  return `${firstInitial}${lastInitial}`.toUpperCase();
}

/**
 * Format patient address
 */
export function formatPatientAddress(patient: Patient): string {
  const parts = [
    patient.streetAddress,
    patient.purok,
    `Barangay ${patient.barangay}`,
    'Jagna, Bohol',
  ].filter(Boolean);
  
  return parts.join(', ');
}

/**
 * Validate patient input
 */
export function validatePatientInput(input: PatientInput): string[] {
  const errors: string[] = [];
  
  if (!input.firstName?.trim()) {
    errors.push('First name is required');
  }
  
  if (!input.lastName?.trim()) {
    errors.push('Last name is required');
  }
  
  if (!input.dateOfBirth) {
    errors.push('Date of birth is required');
  } else {
    const age = calculateAge(input.dateOfBirth);
    if (age < 0) {
      errors.push('Date of birth cannot be in the future');
    }
    if (age > 120) {
      errors.push('Invalid date of birth');
    }
  }
  
  if (!input.sex) {
    errors.push('Sex is required');
  }
  
  if (!input.barangay?.trim()) {
    errors.push('Barangay is required');
  }
  
  if (input.phoneNumber && !/^[0-9+\-\s()]*$/.test(input.phoneNumber)) {
    errors.push('Invalid phone number format');
  }
  
  return errors;
}

/**
 * Search patients by name or UPI
 */
export function searchPatients(patients: Patient[], query: string): Patient[] {
  const lowercaseQuery = query.toLowerCase().trim();
  
  if (!lowercaseQuery) {
    return patients;
  }
  
  return patients.filter(patient => {
    const fullName = getPatientFullName(patient).toLowerCase();
    const upi = patient.upi.toLowerCase();
    
    return fullName.includes(lowercaseQuery) || upi.includes(lowercaseQuery);
  });
}

/**
 * Sort patients by various criteria
 */
export function sortPatients(
  patients: Patient[],
  sortBy: 'name' | 'upi' | 'date' | 'risk' = 'name',
  order: 'asc' | 'desc' = 'asc'
): Patient[] {
  const sorted = [...patients].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'name':
        const nameA = getPatientFullName(a);
        const nameB = getPatientFullName(b);
        comparison = nameA.localeCompare(nameB);
        break;
        
      case 'upi':
        comparison = a.upi.localeCompare(b.upi);
        break;
        
      case 'date':
        comparison = new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime();
        break;
        
      case 'risk':
        comparison = (b.isHighRisk ? 1 : 0) - (a.isHighRisk ? 1 : 0);
        break;
    }
    
    return order === 'asc' ? comparison : -comparison;
  });
  
  return sorted;
}
