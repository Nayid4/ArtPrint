// src/config/firebaseConfig.ts

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getStorage } from 'firebase/storage';  // Importa Firebase Storage

const firebaseConfig = {
  apiKey: "AIzaSyC7DJixHwgjR7mnHppds08Pp5snZAo56U4",
  authDomain: "artprint-2aa0a.firebaseapp.com",
  projectId: "artprint-2aa0a",
  storageBucket: "artprint-2aa0a.appspot.com",
  messagingSenderId: "291195002336",
  appId: "1:291195002336:web:240d66e85cc0711ca49f85",
  measurementId: "G-HRMHT8NY97"
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });
const db = getFirestore(app);
const storage = getStorage(app);  // Configura Firebase Storage

export { app, auth, db, storage };