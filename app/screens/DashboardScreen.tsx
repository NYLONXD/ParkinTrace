// D:\Professional_life\CA_Projects\react_native\ParkinTrace\app\screens\DashboardScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, VitalData } from '../types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Dashboard'>;
};

export default function DashboardScreen({ navigation }: Props) {
  const [vitals, setVitals] = useState<VitalData>({
    heartRate: 72,
    bloodOxygen: 98,
    tremorStatus: 'Normal',
    tremorLevel: 0,
    fallStatus: 'No Fall',
    fallDetected: false,
  });
  const [fallAlertVisible, setFallAlertVisible] = useState(false);
  const [timer, setTimer] = useState(10);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Simulate live vitals
  useEffect(() => {
    const interval = setInterval(() => {
      setVitals(prev => ({
        heartRate: 65 + Math.floor(Math.random() * 20),
        bloodOxygen: 95 + Math.floor(Math.random() * 5),
        tremorStatus: Math.random() > 0.8 ? 'Mild Tremor' : 'Normal',
        tremorLevel: Math.random() > 0.8 ? 2 : 0,
        fallStatus: prev.fallDetected ? 'FALL DETECTED!' : 'No Fall',
        fallDetected: prev.fallDetected || Math.random() > 0.98, // Simulate fall
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Fall detection logic
  useEffect(() => {
    if (vitals.fallDetected && !fallAlertVisible) {
      setFallAlertVisible(true);
      setTimer(10);
      startPulseAnimation();
    }
  }, [vitals.fallDetected]);

  // Countdown timer
  useEffect(() => {
    if (!fallAlertVisible) return;
    
    if (timer === 0) {
      triggerSOS();
      return;
    }

    const countdown = setTimeout(() => setTimer(t => t - 1), 1000);
    return () => clearTimeout(countdown);
  }, [fallAlertVisible, timer]);

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.1, duration: 300, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      ])
    ).start();
  };

  const handleImOK = () => {
    setFallAlertVisible(false);
    setVitals(prev => ({ ...prev, fallDetected: false, fallStatus: 'No Fall' }));
    pulseAnim.stopAnimation();
    pulseAnim.setValue(1);
    Alert.alert('✓ Confirmed', 'Fall alert dismissed');
  };

  const triggerSOS = () => {
    setFallAlertVisible(false);
    pulseAnim.stopAnimation();
    pulseAnim.setValue(1);
    Alert.alert(
      '🚨 SOS TRIGGERED',
      'Emergency services notified!\nCaregivers contacted!',
      [{ text: 'OK', onPress: () => setVitals(prev => ({ ...prev, fallDetected: false, fallStatus: 'No Fall' })) }]
    );
  };

  const handleManualSOS = () => {
    Alert.alert(
      'Send SOS?',
      'This will contact emergency services',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Send SOS', style: 'destructive', onPress: triggerSOS }
      ]
    );
  };

  const handleConnectDoctor = () => {
    Alert.alert('📞 Connecting', 'Calling Dr. Smith...');
  };

  const navigateToDetails = (title: string, value: string | number, unit?: string) => {
    navigation.navigate('Details', { title, value, unit });
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#1a1a2e', '#16213e']} style={styles.gradient}>
        <Text style={styles.header}>ParkinTrace</Text>
        <Text style={styles.subHeader}>Live Patient Monitoring</Text>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Vitals Grid */}
          <View style={styles.grid}>
            <TouchableOpacity 
              style={styles.card}
              onPress={() => navigateToDetails('Heart Rate', vitals.heartRate, 'BPM')}
            >
              <Text style={styles.cardLabel}>❤️ Heart Rate</Text>
              <Text style={styles.cardValue}>{vitals.heartRate}</Text>
              <Text style={styles.cardUnit}>BPM</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.card}
              onPress={() => navigateToDetails('Blood Oxygen', vitals.bloodOxygen, '%')}
            >
              <Text style={styles.cardLabel}>🩸 Blood O₂</Text>
              <Text style={styles.cardValue}>{vitals.bloodOxygen}</Text>
              <Text style={styles.cardUnit}>%</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.card, vitals.tremorLevel > 0 && styles.cardTremorAlert]}
              onPress={() => navigateToDetails('Tremor Status', vitals.tremorStatus)}
            >
              <Text style={styles.cardLabel}>🤚 Tremor</Text>
              <Text style={styles.cardValue}>{vitals.tremorStatus}</Text>
            </TouchableOpacity>

            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <TouchableOpacity 
                style={[styles.card, vitals.fallDetected && styles.cardFallAlert]}
                onPress={() => navigateToDetails('Fall Status', vitals.fallStatus)}
              >
                <Text style={styles.cardLabel}>⚠️ Fall Status</Text>
                <Text style={styles.cardValue}>{vitals.fallStatus}</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>

          {/* Fall Alert Banner */}
          {fallAlertVisible && (
            <View style={styles.alertBanner}>
              <Text style={styles.alertTitle}>🚨 FALL DETECTED!</Text>
              <Text style={styles.alertText}>Are you OK?</Text>
              <Text style={styles.alertTimer}>Auto-SOS in {timer}s</Text>
              <TouchableOpacity style={styles.alertBtn} onPress={handleImOK}>
                <Text style={styles.alertBtnText}>I'M OK</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Emergency Buttons */}
          <View style={styles.emergencyRow}>
            <TouchableOpacity style={styles.sosBtn} onPress={handleManualSOS}>
              <Text style={styles.sosBtnText}>🚨 SOS</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.doctorBtn} onPress={handleConnectDoctor}>
              <Text style={styles.doctorBtnText}>📞 Doctor</Text>
            </TouchableOpacity>
          </View>

          {/* Info Cards */}
          <Text style={styles.sectionTitle}>Info & Exercises</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.infoScroll}>
            {['Exercise Tips', 'Medication', 'Diet Plan', 'Sleep Tips'].map((item, i) => (
              <TouchableOpacity key={i} style={styles.infoCard}>
                <Text style={styles.infoCardText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1 },
  header: { fontSize: 32, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginTop: 60, marginBottom: 5 },
  subHeader: { fontSize: 14, color: '#aaa', textAlign: 'center', marginBottom: 20 },
  content: { flex: 1, paddingHorizontal: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 20 },
  card: { width: '48%', backgroundColor: '#0f3460', borderRadius: 15, padding: 20, marginBottom: 15, alignItems: 'center' },
  cardLabel: { fontSize: 14, color: '#aaa', marginBottom: 10 },
  cardValue: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  cardUnit: { fontSize: 12, color: '#aaa', marginTop: 5 },
  cardTremorAlert: { backgroundColor: '#ff6b35', borderWidth: 2, borderColor: '#fff' },
  cardFallAlert: { backgroundColor: '#e63946', borderWidth: 3, borderColor: '#fff' },
  alertBanner: { backgroundColor: '#e63946', borderRadius: 15, padding: 20, marginBottom: 20, alignItems: 'center' },
  alertTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 10 },
  alertText: { fontSize: 18, color: '#fff', marginBottom: 5 },
  alertTimer: { fontSize: 16, color: '#fff', marginBottom: 15 },
  alertBtn: { backgroundColor: '#fff', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 25 },
  alertBtnText: { fontSize: 16, fontWeight: 'bold', color: '#e63946' },
  emergencyRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  sosBtn: { flex: 1, backgroundColor: '#e63946', padding: 20, borderRadius: 15, marginRight: 10, alignItems: 'center' },
  sosBtnText: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  doctorBtn: { flex: 1, backgroundColor: '#06d6a0', padding: 20, borderRadius: 15, marginLeft: 10, alignItems: 'center' },
  doctorBtnText: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginBottom: 15 },
  infoScroll: { marginBottom: 30 },
  infoCard: { width: 140, height: 100, backgroundColor: '#0f3460', borderRadius: 15, marginRight: 15, justifyContent: 'center', alignItems: 'center' },
  infoCardText: { fontSize: 14, fontWeight: 'bold', color: '#fff', textAlign: 'center' },
});