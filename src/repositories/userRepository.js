/**
 * Repository de Usuário
 * 
 * Abstração do banco de dados para operações com usuários
 */

import { BaseRepository } from './baseRepository';
import { auth, db } from '../services/firebaseConfig';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

export class UserRepository extends BaseRepository {
  constructor() {
    super('usuarios');
  }

  /**
   * Sobrescreve getCollectionPath porque usuarios é coleção raiz
   */
  getCollectionPath() {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      throw new Error('Usuário não autenticado');
    }
    
    return `usuarios/${userId}`;
  }

  async findCurrent() {
    const userId = auth.currentUser?.uid;
    if (!userId) return null;

    try {
      const userRef = doc(db, 'usuarios', userId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        return { id: userSnap.id, ...userSnap.data() };
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  async saveOrUpdate(data) {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error('Usuário não autenticado');

    try {
      const userRef = doc(db, 'usuarios', userId);
      await setDoc(userRef, {
        ...data,
        updatedAt: serverTimestamp(),
      }, { merge: true });
      
      return userId;
    } catch (error) {
      throw error;
    }
  }

  async updateField(field, value) {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error('Usuário não autenticado');

    try {
      const userRef = doc(db, 'usuarios', userId);
      await updateDoc(userRef, {
        [field]: value,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      throw error;
    }
  }
}

