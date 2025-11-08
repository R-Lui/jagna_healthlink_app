/**
 * BP Category Display Component
 * Shows BP category with color and description
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BPCategory } from '../../utils/bpCalculator';
import { getBPCategoryColor, getBPCategoryDescription } from '../../utils/bpCalculator';

interface BPCategoryDisplayProps {
  category: BPCategory;
  systolic: number;
  diastolic: number;
}

export default function BPCategoryDisplay({
  category,
  systolic,
  diastolic,
}: BPCategoryDisplayProps) {
  const color = getBPCategoryColor(category);
  const description = getBPCategoryDescription(category);

  const getIcon = () => {
    switch (category) {
      case 'Normal':
        return '✅';
      case 'Elevated':
        return '⚠️';
      case 'High Blood Pressure (Stage 1)':
      case 'High Blood Pressure (Stage 2)':
        return '🔴';
      case 'Hypertensive Crisis':
        return '🚨';
      default:
        return '📊';
    }
  };

  return (
    <View style={[styles.container, { borderLeftColor: color }]}>
      <View style={styles.header}>
        <Text style={styles.icon}>{getIcon()}</Text>
        <View style={styles.headerText}>
          <Text style={styles.reading}>
            {systolic}/{diastolic} mmHg
          </Text>
          <View style={[styles.badge, { backgroundColor: color }]}>
            <Text style={styles.badgeText}>{category.toUpperCase()}</Text>
          </View>
        </View>
      </View>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    fontSize: 32,
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  reading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 11,
    color: '#fff',
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});
