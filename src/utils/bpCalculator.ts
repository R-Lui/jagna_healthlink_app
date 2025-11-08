/**
 * Blood Pressure Calculator Utility
 * Calculate BP category based on AHA guidelines
 */

export type BPCategory =
  | 'Normal'
  | 'Elevated'
  | 'High Blood Pressure (Stage 1)'
  | 'High Blood Pressure (Stage 2)'
  | 'Hypertensive Crisis';

/**
 * Calculate blood pressure category
 * Based on American Heart Association (AHA) guidelines
 */
export function getBPCategory(systolic: number, diastolic: number): BPCategory {
  // Hypertensive Crisis: Systolic > 180 OR Diastolic > 120
  if (systolic > 180 || diastolic > 120) {
    return 'Hypertensive Crisis';
  }

  // High Blood Pressure Stage 2: Systolic ≥ 140 OR Diastolic ≥ 90
  if (systolic >= 140 || diastolic >= 90) {
    return 'High Blood Pressure (Stage 2)';
  }

  // High Blood Pressure Stage 1: Systolic 130-139 OR Diastolic 80-89
  if ((systolic >= 130 && systolic <= 139) || (diastolic >= 80 && diastolic <= 89)) {
    return 'High Blood Pressure (Stage 1)';
  }

  // Elevated: Systolic 120-129 AND Diastolic < 80
  if (systolic >= 120 && systolic <= 129 && diastolic < 80) {
    return 'Elevated';
  }

  // Normal: Systolic < 120 AND Diastolic < 80
  return 'Normal';
}

/**
 * Get BP category color
 */
export function getBPCategoryColor(category: BPCategory): string {
  switch (category) {
    case 'Normal':
      return '#4CAF50';
    case 'Elevated':
      return '#FF9800';
    case 'High Blood Pressure (Stage 1)':
      return '#FF5722';
    case 'High Blood Pressure (Stage 2)':
      return '#F44336';
    case 'Hypertensive Crisis':
      return '#B71C1C';
    default:
      return '#999';
  }
}

/**
 * Get BP category description
 */
export function getBPCategoryDescription(category: BPCategory): string {
  switch (category) {
    case 'Normal':
      return 'Blood pressure is in healthy range. Maintain healthy lifestyle.';
    case 'Elevated':
      return 'Higher than normal. May develop high BP without action.';
    case 'High Blood Pressure (Stage 1)':
      return 'Medical attention recommended. Lifestyle changes needed.';
    case 'High Blood Pressure (Stage 2)':
      return 'Medical attention needed. May require medication.';
    case 'Hypertensive Crisis':
      return 'EMERGENCY! Seek immediate medical care.';
    default:
      return '';
  }
}

/**
 * Validate BP readings
 */
export function validateBPReading(systolic: number, diastolic: number): {
  valid: boolean;
  error?: string;
} {
  if (systolic < 70 || systolic > 250) {
    return { valid: false, error: 'Systolic BP must be between 70 and 250' };
  }

  if (diastolic < 40 || diastolic > 150) {
    return { valid: false, error: 'Diastolic BP must be between 40 and 150' };
  }

  if (diastolic >= systolic) {
    return { valid: false, error: 'Diastolic BP must be lower than Systolic BP' };
  }

  return { valid: true };
}
