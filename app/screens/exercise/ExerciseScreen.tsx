import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, 
  StatusBar, Platform, Dimensions 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

type Exercise = {
  id: string;
  title: string;
  duration: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  completed: boolean;
  icon: string;
  color: string;
  description: string;
};

export default function ExerciseScreen() {
  const router = useRouter();
  const [exercises, setExercises] = useState<Exercise[]>([
    { 
      id: '1', 
      title: 'Walking', 
      duration: '30 min', 
      difficulty: 'Easy',
      completed: true,
      icon: '🚶',
      color: '#10B981',
      description: 'Light walking around the house'
    },
    { 
      id: '2', 
      title: 'Hand Exercises', 
      duration: '15 min', 
      difficulty: 'Easy',
      completed: false,
      icon: '🤲',
      color: '#3B82F6',
      description: 'Finger tapping and grip exercises'
    },
    { 
      id: '3', 
      title: 'Balance Training', 
      duration: '20 min', 
      difficulty: 'Medium',
      completed: false,
      icon: '🧘',
      color: '#8B5CF6',
      description: 'Standing balance exercises'
    },
    { 
      id: '4', 
      title: 'Stretching', 
      duration: '10 min', 
      difficulty: 'Easy',
      completed: false,
      icon: '🤸',
      color: '#F59E0B',
      description: 'Full body stretching routine'
    },
  ]);

  const completedCount = exercises.filter(e => e.completed).length;
  const totalMinutes = exercises.reduce((acc, e) => {
    if (e.completed) {
      return acc + parseInt(e.duration);
    }
    return acc;
  }, 0);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return '#10B981';
      case 'Medium': return '#F59E0B';
      case 'Hard': return '#EF4444';
      default: return '#64748B';
    }
  };

  const toggleExercise = (id: string) => {
    setExercises(prev =>
      prev.map(ex =>
        ex.id === id ? { ...ex, completed: !ex.completed } : ex
      )
    );
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
          <Text style={styles.headerTitle}>Exercise</Text>
          <TouchableOpacity style={styles.videoBtn}>
            <Text style={styles.videoIcon}>🎥</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Progress Card */}
          <View style={styles.progressCard}>
            <LinearGradient colors={['#8B5CF6', '#7C3AED']} style={styles.progressGradient}>
              <View style={styles.progressRow}>
                <View style={styles.progressItem}>
                  <Text style={styles.progressValue}>{completedCount}/{exercises.length}</Text>
                  <Text style={styles.progressLabel}>Completed</Text>
                </View>
                <View style={styles.progressDivider} />
                <View style={styles.progressItem}>
                  <Text style={styles.progressValue}>{totalMinutes} min</Text>
                  <Text style={styles.progressLabel}>Today</Text>
                </View>
                <View style={styles.progressDivider} />
                <View style={styles.progressItem}>
                  <Text style={styles.progressValue}>🔥 7</Text>
                  <Text style={styles.progressLabel}>Day Streak</Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* Today's Routine */}
          <Text style={styles.sectionTitle}>Today's Routine</Text>
          {exercises.map((exercise) => (
            <TouchableOpacity 
              key={exercise.id}
              style={[styles.exerciseCard, exercise.completed && styles.exerciseCardCompleted]}
              onPress={() => toggleExercise(exercise.id)}
              activeOpacity={0.7}
            >
              <View style={[styles.exerciseIcon, { backgroundColor: exercise.color + '20' }]}>
                <Text style={styles.exerciseEmoji}>{exercise.icon}</Text>
              </View>
              
              <View style={styles.exerciseInfo}>
                <Text style={[styles.exerciseTitle, exercise.completed && styles.exerciseTitleCompleted]}>
                  {exercise.title}
                </Text>
                <Text style={styles.exerciseDescription}>{exercise.description}</Text>
                <View style={styles.exerciseMeta}>
                  <View style={styles.metaItem}>
                    <Text style={styles.metaIcon}>⏱️</Text>
                    <Text style={styles.metaText}>{exercise.duration}</Text>
                  </View>
                  <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(exercise.difficulty) + '20' }]}>
                    <Text style={[styles.difficultyText, { color: getDifficultyColor(exercise.difficulty) }]}>
                      {exercise.difficulty}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={[styles.checkbox, exercise.completed && styles.checkboxChecked]}>
                {exercise.completed && <Text style={styles.checkmark}>✓</Text>}
              </View>
            </TouchableOpacity>
          ))}

          {/* Tips Card */}
          <View style={styles.tipsCard}>
            <View style={styles.tipsHeader}>
              <Text style={styles.tipsIcon}>💡</Text>
              <Text style={styles.tipsTitle}>Exercise Tips</Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipBullet}>•</Text>
              <Text style={styles.tipText}>Start slowly and gradually increase intensity</Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipBullet}>•</Text>
              <Text style={styles.tipText}>Stay hydrated throughout your routine</Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipBullet}>•</Text>
              <Text style={styles.tipText}>Listen to your body and rest when needed</Text>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.actionCard}>
              <View style={[styles.actionIcon, { backgroundColor: '#3B82F620' }]}>
                <Text style={styles.actionEmoji}>📹</Text>
              </View>
              <Text style={styles.actionText}>Video Guides</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard}>
              <View style={[styles.actionIcon, { backgroundColor: '#10B98120' }]}>
                <Text style={styles.actionEmoji}>📊</Text>
              </View>
              <Text style={styles.actionText}>Progress</Text>
            </TouchableOpacity>
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
  videoBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  videoIcon: { fontSize: 20 },
  content: { flex: 1, paddingHorizontal: 20 },

  progressCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 24,
  },
  progressGradient: {
    padding: 20,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  progressItem: {
    alignItems: 'center',
  },
  progressValue: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  progressLabel: { fontSize: 12, color: '#fff', opacity: 0.8 },
  progressDivider: {
    width: 1,
    backgroundColor: '#ffffff30',
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F1F5F9',
    marginBottom: 12,
  },
  exerciseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  exerciseCardCompleted: {
    opacity: 0.6,
  },
  exerciseIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  exerciseEmoji: { fontSize: 24 },
  exerciseInfo: { flex: 1 },
  exerciseTitle: { fontSize: 16, fontWeight: 'bold', color: '#F1F5F9', marginBottom: 4 },
  exerciseTitleCompleted: { textDecorationLine: 'line-through', color: '#64748B' },
  exerciseDescription: { fontSize: 13, color: '#94A3B8', marginBottom: 8 },
  exerciseMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaIcon: { fontSize: 12 },
  metaText: { fontSize: 12, color: '#94A3B8' },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  difficultyText: { fontSize: 11, fontWeight: '600' },
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

  tipsCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipsIcon: { fontSize: 20, marginRight: 8 },
  tipsTitle: { fontSize: 16, fontWeight: 'bold', color: '#F1F5F9' },
  tipItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  tipBullet: { fontSize: 16, color: '#8B5CF6', marginRight: 8, marginTop: -2 },
  tipText: { flex: 1, fontSize: 13, color: '#94A3B8', lineHeight: 20 },

  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionEmoji: { fontSize: 24 },
  actionText: { fontSize: 13, fontWeight: '600', color: '#F1F5F9' },
});