import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from 'expo-constants';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  query, 
  where, 
  addDoc, 
  doc, 
  updateDoc,
  setDoc,
  enableNetwork,
  disableNetwork,
  serverTimestamp
} from 'firebase/firestore';

// Configuração do Firebase usando variáveis de ambiente (Constants)
const firebaseConfig = {
  apiKey: Constants.expoConfig?.extra?.firebaseApiKey || "AIzaSyAterCoClahPfG5dGysE37nPLnexlPOrNM",
  authDomain: Constants.expoConfig?.extra?.firebaseAuthDomain || "todo-mobile-368fe.firebaseapp.com",
  projectId: Constants.expoConfig?.extra?.firebaseProjectId || "todo-mobile-368fe",
  storageBucket: Constants.expoConfig?.extra?.firebaseStorageBucket || "todo-mobile-368fe.firebasestorage.app",
  messagingSenderId: Constants.expoConfig?.extra?.firebaseMessagingSenderId || "762086307046",
  appId: Constants.expoConfig?.extra?.firebaseAppId || "1:762086307046:web:daa599c62234468328f727"
};

// Inicializar app
export const app = initializeApp(firebaseConfig);

// Inicializar auth com persistência AsyncStorage
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Re-exportar funções de auth
export { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

// Inicializar Firestore
export const db = getFirestore(app);

// Exporta utilitários do Firestore
export { 
  collection, 
  getDocs, 
  query, 
  where, 
  addDoc, 
  doc, 
  updateDoc,
  setDoc,
  serverTimestamp,
  enableNetwork,
  disableNetwork
};