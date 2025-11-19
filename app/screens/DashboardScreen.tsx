import React, { useState, useEffect, useRef } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, 
  Animated, Dimensions, StatusBar, Platform 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, Href } from 'expo-router';
import { signOut } from 'firebase/auth';
import { auth } from '../../config/firebase';
import CustomAlert from '../../components/common/CustomAlert';


const { width } = Dimensions.get('window');
const isSmallDevice = width < 375;

type VitalData = {
  heartRate: number;
  bloodOxygen: number;
  tremorStatus: string;
  tremorLevel: number;
  fallStatus: string;
  fallDetected: boolean;
  steps: number;
  calories: number;
};

type AlertConfig = {
  visible: boolean;
  type: 'success' | 'error' | 'warning' | 'info' | 'confirm';
  title: string;
  message: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
};

export default function DashboardScreen() {
  const router = useRouter();
  const [vitals, setVitals] = useState<VitalData>({
    heartRate: 72,
    bloodOxygen: 98,
    tremorStatus: 'Normal',
    tremorLevel: 0,
    fallStatus: 'No Fall',
    fallDetected: false,
    steps: 2847,
    calories: 345,
  });
  
  const [fallAlertVisible, setFallAlertVisible] = useState(false);
  const [timer, setTimer] = useState(10);
  const [alert, setAlert] = useState<AlertConfig>({
    visible: false,
    type: 'info',
    title: '',
    message: '',
  });
  
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  // Simulate live vitals
  useEffect(() => {
    const interval = setInterval(() => {
      setVitals(prev => ({
        ...prev,
        heartRate: 65 + Math.floor(Math.random() * 20),
        bloodOxygen: 95 + Math.floor(Math.random() * 5),
        tremorStatus: Math.random() > 0.8 ? 'Mild Tremor' : 'Normal',
        tremorLevel: Math.random() > 0.8 ? 2 : 0,
        fallStatus: prev.fallDetected ? 'FALL DETECTED!' : 'Safe',
        fallDetected: prev.fallDetected || Math.random() > 0.98,
        steps: prev.steps + Math.floor(Math.random() * 5),
        calories: prev.calories + Math.floor(Math.random() * 2),
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (vitals.fallDetected && !fallAlertVisible) {
      setFallAlertVisible(true);
      setTimer(10);
      startPulseAnimation();
    }
  }, [vitals.fallDetected]);

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

  const showAlert = (config: Omit<AlertConfig, 'visible'>) => {
    setAlert({ ...config, visible: true });
  };

  const hideAlert = () => {
    setAlert(prev => ({ ...prev, visible: false }));
  };

  const handleImOK = () => {
    setFallAlertVisible(false);
    setVitals(prev => ({ ...prev, fallDetected: false, fallStatus: 'Safe' }));
    pulseAnim.stopAnimation();
    pulseAnim.setValue(1);
    showAlert({
      type: 'success',
      title: 'Confirmed',
      message: 'Fall alert dismissed. Stay safe!',
      onConfirm: hideAlert,
      confirmText: 'Got it',
    });
  };

  const triggerSOS = () => {
    setFallAlertVisible(false);
    pulseAnim.stopAnimation();
    pulseAnim.setValue(1);
    showAlert({
      type: 'error',
      title: 'SOS TRIGGERED',
      message: 'Emergency services notified!\nCaregivers have been contacted.',
      onConfirm: () => {
        setVitals(prev => ({ ...prev, fallDetected: false, fallStatus: 'Safe' }));
        hideAlert();
      },
      confirmText: 'Understood',
    });
  };

  const handleManualSOS = () => {
    showAlert({
      type: 'confirm',
      title: 'Emergency SOS',
      message: 'This will immediately contact emergency services and your caregivers. Continue?',
      onConfirm: () => {
        hideAlert();
        setTimeout(() => {
          showAlert({
            type: 'success',
            title: 'Help is on the way!',
            message: 'Emergency services have been notified.\nETA: 8-10 minutes',
            onConfirm: hideAlert,
            confirmText: 'OK',
          });
        }, 300);
      },
      onCancel: hideAlert,
      confirmText: 'Send SOS',
      cancelText: 'Cancel',
    });
  };

  const handleLogout = () => {
    showAlert({
      type: 'warning',
      title: 'Logout',
      message: 'Are you sure you want to logout?',
      onConfirm: async () => {
        hideAlert();
        try {
          await signOut(auth);
          router.replace('/screens/auth/LoginScreen');
        } catch (error) {
          showAlert({
            type: 'error',
            title: 'Error',
            message: 'Failed to logout. Please try again.',
            onConfirm: hideAlert,
          });
        }
      },
      onCancel: hideAlert,
      confirmText: 'Logout',
      cancelText: 'Cancel',
    });
  };

  const handleCallDoctor = () => {
    showAlert({
      type: 'info',
      title: 'Calling Doctor',
      message: 'Connecting you to Dr. Sarah Smith...\n📞 +1 (555) 123-4567',
      onConfirm: () => {
        hideAlert();
        setTimeout(() => {
          showAlert({
            type: 'success',
            title: 'Call Connected',
            message: 'You are now connected with Dr. Smith',
            onConfirm: hideAlert,
          });
        }, 300);
      },
      confirmText: 'End Call',
    });
  };

  const handleMedication = () => {
    router.push('screens/medication/MedicationScreen' as Href);
  };

  const handleReports = () => {
    router.push('/screens/reports/ReportScreen' as Href);
  };

  const handleExercise = () => {
    router.push('/screens/exercise/ExerciseScreen' as Href);
  };

  const handleAppointments = () => {
    router.push('/screens/doctor/AppointmentsScreen' as Href);
  };

  const navigateToDetails = (title: string, value: string | number, unit?: string) => {
    router.push({
      pathname: '/screens/DetailsScreen',
      params: { title, value: value.toString(), unit: unit || '' }
    });
  };

  const getHeartRateColor = (hr: number) => {
    if (hr < 60 || hr > 100) return '#FF6B6B';
    if (hr < 70 || hr > 90) return '#FFA94D';
    return '#51CF66';
  };

  const getOxygenColor = (o2: number) => {
    if (o2 < 95) return '#FF6B6B';
    if (o2 < 97) return '#FFA94D';
    return '#51CF66';
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E293B" />
      <LinearGradient colors={['#1E293B', '#0F172A']} style={styles.gradient}>
        
        <Animated.View style={[styles.header, { opacity: fadeAnim }]}> 
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>Good Morning</Text>
              <Text style={styles.headerTitle}>Health Monitor</Text>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity 
                onPress={() => router.push('/screens/profile/ProfileScreen' as Href)} 
                style={styles.profileBtn}
              >
                <Text style={styles.profileIcon}>👤</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
                <Text style={styles.logoutIcon}>⎋</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        <ScrollView 
          style={styles.content} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Main Vitals Cards */}
          <View style={styles.vitalCardsRow}>
            <TouchableOpacity 
              style={[styles.vitalCardLarge, { backgroundColor: '#1E40AF15' }]}
              onPress={() => navigateToDetails('Heart Rate', vitals.heartRate, 'BPM')}
            >
              <View style={[styles.circleIcon, { backgroundColor: '#1E40AF' }]}>
                <Text style={styles.iconEmoji}>❤️</Text>
              </View>
              <Text style={styles.vitalLabel}>Heart Rate</Text>
              <View style={styles.vitalValueRow}>
                <Text style={[styles.vitalValue, { color: getHeartRateColor(vitals.heartRate) }]}>
                  {vitals.heartRate}
                </Text>
                <Text style={styles.vitalUnit}>BPM</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: getHeartRateColor(vitals.heartRate) + '20' }]}>
                <View style={[styles.statusDot, { backgroundColor: getHeartRateColor(vitals.heartRate) }]} />
                <Text style={[styles.statusText, { color: getHeartRateColor(vitals.heartRate) }]}>
                  {vitals.heartRate >= 60 && vitals.heartRate <= 100 ? 'Normal' : 'Abnormal'}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.vitalCardLarge, { backgroundColor: '#7C3AED15' }]}
              onPress={() => navigateToDetails('Blood Oxygen', vitals.bloodOxygen, '%')}
            >
              <View style={[styles.circleIcon, { backgroundColor: '#7C3AED' }]}>
                <Text style={styles.iconEmoji}>🫁</Text>
              </View>
              <Text style={styles.vitalLabel}>Blood O₂</Text>
              <View style={styles.vitalValueRow}>
                <Text style={[styles.vitalValue, { color: getOxygenColor(vitals.bloodOxygen) }]}>
                  {vitals.bloodOxygen}
                </Text>
                <Text style={styles.vitalUnit}>%</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: getOxygenColor(vitals.bloodOxygen) + '20' }]}>
                <View style={[styles.statusDot, { backgroundColor: getOxygenColor(vitals.bloodOxygen) }]} />
                <Text style={[styles.statusText, { color: getOxygenColor(vitals.bloodOxygen) }]}>
                  {vitals.bloodOxygen >= 95 ? 'Normal' : 'Low'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Alert Cards */}
          <View style={styles.alertCardsRow}>
            <TouchableOpacity 
              style={[
                styles.alertCard,
                vitals.tremorLevel > 0 && styles.alertCardActive
              ]}
              onPress={() => navigateToDetails('Tremor Status', vitals.tremorStatus)}
            >
              <View style={[
                styles.alertCircle,
                { backgroundColor: vitals.tremorLevel > 0 ? '#F59E0B' : '#10B981' }
              ]}>
                <Text style={styles.alertIcon}>🤚</Text>
              </View>
              <Text style={styles.alertLabel}>Tremor</Text>
              <Text style={[
                styles.alertValue,
                { color: vitals.tremorLevel > 0 ? '#F59E0B' : '#10B981' }
              ]}>
                {vitals.tremorStatus}
              </Text>
            </TouchableOpacity>

            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <TouchableOpacity 
                style={[
                  styles.alertCard,
                  vitals.fallDetected && styles.alertCardDanger
                ]}
                onPress={() => navigateToDetails('Fall Status', vitals.fallStatus)}
              >
                <View style={[
                  styles.alertCircle,
                  { backgroundColor: vitals.fallDetected ? '#EF4444' : '#10B981' }
                ]}>
                  <Text style={styles.alertIcon}>⚠️</Text>
                </View>
                <Text style={styles.alertLabel}>Fall Status</Text>
                <Text style={[
                  styles.alertValue,
                  { color: vitals.fallDetected ? '#EF4444' : '#10B981' }
                ]}>
                  {vitals.fallStatus}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </View>

          {/* Fall Alert Banner */}
          {fallAlertVisible && (
            <Animated.View style={[styles.fallBanner, { opacity: fadeAnim }]}>
              <LinearGradient colors={['#EF4444', '#DC2626']} style={styles.fallGradient}>
                <Text style={styles.fallTitle}>🚨 FALL DETECTED!</Text>
                <Text style={styles.fallText}>Are you OK?</Text>
                <Text style={styles.fallTimer}>Auto-SOS in {timer}s</Text>
                <TouchableOpacity style={styles.okButton} onPress={handleImOK}>
                  <Text style={styles.okButtonText}>I'M OK</Text>
                </TouchableOpacity>
              </LinearGradient>
            </Animated.View>
          )}

          {/* Activity Summary */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Today's Activity</Text>
            <View style={styles.activityRow}>
              <View style={styles.activityCard}>
                <View style={[styles.circleIconSmall, { backgroundColor: '#EC4899' }]}>
                  <Text style={styles.activityIcon}>👟</Text>
                </View>
                <Text style={styles.activityValue}>{vitals.steps.toLocaleString()}</Text>
                <Text style={styles.activityLabel}>Steps</Text>
              </View>

              <View style={styles.activityCard}>
                <View style={[styles.circleIconSmall, { backgroundColor: '#F59E0B' }]}>
                  <Text style={styles.activityIcon}>🔥</Text>
                </View>
                <Text style={styles.activityValue}>{vitals.calories}</Text>
                <Text style={styles.activityLabel}>Calories</Text>
              </View>

              <View style={styles.activityCard}>
                <View style={[styles.circleIconSmall, { backgroundColor: '#8B5CF6' }]}>
                  <Text style={styles.activityIcon}>⏱️</Text>
                </View>
                <Text style={styles.activityValue}>8.5h</Text>
                <Text style={styles.activityLabel}>Active</Text>
              </View>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.actionGrid}>
              <TouchableOpacity 
                style={[styles.actionBtn, { backgroundColor: '#10B98120' }]}
                onPress={handleMedication}
              >
                <View style={[styles.actionCircle, { backgroundColor: '#10B981' }]}>
                  <Text style={styles.actionEmoji}>💊</Text>
                </View>
                <Text style={styles.actionText}>Medication</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.actionBtn, { backgroundColor: '#3B82F620' }]}
                onPress={handleReports}
              >
                <View style={[styles.actionCircle, { backgroundColor: '#3B82F6' }]}>
                  <Text style={styles.actionEmoji}>📊</Text>
                </View>
                <Text style={styles.actionText}>Reports</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.actionBtn, { backgroundColor: '#8B5CF620' }]}
                onPress={handleExercise}
              >
                <View style={[styles.actionCircle, { backgroundColor: '#8B5CF6' }]}>
                  <Text style={styles.actionEmoji}>🏋️</Text>
                </View>
                <Text style={styles.actionText}>Exercise</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.actionBtn, { backgroundColor: '#EC489920' }]}
                onPress={handleAppointments}
              >
                <View style={[styles.actionCircle, { backgroundColor: '#EC4899' }]}>
                  <Text style={styles.actionEmoji}>📅</Text>
                </View>
                <Text style={styles.actionText}>Appointments</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Emergency Buttons */}
          <View style={styles.emergencySection}>
            <TouchableOpacity style={styles.doctorBtn} onPress={handleCallDoctor}>
              <LinearGradient colors={['#10B981', '#059669']} style={styles.buttonGradient}>
                <View style={styles.emergencyContent}>
                  <View style={styles.emergencyCircle}>
                    <Text style={styles.emergencyIcon}>📞</Text>
                  </View>
                  <Text style={styles.emergencyText}>Call Doctor</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.sosBtn} onPress={handleManualSOS}>
              <LinearGradient colors={['#EF4444', '#DC2626']} style={styles.buttonGradient}>
                <View style={styles.emergencyContent}>
                  <View style={styles.emergencyCircle}>
                    <Text style={styles.emergencyIcon}>🚨</Text>
                  </View>
                  <Text style={styles.emergencyText}>Emergency SOS</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>

      {/* Custom Alert Modal */}
      <CustomAlert
        visible={alert.visible}
        type={alert.type}
        title={alert.title}
        message={alert.message}
        onConfirm={alert.onConfirm}
        onCancel={alert.onCancel}
        confirmText={alert.confirmText}
        cancelText={alert.cancelText}
      />
    </View>
  );
}

