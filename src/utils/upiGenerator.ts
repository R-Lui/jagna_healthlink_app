/**
 * UPI Generator
 * Generates Unique Patient Identifiers using composite format
 */

import { format } from 'date-fns';

// Barangays in Jagna
export const JAGNA_BARANGAYS = [
  'Alejawan',
  'Balili',
  'Boctol',
  'Buyog',
  'Bunga Ilaya',
  'Bunga Mar',
  'Cabungaan',
  'Calabacita',
  'Cambugason',
  'Can-ipol',
  'Canjulao',
  'Cantagay',
  'Cantuyoc',
  'Can-uba',
  'Can-upao',
  'Faraon',
  'Ipil',
  'Kinagbaan',
  'Laca',
  'Larapan',
  'Lonoy',
  'Looc',
  'Malbog',
  'Mayana',
  'Naatang',
  'Nausok',
  'Odiong',
  'Pagina',
  'Pangdan',
  'Poblacion (Pondol)',
  'Tejero',
  'Tubod Mar',
  'Tubod Monte',
];

/**
 * Generate Composite UPI
 * Format: LASTNAME[4]FIRSTNAME[1]YYYYMMDD
 * Example: Juan Dela Cruz born Jan 15, 1990 = DELAJ19900115
 * 
 * @param lastName - Patient's last name
 * @param firstName - Patient's first name
 * @param birthdate - Patient's birthdate
 * @returns UPI string
 */
export function generateCompositeUPI(
  lastName: string,
  firstName: string,
  birthdate: Date
): string {
  // Get first 4 characters of last name (uppercase, remove spaces)
  const lastNamePart = lastName
    .replace(/\s+/g, '')
    .substring(0, 4)
    .toUpperCase()
    .padEnd(4, 'X'); // Pad with X if less than 4 characters

  // Get first character of first name (uppercase)
  const firstNamePart = firstName
    .replace(/\s+/g, '')
    .substring(0, 1)
    .toUpperCase();

  // Format birthdate as YYYYMMDD
  const birthdatePart = format(birthdate, 'yyyyMMdd');

  return `${lastNamePart}${firstNamePart}${birthdatePart}`;
}

/**
 * Validate UPI format
 * @param upi - UPI string to validate
 * @returns true if valid format
 */
export function validateUPI(upi: string): boolean {
  // Format: LASTNAME[4]FIRSTNAME[1]YYYYMMDD (13 characters total)
  const upiRegex = /^[A-Z]{5}\d{8}$/;
  return upiRegex.test(upi);
}

/**
 * Parse UPI to extract components
 * @param upi - UPI string
 * @returns Object with lastName, firstName, and birthdate parts
 */
export function parseUPI(upi: string): {
  lastNamePart: string;
  firstNamePart: string;
  birthdatePart: string;
} | null {
  if (!validateUPI(upi)) {
    return null;
  }

  return {
    lastNamePart: upi.substring(0, 4),
    firstNamePart: upi.substring(4, 5),
    birthdatePart: upi.substring(5, 13),
  };
}
