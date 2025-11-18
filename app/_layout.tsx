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
      <Stack.Screen name="screens/auth/LoginScreen" />
      <Stack.Screen name="screens/auth/SignupScreen" />
      <Stack.Screen name="screens/DashboardScreen" />
      <Stack.Screen name="screens/DetailsScreen" />
      <Stack.Screen name="screens/medication/MedicationScreen" />
      <Stack.Screen name="screens/reports/ReportsScreen" />
      <Stack.Screen name="screens/exercise/ExerciseScreen" />
      <Stack.Screen name="screens/doctor/AppointmentsScreen" />
    </Stack>
  );
}