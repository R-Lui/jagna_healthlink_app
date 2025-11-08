/**
 * Encounter Utility Functions
 * BP calculations and validations
 */

import { BPCategory, Encounter, EncounterInput, EncounterStats } from '../models';
import { BP_THRESHOLDS, VALIDATION } from './constants';

/**
 * Calculate BP Category based on AHA Guidelines
 */
export function calculateBPCategory(systolic: number, diastolic: number): BPCategory {
  // Hypertensive Crisis
  if (systolic >= BP_THRESHOLDS.HYPERTENSIVE_CRISIS.systolic.min || 
      diastolic >= BP_THRESHOLDS.HYPERTENSIVE_CRISIS.diastolic.min) {
    return BPCategory.HYPERTENSIVE_CRISIS;
  }
  
  // Hypertension Stage 2
  if (systolic >= BP_THRESHOLDS.HYPERTENSION_STAGE_2.systolic.min || 
      diastolic >= BP_THRESHOLDS.HYPERTENSION_STAGE_2.diastolic.min) {
    return BPCategory.HYPERTENSION_STAGE_2;
  }
  
  // Hypertension Stage 1
  if ((systolic >= BP_THRESHOLDS.HYPERTENSION_STAGE_1.systolic.min && 
       systolic <= BP_THRESHOLDS.HYPERTENSION_STAGE_1.systolic.max) ||
      (diastolic >= BP_THRESHOLDS.HYPERTENSION_STAGE_1.diastolic.min && 
       diastolic <= BP_THRESHOLDS.HYPERTENSION_STAGE_1.diastolic.max)) {
    return BPCategory.HYPERTENSION_STAGE_1;
  }
  
  // Elevated
  if (systolic >= BP_THRESHOLDS.ELEVATED.systolic.min && 
      systolic <= BP_THRESHOLDS.ELEVATED.systolic.max && 
      diastolic < BP_THRESHOLDS.ELEVATED.diastolic.max) {
    return BPCategory.ELEVATED;
  }
  
  // Normal
  return BPCategory.NORMAL;
}

/**
 * Check if BP reading is high risk
 */
export function isHighRiskBP(systolic: number, diastolic: number): boolean {
  const category = calculateBPCategory(systolic, diastolic);
  return category === BPCategory.HYPERTENSION_STAGE_2 || 
         category === BPCategory.HYPERTENSIVE_CRISIS;
}

/**
 * Validate encounter input
 */
export function validateEncounterInput(input: EncounterInput): string[] {
  const errors: string[] = [];
  
  // Validate systolic
  if (!input.systolic) {
    errors.push('Systolic blood pressure is required');
  } else if (input.systolic < VALIDATION.MIN_SYSTOLIC || input.systolic > VALIDATION.MAX_SYSTOLIC) {
    errors.push(`Systolic must be between ${VALIDATION.MIN_SYSTOLIC} and ${VALIDATION.MAX_SYSTOLIC} mmHg`);
  }
  
  // Validate diastolic
  if (!input.diastolic) {
    errors.push('Diastolic blood pressure is required');
  } else if (input.diastolic < VALIDATION.MIN_DIASTOLIC || input.diastolic > VALIDATION.MAX_DIASTOLIC) {
    errors.push(`Diastolic must be between ${VALIDATION.MIN_DIASTOLIC} and ${VALIDATION.MAX_DIASTOLIC} mmHg`);
  }
  
  // Validate relationship between systolic and diastolic
  if (input.systolic && input.diastolic && input.diastolic >= input.systolic) {
    errors.push('Diastolic pressure must be lower than systolic pressure');
  }
  
  // Validate heart rate (optional)
  if (input.heartRate !== undefined) {
    if (input.heartRate < VALIDATION.MIN_HEART_RATE || input.heartRate > VALIDATION.MAX_HEART_RATE) {
      errors.push(`Heart rate must be between ${VALIDATION.MIN_HEART_RATE} and ${VALIDATION.MAX_HEART_RATE} bpm`);
    }
  }
  
  // Validate temperature (optional)
  if (input.temperature !== undefined) {
    if (input.temperature < VALIDATION.MIN_TEMPERATURE || input.temperature > VALIDATION.MAX_TEMPERATURE) {
      errors.push(`Temperature must be between ${VALIDATION.MIN_TEMPERATURE} and ${VALIDATION.MAX_TEMPERATURE}°C`);
    }
  }
  
  // Validate weight (optional)
  if (input.weight !== undefined) {
    if (input.weight < VALIDATION.MIN_WEIGHT || input.weight > VALIDATION.MAX_WEIGHT) {
      errors.push(`Weight must be between ${VALIDATION.MIN_WEIGHT} and ${VALIDATION.MAX_WEIGHT} kg`);
    }
  }
  
  // Validate follow-up date
  if (input.requiresFollowUp && input.followUpDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const followUp = new Date(input.followUpDate);
    followUp.setHours(0, 0, 0, 0);
    
    if (followUp < today) {
      errors.push('Follow-up date cannot be in the past');
    }
  }
  
  return errors;
}

