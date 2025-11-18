import React, { useState, useEffect, useRef } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  Alert, Animated, Dimensions, Platform, KeyboardAvoidingView, StatusBar 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../config/firebase';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const isSmallDevice = width < 375;

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
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

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace('/screens/DashboardScreen');
    } catch (error: any) {
      const errorMessage = error.code === 'auth/user-not-found' 
        ? 'No account found with this email'
        : error.code === 'auth/wrong-password'
        ? 'Incorrect password'
        : error.message;
      Alert.alert('Login Failed', errorMessage);
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
          <Animated.View 
            style={[
              styles.content,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
            ]}
          >
            {/* Logo Circle */}
            <View style={styles.logoContainer}>
              <LinearGradient 
                colors={['#3B82F6', '#8B5CF6']} 
                style={styles.logoCircle}
              >
                <Text style={styles.logoEmoji}>🏥</Text>
              </LinearGradient>
            </View>

            <Text style={styles.title}>ParkinTrace</Text>
            <Text style={styles.subtitle}>Welcome back</Text>

            {/* Input Fields */}
            <View style={styles.formContainer}>
              <View style={styles.inputWrapper}>
                <View style={styles.inputIcon}>
                  <Text style={styles.inputIconText}>📧</Text>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor="#64748B"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <View style={styles.inputWrapper}>
                <View style={styles.inputIcon}>
                  <Text style={styles.inputIconText}>🔒</Text>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Password"
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

              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </TouchableOpacity>

              {/* Login Button */}
              <TouchableOpacity 
                style={[styles.loginButton, loading && styles.buttonDisabled]} 
                onPress={handleLogin}
                disabled={loading}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={loading ? ['#64748B', '#475569'] : ['#3B82F6', '#8B5CF6']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.loginButtonText}>
                    {loading ? 'Please wait...' : 'Login'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              {/* Signup Link */}
              <View style={styles.signupContainer}>
                <Text style={styles.signupQuestion}>Don't have an account?</Text>
                <TouchableOpacity onPress={() => router.push('./screens/auth/SignupScreen')}>
                  <Text style={styles.signupButton}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Features */}
            <View style={styles.featuresContainer}>
              <View style={styles.featureItem}>
                <View style={styles.featureCircle}>
                  <Text style={styles.featureEmoji}>❤️</Text>
                </View>
                <Text style={styles.featureText}>Real-time Monitoring</Text>
              </View>
              <View style={styles.featureItem}>
                <View style={styles.featureCircle}>
                  <Text style={styles.featureEmoji}>🚨</Text>
                </View>
                <Text style={styles.featureText}>Fall Detection</Text>
              </View>
              <View style={styles.featureItem}>
                <View style={styles.featureCircle}>
                  <Text style={styles.featureEmoji}>📞</Text>
                </View>
                <Text style={styles.featureText}>Emergency SOS</Text>
              </View>
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1 },
  keyboardView: { flex: 1 },
  content: { 
    flex: 1, 
    justifyContent: 'center', 
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  logoEmoji: { fontSize: 48 },
  
  title: { 
    fontSize: isSmallDevice ? 32 : 38, 
    fontWeight: 'bold', 
    color: '#F1F5F9', 
    textAlign: 'center', 
    marginBottom: 8,
  },
  subtitle: { 
    fontSize: isSmallDevice ? 14 : 16, 
    color: '#94A3B8', 
    textAlign: 'center', 
    marginBottom: 40,
  },

  formContainer: {
    width: '100%',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 16,
    marginBottom: 16,
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

  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotText: {
    color: '#60A5FA',
    fontSize: 14,
    fontWeight: '600',
  },

  loginButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
  },
  buttonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  loginButtonText: { 
    color: '#fff', 
    fontSize: 18, 
    fontWeight: 'bold',
  },
  buttonDisabled: { 
    opacity: 0.6,
  },

  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  signupQuestion: {
    color: '#94A3B8',
    fontSize: 14,
    marginRight: 6,
  },
  signupButton: {
    color: '#60A5FA',
    fontSize: 14,
    fontWeight: 'bold',
  },

  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 40,
    paddingTop: 30,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  featureItem: {
    alignItems: 'center',
  },
  featureCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  featureEmoji: { fontSize: 22 },
  featureText: {
    color: '#94A3B8',
    fontSize: 11,
    textAlign: 'center',
    maxWidth: 80,
  },
});