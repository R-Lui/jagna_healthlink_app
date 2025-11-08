/**
 * Encounter List Item Component
 * Displays individual encounter in patient history
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Encounter } from '../../models';
import { formatDate, formatTime } from '../../utils/helpers';
import { getBPCategory } from '../../utils/bpCalculator';

interface EncounterListItemProps {
  encounter: Encounter;
  onPress?: (encounter: Encounter) => void;
}

export default function EncounterListItem({ encounter, onPress }: EncounterListItemProps) {
  const category = getBPCategory(encounter.systolic, encounter.diastolic);

  const getCategoryColor = () => {
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
  };

  const getCategoryIcon = () => {
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

  const handlePress = () => {
    if (onPress) {
      onPress(encounter);
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      disabled={!onPress}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.date}>{formatDate(encounter.encounterDate)}</Text>
          <Text style={styles.time}>{formatTime(encounter.encounterDate)}</Text>
        </View>
        <Text style={styles.icon}>{getCategoryIcon()}</Text>
      </View>

      <View style={styles.bpContainer}>
        <View style={styles.bpReading}>
          <Text style={styles.bpValue}>
            {encounter.systolic}/{encounter.diastolic}
          </Text>
          <Text style={styles.bpLabel}>mmHg</Text>
        </View>
        <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor() }]}>
          <Text style={styles.categoryText}>{category}</Text>
        </View>
      </View>

      {encounter.notes && (
        <Text style={styles.notes} numberOfLines={2}>
          Notes: {encounter.notes}
        </Text>
      )}

      {encounter.recordedBy && (
        <Text style={styles.footer}>Recorded by BHW</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 15,
    marginHorizontal: 15,
    marginVertical: 5,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  date: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  time: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  icon: {
    fontSize: 24,
  },
  bpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  bpReading: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  bpValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  bpLabel: {
    fontSize: 14,
    color: '#999',
    marginLeft: 5,
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 11,
    color: '#fff',
    fontWeight: 'bold',
  },
  notes: {
    fontSize: 13,
    color: '#666',
    marginTop: 5,
    fontStyle: 'italic',
  },
  footer: {
    fontSize: 11,
    color: '#999',
    marginTop: 10,
  },
});
