// D:\Professional_life\CA_Projects\react_native\ParkinTrace\app\screens\medication\MedicationScreen.tsx
import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, 
  StatusBar, Platform, Dimensions 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import CustomAlert from '../../../components/common/CustomAlert';

const { width } = Dimensions.get('window');

type Medication = {
  id: string;
  name: string;
  dosage: string;
  time: string;
  taken: boolean;
  icon: string;
  color: string;
};

export default function MedicationScreen() {
  const router = useRouter();
  const [medications, setMedications] = useState<Medication[]>([
    { id: '1', name: 'Levodopa', dosage: '100mg', time: '08:00 AM', taken: true, icon: '💊', color: '#3B82F6' },
    { id: '2', name: 'Carbidopa', dosage: '25mg', time: '08:00 AM', taken: true, icon: '💊', color: '#10B981' },
    { id: '3', name: 'Ropinirole', dosage: '2mg', time: '02:00 PM', taken: false, icon: '💊', color: '#F59E0B' },
    { id: '4', name: 'Selegiline', dosage: '5mg', time: '08:00 PM', taken: false, icon: '💊', color: '#8B5CF6' },
  ]);

  const [alert, setAlert] = useState({
    visible: false,
    type: 'success' as 'success' | 'error' | 'warning' | 'info' | 'confirm',
    title: '',
    message: '',
  });

  const toggleMedication = (id: string) => {
    setMedications(prev =>
      prev.map(med =>
        med.id === id ? { ...med, taken: !med.taken } : med
      )
    );
    
    const med = medications.find(m => m.id === id);
    if (med && !med.taken) {
      setAlert({
        visible: true,
        type: 'success',
        title: 'Medication Taken',
        message: `${med.name} ${med.dosage} marked as taken`,
      });
    }
  };

  const takenCount = medications.filter(m => m.taken).length;
  const progress = (takenCount / medications.length) * 100;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E293B" />
      <LinearGradient colors={['#1E293B', '#0F172A']} style={styles.gradient}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Medication</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Progress Card */}
          <View style={styles.progressCard}>
            <LinearGradient colors={['#3B82F6', '#8B5CF6']} style={styles.progressGradient}>
              <View style={styles.progressHeader}>
                <View>
                  <Text style={styles.progressTitle}>Today's Progress</Text>
                  <Text style={styles.progressSubtitle}>
                    {takenCount} of {medications.length} taken
                  </Text>
                </View>
                <View style={styles.progressCircle}>
                  <Text style={styles.progressPercent}>{Math.round(progress)}%</Text>
                </View>
              </View>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${progress}%` }]} />
              </View>
            </LinearGradient>
          </View>

          {/* Medication List */}
          <Text style={styles.sectionTitle}>Today's Schedule</Text>
          {medications.map((med) => (
            <TouchableOpacity 
              key={med.id}
              style={[styles.medCard, med.taken && styles.medCardTaken]}
              onPress={() => toggleMedication(med.id)}
              activeOpacity={0.7}
            >
              <View style={[styles.medIcon, { backgroundColor: med.color + '20' }]}>
                <Text style={styles.medEmoji}>{med.icon}</Text>
              </View>
              
              <View style={styles.medInfo}>
                <Text style={[styles.medName, med.taken && styles.medNameTaken]}>
                  {med.name}
                </Text>
                <Text style={styles.medDosage}>{med.dosage}</Text>
                <Text style={styles.medTime}>⏰ {med.time}</Text>
              </View>

              <View style={[styles.checkbox, med.taken && styles.checkboxChecked]}>
                {med.taken && <Text style={styles.checkmark}>✓</Text>}
              </View>
            </TouchableOpacity>
          ))}

          {/* Reminders */}
          <Text style={styles.sectionTitle}>Reminders</Text>
          <View style={styles.reminderCard}>
            <View style={styles.reminderIcon}>
              <Text style={styles.reminderEmoji}>🔔</Text>
            </View>
            <View style={styles.reminderInfo}>
              <Text style={styles.reminderTitle}>Notifications Enabled</Text>
              <Text style={styles.reminderText}>
                You'll receive reminders 15 minutes before each dose
              </Text>
            </View>
          </View>

          {/* Info Card */}
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>💡 Did you know?</Text>
            <Text style={styles.infoText}>
              Taking medications at the same time each day helps maintain steady levels in your body
            </Text>
          </View>
        </ScrollView>
      </LinearGradient>

      <CustomAlert
        visible={alert.visible}
        type={alert.type}
        title={alert.title}
        message={alert.message}
        onConfirm={() => setAlert(prev => ({ ...prev, visible: false }))}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  backIcon: { fontSize: 24, color: '#F1F5F9' },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#F1F5F9' },
  placeholder: { width: 44 },
  content: { flex: 1, paddingHorizontal: 20 },

  progressCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 24,
  },
  progressGradient: {
    padding: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  progressSubtitle: { fontSize: 14, color: '#fff', opacity: 0.8 },
  progressCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ffffff20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressPercent: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  progressBar: {
    height: 8,
    backgroundColor: '#ffffff20',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 4,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F1F5F9',
    marginBottom: 12,
  },
  medCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  medCardTaken: {
    opacity: 0.6,
  },
  medIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  medEmoji: { fontSize: 24 },
  medInfo: { flex: 1 },
  medName: { fontSize: 16, fontWeight: 'bold', color: '#F1F5F9', marginBottom: 4 },
  medNameTaken: { textDecorationLine: 'line-through', color: '#64748B' },
  medDosage: { fontSize: 14, color: '#94A3B8', marginBottom: 4 },
  medTime: { fontSize: 12, color: '#64748B' },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  checkmark: { color: '#fff', fontSize: 14, fontWeight: 'bold' },

  reminderCard: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#334155',
  },
  reminderIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F59E0B20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  reminderEmoji: { fontSize: 24 },
  reminderInfo: { flex: 1 },
  reminderTitle: { fontSize: 16, fontWeight: 'bold', color: '#F1F5F9', marginBottom: 4 },
  reminderText: { fontSize: 13, color: '#94A3B8', lineHeight: 18 },

  infoCard: {
    backgroundColor: '#3B82F615',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#3B82F640',
  },
  infoTitle: { fontSize: 16, fontWeight: 'bold', color: '#F1F5F9', marginBottom: 8 },
  infoText: { fontSize: 13, color: '#94A3B8', lineHeight: 20 },
});