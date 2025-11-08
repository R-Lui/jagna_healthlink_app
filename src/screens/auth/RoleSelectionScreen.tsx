import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { RootStackParamList } from '../../types/navigation.types';

type Props = NativeStackScreenProps<RootStackParamList, 'RoleSelection'>;

export default function RoleSelectionScreen({ navigation }: Props) {
  const { t } = useTranslation();
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('auth.selectRole')}</Text>
      <Text style={styles.subtitle}>{t('auth.selectRoleSubtitle')}</Text>
      
      <TouchableOpacity 
        style={[styles.button, styles.bhwButton]}
        onPress={() => navigation.navigate('BHWHome')}
      >
        <Text style={styles.buttonText}>{t('auth.bhwRole')}</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, styles.cvifButton]}
        onPress={() => navigation.navigate('CVIFHome')}
      >
        <Text style={styles.buttonText}>{t('auth.cvifRole')}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 40,
  },
  button: {
    width: '100%',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center',
  },
  bhwButton: {
    backgroundColor: '#2E7D32',
  },
  cvifButton: {
    backgroundColor: '#1565C0',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
