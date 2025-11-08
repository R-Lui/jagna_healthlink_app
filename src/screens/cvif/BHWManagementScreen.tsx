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
import { useTranslation } from 'react-i18next';
import { CVIFStackParamList } from '../../types/navigation.types';
import { firestoreService } from '../../services/firebase';
import { User, UserRole, BHW, isBHW } from '../../models';
import BHWListItem from '../../components/cvif/BHWListItem';
import SearchBar from '../../components/common/SearchBar';
import EmptyState from '../../components/common/EmptyState';

type Props = NativeStackScreenProps<CVIFStackParamList, 'BHWManagement'>;

export default function BHWManagementScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const [bhws, setBhws] = useState<BHW[]>([]);
  const [filteredBhws, setFilteredBhws] = useState<BHW[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBHWs();
  }, []);

  useEffect(() => {
    filterBHWs();
  }, [searchQuery, bhws]);

  /**
   * Load all BHWs from Firebase
   */
  const loadBHWs = async () => {
    try {
      setLoading(true);
      const users = await firestoreService.getUsers({ role: UserRole.BHW });
      
      // Filter to only BHW users and type cast
      const bhwUsers = users.filter(isBHW);
      
      // Sort by last name
      bhwUsers.sort((a, b) => a.lastName.localeCompare(b.lastName));
      
      setBhws(bhwUsers);
      console.log(`✅ Loaded ${bhwUsers.length} BHWs`);
    } catch (error) {
      console.error('❌ Failed to load BHWs:', error);
      Alert.alert(t('common.error'), t('bhw.loadError'));
    } finally {
      setLoading(false);
    }
  };

  /**
   * Filter BHWs based on search query
   */
  const filterBHWs = () => {
    if (!searchQuery.trim()) {
      setFilteredBhws(bhws);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = bhws.filter(
      (bhw: BHW) =>
        bhw.firstName.toLowerCase().includes(query) ||
        bhw.lastName.toLowerCase().includes(query) ||
        bhw.barangay.toLowerCase().includes(query) ||
        (bhw.email && bhw.email.toLowerCase().includes(query))
    );
    setFilteredBhws(filtered);
  };

  /**
   * Handle pull to refresh
   */
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadBHWs();
    setRefreshing(false);
  }, []);

  /**
   * Navigate to create BHW
   */
  const handleCreateBHW = () => {
    navigation.navigate('CreateBHW');
  };

  /**
   * Handle BHW press
   */
  const handleBHWPress = (bhw: BHW) => {
    navigation.navigate('BHWDetails', { bhwId: bhw.id });
  };

  /**
   * Render BHW item
   */
  const renderBHW = ({ item }: { item: BHW }) => (
    <BHWListItem bhw={item} onPress={handleBHWPress} />
  );

  /**
   * Render empty state
   */
  const renderEmptyState = () => {
    if (loading) {
      return null;
    }

    if (bhws.length === 0) {
      return (
        <EmptyState
          icon="👥"
          title={t('bhw.noBHWs')}
          message={t('bhw.createFirst')}
        />
      );
    }

    if (filteredBhws.length === 0) {
      return (
        <EmptyState
          icon="🔍"
          title={t('common.noResults')}
          message={t('bhw.noMatch', { query: searchQuery })}
        />
      );
    }

    return null;
  };

  const activeBhws = bhws.filter((bhw) => bhw.isActive).length;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{t('bhw.management')}</Text>
          <Text style={styles.subtitle}>{t('bhw.managementSubtitle')}</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={handleCreateBHW}>
          <Text style={styles.addButtonText}>+ {t('common.add')}</Text>
        </TouchableOpacity>
      </View>

      {/* Stats Card */}
      <View style={styles.statsCard}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{bhws.length}</Text>
          <Text style={styles.statLabel}>{t('bhw.totalBHWs')}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{activeBhws}</Text>
          <Text style={styles.statLabel}>{t('bhw.active')}</Text>
        </View>
      </View>

      {/* Search Bar */}
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder={t('bhw.searchBHWs')}
      />

      {/* BHW List */}
      <FlatList
        data={filteredBhws}
        renderItem={renderBHW}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
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
    backgroundColor: '#1565C0',
    padding: 20,
    paddingVertical: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
  addButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  statsCard: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginTop: -20,
    marginBottom: 10,
    padding: 20,
    borderRadius: 10,
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
    color: '#1565C0',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#ddd',
    marginHorizontal: 20,
  },
  listContent: {
    paddingBottom: 20,
  },
});

