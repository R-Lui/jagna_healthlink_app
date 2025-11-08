import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function PatientListScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Patient List</Text>
      <Text style={styles.placeholder}>Patient list will be implemented in Step 09</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  placeholder: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
});
