/**
 * Patient List Item Component
 * Displays individual patient in the list
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Patient } from '../../models';
import { calculateAge } from '../../utils/helpers';

interface PatientListItemProps {
  patient: Patient;
  onPress: (patient: Patient) => void;
}

export default function PatientListItem({ patient, onPress }: PatientListItemProps) {
  const age = calculateAge(patient.dateOfBirth);

  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(patient)}>
      <View style={styles.header}>
        <Text style={styles.name}>
          {patient.lastName}, {patient.firstName} {patient.middleName || ''}
        </Text>
        <View style={[styles.badge, patient.sex === 'Male' ? styles.badgeMale : styles.badgeFemale]}>
          <Text style={styles.badgeText}>{patient.sex === 'Male' ? 'M' : 'F'}</Text>
        </View>
      </View>

      <View style={styles.details}>
        <Text style={styles.detailText}>UPI: {patient.upi}</Text>
        <Text style={styles.detailText}>Age: {age} years old</Text>
        <Text style={styles.detailText}>Contact: {patient.phoneNumber || 'N/A'}</Text>
      </View>

      <View style={styles.location}>
        <Text style={styles.locationText}>
          📍 {patient.purok ? `Purok ${patient.purok}, ` : ''}{patient.barangay}
        </Text>
      </View>

      {patient.lastEncounterDate && (
        <Text style={styles.lastVisit}>
          Last visit: {new Date(patient.lastEncounterDate).toLocaleDateString()}
        </Text>
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
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  badge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeMale: {
    backgroundColor: '#2196F3',
  },
  badgeFemale: {
    backgroundColor: '#E91E63',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  details: {
    marginBottom: 5,
  },
  detailText: {
    fontSize: 13,
    color: '#666',
    marginBottom: 2,
  },
  location: {
    marginTop: 5,
  },
  locationText: {
    fontSize: 12,
    color: '#999',
  },
  lastVisit: {
    fontSize: 11,
    color: '#2E7D32',
    marginTop: 5,
    fontStyle: 'italic',
  },
});
