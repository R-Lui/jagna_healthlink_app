import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CVIFStackParamList } from '../../types/navigation.types';

type Props = NativeStackScreenProps<CVIFStackParamList, 'BHWDetails'>;

export default function BHWDetailsScreen({ route }: Props) {
  const { bhwId } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>BHW Details</Text>
      <Text style={styles.text}>ID: {bhwId}</Text>
      <Text style={styles.placeholder}>
        Full BHW details view will be added in future updates.
        {'\n\n'}
        This screen will show:
        {'\n'}• BHW profile information
        {'\n'}• Patient statistics
        {'\n'}• Activity history
        {'\n'}• Account management options
      </Text>
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
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  placeholder: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginTop: 20,
  },
});
