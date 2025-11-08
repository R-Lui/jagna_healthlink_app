/**
 * Form Picker Component
 * Reusable picker with label and error message
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

interface FormPickerProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  items: { label: string; value: string }[];
  error?: string;
  required?: boolean;
  enabled?: boolean;
}

export default function FormPicker({
  label,
  value,
  onValueChange,
  items,
  error,
  required = false,
  enabled = true,
}: FormPickerProps) {
  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
        {required && <Text style={styles.required}> *</Text>}
      </View>
      <View style={[styles.pickerContainer, error ? styles.pickerError : null]}>
        <Picker
          selectedValue={value}
          onValueChange={onValueChange}
          enabled={enabled}
          style={styles.picker}
        >
          <Picker.Item label="Select..." value="" />
          {items.map((item) => (
            <Picker.Item key={item.value} label={item.label} value={item.value} />
          ))}
        </Picker>
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
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
    fontWeight: 'bold',
    fontSize: 16,
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
    minHeight:150,
  },
  pickerError: {
    borderColor: '#F44336',
  },
  picker: {
    height: 50,
    marginTop:-50
  },
  errorText: {
    color: '#F44336',
    fontSize: 12,
    marginTop: 5,
  },
});