// Keep existing styles...
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  gradient: { flex: 1 },
  header: { 
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greeting: { 
    fontSize: isSmallDevice ? 13 : 14, 
    color: '#94A3B8',
    marginBottom: 4,
  },
  headerTitle: { 
    fontSize: isSmallDevice ? 26 : 32, 
    fontWeight: 'bold', 
    color: '#F1F5F9',
  },
  logoutBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  logoutIcon: { fontSize: 20, color: '#F87171' },
  content: { flex: 1, paddingHorizontal: 16 },
  scrollContent: { paddingBottom: 100 },
  
  vitalCardsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  vitalCardLarge: {
    flex: 1,
    borderRadius: 20,
    padding: isSmallDevice ? 16 : 20,
    borderWidth: 1,
    borderColor: '#ffffff10',
  },
  circleIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconEmoji: { fontSize: 28 },
  vitalLabel: { 
    fontSize: isSmallDevice ? 12 : 13, 
    color: '#94A3B8', 
    marginBottom: 8,
    fontWeight: '600',
  },
  vitalValueRow: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 12 },
  vitalValue: { 
    fontSize: isSmallDevice ? 32 : 36, 
    fontWeight: 'bold',
  },
  vitalUnit: { 
    fontSize: isSmallDevice ? 14 : 16, 
    color: '#64748B', 
    marginLeft: 6,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: { fontSize: 11, fontWeight: '600' },

  alertCardsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  alertCard: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  alertCardActive: {
    borderColor: '#F59E0B',
    backgroundColor: '#F59E0B10',
  },
  alertCardDanger: {
    borderColor: '#EF4444',
    backgroundColor: '#EF444410',
  },
  alertCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  alertIcon: { fontSize: 24 },
  alertLabel: { fontSize: 12, color: '#94A3B8', marginBottom: 4 },
  alertValue: { fontSize: 14, fontWeight: 'bold' },

  fallBanner: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
  },
  fallGradient: {
    padding: 24,
    alignItems: 'center',
  },
  fallTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
  fallText: { fontSize: 16, color: '#fff', marginBottom: 4 },
  fallTimer: { fontSize: 18, color: '#fff', fontWeight: '600', marginBottom: 16 },
  okButton: {
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  okButtonText: { fontSize: 16, fontWeight: 'bold', color: '#EF4444' },

  section: { marginBottom: 24 },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#F1F5F9', 
    marginBottom: 12,
  },
  activityRow: {
    flexDirection: 'row',
    gap: 12,
  },
  activityCard: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  circleIconSmall: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  activityIcon: { fontSize: 20 },
  activityValue: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#F1F5F9', 
    marginBottom: 4,
  },
  activityLabel: { fontSize: 11, color: '#94A3B8' },

  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionBtn: {
    width: (width - 44) / 2,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ffffff10',
  },
  actionCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionEmoji: { fontSize: 22 },
  actionText: { fontSize: 13, fontWeight: '600', color: '#F1F5F9' },

  emergencySection: { gap: 12, marginBottom: 20 },
  doctorBtn: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  sosBtn: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  buttonGradient: {
    padding: 18,
  },
  emergencyContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  emergencyCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffffff20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emergencyIcon: { fontSize: 20 },
  emergencyText: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#fff',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  profileBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  profileIcon: { fontSize: 20, color: '#60A5FA' },
});