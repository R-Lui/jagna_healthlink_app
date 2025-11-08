/**
 * Sync Status Screen
 * Displays synchronization status and history for CVIF users
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../../utils/constants';
import { syncService } from '../../services/sync';
import { formatDate } from '../../utils/date.utils';
import { useAuth } from '../../context/AuthContext';

interface SyncStats {
  lastSyncTime: string | null;
  pendingPatients: number;
  pendingEncounters: number;
  isOnline: boolean;
}

export default function SyncStatusScreen() {
  const { user } = useAuth();
  const [stats, setStats] = useState<SyncStats>({
    lastSyncTime: null,
    pendingPatients: 0,
    pendingEncounters: 0,
    isOnline: false,
  });
  const [refreshing, setRefreshing] = useState(false);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    loadSyncStats();
  }, []);

  const loadSyncStats = async () => {
    try {
      const lastSync = await AsyncStorage.getItem(STORAGE_KEYS.LAST_SYNC);
      const syncQueueJson = await AsyncStorage.getItem(STORAGE_KEYS.SYNC_QUEUE);
      const syncQueue = syncQueueJson ? JSON.parse(syncQueueJson) : [];
      const pendingPatients = syncQueue.filter((item: any) => item.entityType === 'patient').length;
      const pendingEncounters = syncQueue.filter((item: any) => item.entityType === 'encounter').length;
      const isOnline = await syncService.isOnline();

      setStats({
        lastSyncTime: lastSync,
        pendingPatients,
        pendingEncounters,
        isOnline,
      });
    } catch (error) {
      console.error('Failed to load sync stats:', error);
    }
  };

  const handleSync = async () => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to sync');
      return;
    }

    try {
      setSyncing(true);
      const result = await syncService.performFullSync(user.id);
      
      if (result.success) {
        Alert.alert('Success', `Synchronized ${result.patientsSynced} patients and ${result.encountersSynced} encounters`);
      } else {
        Alert.alert('Sync Completed with Errors', result.errors.join('\n') || 'Some items failed to sync');
      }
      
      await loadSyncStats();
    } catch (error: any) {
      Alert.alert('Sync Failed', error.message || 'Failed to synchronize data');
    } finally {
      setSyncing(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadSyncStats();
    setRefreshing(false);
  };

  const getLastSyncDisplay = () => {
    if (!stats.lastSyncTime) return 'Never synced';
    
    const syncDate = new Date(stats.lastSyncTime);
    const now = new Date();
    const diffMs = now.getTime() - syncDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;
    if (diffMins < 1440) {
      const hours = Math.floor(diffMins / 60);
      return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    }
    return formatDate(syncDate);
  };

  const hasPendingItems = stats.pendingPatients > 0 || stats.pendingEncounters > 0;

  return (
    <ScrollView style={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <View style={styles.header}>
        <Text style={styles.title}>Sync Status</Text>
        <Text style={styles.subtitle}>Monitor data synchronization</Text>
      </View>

      <View style={styles.statusCard}>
        <View style={[styles.statusIndicator, hasPendingItems ? styles.statusPending : styles.statusSynced]}>
          <Text style={styles.statusText}>{hasPendingItems ? '⚠️ Pending Sync' : '✅ All Synced'}</Text>
        </View>
        <Text style={styles.lastSyncText}>Last synced: {getLastSyncDisplay()}</Text>
        <Text style={styles.connectionText}>{stats.isOnline ? '🟢 Online' : '🔴 Offline'}</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.pendingPatients}</Text>
          <Text style={styles.statLabel}>Pending Patients</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.pendingEncounters}</Text>
          <Text style={styles.statLabel}>Pending Encounters</Text>
        </View>
      </View>

      <TouchableOpacity style={[styles.syncButton, (syncing || !stats.isOnline) && styles.syncButtonDisabled]} onPress={handleSync} disabled={syncing || !stats.isOnline}>
        {syncing ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.syncButtonText}>
            {!stats.isOnline ? '📡 Offline - Cannot Sync' : hasPendingItems ? '🔄 Sync Now' : '🔄 Check for Updates'}
          </Text>
        )}
      </TouchableOpacity>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>About Synchronization</Text>
        <Text style={styles.infoText}>
          • Data is automatically synced when online{'\n'}
          • Pending items will sync when connection is restored{'\n'}
          • Manual sync uploads all pending changes{'\n'}
          • Pull down to refresh status
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#1565C0', padding: 20, paddingVertical: 40 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 5 },
  subtitle: { fontSize: 14, color: 'rgba(255,255,255,0.8)' },
  statusCard: { backgroundColor: '#fff', marginHorizontal: 15, marginTop: -20, marginBottom: 15, padding: 20, borderRadius: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  statusIndicator: { padding: 15, borderRadius: 8, marginBottom: 15, alignItems: 'center' },
  statusSynced: { backgroundColor: '#E8F5E9' },
  statusPending: { backgroundColor: '#FFF3E0' },
  statusText: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  lastSyncText: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 8 },
  connectionText: { fontSize: 14, color: '#666', textAlign: 'center', fontWeight: '600' },
  statsContainer: { flexDirection: 'row', marginHorizontal: 15, marginBottom: 15, gap: 10 },
  statCard: { flex: 1, backgroundColor: '#fff', padding: 20, borderRadius: 10, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  statValue: { fontSize: 32, fontWeight: 'bold', color: '#1565C0', marginBottom: 5 },
  statLabel: { fontSize: 12, color: '#666', textAlign: 'center' },
  syncButton: { backgroundColor: '#1565C0', marginHorizontal: 15, marginBottom: 15, padding: 18, borderRadius: 10, alignItems: 'center' },
  syncButtonDisabled: { opacity: 0.6 },
  syncButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  infoCard: { backgroundColor: '#E3F2FD', marginHorizontal: 15, marginBottom: 20, padding: 20, borderRadius: 10 },
  infoTitle: { fontSize: 16, fontWeight: 'bold', color: '#1565C0', marginBottom: 10 },
  infoText: { fontSize: 13, color: '#666', lineHeight: 22 },
});
