/**
 * BHW List Item Component
 * Displays individual BHW in the list
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BHW } from '../../models';

interface BHWListItemProps {
  bhw: BHW;
  onPress: (bhw: BHW) => void;
}

export default function BHWListItem({ bhw, onPress }: BHWListItemProps) {
  const isActive = bhw.isActive !== false;
  const fullName = `${bhw.firstName} ${bhw.lastName}`;

  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(bhw)}>
      <View style={styles.header}>
        <View style={styles.nameContainer}>
          <Text style={styles.name}>{fullName}</Text>
          <View style={[styles.statusBadge, isActive ? styles.statusActive : styles.statusInactive]}>
            <Text style={styles.statusText}>{isActive ? 'ACTIVE' : 'INACTIVE'}</Text>
          </View>
        </View>
      </View>

      <View style={styles.details}>
        <Text style={styles.detailText}>📍 {bhw.barangay}</Text>
        {bhw.purok && (
          <Text style={styles.detailText}>• Purok {bhw.purok}</Text>
        )}
      </View>

      {bhw.email && (
        <Text style={styles.email}>{bhw.email}</Text>
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
    marginBottom: 8,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusActive: {
    backgroundColor: '#4CAF50',
  },
  statusInactive: {
    backgroundColor: '#999',
  },
  statusText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  detailText: {
    fontSize: 13,
    color: '#666',
    marginRight: 10,
  },
  email: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
});
