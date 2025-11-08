/**
 * Firebase Test Button Component
 * Tests Firebase connectivity and operations
 * Remove in production
 */

import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { firestoreService } from '../../services/firebase/firestore.service';
import { initializeFirebase } from '../../services/firebase/firebase.init';

export default function FirebaseTestButton() {
  const [testing, setTesting] = useState(false);

  const runTests = async () => {
    setTesting(true);
    
    try {
      // Test 1: Initialize Firebase
      console.log('🧪 Test 1: Initializing Firebase...');
      initializeFirebase();
      
      // Test 2: Test Firestore connection
      console.log('🧪 Test 2: Testing Firestore connection...');
      const connected = await firestoreService.testConnection();
      
      if (connected) {
        Alert.alert(
          'Firebase Tests Passed ✅',
          'Firebase is properly configured and connected!',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'Firebase Test Failed ❌',
          'Could not connect to Firestore. Check your configuration.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('❌ Firebase test error:', error);
      Alert.alert(
        'Firebase Test Error ❌',
        error instanceof Error ? error.message : 'Unknown error occurred',
        [{ text: 'OK' }]
      );
    } finally {
      setTesting(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, testing && styles.buttonDisabled]}
        onPress={runTests}
        disabled={testing}
      >
        <Text style={styles.buttonText}>
          {testing ? '🧪 Testing Firebase...' : '🔥 Test Firebase'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  button: {
    backgroundColor: '#FF6F00',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
