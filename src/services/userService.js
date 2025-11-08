/**
 * Serviço de Usuário
 * Gerencia dados do usuário no Firestore
 */

import { auth, db } from './firebaseConfig';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

const COLLECTION = 'usuarios';

/**
 * Busca dados do usuário atual
 */
export async function getCurrentUser() {
  const user = auth.currentUser;
  if (!user) return null;

  try {
    const userRef = doc(db, COLLECTION, user.uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return { id: userSnap.id, ...userSnap.data() };
    }
    return null;
  } catch (error) {
    throw error;
  }
}

/**
 * Cria ou atualiza um usuário
 */
export async function saveUser(userData) {
  const user = auth.currentUser;
  if (!user) throw new Error('Usuário não autenticado');

  try {
    const userRef = doc(db, COLLECTION, user.uid);
    await setDoc(userRef, {
      ...userData,
      updatedAt: serverTimestamp(),
    }, { merge: true });
    
    return user.uid;
  } catch (error) {
    throw error;
  }
}

/**
 * Atualiza foto do usuário
 */
export async function updateUserPhoto(photo) {
  const user = auth.currentUser;
  if (!user) throw new Error('Usuário não autenticado');

  try {
    const userRef = doc(db, COLLECTION, user.uid);
    await updateDoc(userRef, {
      foto: photo,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    throw error;
  }
}

/**
 * Atualiza dados do usuário
 */
export async function updateUser(userData) {
  const user = auth.currentUser;
  if (!user) throw new Error('Usuário não autenticado');

  try {
    const userRef = doc(db, COLLECTION, user.uid);
    await updateDoc(userRef, {
      ...userData,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    throw error;
  }
}

