import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, 
  StatusBar, Platform, Dimensions, Image 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { auth } from '../../../config/firebase';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const router = useRouter();
  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/screens/DashboardScreen' as any);
    }
  };
  const user = auth.currentUser;

  const profileStats = [
    { label: 'Age', value: '20', icon: '🎂' },
    { label: 'Height', value: '5\'5"', icon: '📏' },
    { label: 'Weight', value: '165 lbs', icon: '⚖️' },
  ];

  const menuItems = [
    { id: '1', title: 'Edit Profile', icon: '✏️', route: '/screens/profile/EditProfileScreen', color: '#3B82F6' },
    { id: '2', title: 'Medical History', icon: '📋', route: '/screens/profile/MedicalHistoryScreen', color: '#10B981' },
    { id: '3', title: 'Emergency Contacts', icon: '🚨', route: '/screens/settings/EmergencyContactsScreen', color: '#EF4444' },
    { id: '4', title: 'Notification Settings', icon: '🔔', route: '/screens/settings/NotificationSettingsScreen', color: '#F59E0B' },
    { id: '5', title: 'Settings', icon: '⚙️', route: '/screens/settings/SettingsScreen', color: '#8B5CF6' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E293B" />
      <LinearGradient colors={['#1E293B', '#0F172A']} style={styles.gradient}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backBtn}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Profile Card */}
          <View style={styles.profileCard}>
            <LinearGradient colors={['#3B82F6', '#8B5CF6']} style={styles.profileGradient}>
              <View style={styles.avatarContainer}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>SS</Text>
                </View>
                <TouchableOpacity style={styles.editAvatarBtn}>
                  <Text style={styles.editAvatarIcon}>📷</Text>
                </TouchableOpacity>
              </View>
              
              <Text style={styles.profileName}>Shanvi</Text>
              <Text style={styles.profileEmail}>{user?.email || 'Shanvi@gmail.com'}</Text>
              
              <View style={styles.statsRow}>
                {profileStats.map((stat, index) => (
                  <View key={index} style={styles.statItem}>
                    <Text style={styles.statIcon}>{stat.icon}</Text>
                    <Text style={styles.statValue}>{stat.value}</Text>
                    <Text style={styles.statLabel}>{stat.label}</Text>
                  </View>
                ))}
              </View>
            </LinearGradient>
          </View>

          {/* Health Summary */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Health Summary</Text>
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <View style={styles.summaryItem}>
                  <View style={[styles.summaryIcon, { backgroundColor: '#10B98120' }]}>
                    <Text style={styles.summaryEmoji}>💊</Text>
                  </View>
                  <View style={styles.summaryInfo}>
                    <Text style={styles.summaryValue}>85%</Text>
                    <Text style={styles.summaryLabel}>Medication Adherence</Text>
                  </View>
                </View>
              </View>

              <View style={styles.summaryRow}>
                <View style={styles.summaryItem}>
                  <View style={[styles.summaryIcon, { backgroundColor: '#3B82F620' }]}>
                    <Text style={styles.summaryEmoji}>🏃</Text>
                  </View>
                  <View style={styles.summaryInfo}>
                    <Text style={styles.summaryValue}>4.2k</Text>
                    <Text style={styles.summaryLabel}>Steps Today</Text>
                  </View>
                </View>
              </View>

              <View style={styles.summaryRow}>
                <View style={styles.summaryItem}>
                  <View style={[styles.summaryIcon, { backgroundColor: '#8B5CF620' }]}>
                    <Text style={styles.summaryEmoji}>😊</Text>
                  </View>
                  <View style={styles.summaryInfo}>
                    <Text style={styles.summaryValue}>Good</Text>
                    <Text style={styles.summaryLabel}>Overall Health</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Menu Items */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account</Text>
            {menuItems.map((item) => (
              <TouchableOpacity 
                key={item.id}
                style={styles.menuItem}
                onPress={() => router.push(item.route as any)}
                activeOpacity={0.7}
              >
                <View style={[styles.menuIcon, { backgroundColor: item.color + '20' }]}>
                  <Text style={styles.menuEmoji}>{item.icon}</Text>
                </View>
                <Text style={styles.menuText}>{item.title}</Text>
                <Text style={styles.menuArrow}>›</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* App Info */}
          <View style={styles.infoCard}>
            <Text style={styles.infoText}>Version 1.0.0</Text>
            <Text style={styles.infoText}>© 2024 ParkinTrace</Text>
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
  placeholder: { width: 44 },
  content: { flex: 1, paddingHorizontal: 20 },

  profileCard: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 24,
  },
  profileGradient: {
    padding: 24,
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ffffff30',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#fff',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editAvatarIcon: { fontSize: 16 },
  profileName: { fontSize: 26, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  profileEmail: { fontSize: 14, color: '#fff', opacity: 0.8, marginBottom: 20 },
  statsRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#ffffff30',
  },
  statItem: {
    alignItems: 'center',
  },
  statIcon: { fontSize: 24, marginBottom: 8 },
  statValue: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  statLabel: { fontSize: 12, color: '#fff', opacity: 0.8 },

  section: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F1F5F9',
    marginBottom: 12,
  },
  summaryCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  summaryRow: {
    marginBottom: 16,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  summaryEmoji: { fontSize: 24 },
  summaryInfo: { flex: 1 },
  summaryValue: { fontSize: 20, fontWeight: 'bold', color: '#F1F5F9', marginBottom: 2 },
  summaryLabel: { fontSize: 13, color: '#94A3B8' },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  menuIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuEmoji: { fontSize: 20 },
  menuText: { flex: 1, fontSize: 16, fontWeight: '600', color: '#F1F5F9' },
  menuArrow: { fontSize: 24, color: '#64748B' },

  infoCard: {
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 20,
  },
  infoText: { fontSize: 12, color: '#64748B', marginBottom: 4 },
});