/**
 * Format BP reading
 */
export function formatBPReading(systolic: number, diastolic: number): string {
  return `${systolic}/${diastolic} mmHg`;
}

/**
 * Get BP category color
 */
export function getBPCategoryColor(category: BPCategory): string {
  const { COLORS } = require('./constants');
  
  switch (category) {
    case BPCategory.NORMAL:
      return COLORS.bpNormal;
    case BPCategory.ELEVATED:
      return COLORS.bpElevated;
    case BPCategory.HYPERTENSION_STAGE_1:
      return COLORS.bpStage1;
    case BPCategory.HYPERTENSION_STAGE_2:
      return COLORS.bpStage2;
    case BPCategory.HYPERTENSIVE_CRISIS:
      return COLORS.bpCrisis;
    default:
      return COLORS.text;
  }
}

/**
 * Calculate encounter statistics
 */
export function calculateEncounterStats(encounters: Encounter[]): EncounterStats {
  if (encounters.length === 0) {
    return {
      totalEncounters: 0,
      normalCount: 0,
      elevatedCount: 0,
      hypertensionStage1Count: 0,
      hypertensionStage2Count: 0,
      hypertensiveCrisisCount: 0,
      averageSystolic: 0,
      averageDiastolic: 0,
    };
  }
  
  let normalCount = 0;
  let elevatedCount = 0;
  let stage1Count = 0;
  let stage2Count = 0;
  let crisisCount = 0;
  let totalSystolic = 0;
  let totalDiastolic = 0;
  let lastEncounter: Encounter | undefined;
  
  encounters.forEach(encounter => {
    // Count by category
    switch (encounter.bpCategory) {
      case BPCategory.NORMAL:
        normalCount++;
        break;
      case BPCategory.ELEVATED:
        elevatedCount++;
        break;
      case BPCategory.HYPERTENSION_STAGE_1:
        stage1Count++;
        break;
      case BPCategory.HYPERTENSION_STAGE_2:
        stage2Count++;
        break;
      case BPCategory.HYPERTENSIVE_CRISIS:
        crisisCount++;
        break;
    }
    
    // Sum for averages
    totalSystolic += encounter.systolic;
    totalDiastolic += encounter.diastolic;
    
    // Track latest encounter
    if (!lastEncounter || new Date(encounter.encounterDate) > new Date(lastEncounter.encounterDate)) {
      lastEncounter = encounter;
    }
  });
  
  return {
    totalEncounters: encounters.length,
    normalCount,
    elevatedCount,
    hypertensionStage1Count: stage1Count,
    hypertensionStage2Count: stage2Count,
    hypertensiveCrisisCount: crisisCount,
    averageSystolic: Math.round(totalSystolic / encounters.length),
    averageDiastolic: Math.round(totalDiastolic / encounters.length),
    lastEncounterDate: lastEncounter?.encounterDate,
  };
}

/**
 * Get recommended action based on BP category
 */
export function getRecommendedAction(category: BPCategory): string {
  switch (category) {
    case BPCategory.NORMAL:
      return 'Continue healthy lifestyle. Schedule annual checkup.';
    case BPCategory.ELEVATED:
      return 'Adopt healthier lifestyle. Recheck in 3-6 months.';
    case BPCategory.HYPERTENSION_STAGE_1:
      return 'Lifestyle changes recommended. Consult with healthcare provider.';
    case BPCategory.HYPERTENSION_STAGE_2:
      return 'Medical attention recommended. Consider medication and lifestyle changes.';
    case BPCategory.HYPERTENSIVE_CRISIS:
      return '⚠️ URGENT: Seek immediate medical attention!';
    default:
      return '';
  }
}
