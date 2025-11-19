import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, 
  StatusBar, Platform, Dimensions, Modal, TextInput 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import CustomAlert from '../../../components/common/CustomAlert';

const { width } = Dimensions.get('window');

type Appointment = {
  id: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  type: 'In-person' | 'Video Call' | 'Phone Call';
  status: 'upcoming' | 'completed' | 'cancelled';
  icon: string;
  color: string;
};

export default function AppointmentsScreen() {
  const router = useRouter();
  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/screens/DashboardScreen' as any);
    }
  };
  const [appointments, setAppointments] = useState<Appointment[]>([
    { 
      id: '1', 
      doctorName: 'Dr. Sarah Smith', 
      specialty: 'Neurologist',
      date: 'Nov 25, 2024',
      time: '10:30 AM',
      type: 'In-person',
      status: 'upcoming',
      icon: '👨‍⚕️',
      color: '#3B82F6'
    },
    { 
      id: '2', 
      doctorName: 'Dr. Michael Chen', 
      specialty: 'Physical Therapist',
      date: 'Nov 28, 2024',
      time: '02:00 PM',
      type: 'Video Call',
      status: 'upcoming',
      icon: '🎥',
      color: '#10B981'
    },
    { 
      id: '3', 
      doctorName: 'Dr. Emily Johnson', 
      specialty: 'General Physician',
      date: 'Nov 20, 2024',
      time: '11:00 AM',
      type: 'Phone Call',
      status: 'completed',
      icon: '📞',
      color: '#8B5CF6'
    },
  ]);

  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  
  const [alert, setAlert] = useState({
    visible: false,
    type: 'success' as 'success' | 'error' | 'warning' | 'info' | 'confirm',
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const upcomingAppointments = appointments.filter(a => a.status === 'upcoming');
  const nextAppointment = upcomingAppointments[0];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return '#3B82F6';
      case 'completed': return '#10B981';
      case 'cancelled': return '#EF4444';
      default: return '#64748B';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'In-person': return '🏥';
      case 'Video Call': return '🎥';
      case 'Phone Call': return '📞';
      default: return '📅';
    }
  };

  const handleReschedule = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setNewDate(appointment.date);
    setNewTime(appointment.time);
    setShowRescheduleModal(true);
  };

  const confirmReschedule = () => {
    if (!newDate || !newTime) {
      setAlert({
        visible: true,
        type: 'error',
        title: 'Missing Information',
        message: 'Please enter both date and time',
        onConfirm: () => setAlert(prev => ({ ...prev, visible: false })),
      });
      return;
    }

    setAppointments(appointments.map(apt => 
      apt.id === selectedAppointment?.id 
        ? { ...apt, date: newDate, time: newTime }
        : apt
    ));

    setShowRescheduleModal(false);
    setAlert({
      visible: true,
      type: 'success',
      title: 'Rescheduled',
      message: `Appointment rescheduled to ${newDate} at ${newTime}`,
      onConfirm: () => setAlert(prev => ({ ...prev, visible: false })),
    });
  };

  const handleCancelAppointment = (id: string) => {
    setAlert({
      visible: true,
      type: 'confirm',
      title: 'Cancel Appointment',
      message: 'Are you sure you want to cancel this appointment?',
      onConfirm: () => {
        setAppointments(appointments.map(apt => 
          apt.id === id ? { ...apt, status: 'cancelled' as const } : apt
        ));
        setAlert(prev => ({ ...prev, visible: false }));
      },
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E293B" />
      <LinearGradient colors={['#1E293B', '#0F172A']} style={styles.gradient}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backBtn}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Appointments</Text>
          <TouchableOpacity style={styles.calendarBtn}>
            <Text style={styles.calendarIcon}>📅</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Next Appointment Card */}
          {nextAppointment && (
            <View style={styles.nextCard}>
              <LinearGradient colors={['#3B82F6', '#8B5CF6']} style={styles.nextGradient}>
                <View style={styles.nextHeader}>
                  <Text style={styles.nextLabel}>Next Appointment</Text>
                  <View style={styles.nextBadge}>
                    <Text style={styles.nextBadgeText}>UPCOMING</Text>
                  </View>
                </View>
                
                <View style={styles.nextInfo}>
                  <View style={styles.nextIcon}>
                    <Text style={styles.nextEmoji}>{nextAppointment.icon}</Text>
                  </View>
                  <View style={styles.nextDetails}>
                    <Text style={styles.nextDoctor}>{nextAppointment.doctorName}</Text>
                    <Text style={styles.nextSpecialty}>{nextAppointment.specialty}</Text>
                    <View style={styles.nextMeta}>
                      <Text style={styles.nextMetaItem}>📅 {nextAppointment.date}</Text>
                      <Text style={styles.nextMetaItem}>⏰ {nextAppointment.time}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.nextActions}>
                  <TouchableOpacity style={styles.nextActionBtn}>
                    <Text style={styles.nextActionText}>Join Call</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.nextActionBtn, styles.nextActionBtnSecondary]}
                    onPress={() => handleReschedule(nextAppointment)}
                  >
                    <Text style={[styles.nextActionText, styles.nextActionTextSecondary]}>
                      Reschedule
                    </Text>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </View>
          )}

          {/* Book Appointment Button */}
          <TouchableOpacity style={styles.bookBtn}>
            <View style={styles.bookContent}>
              <View style={styles.bookIcon}>
                <Text style={styles.bookEmoji}>➕</Text>
              </View>
              <View style={styles.bookInfo}>
                <Text style={styles.bookTitle}>Book New Appointment</Text>
                <Text style={styles.bookText}>Schedule with your doctor</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Appointments List */}
          <Text style={styles.sectionTitle}>All Appointments</Text>
          {appointments.map((appointment) => (
            <View 
              key={appointment.id}
              style={[
                styles.appointmentCard,
                appointment.status === 'completed' && styles.appointmentCardCompleted,
                appointment.status === 'cancelled' && styles.appointmentCardCancelled
              ]}
            >
              <View style={[styles.appointmentIcon, { backgroundColor: appointment.color + '20' }]}>
                <Text style={styles.appointmentEmoji}>{appointment.icon}</Text>
              </View>
              
              <View style={styles.appointmentInfo}>
                <Text style={styles.appointmentDoctor}>{appointment.doctorName}</Text>
                <Text style={styles.appointmentSpecialty}>{appointment.specialty}</Text>
                <View style={styles.appointmentMeta}>
                  <Text style={styles.appointmentMetaItem}>
                    {getTypeIcon(appointment.type)} {appointment.type}
                  </Text>
                  <Text style={styles.appointmentMetaItem}>
                    📅 {appointment.date} • {appointment.time}
                  </Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(appointment.status) + '20' }]}>
                  <View style={[styles.statusDot, { backgroundColor: getStatusColor(appointment.status) }]} />
                  <Text style={[styles.statusText, { color: getStatusColor(appointment.status) }]}>
                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                  </Text>
                </View>
              </View>

              {appointment.status === 'upcoming' && (
                <View style={styles.appointmentActions}>
                  <TouchableOpacity 
                    style={styles.iconBtn}
                    onPress={() => handleReschedule(appointment)}
                  >
                    <Text style={styles.iconBtnText}>🔄</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.iconBtn}
                    onPress={() => handleCancelAppointment(appointment.id)}
                  >
                    <Text style={styles.iconBtnText}>❌</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}

          {/* Info Card */}
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>📌 Reminder</Text>
            <Text style={styles.infoText}>
              Please arrive 10 minutes early for in-person appointments. For video calls, ensure your camera and microphone are working.
            </Text>
          </View>
        </ScrollView>
      </LinearGradient>

      {/* Reschedule Modal */}
      <Modal
        visible={showRescheduleModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowRescheduleModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Reschedule Appointment</Text>
            <Text style={styles.modalSubtitle}>{selectedAppointment?.doctorName}</Text>
            
            <View style={styles.modalInputGroup}>
              <Text style={styles.modalLabel}>New Date</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g., Dec 5, 2024"
                placeholderTextColor="#64748B"
                value={newDate}
                onChangeText={setNewDate}
              />
            </View>

            <View style={styles.modalInputGroup}>
              <Text style={styles.modalLabel}>New Time</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g., 02:00 PM"
                placeholderTextColor="#64748B"
                value={newTime}
                onChangeText={setNewTime}
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={[styles.modalBtn, styles.modalBtnCancel]}
                onPress={() => setShowRescheduleModal(false)}
              >
                <Text style={styles.modalBtnTextCancel}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.modalBtn} onPress={confirmReschedule}>
                <LinearGradient colors={['#3B82F6', '#8B5CF6']} style={styles.modalBtnGradient}>
                  <Text style={styles.modalBtnText}>Confirm</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <CustomAlert
        visible={alert.visible}
        type={alert.type}
        title={alert.title}
        message={alert.message}
        onConfirm={alert.onConfirm}
        onCancel={() => setAlert(prev => ({ ...prev, visible: false }))}
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
  calendarBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  calendarIcon: { fontSize: 20 },
  content: { flex: 1, paddingHorizontal: 20 },

  nextCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
  },
  nextGradient: {
    padding: 20,
  },
  nextHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  nextLabel: { fontSize: 14, color: '#fff', opacity: 0.8 },
  nextBadge: {
    backgroundColor: '#ffffff30',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  nextBadgeText: { fontSize: 11, fontWeight: 'bold', color: '#fff' },
  nextInfo: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  nextIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ffffff20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  nextEmoji: { fontSize: 28 },
  nextDetails: { flex: 1 },
  nextDoctor: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  nextSpecialty: { fontSize: 14, color: '#fff', opacity: 0.8, marginBottom: 8 },
  nextMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  nextMetaItem: { fontSize: 13, color: '#fff', opacity: 0.9 },
  nextActions: {
    flexDirection: 'row',
    gap: 12,
  },
  nextActionBtn: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  nextActionBtnSecondary: {
    backgroundColor: '#ffffff20',
  },
  nextActionText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  nextActionTextSecondary: {
    color: '#fff',
  },

  bookBtn: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#334155',
  },
  bookContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bookIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#3B82F620',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  bookEmoji: { fontSize: 24 },
  bookInfo: { flex: 1 },
  bookTitle: { fontSize: 16, fontWeight: 'bold', color: '#F1F5F9', marginBottom: 4 },
  bookText: { fontSize: 13, color: '#94A3B8' },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F1F5F9',
    marginBottom: 12,
  },
  appointmentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  appointmentCardCompleted: {
    opacity: 0.6,
  },
  appointmentCardCancelled: {
    opacity: 0.5,
    borderColor: '#EF4444',
  },
  appointmentIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  appointmentEmoji: { fontSize: 24 },
  appointmentInfo: { flex: 1 },
  appointmentDoctor: { fontSize: 16, fontWeight: 'bold', color: '#F1F5F9', marginBottom: 4 },
  appointmentSpecialty: { fontSize: 13, color: '#94A3B8', marginBottom: 8 },
  appointmentMeta: {
    marginBottom: 8,
  },
  appointmentMetaItem: { fontSize: 12, color: '#64748B', marginBottom: 2 },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: { fontSize: 11, fontWeight: '600' },
  appointmentActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBtnText: { fontSize: 16 },

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

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#F1F5F9',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#94A3B8',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalInputGroup: {
    marginBottom: 16,
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F1F5F9',
    marginBottom: 8,
  },
  modalInput: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    color: '#F1F5F9',
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  modalBtn: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalBtnCancel: {
    backgroundColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
  },
  modalBtnGradient: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  modalBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  modalBtnTextCancel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F1F5F9',
  },
});