/**
 * Blood Pressure Input Component
 * Two-field input for systolic and diastolic BP
 */

import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

interface BPInputProps {
  systolicValue: string;
  diastolicValue: string;
  onSystolicChange: (value: string) => void;
  onDiastolicChange: (value: string) => void;
  error?: string;
}

export default function BPInput({
  systolicValue,
  diastolicValue,
  onSystolicChange,
  onDiastolicChange,
  error,
}: BPInputProps) {
  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>Blood Pressure Reading</Text>
        <Text style={styles.required}>*</Text>
      </View>

      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={[styles.input, error ? styles.inputError : null]}
            value={systolicValue}
            onChangeText={onSystolicChange}
            keyboardType="numeric"
            placeholder="120"
            maxLength={3}
          />
          <Text style={styles.inputLabel}>Systolic</Text>
        </View>

        <Text style={styles.separator}>/</Text>

        <View style={styles.inputWrapper}>
          <TextInput
            style={[styles.input, error ? styles.inputError : null]}
            value={diastolicValue}
            onChangeText={onDiastolicChange}
            keyboardType="numeric"
            placeholder="80"
            maxLength={3}
          />
          <Text style={styles.inputLabel}>Diastolic</Text>
        </View>

        <Text style={styles.unit}>mmHg</Text>
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <Text style={styles.hint}>
        Example: 120/80 mmHg{'\n'}
        Systolic (top number) / Diastolic (bottom number)
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  labelContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  required: {
    color: '#F44336',
    marginLeft: 4,
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
  },
  inputWrapper: {
    alignItems: 'center',
  },
  input: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    minWidth: 80,
    padding: 8,
  },
  inputError: {
    color: '#F44336',
  },
  inputLabel: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
  },
  separator: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ddd',
    marginHorizontal: 10,
  },
  unit: {
    fontSize: 14,
    color: '#999',
    marginLeft: 10,
  },
  errorText: {
    color: '#F44336',
    fontSize: 12,
    marginTop: 5,
  },
  hint: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
    lineHeight: 18,
  },
});
