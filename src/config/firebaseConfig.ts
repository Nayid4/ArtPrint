// src/config/firebaseConfig.ts

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getStorage } from 'firebase/storage';  // Importa Firebase Storage

const firebaseConfig = {
    apiKey: "AIzaSyAYgi5VCXReXCaFgEVJdc_w03R7zNO149U",
    authDomain: "art-print-aa424.firebaseapp.com",
    projectId: "art-print-aa424",
    storageBucket: "art-print-aa424.appspot.com",
    messagingSenderId: "258252027604",
    appId: "1:258252027604:web:26c809cf04bc2e37246d41",
    measurementId: "G-0JXDQ7CMDL"
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });
const db = getFirestore(app);
const storage = getStorage(app);  // Configura Firebase Storage

export { app, auth, db, storage };