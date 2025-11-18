import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, 
  StatusBar, Platform, Dimensions 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

type Report = {
  id: string;
  title: string;
  date: string;
  type: string;
  icon: string;
  color: string;
  status: 'normal' | 'warning' | 'critical';
};

export default function ReportsScreen() {
  const router = useRouter();
  const [reports] = useState<Report[]>([
    { 
      id: '1', 
      title: 'Monthly Health Summary', 
      date: 'Nov 15, 2024', 
      type: 'PDF', 
      icon: '📄', 
      color: '#3B82F6',
      status: 'normal'
    },
    { 
      id: '2', 
      title: 'Tremor Analysis Report', 
      date: 'Nov 12, 2024', 
      type: 'PDF', 
      icon: '📊', 
      color: '#F59E0B',
      status: 'warning'
    },
    { 
      id: '3', 
      title: 'Fall Detection Log', 
      date: 'Nov 10, 2024', 
      type: 'PDF', 
      icon: '⚠️', 
      color: '#EF4444',
      status: 'critical'
    },
    { 
      id: '4', 
      title: 'Medication Adherence', 
      date: 'Nov 8, 2024', 
      type: 'PDF', 
      icon: '💊', 
      color: '#10B981',
      status: 'normal'
    },
  ]);

  const [stats] = useState([
    { label: 'Total Reports', value: '24', icon: '📊', color: '#3B82F6' },
    { label: 'This Month', value: '8', icon: '📅', color: '#10B981' },
    { label: 'Pending', value: '2', icon: '⏳', color: '#F59E0B' },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return '#10B981';
      case 'warning': return '#F59E0B';
      case 'critical': return '#EF4444';
      default: return '#64748B';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'normal': return 'Normal';
      case 'warning': return 'Review Needed';
      case 'critical': return 'Urgent';
      default: return 'Unknown';
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E293B" />
      <LinearGradient colors={['#1E293B', '#0F172A']} style={styles.gradient}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Reports</Text>
          <TouchableOpacity style={styles.filterBtn}>
            <Text style={styles.filterIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Stats Row */}
          <View style={styles.statsRow}>
            {stats.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: stat.color + '20' }]}>
                  <Text style={styles.statEmoji}>{stat.icon}</Text>
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>

          {/* Generate Report Button */}
          <TouchableOpacity style={styles.generateBtn}>
            <LinearGradient colors={['#3B82F6', '#8B5CF6']} style={styles.generateGradient}>
              <View style={styles.generateContent}>
                <View style={styles.generateIcon}>
                  <Text style={styles.generateEmoji}>➕</Text>
                </View>
                <View style={styles.generateInfo}>
                  <Text style={styles.generateTitle}>Generate New Report</Text>
                  <Text style={styles.generateText}>Create custom health report</Text>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* Reports List */}
          <Text style={styles.sectionTitle}>Recent Reports</Text>
          {reports.map((report) => (
            <TouchableOpacity 
              key={report.id}
              style={styles.reportCard}
              activeOpacity={0.7}
            >
              <View style={[styles.reportIcon, { backgroundColor: report.color + '20' }]}>
                <Text style={styles.reportEmoji}>{report.icon}</Text>
              </View>
              
              <View style={styles.reportInfo}>
                <Text style={styles.reportTitle}>{report.title}</Text>
                <Text style={styles.reportDate}>📅 {report.date} • {report.type}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(report.status) + '20' }]}>
                  <View style={[styles.statusDot, { backgroundColor: getStatusColor(report.status) }]} />
                  <Text style={[styles.statusText, { color: getStatusColor(report.status) }]}>
                    {getStatusText(report.status)}
                  </Text>
                </View>
              </View>

              <TouchableOpacity style={styles.downloadBtn}>
                <Text style={styles.downloadIcon}>⬇️</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}

          {/* Info Card */}
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>📌 Report Schedule</Text>
            <Text style={styles.infoText}>
              Monthly health summaries are automatically generated on the 1st of each month. You can request custom reports anytime.
            </Text>
          </View>
        </ScrollView>
      </LinearGradient>
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
  filterBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  filterIcon: { fontSize: 20 },
  content: { flex: 1, paddingHorizontal: 20 },

  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statEmoji: { fontSize: 20 },
  statValue: { fontSize: 22, fontWeight: 'bold', color: '#F1F5F9', marginBottom: 4 },
  statLabel: { fontSize: 11, color: '#94A3B8', textAlign: 'center' },

  generateBtn: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
  },
  generateGradient: {
    padding: 16,
  },
  generateContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  generateIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ffffff20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  generateEmoji: { fontSize: 24 },
  generateInfo: { flex: 1 },
  generateTitle: { fontSize: 16, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  generateText: { fontSize: 13, color: '#fff', opacity: 0.8 },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F1F5F9',
    marginBottom: 12,
  },
  reportCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  reportIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  reportEmoji: { fontSize: 24 },
  reportInfo: { flex: 1 },
  reportTitle: { fontSize: 15, fontWeight: 'bold', color: '#F1F5F9', marginBottom: 6 },
  reportDate: { fontSize: 12, color: '#94A3B8', marginBottom: 8 },
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
  downloadBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
  },
  downloadIcon: { fontSize: 16 },

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