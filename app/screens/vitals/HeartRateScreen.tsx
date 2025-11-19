import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, 
  StatusBar, Platform, Dimensions 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function HeartRateScreen() {
  const router = useRouter();
  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/screens/DashboardScreen' as any);
    }
  };
  const [currentHR, setCurrentHR] = useState(72);
  const [historicalData] = useState([
    { time: '6 AM', value: 68 },
    { time: '9 AM', value: 72 },
    { time: '12 PM', value: 75 },
    { time: '3 PM', value: 78 },
    { time: '6 PM', value: 74 },
    { time: 'Now', value: currentHR },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHR(65 + Math.floor(Math.random() * 25));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const getHRColor = (hr: number) => {
    if (hr < 60 || hr > 100) return '#EF4444';
    if (hr < 70 || hr > 90) return '#F59E0B';
    return '#10B981';
  };

  const getHRStatus = (hr: number) => {
    if (hr < 60) return 'Low';
    if (hr > 100) return 'High';
    if (hr < 70 || hr > 90) return 'Elevated';
    return 'Normal';
  };

  const maxValue = Math.max(...historicalData.map(d => d.value));

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E293B" />
      <LinearGradient colors={['#1E293B', '#0F172A']} style={styles.gradient}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backBtn}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Heart Rate</Text>
          <TouchableOpacity style={styles.historyBtn}>
            <Text style={styles.historyIcon}>📊</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Current Heart Rate */}
          <View style={styles.currentCard}>
            <LinearGradient 
              colors={[getHRColor(currentHR), getHRColor(currentHR) + 'CC']} 
              style={styles.currentGradient}
            >
              <Text style={styles.currentLabel}>Current Heart Rate</Text>
              <View style={styles.heartIcon}>
                <Text style={styles.heartEmoji}>❤️</Text>
              </View>
              <Text style={styles.currentValue}>{currentHR}</Text>
              <Text style={styles.currentUnit}>BPM</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>{getHRStatus(currentHR)}</Text>
              </View>
            </LinearGradient>
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Resting</Text>
              <Text style={styles.statValue}>68</Text>
              <Text style={styles.statUnit}>BPM</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Average</Text>
              <Text style={styles.statValue}>72</Text>
              <Text style={styles.statUnit}>BPM</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Peak</Text>
              <Text style={styles.statValue}>85</Text>
              <Text style={styles.statUnit}>BPM</Text>
            </View>
          </View>

          {/* Chart */}
          <View style={styles.chartSection}>
            <Text style={styles.sectionTitle}>Today's Trend</Text>
            <View style={styles.chartCard}>
              <View style={styles.chart}>
                {historicalData.map((data, index) => {
                  const height = (data.value / maxValue) * 120;
                  const color = getHRColor(data.value);
                  return (
                    <View key={index} style={styles.chartBar}>
                      <View style={[styles.bar, { height, backgroundColor: color }]} />
                      <Text style={styles.barLabel}>{data.time}</Text>
                      <Text style={styles.barValue}>{data.value}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
          </View>

          {/* Range Info */}
          <View style={styles.rangeSection}>
            <Text style={styles.sectionTitle}>Heart Rate Zones</Text>
            <View style={styles.rangeCard}>
              <View style={styles.rangeItem}>
                <View style={[styles.rangeDot, { backgroundColor: '#10B981' }]} />
                <Text style={styles.rangeLabel}>Normal: 60-100 BPM</Text>
              </View>
              <View style={styles.rangeItem}>
                <View style={[styles.rangeDot, { backgroundColor: '#F59E0B' }]} />
                <Text style={styles.rangeLabel}>Elevated: 100-120 BPM</Text>
              </View>
              <View style={styles.rangeItem}>
                <View style={[styles.rangeDot, { backgroundColor: '#EF4444' }]} />
                <Text style={styles.rangeLabel}>High: Above 120 BPM</Text>
              </View>
            </View>
          </View>

          {/* Tips */}
          <View style={styles.tipsCard}>
            <Text style={styles.tipsTitle}>💡 Heart Health Tips</Text>
            <Text style={styles.tipsText}>
              • Stay hydrated throughout the day{'\n'}
              • Take regular breaks during physical activity{'\n'}
              • Monitor your heart rate during exercise{'\n'}
              • Contact your doctor if you notice irregular patterns
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
  historyBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  historyIcon: { fontSize: 20 },
  content: { flex: 1, paddingHorizontal: 20 },

  currentCard: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 20,
  },
  currentGradient: {
    padding: 32,
    alignItems: 'center',
  },
  currentLabel: { fontSize: 16, color: '#fff', opacity: 0.9, marginBottom: 16 },
  heartIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ffffff20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  heartEmoji: { fontSize: 40 },
  currentValue: { fontSize: 64, fontWeight: 'bold', color: '#fff' },
  currentUnit: { fontSize: 24, color: '#fff', opacity: 0.8, marginBottom: 16 },
  statusBadge: {
    backgroundColor: '#ffffff30',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusText: { fontSize: 14, fontWeight: 'bold', color: '#fff' },

  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
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
  statLabel: { fontSize: 12, color: '#94A3B8', marginBottom: 8 },
  statValue: { fontSize: 24, fontWeight: 'bold', color: '#F1F5F9', marginBottom: 4 },
  statUnit: { fontSize: 12, color: '#64748B' },

  chartSection: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F1F5F9',
    marginBottom: 12,
  },
  chartCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 160,
  },
  chartBar: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
  },
  bar: {
    width: '70%',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    marginBottom: 8,
  },
  barLabel: { fontSize: 10, color: '#94A3B8', marginBottom: 2 },
  barValue: { fontSize: 11, fontWeight: 'bold', color: '#F1F5F9' },

  rangeSection: { marginBottom: 24 },
  rangeCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  rangeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  rangeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  rangeLabel: { fontSize: 14, color: '#F1F5F9' },

  tipsCard: {
    backgroundColor: '#3B82F615',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#3B82F640',
  },
  tipsTitle: { fontSize: 16, fontWeight: 'bold', color: '#F1F5F9', marginBottom: 12 },
  tipsText: { fontSize: 13, color: '#94A3B8', lineHeight: 22 },
});