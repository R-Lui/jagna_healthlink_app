/**
 * Form Date Picker Component
 * Date picker with label and error message
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { formatDate } from '../../utils/helpers';

interface FormDatePickerProps {
  label: string;
  value: Date;
  onValueChange: (date: Date) => void;
  error?: string;
  required?: boolean;
  maximumDate?: Date;
  minimumDate?: Date;
}

export default function FormDatePicker({
  label,
  value,
  onValueChange,
  error,
  required = false,
  maximumDate,
  minimumDate,
}: FormDatePickerProps) {
  const [show, setShow] = useState(false);

  const handleChange = (event: any, selectedDate?: Date) => {
    setShow(Platform.OS === 'ios');
    if (selectedDate) {
      onValueChange(selectedDate);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
        {required && <Text style={styles.required}> *</Text>}
      </View>
      <TouchableOpacity
        style={[styles.dateButton, error ? styles.dateButtonError : null]}
        onPress={() => setShow(true)}
      >
        <Text style={styles.dateText}>{formatDate(value)}</Text>
        <Text style={styles.calendarIcon}>📅</Text>
      </TouchableOpacity>
      {error && <Text style={styles.errorText}>{error}</Text>}
      {show && (
        <DateTimePicker
          value={value}
          mode="date"
          display="default"
          onChange={handleChange}
          maximumDate={maximumDate}
          minimumDate={minimumDate}
        />
      )}
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
  dateButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateButtonError: {
    borderColor: '#F44336',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  calendarIcon: {
    fontSize: 20,
  },
  errorText: {
    color: '#F44336',
    fontSize: 12,
    marginTop: 5,
  },
});
