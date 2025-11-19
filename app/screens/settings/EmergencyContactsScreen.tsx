import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, 
  TextInput, StatusBar, Platform, Modal 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import CustomAlert from '../../../components/common/CustomAlert';

type Contact = {
  id: string;
  name: string;
  relation: string;
  phone: string;
  isPrimary: boolean;
};

export default function EmergencyContactsScreen() {
  const router = useRouter();
  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/screens/DashboardScreen' as any);
    }
  };
  
  const [contacts, setContacts] = useState<Contact[]>([
    { id: '1', name: 'Sarah Johnson', relation: 'Daughter', phone: '+1 234 567 8901', isPrimary: true },
    { id: '2', name: 'Michael Doe', relation: 'Son', phone: '+1 234 567 8902', isPrimary: false },
    { id: '3', name: 'Dr. Emily Smith', relation: 'Doctor', phone: '+1 234 567 8903', isPrimary: false },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [newContact, setNewContact] = useState({ name: '', relation: '', phone: '' });
  
  const [alert, setAlert] = useState({
    visible: false,
    type: 'success' as 'success' | 'error' | 'warning' | 'info' | 'confirm',
    title: '',
    message: '',
  });

  const handleAddContact = () => {
    if (!newContact.name || !newContact.phone) {
      setAlert({
        visible: true,
        type: 'error',
        title: 'Missing Information',
        message: 'Please fill in all required fields',
      });
      return;
    }

    const contact: Contact = {
      id: Date.now().toString(),
      name: newContact.name,
      relation: newContact.relation || 'Family',
      phone: newContact.phone,
      isPrimary: contacts.length === 0,
    };

    setContacts([...contacts, contact]);
    setNewContact({ name: '', relation: '', phone: '' });
    setShowAddModal(false);
    
    setAlert({
      visible: true,
      type: 'success',
      title: 'Contact Added',
      message: 'Emergency contact has been added successfully',
    });
  };

  const handleDeleteContact = (id: string) => {
    setAlert({
      visible: true,
      type: 'confirm',
      title: 'Delete Contact',
      message: 'Are you sure you want to remove this emergency contact?',
    });
    
    // Store the id for deletion
    (alert as any).deleteId = id;
  };

  const confirmDelete = () => {
    const deleteId = (alert as any).deleteId;
    setContacts(contacts.filter(c => c.id !== deleteId));
    setAlert(prev => ({ ...prev, visible: false }));
  };

  const setPrimaryContact = (id: string) => {
    setContacts(contacts.map(c => ({
      ...c,
      isPrimary: c.id === id
    })));
    
    setAlert({
      visible: true,
      type: 'success',
      title: 'Primary Contact Updated',
      message: 'Primary emergency contact has been updated',
    });
  };

  const handleCallContact = (phone: string) => {
    setAlert({
      visible: true,
      type: 'info',
      title: 'Calling Contact',
      message: `Calling ${phone}...`,
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
          <Text style={styles.headerTitle}>Emergency Contacts</Text>
          <TouchableOpacity onPress={() => setShowAddModal(true)} style={styles.addBtn}>
            <Text style={styles.addIcon}>+</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          
          {/* Info Card */}
          <View style={styles.infoCard}>
            <Text style={styles.infoIcon}>ℹ️</Text>
            <Text style={styles.infoText}>
              These contacts will be notified in case of an emergency or fall detection
            </Text>
          </View>

          {/* Contacts List */}
          {contacts.map((contact) => (
            <View key={contact.id} style={styles.contactCard}>
              <View style={styles.contactHeader}>
                <View style={styles.contactIcon}>
                  <Text style={styles.contactEmoji}>👤</Text>
                </View>
                <View style={styles.contactInfo}>
                  <View style={styles.contactNameRow}>
                    <Text style={styles.contactName}>{contact.name}</Text>
                    {contact.isPrimary && (
                      <View style={styles.primaryBadge}>
                        <Text style={styles.primaryText}>PRIMARY</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.contactRelation}>{contact.relation}</Text>
                  <Text style={styles.contactPhone}>📞 {contact.phone}</Text>
                </View>
              </View>

              <View style={styles.contactActions}>
                <TouchableOpacity 
                  style={styles.actionBtn}
                  onPress={() => handleCallContact(contact.phone)}
                >
                  <Text style={styles.actionBtnText}>Call</Text>
                </TouchableOpacity>
                
                {!contact.isPrimary && (
                  <TouchableOpacity 
                    style={[styles.actionBtn, styles.actionBtnSecondary]}
                    onPress={() => setPrimaryContact(contact.id)}
                  >
                    <Text style={styles.actionBtnTextSecondary}>Set Primary</Text>
                  </TouchableOpacity>
                )}
                
                <TouchableOpacity 
                  style={[styles.actionBtn, styles.actionBtnDanger]}
                  onPress={() => handleDeleteContact(contact.id)}
                >
                  <Text style={styles.actionBtnTextDanger}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {contacts.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📋</Text>
              <Text style={styles.emptyText}>No emergency contacts yet</Text>
              <Text style={styles.emptySubtext}>Add your first emergency contact</Text>
            </View>
          )}
        </ScrollView>
      </LinearGradient>

      {/* Add Contact Modal */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Emergency Contact</Text>
            
            <View style={styles.modalInputGroup}>
              <Text style={styles.modalLabel}>Name *</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Enter name"
                placeholderTextColor="#64748B"
                value={newContact.name}
                onChangeText={(text) => setNewContact({ ...newContact, name: text })}
              />
            </View>

            <View style={styles.modalInputGroup}>
              <Text style={styles.modalLabel}>Relation</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g., Family, Doctor"
                placeholderTextColor="#64748B"
                value={newContact.relation}
                onChangeText={(text) => setNewContact({ ...newContact, relation: text })}
              />
            </View>

            <View style={styles.modalInputGroup}>
              <Text style={styles.modalLabel}>Phone Number *</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="+1 234 567 8900"
                placeholderTextColor="#64748B"
                keyboardType="phone-pad"
                value={newContact.phone}
                onChangeText={(text) => setNewContact({ ...newContact, phone: text })}
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={[styles.modalBtn, styles.modalBtnCancel]}
                onPress={() => {
                  setShowAddModal(false);
                  setNewContact({ name: '', relation: '', phone: '' });
                }}
              >
                <Text style={styles.modalBtnTextCancel}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.modalBtn}
                onPress={handleAddContact}
              >
                <LinearGradient colors={['#3B82F6', '#8B5CF6']} style={styles.modalBtnGradient}>
                  <Text style={styles.modalBtnText}>Add Contact</Text>
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
        onConfirm={alert.type === 'confirm' ? confirmDelete : () => setAlert(prev => ({ ...prev, visible: false }))}
        onCancel={() => setAlert(prev => ({ ...prev, visible: false }))}
        confirmText={alert.type === 'confirm' ? 'Delete' : 'OK'}
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
  addBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addIcon: { fontSize: 28, color: '#fff', fontWeight: 'bold' },
  content: { flex: 1, paddingHorizontal: 20 },

  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#3B82F615',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#3B82F640',
  },
  infoIcon: { fontSize: 20, marginRight: 12 },
  infoText: { flex: 1, fontSize: 13, color: '#94A3B8', lineHeight: 20 },

  contactCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  contactHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  contactIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contactEmoji: { fontSize: 24 },
  contactInfo: { flex: 1 },
  contactNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  contactName: { fontSize: 18, fontWeight: 'bold', color: '#F1F5F9', marginRight: 8 },
  primaryBadge: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  primaryText: { fontSize: 10, fontWeight: 'bold', color: '#fff' },
  contactRelation: { fontSize: 14, color: '#94A3B8', marginBottom: 6 },
  contactPhone: { fontSize: 14, color: '#60A5FA' },

  contactActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: '#3B82F6',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  actionBtnSecondary: {
    backgroundColor: '#334155',
  },
  actionBtnDanger: {
    backgroundColor: '#EF444420',
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  actionBtnText: { fontSize: 14, fontWeight: '600', color: '#fff' },
  actionBtnTextSecondary: { fontSize: 14, fontWeight: '600', color: '#F1F5F9' },
  actionBtnTextDanger: { fontSize: 14, fontWeight: '600', color: '#EF4444' },

  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyText: { fontSize: 18, fontWeight: 'bold', color: '#F1F5F9', marginBottom: 8 },
  emptySubtext: { fontSize: 14, color: '#94A3B8' },

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