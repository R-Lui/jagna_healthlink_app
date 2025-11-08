import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { BHWStackParamList } from '../../types/navigation.types';
import { useAuth } from '../../context/AuthContext';
import { usePatientStorage } from '../../hooks/useStorage';
import { Patient, isBHW } from '../../models';
import PatientListItem from '../../components/bhw/PatientListItem';
import PatientFilter from '../../components/bhw/PatientFilter';
import SearchBar from '../../components/common/SearchBar';
import EmptyState from '../../components/common/EmptyState';
import SyncButton from '../../components/common/SyncButton';

type Props = NativeStackScreenProps<BHWStackParamList, 'BHWDashboard'>;

export default function BHWDashboardScreen({ navigation }: Props) {
  const { user } = useAuth();
  const { t } = useTranslation();
  const patientStorage = usePatientStorage();

  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPurok, setSelectedPurok] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Get unique puroks from user's barangay
  const puroks = ['1', '2', '3', '4', '5', '6', '7', '8'];

  /**
   * Normalize barangay name for comparison
   * Handles variations like "Poblacion" vs "Poblacion (Pondol)"
   */
  const normalizeBarangay = (barangay: string): string => {
    return barangay.toLowerCase().replace(/\s*\([^)]*\)/g, '').trim();
  };

  // Load patients when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadPatients();
    }, [])
  );

  // Filter patients when search or purok changes
  useEffect(() => {
    filterPatients();
  }, [searchQuery, selectedPurok, patients]);

  /**
   * Load all patients from storage
   */
  const loadPatients = async () => {
    try {
      setLoading(true);
      const allPatients = await patientStorage.getAllPatients();
      
      console.log(`📊 Dashboard Debug Info:`);
      console.log(`  - Total patients in storage: ${allPatients.length}`);
      console.log(`  - Current user:`, user ? {
        id: user.id,
        role: user.role,
        fullName: `${user.firstName} ${user.lastName}`,
        barangay: isBHW(user) ? user.barangay : 'N/A (not BHW)',
      } : 'NO USER');

      // Log all patients with their barangays
      if (allPatients.length > 0) {
        console.log(`  - All patients by barangay:`);
        allPatients.forEach((p: Patient) => {
          console.log(`    • ${p.firstName} ${p.lastName} - Barangay: "${p.barangay}" (ID: ${p.id})`);
        });
      }

      // Filter patients by BHW's barangay
      if (!user || !isBHW(user)) {
        console.log(`⚠️ User is not a BHW, showing no patients`);
        setPatients([]);
        setLoading(false);
        return;
      }

      const userBarangay = user.barangay;
      const normalizedUserBarangay = normalizeBarangay(userBarangay);
      
      const barangayPatients = allPatients.filter(
        (p: Patient) => normalizeBarangay(p.barangay) === normalizedUserBarangay
      );

      console.log(`📊 Filtering Results:`);
      console.log(`  - User's barangay: "${userBarangay}" (normalized: "${normalizedUserBarangay}")`);
      console.log(`  - Matching patients: ${barangayPatients.length}`);
      
      if (barangayPatients.length > 0) {
        console.log(`  - Filtered patients:`);
        barangayPatients.forEach((p: Patient) => {
          console.log(`    ✓ ${p.firstName} ${p.lastName} - Purok ${p.purok}`);
        });
      } else if (allPatients.length > 0) {
        console.log(`  ⚠️ No patients match barangay "${userBarangay}"`);
        console.log(`  - Available barangays in storage:`, 
          [...new Set(allPatients.map((p: Patient) => p.barangay))]);
      }

      setPatients(barangayPatients);
    } catch (error) {
      console.error('❌ Failed to load patients:', error);
      Alert.alert('Error', 'Failed to load patients');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Filter patients based on search query and purok
   */
  const filterPatients = () => {
    let filtered = [...patients];

    // Filter by purok
    if (selectedPurok) {
      filtered = filtered.filter((p) => {
        // Handle both formats: "1" and "Purok 1"
        const patientPurok = p.purok?.toLowerCase() || '';
        const selectedPurokLower = selectedPurok.toLowerCase();
        return (
          patientPurok === selectedPurokLower ||
          patientPurok === `purok ${selectedPurokLower}` ||
          patientPurok.endsWith(` ${selectedPurokLower}`)
        );
      });
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.firstName.toLowerCase().includes(query) ||
          p.lastName.toLowerCase().includes(query) ||
          p.upi.toLowerCase().includes(query)
      );
    }

    setFilteredPatients(filtered);
  };

  /**
   * Handle pull to refresh
   */
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadPatients();
    setRefreshing(false);
  }, []);

  /**
   * Navigate to patient details
   */
  const handlePatientPress = (patient: Patient) => {
    navigation.navigate('PatientProfile', { patientId: patient.id });
  };

  /**
   * Navigate to register new patient
   */
  const handleAddPatient = () => {
    navigation.navigate('PatientRegistration');
  };

  /**
   * Navigate to settings
   */
  const handleSettings = () => {
    navigation.navigate('Settings');
  };

  /**
   * Render patient list item
   */
  const renderPatient = ({ item }: { item: Patient }) => (
    <PatientListItem patient={item} onPress={handlePatientPress} />
  );

  /**
   * Render empty state
   */
  const renderEmptyState = () => {
    if (loading) {
      return null;
    }

    if (patients.length === 0) {
      return (
        <EmptyState
          icon="👥"
          title={t('dashboard.noPatientsTitle')}
          message={t('dashboard.noPatientsMessage')}
          actionText={t('dashboard.addPatient')}
          onAction={handleAddPatient}
        />
      );
    }

    if (filteredPatients.length === 0) {
      return (
        <EmptyState
          icon="🔍"
          title={t('dashboard.noResultsTitle')}
          message={t('dashboard.noResultsMessage')}
          actionText={t('common.clear')}
          onAction={() => {
            setSearchQuery('');
            setSelectedPurok(null);
          }}
        />
      );
    }

    return null;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.greeting}>{t('dashboard.greeting')} 👋</Text>
          <Text style={styles.subtitle}>
            {user && isBHW(user) ? user.barangay : ''}{' '}
            {user && isBHW(user) && user.purok ? `• ${user.purok}` : ''}
          </Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.settingsButton} onPress={handleSettings}>
            <Text style={styles.settingsIcon}>⚙️</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.addButton} onPress={handleAddPatient}>
            <Text style={styles.addButtonText}>+ {t('dashboard.addPatient')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats Card */}
      <View style={styles.statsCard}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{patients.length}</Text>
          <Text style={styles.statLabel}>{t('dashboard.totalPatients')}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {selectedPurok ? filteredPatients.length : patients.length}
          </Text>
          <Text style={styles.statLabel}>
            {selectedPurok ? `Purok ${selectedPurok}` : t('dashboard.all')}
          </Text>
        </View>
      </View>

      {/* Sync Button */}
      <SyncButton />

      {/* Search Bar */}
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder={t('dashboard.searchPlaceholder')}
        onClear={() => setSearchQuery('')}
      />

      {/* Purok Filter */}
      <PatientFilter
        selectedPurok={selectedPurok}
        onSelectPurok={setSelectedPurok}
        puroks={puroks}
      />

      {/* Patient List */}
      <FlatList
        data={filteredPatients}
        renderItem={renderPatient}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2E7D32']} />
        }
        ListEmptyComponent={renderEmptyState()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2E7D32',
    paddingHorizontal: 20,
    paddingVertical: 40,
    paddingBottom: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  settingsButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsIcon: {
    fontSize: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  statsCard: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginTop: -15,
    marginBottom: 10,
    padding: 20,
    borderRadius: 15,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 20,
  },
  listContent: {
    paddingBottom: 20,
  },
});
