/**
 * Bulk Onboarding Screen
 * CSV import feature for bulk patient registration (Coming Soon)
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function BulkOnboardingScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Bulk Onboarding</Text>
        <Text style={styles.subtitle}>Import patients from CSV file</Text>
      </View>

      {/* Coming Soon Card */}
      <View style={styles.comingSoonCard}>
        <Text style={styles.comingSoonIcon}>🚧</Text>
        <Text style={styles.comingSoonTitle}>Feature Coming Soon</Text>
        <Text style={styles.comingSoonText}>
          Bulk patient onboarding via CSV file import will be available in a future update.
        </Text>
      </View>

      {/* Feature Info */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Planned Features</Text>
        <Text style={styles.infoText}>
          • Upload CSV file with patient data{'\n'}
          • Automatic UPI generation{'\n'}
          • Data validation and error checking{'\n'}
          • Bulk patient registration{'\n'}
          • Progress tracking{'\n'}
          • Error reporting and corrections
        </Text>
      </View>

      {/* CSV Format Info */}
      <View style={styles.formatCard}>
        <Text style={styles.formatTitle}>Expected CSV Format</Text>
        <Text style={styles.formatText}>
          firstName, lastName, dateOfBirth, sex, barangay, purok, phoneNumber
        </Text>
        <Text style={styles.formatExample}>
          Example:{'\n'}
          Juan, Dela Cruz, 1990-05-15, Male, Napo, 1, 09171234567
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#1565C0',
    padding: 20,
    paddingVertical:40
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  comingSoonCard: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginTop: -20,
    marginBottom: 15,
    padding: 30,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  comingSoonIcon: {
    fontSize: 60,
    marginBottom: 15,
  },
  comingSoonTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  comingSoonText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  infoCard: {
    backgroundColor: '#E3F2FD',
    marginHorizontal: 15,
    marginBottom: 15,
    padding: 20,
    borderRadius: 10,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1565C0',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 22,
  },
  formatCard: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginBottom: 20,
    padding: 20,
    borderRadius: 10,
  },
  formatTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  formatText: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#666',
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  formatExample: {
    fontSize: 12,
    color: '#666',
    lineHeight: 20,
  },
});
