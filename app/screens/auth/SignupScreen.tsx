import React, { useState, useEffect, useRef } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  Alert, Animated, Dimensions, Platform, KeyboardAvoidingView, 
  StatusBar, ScrollView 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../config/firebase';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const isSmallDevice = width < 375;

export default function SignupScreen() {
  const router = useRouter();
  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/screens/DashboardScreen' as any);
    }
  };
  
  // Form States
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Password Visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Password Strength
  const [passwordStrength, setPasswordStrength] = useState(0);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Calculate Password Strength
  useEffect(() => {
    if (!password) {
      setPasswordStrength(0);
      return;
    }
    
    let strength = 0;
    if (password.length >= 6) strength += 25;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password) || /[!@#$%^&*]/.test(password)) strength += 25;
    
    setPasswordStrength(strength);
  }, [password]);

  const getStrengthColor = () => {
    if (passwordStrength < 50) return '#EF4444';
    if (passwordStrength < 75) return '#F59E0B';
    return '#10B981';
  };

  const getStrengthText = () => {
    if (passwordStrength < 50) return 'Weak';
    if (passwordStrength < 75) return 'Medium';
    return 'Strong';
  };

  const validateForm = () => {
    if (!fullName.trim()) {
      Alert.alert('Error', 'Please enter your full name');
      return false;
    }
    
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }
    
    if (!phone.trim()) {
      Alert.alert('Error', 'Please enter your phone number');
      return false;
    }
    
    if (phone.length < 10) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return false;
    }
    
    if (!age.trim()) {
      Alert.alert('Error', 'Please enter your age');
      return false;
    }
    
    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
      Alert.alert('Error', 'Please enter a valid age');
      return false;
    }
    
    if (!gender) {
      Alert.alert('Error', 'Please select your gender');
      return false;
    }
    
    if (!password) {
      Alert.alert('Error', 'Please enter a password');
      return false;
    }
    
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return false;
    }
    
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }
    
    if (!agreeTerms) {
      Alert.alert('Error', 'Please accept the Terms & Conditions');
      return false;
    }
    
    return true;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      
      // Here you would typically save additional user data to Firestore
      // await setDoc(doc(db, 'users', user.uid), { fullName, phone, age, gender });
      
      Alert.alert(
        'Success! 🎉',
        'Your account has been created successfully!',
        [
          {
            text: 'Continue',
            onPress: () => router.replace('/screens/DashboardScreen'),
          },
        ]
      );
    } catch (error: any) {
      let errorMessage = 'Failed to create account';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak';
      }
      
      Alert.alert('Signup Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
      <LinearGradient colors={['#0F172A', '#1E293B']} style={styles.gradient}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <Animated.View 
              style={[
                styles.content,
                { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
              ]}
            >
              {/* Header */}
              <View style={styles.header}>
                <TouchableOpacity 
                  onPress={handleGoBack} 
                  style={styles.backButton}
                >
                  <Text style={styles.backIcon}>←</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Create Account</Text>
                <Text style={styles.subtitle}>Join ParkinTrace today</Text>
              </View>

              {/* Form */}
              <View style={styles.formContainer}>
                
                {/* Full Name */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Full Name</Text>
                  <View style={styles.inputWrapper}>
                    <View style={styles.inputIcon}>
                      <Text style={styles.inputIconText}>👤</Text>
                    </View>
                    <TextInput
                      style={styles.input}
                      placeholder="Name"
                      placeholderTextColor="#64748B"
                      value={fullName}
                      onChangeText={setFullName}
                      autoCapitalize="words"
                    />
                  </View>
                </View>

                {/* Email */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Email Address</Text>
                  <View style={styles.inputWrapper}>
                    <View style={styles.inputIcon}>
                      <Text style={styles.inputIconText}>📧</Text>
                    </View>
                    <TextInput
                      style={styles.input}
                      placeholder="Email Address"
                      placeholderTextColor="#64748B"
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  </View>
                </View>

                {/* Phone */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Phone Number</Text>
                  <View style={styles.inputWrapper}>
                    <View style={styles.inputIcon}>
                      <Text style={styles.inputIconText}>📱</Text>
                    </View>
                    <TextInput
                      style={styles.input}
                      placeholder="Number"
                      placeholderTextColor="#64748B"
                      value={phone}
                      onChangeText={setPhone}
                      keyboardType="phone-pad"
                    />
                  </View>
                </View>

                {/* Age & Gender Row */}
                <View style={styles.rowInputs}>
                  <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                    <Text style={styles.label}>Age</Text>
                    <View style={styles.inputWrapper}>
                      <View style={styles.inputIcon}>
                        <Text style={styles.inputIconText}>🎂</Text>
                      </View>
                      <TextInput
                        style={styles.input}
                        placeholder="Age"
                        placeholderTextColor="#64748B"
                        value={age}
                        onChangeText={setAge}
                        keyboardType="number-pad"
                        maxLength={3}
                      />
                    </View>
                  </View>

                  <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                    <Text style={styles.label}>Gender</Text>
                    <View style={styles.genderContainer}>
                      <TouchableOpacity 
                        style={[
                          styles.genderBtn,
                          gender === 'male' && styles.genderBtnActive
                        ]}
                        onPress={() => setGender('male')}
                      >
                        <Text style={[
                          styles.genderText,
                          gender === 'male' && styles.genderTextActive
                        ]}>Male</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        style={[
                          styles.genderBtn,
                          gender === 'female' && styles.genderBtnActive
                        ]}
                        onPress={() => setGender('female')}
                      >
                        <Text style={[
                          styles.genderText,
                          gender === 'female' && styles.genderTextActive
                        ]}>Female</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                {/* Password */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Password</Text>
                  <View style={styles.inputWrapper}>
                    <View style={styles.inputIcon}>
                      <Text style={styles.inputIconText}>🔒</Text>
                    </View>
                    <TextInput
                      style={styles.input}
                      placeholder="Min 6 characters"
                      placeholderTextColor="#64748B"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity 
                      onPress={() => setShowPassword(!showPassword)}
                      style={styles.eyeIcon}
                    >
                      <Text style={styles.eyeText}>
                        {showPassword ? '👁️' : '👁️‍🗨️'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  
                  {/* Password Strength Indicator */}
                  {password.length > 0 && (
                    <View style={styles.strengthContainer}>
                      <View style={styles.strengthBar}>
                        <View 
                          style={[
                            styles.strengthFill,
                            { 
                              width: `${passwordStrength}%`,
                              backgroundColor: getStrengthColor()
                            }
                          ]} 
                        />
                      </View>
                      <Text style={[styles.strengthText, { color: getStrengthColor() }]}>
                        {getStrengthText()}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Confirm Password */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Confirm Password</Text>
                  <View style={styles.inputWrapper}>
                    <View style={styles.inputIcon}>
                      <Text style={styles.inputIconText}>🔐</Text>
                    </View>
                    <TextInput
                      style={styles.input}
                      placeholder="Re-enter password"
                      placeholderTextColor="#64748B"
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      secureTextEntry={!showConfirmPassword}
                    />
                    <TouchableOpacity 
                      onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={styles.eyeIcon}
                    >
                      <Text style={styles.eyeText}>
                        {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  
                  {/* Password Match Indicator */}
                  {confirmPassword.length > 0 && (
                    <View style={styles.matchContainer}>
                      {password === confirmPassword ? (
                        <Text style={styles.matchText}>✓ Passwords match</Text>
                      ) : (
                        <Text style={styles.mismatchText}>✗ Passwords don't match</Text>
                      )}
                    </View>
                  )}
                </View>

                {/* Terms & Conditions */}
                <TouchableOpacity 
                  style={styles.checkboxContainer}
                  onPress={() => setAgreeTerms(!agreeTerms)}
                >
                  <View style={[styles.checkbox, agreeTerms && styles.checkboxActive]}>
                    {agreeTerms && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                  <Text style={styles.checkboxText}>
                    I agree to the{' '}
                    <Text style={styles.linkText}>Terms & Conditions</Text>
                    {' '}and{' '}
                    <Text style={styles.linkText}>Privacy Policy</Text>
                  </Text>
                </TouchableOpacity>

                {/* Signup Button */}
                <TouchableOpacity 
                  style={[styles.signupButton, loading && styles.buttonDisabled]} 
                  onPress={handleSignup}
                  disabled={loading}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={loading ? ['#64748B', '#475569'] : ['#3B82F6', '#8B5CF6']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.buttonGradient}
                  >
                    <Text style={styles.signupButtonText}>
                      {loading ? 'Creating Account...' : 'Create Account'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>

                {/* Login Link */}
                <View style={styles.loginContainer}>
                  <Text style={styles.loginQuestion}>Already have an account?</Text>
                  <TouchableOpacity onPress={handleGoBack}>
                    <Text style={styles.loginButton}>Login</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1 },
  keyboardView: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  content: { 
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 40,
  },
  
  header: {
    marginBottom: 32,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  backIcon: { fontSize: 24, color: '#F1F5F9' },
  title: { 
    fontSize: isSmallDevice ? 28 : 32, 
    fontWeight: 'bold', 
    color: '#F1F5F9', 
    marginBottom: 8,
  },
  subtitle: { 
    fontSize: 16, 
    color: '#94A3B8',
  },

  formContainer: { width: '100%' },
  inputGroup: { marginBottom: 20 },
  label: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: '#F1F5F9', 
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
    paddingHorizontal: 16,
  },
  inputIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  inputIconText: { fontSize: 18 },
  input: { 
    flex: 1,
    color: '#F1F5F9', 
    fontSize: 16,
    paddingVertical: 18,
  },
  eyeIcon: {
    padding: 8,
  },
  eyeText: { fontSize: 20 },

  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  genderContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  genderBtn: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  genderBtnActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  genderText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94A3B8',
  },
  genderTextActive: {
    color: '#fff',
  },

  strengthContainer: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  strengthBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#1E293B',
    borderRadius: 2,
    overflow: 'hidden',
  },
  strengthFill: {
    height: '100%',
    borderRadius: 2,
  },
  strengthText: {
    fontSize: 12,
    fontWeight: '600',
  },

  matchContainer: {
    marginTop: 8,
  },
  matchText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
  },
  mismatchText: {
    fontSize: 12,
    color: '#EF4444',
    fontWeight: '600',
  },

  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#334155',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  checkboxText: {
    flex: 1,
    fontSize: 13,
    color: '#94A3B8',
    lineHeight: 20,
  },
  linkText: {
    color: '#60A5FA',
    fontWeight: '600',
  },

  signupButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
  },
  buttonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  signupButtonText: { 
    color: '#fff', 
    fontSize: 18, 
    fontWeight: 'bold',
  },
  buttonDisabled: { 
    opacity: 0.6,
  },

  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginQuestion: {
    color: '#94A3B8',
    fontSize: 14,
    marginRight: 6,
  },
  loginButton: {
    color: '#60A5FA',
    fontSize: 14,
    fontWeight: 'bold',
  },
});