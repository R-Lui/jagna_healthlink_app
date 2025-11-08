/**
 * Date Utility Functions
 */

import { format, parseISO, formatDistanceToNow, isValid, differenceInYears } from 'date-fns';
import { DATE_FORMATS } from './constants';

/**
 * Format date for display
 */
export function formatDate(date: Date | string, formatString: string = DATE_FORMATS.DISPLAY): string {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return isValid(dateObj) ? format(dateObj, formatString) : 'Invalid Date';
  } catch (error) {
    return 'Invalid Date';
  }
}

/**
 * Format date with time
 */
export function formatDateTime(date: Date | string): string {
  return formatDate(date, DATE_FORMATS.DISPLAY_WITH_TIME);
}

/**
 * Format date as short format
 */
export function formatShortDate(date: Date | string): string {
  return formatDate(date, DATE_FORMATS.SHORT);
}

/**
 * Get relative time (e.g., "2 days ago")
 */
export function getRelativeTime(date: Date | string): string {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return isValid(dateObj) ? formatDistanceToNow(dateObj, { addSuffix: true }) : 'Invalid Date';
  } catch (error) {
    return 'Invalid Date';
  }
}

/**
 * Check if date is today
 */
export function isToday(date: Date | string): boolean {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    const today = new Date();
    
    return (
      dateObj.getDate() === today.getDate() &&
      dateObj.getMonth() === today.getMonth() &&
      dateObj.getFullYear() === today.getFullYear()
    );
  } catch (error) {
    return false;
  }
}

/**
 * Calculate age from date of birth
 */
export function calculateAgeFromDate(dateOfBirth: Date | string): number {
  try {
    const birthDate = typeof dateOfBirth === 'string' ? parseISO(dateOfBirth) : dateOfBirth;
    return differenceInYears(new Date(), birthDate);
  } catch (error) {
    return 0;
  }
}

/**
 * Parse date string to Date object
 */
export function parseDate(dateString: string): Date | null {
  try {
    const parsed = parseISO(dateString);
    return isValid(parsed) ? parsed : null;
  } catch (error) {
    return null;
  }
}

/**
 * Convert Firestore timestamp to Date
 */
export function firestoreTimestampToDate(timestamp: { seconds: number; nanoseconds: number }): Date {
  return new Date(timestamp.seconds * 1000);
}

/**
 * Convert Date to Firestore timestamp format
 */
export function dateToFirestoreTimestamp(date: Date): { seconds: number; nanoseconds: number } {
  return {
    seconds: Math.floor(date.getTime() / 1000),
    nanoseconds: 0,
  };
}

/**
 * Get start of day
 */
export function getStartOfDay(date: Date = new Date()): Date {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
}

/**
 * Get end of day
 */
export function getEndOfDay(date: Date = new Date()): Date {
  const newDate = new Date(date);
  newDate.setHours(23, 59, 59, 999);
  return newDate;
}

/**
 * Check if date is in the past
 */
export function isInThePast(date: Date | string): boolean {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return dateObj.getTime() < new Date().getTime();
  } catch (error) {
    return false;
  }
}

/**
 * Check if date is in the future
 */
export function isInTheFuture(date: Date | string): boolean {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return dateObj.getTime() > new Date().getTime();
  } catch (error) {
    return false;
  }
}

/**
 * Add days to date
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Subtract days from date
 */
export function subtractDays(date: Date, days: number): Date {
  return addDays(date, -days);
}
