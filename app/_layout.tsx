import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    // Add custom fonts here if needed
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      
      {/* Auth Screens */}
      <Stack.Screen name="screens/auth/LoginScreen" />
      <Stack.Screen name="screens/auth/SignupScreen" />
      
      {/* Main Screens */}
      <Stack.Screen name="screens/DashboardScreen" />
      <Stack.Screen name="screens/DetailsScreen" />
      
      {/* Feature Screens */}
      <Stack.Screen name="screens/medication/MedicationScreen" />
      <Stack.Screen name="screens/reports/ReportsScreen" />
      <Stack.Screen name="screens/exercise/ExerciseScreen" />
      <Stack.Screen name="screens/doctor/AppointmentsScreen" />
      
      {/* Profile & Settings */}
      <Stack.Screen name="screens/profile/ProfileScreen" />
      <Stack.Screen name="screens/profile/EditProfileScreen" />
      {/* <Stack.Screen name="screens/profile/MedicalHistoryScreen" /> */}
      <Stack.Screen name="screens/settings/SettingsScreen" />
      <Stack.Screen name="screens/settings/EmergencyContactsScreen" />
      {/* <Stack.Screen name="screens/settings/NotificationSettingsScreen" /> */}
      
      {/* Vitals Screens */}
      <Stack.Screen name="screens/vitals/HeartRateScreen" />
      {/* <Stack.Screen name="screens/vitals/BloodOxygenScreen" /> */}
      {/* <Stack.Screen name="screens/vitals/TremorHistoryScreen" /> */}
      {/* <Stack.Screen name="screens/vitals/FallHistoryScreen" /> */}
    </Stack>
  );
}