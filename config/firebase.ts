import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyASq3unONpWrfDR0IdaPW76EgAWw5eg6qI",
  authDomain: "parkintrace.firebaseapp.com",
  projectId: "parkintrace",
  storageBucket: "parkintrace.firebasestorage.app",
  messagingSenderId: "995849002564",
  appId: "1:995849002564:web:1bff56236c1f8b402c2611",
  measurementId: "G-LR4D734DRT"
};


const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});
export const db = getFirestore(app);
