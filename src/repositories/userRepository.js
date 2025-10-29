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

  /**
   * Busca dados do usuário atual
   */
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
      console.error('Erro ao buscar usuário:', error);
      throw error;
    }
  }

  /**
   * Cria ou atualiza dados do usuário
   */
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
      console.error('Erro ao salvar usuário:', error);
      throw error;
    }
  }

  /**
   * Atualiza apenas um campo específico
   */
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
      console.error('Erro ao atualizar usuário:', error);
      throw error;
    }
  }
}

