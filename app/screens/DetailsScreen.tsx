// D:\Professional_life\CA_Projects\react_native\ParkinTrace\app\screens\DetailsScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Details'>;

export default function DetailsScreen({ navigation, route }: Props) {
  const { title, value, unit } = route.params;

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#1a1a2e', '#16213e']} style={styles.gradient}>
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.valueContainer}>
            <Text style={styles.value}>{value}</Text>
            {unit && <Text style={styles.unit}>{unit}</Text>}
          </View>
          <Text style={styles.description}>
            {title === 'Heart Rate' && 'Normal range: 60-100 BPM'}
            {title === 'Blood Oxygen' && 'Normal range: 95-100%'}
            {title === 'Tremor Status' && 'Monitoring tremor intensity'}
            {title === 'Fall Status' && 'Real-time fall detection active'}
          </Text>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backBtnText}>← Back to Dashboard</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1 },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 30 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 40 },
  valueContainer: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 20 },
  value: { fontSize: 72, fontWeight: 'bold', color: '#06d6a0' },
  unit: { fontSize: 32, color: '#aaa', marginLeft: 10 },
  description: { fontSize: 16, color: '#aaa', textAlign: 'center', marginBottom: 60 },
  backBtn: { backgroundColor: '#0f3460', paddingVertical: 15, paddingHorizontal: 40, borderRadius: 25 },
  backBtnText: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
});