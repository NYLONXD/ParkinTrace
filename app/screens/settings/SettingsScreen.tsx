import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, 
  StatusBar, Platform, Switch 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import CustomAlert from '../../../components/common/CustomAlert';

export default function SettingsScreen() {
  const router = useRouter();
  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/screens/DashboardScreen' as any);
    }
  };
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [fallDetectionEnabled, setFallDetectionEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(true);

  const [alert, setAlert] = useState({
    visible: false,
    type: 'info' as 'success' | 'error' | 'warning' | 'info' | 'confirm',
    title: '',
    message: '',
  });

  const settingsSections = [
    {
      title: 'Monitoring',
      items: [
        { 
          id: '1', 
          label: 'Fall Detection', 
          value: fallDetectionEnabled, 
          onChange: setFallDetectionEnabled,
          icon: '⚠️',
          description: 'Automatically detect falls'
        },
        { 
          id: '2', 
          label: 'Location Services', 
          value: locationEnabled, 
          onChange: setLocationEnabled,
          icon: '📍',
          description: 'Share location with caregivers'
        },
      ]
    },
    {
      title: 'Notifications',
      items: [
        { 
          id: '3', 
          label: 'Push Notifications', 
          value: notificationsEnabled, 
          onChange: setNotificationsEnabled,
          icon: '🔔',
          description: 'Medication and appointment reminders'
        },
      ]
    },
    {
      title: 'Appearance',
      items: [
        { 
          id: '4', 
          label: 'Dark Mode', 
          value: darkModeEnabled, 
          onChange: setDarkModeEnabled,
          icon: '🌙',
          description: 'Use dark theme'
        },
      ]
    }
  ];

  const accountItems = [
    { id: '1', title: 'Privacy Policy', icon: '🔒', color: '#3B82F6' },
    { id: '2', title: 'Terms of Service', icon: '📄', color: '#10B981' },
    { id: '3', title: 'Help & Support', icon: '❓', color: '#F59E0B' },
    { id: '4', title: 'About', icon: 'ℹ️', color: '#8B5CF6' },
  ];

  const handleDangerAction = (action: string) => {
    setAlert({
      visible: true,
      type: 'warning',
      title: `${action}?`,
      message: `Are you sure you want to ${action.toLowerCase()}? This action cannot be undone.`,
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
          <Text style={styles.headerTitle}>Settings</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          
          {/* Toggle Settings */}
          {settingsSections.map((section, sectionIndex) => (
            <View key={sectionIndex} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              {section.items.map((item) => (
                <View key={item.id} style={styles.settingItem}>
                  <View style={styles.settingIcon}>
                    <Text style={styles.settingEmoji}>{item.icon}</Text>
                  </View>
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingLabel}>{item.label}</Text>
                    <Text style={styles.settingDescription}>{item.description}</Text>
                  </View>
                  <Switch
                    value={item.value}
                    onValueChange={item.onChange}
                    trackColor={{ false: '#334155', true: '#3B82F6' }}
                    thumbColor={item.value ? '#fff' : '#94A3B8'}
                  />
                </View>
              ))}
            </View>
          ))}

          {/* Account Items */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account</Text>
            {accountItems.map((item) => (
              <TouchableOpacity 
                key={item.id}
                style={styles.menuItem}
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

          {/* Danger Zone */}
          <View style={styles.section}>
            <Text style={styles.dangerTitle}>Danger Zone</Text>
            
            <TouchableOpacity 
              style={styles.dangerItem}
              onPress={() => handleDangerAction('Clear All Data')}
            >
              <View style={styles.dangerIcon}>
                <Text style={styles.dangerEmoji}>🗑️</Text>
              </View>
              <View style={styles.dangerInfo}>
                <Text style={styles.dangerLabel}>Clear All Data</Text>
                <Text style={styles.dangerDescription}>Remove all stored health data</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.dangerItem}
              onPress={() => handleDangerAction('Delete Account')}
            >
              <View style={styles.dangerIcon}>
                <Text style={styles.dangerEmoji}>⚠️</Text>
              </View>
              <View style={styles.dangerInfo}>
                <Text style={styles.dangerLabel}>Delete Account</Text>
                <Text style={styles.dangerDescription}>Permanently delete your account</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Version Info */}
          <View style={styles.versionCard}>
            <Text style={styles.versionText}>ParkinTrace v1.0.0</Text>
            <Text style={styles.versionSubtext}>Built with ❤️ for Parkinson's patients</Text>
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

  section: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F1F5F9',
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  settingIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingEmoji: { fontSize: 20 },
  settingInfo: { flex: 1 },
  settingLabel: { fontSize: 16, fontWeight: '600', color: '#F1F5F9', marginBottom: 4 },
  settingDescription: { fontSize: 13, color: '#94A3B8' },

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

  dangerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#EF4444',
    marginBottom: 12,
  },
  dangerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EF444410',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EF444430',
  },
  dangerIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EF444420',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  dangerEmoji: { fontSize: 20 },
  dangerInfo: { flex: 1 },
  dangerLabel: { fontSize: 16, fontWeight: '600', color: '#EF4444', marginBottom: 4 },
  dangerDescription: { fontSize: 13, color: '#F87171' },

  versionCard: {
    alignItems: 'center',
    paddingVertical: 24,
    marginBottom: 20,
  },
  versionText: { fontSize: 14, color: '#64748B', marginBottom: 4, fontWeight: '600' },
  versionSubtext: { fontSize: 12, color: '#64748B' },
});