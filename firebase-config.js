import { initializeApp } from 'firebase/app';
import { getAuth, browserLocalPersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAYgi5VCXReXCaFgEVJdc_w03R7zNO149U",
  authDomain: "art-print-aa424.firebaseapp.com",
  projectId: "art-print-aa424",
  storageBucket: "art-print-aa424.appspot.com",
  messagingSenderId: "258252027604",
  appId: "1:258252027604:web:26c809cf04bc2e37246d41",
  measurementId: "G-0JXDQ7CMDL"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Inicialización de la persistencia de Firebase Auth
export const initializeAuthPersistence = async () => {
    const auth = getAuth(app);
    try {
      // Intenta establecer la persistencia en el navegador web (localStorage)
      await auth.setPersistence(browserLocalPersistence);
    } catch (error) {
      console.error('Error al configurar la persistencia de Firebase Auth:', error);
      // Si hay un error, intenta usar AsyncStorage como respaldo
      await auth.setPersistence(getReactNativePersistence(AsyncStorage));
    }
  };



  