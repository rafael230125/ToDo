import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
import configData from '../../config.json';

// Configuração do Firebase lida do arquivo config.json
const getFirebaseConfig = () => {
  const firebaseConfig = configData?.firebase;

  if (!firebaseConfig) {
    throw new Error(
      '❌ Configuração do Firebase não encontrada no arquivo config.json\n' +
      'Por favor, crie um arquivo config.json na raiz do projeto.\n' +
      'Consulte o arquivo config.json.example para um template.'
    );
  }

  // Validação: garante que todas as propriedades necessárias estão definidas
  const requiredFields = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
  const missingFields = requiredFields.filter(field => !firebaseConfig[field]);

  if (missingFields.length > 0) {
    throw new Error(
      `❌ Campos obrigatórios do Firebase não encontrados em config.json: ${missingFields.join(', ')}\n` +
      'Por favor, verifique se todos os campos estão preenchidos corretamente.\n' +
      'Consulte o arquivo config.json.example para um template.'
    );
  }

  return firebaseConfig;
};

const firebaseConfig = getFirebaseConfig();

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