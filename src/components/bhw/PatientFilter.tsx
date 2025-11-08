/**
 * Patient Filter Component
 * Filter patients by purok
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

interface PatientFilterProps {
  selectedPurok: string | null;
  onSelectPurok: (purok: string | null) => void;
  puroks: string[];
}

export default function PatientFilter({
  selectedPurok,
  onSelectPurok,
  puroks,
}: PatientFilterProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Filter by Purok:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity
          style={[styles.filterButton, selectedPurok === null && styles.filterButtonActive]}
          onPress={() => onSelectPurok(null)}
        >
          <Text style={[styles.filterText, selectedPurok === null && styles.filterTextActive]}>
            All
          </Text>
        </TouchableOpacity>
        {puroks.map((purok) => (
          <TouchableOpacity
            key={purok}
            style={[styles.filterButton, selectedPurok === purok && styles.filterButtonActive]}
            onPress={() => onSelectPurok(purok)}
          >
            <Text style={[styles.filterText, selectedPurok === purok && styles.filterTextActive]}>
              Purok {purok}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    backgroundColor: '#f5f5f5',
  },
  label: {
    fontSize: 12,
    color: '#666',
    marginLeft: 15,
    marginBottom: 8,
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: 15,
  },
  filterButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  filterButtonActive: {
    backgroundColor: '#2E7D32',
    borderColor: '#2E7D32',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#fff',
  },
});
