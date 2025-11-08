/**
 * Sync Button Component
 * Shows sync status and triggers sync
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { syncService } from '../../services/sync/SyncService';
import { useAuth } from '../../context/AuthContext';

export default function SyncButton() {
  const { user } = useAuth();
  const [syncing, setSyncing] = useState(false);
  const [status, setStatus] = useState<{
    pendingPatients: number;
    pendingEncounters: number;
    lastSyncTime: Date | null;
    isOnline: boolean;
  } | null>(null);

  useEffect(() => {
    // Initial load
    loadSyncStatus();

    // Listen for network state changes
    const unsubscribe = NetInfo.addEventListener(state => {
      console.log('Network state changed:', state.isConnected, state.isInternetReachable);
      loadSyncStatus();
    });

    // Periodic refresh every 30 seconds
    const interval = setInterval(() => {
      loadSyncStatus();
    }, 30000);

    // Cleanup
    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  const loadSyncStatus = async () => {
    try {
      const syncStatus = await syncService.getSyncStatus();
      setStatus(syncStatus);
    } catch (error) {
      console.error('Failed to load sync status:', error);
    }
  };

  const handleSync = async () => {
    if (!user) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }

    if (!status?.isOnline) {
      Alert.alert('No Connection', 'Please check your internet connection');
      return;
    }

    setSyncing(true);
    try {
      const result = await syncService.performFullSync(user.id);

      if (result.success) {
        Alert.alert(
          'Sync Complete',
          `Synced ${result.patientsSynced} patients and ${result.encountersSynced} encounters`
        );
      } else {
        Alert.alert(
          'Sync Issues',
          `Some items failed to sync:\n${result.errors.join('\n')}`
        );
      }

      await loadSyncStatus();
    } catch (error: any) {
      Alert.alert('Sync Failed', error.message || 'Failed to sync data');
    } finally {
      setSyncing(false);
    }
  };

  if (!status) {
    return null;
  }

  const hasPending = status.pendingPatients > 0 || status.pendingEncounters > 0;
  const totalPending = status.pendingPatients + status.pendingEncounters;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        !status.isOnline && styles.containerOffline,
        hasPending && styles.containerPending,
      ]}
      onPress={handleSync}
      disabled={syncing || !status.isOnline}
      activeOpacity={0.7}
    >
      {syncing ? (
        <>
          <ActivityIndicator color="#fff" style={styles.icon} />
          <View style={styles.textContainer}>
            <Text style={styles.text}>Syncing...</Text>
          </View>
        </>
      ) : (
        <>
          <Text style={styles.icon}>🔄</Text>
          <View style={styles.textContainer}>
            <Text style={styles.text}>
              {!status.isOnline
                ? 'Offline - No Connection'
                : hasPending
                ? `Tap to Sync ${totalPending} Item${totalPending > 1 ? 's' : ''}`
                : 'All Synced ✓'}
            </Text>
            {status.lastSyncTime && (
              <Text style={styles.subtext}>
                Last sync: {new Date(status.lastSyncTime).toLocaleTimeString()}
              </Text>
            )}
            {hasPending && status.isOnline && (
              <Text style={styles.subtext}>
                {status.pendingPatients} patient{status.pendingPatients !== 1 ? 's' : ''}, {status.pendingEncounters} encounter{status.pendingEncounters !== 1 ? 's' : ''}
              </Text>
            )}
          </View>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginHorizontal: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  containerOffline: {
    backgroundColor: '#999',
  },
  containerPending: {
    backgroundColor: '#FF9800',
  },
  icon: {
    fontSize: 24,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  text: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  subtext: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 12,
    marginTop: 3,
  },
});
