import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { CVIFStackParamList } from '../../types/navigation.types';

type Props = NativeStackScreenProps<CVIFStackParamList, 'CVIFDashboard'>;

export default function CVIFDashboardScreen({ navigation }: Props) {
  const { t } = useTranslation();
  
  return (
    <ScrollView style={styles.container}>
      <View style={{ padding: 20 }}>
        <Text style={styles.title}>{t('cvif.dashboard')}</Text>
        <Text style={styles.subtitle}>{t('cvif.dashboardSubtitle')}</Text>

        <TouchableOpacity 
          style={styles.card}
          onPress={() => navigation.navigate('BHWManagement')}
        >
          <Text style={styles.cardTitle}>{t('bhw.management')}</Text>
          <Text style={styles.cardSubtitle}>{t('cvif.manageBHWs')}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.card}
          onPress={() => navigation.navigate('BulkOnboarding')}
        >
          <Text style={styles.cardTitle}>{t('cvif.bulkOnboarding')}</Text>
          <Text style={styles.cardSubtitle}>{t('cvif.bulkOnboardingSubtitle')}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.card}
          onPress={() => navigation.navigate('SyncStatus')}
        >
          <Text style={styles.cardTitle}>{t('sync.syncStatus')}</Text>
          <Text style={styles.cardSubtitle}>{t('cvif.monitorSync')}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.card}
          onPress={() => navigation.navigate('Settings')}
        >
          <Text style={styles.cardTitle}>{t('settings.settings')}</Text>
          <Text style={styles.cardSubtitle}>{t('cvif.appPreferences')}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1565C0',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
  },
});
