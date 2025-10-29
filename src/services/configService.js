/**
 * Serviço de Configurações
 * Gerencia configurações do usuário
 */

import { auth, db } from './firebaseConfig';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

const SUBCOLLECTION = 'config';
const DOCUMENT_ID = 'userConfig';

/**
 * Busca configurações do usuário atual
 */
export async function getUserConfig() {
  const user = auth.currentUser;
  if (!user) return null;

  try {
    const configRef = doc(db, 'usuarios', user.uid, SUBCOLLECTION, DOCUMENT_ID);
    const configSnap = await getDoc(configRef);
    
    if (configSnap.exists()) {
      return configSnap.data();
    }
    return null;
  } catch (error) {
    console.error('Erro ao buscar configurações:', error);
    throw error;
  }
}

/**
 * Salva configurações do usuário
 */
export async function saveUserConfig(configData) {
  const user = auth.currentUser;
  if (!user) throw new Error('Usuário não autenticado');

  try {
    const configRef = doc(db, 'usuarios', user.uid, SUBCOLLECTION, DOCUMENT_ID);
    await setDoc(configRef, {
      ...configData,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Erro ao salvar configurações:', error);
    throw error;
  }
}

/**
 * Atualiza uma configuração específica
 */
export async function updateConfigField(field, value) {
  const user = auth.currentUser;
  if (!user) throw new Error('Usuário não autenticado');

  try {
    const configRef = doc(db, 'usuarios', user.uid, SUBCOLLECTION, DOCUMENT_ID);
    await setDoc(configRef, {
      [field]: value,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  } catch (error) {
    console.error('Erro ao atualizar configuração:', error);
    throw error;
  }
}

