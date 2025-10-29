/**
 * Repository Base
 * 
 * Classe base com queries comuns para todos os repositories
 * Facilita migrações futuras e padroniza acesso aos dados
 */

import { auth, db } from '../services/firebaseConfig';
import {
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  serverTimestamp
} from 'firebase/firestore';

export class BaseRepository {
  constructor(collectionName) {
    this.collectionName = collectionName;
  }

  /**
   * Retorna o caminho da coleção completo
   */
  getCollectionPath() {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      throw new Error('Usuário não autenticado');
    }
    
    if (this.collectionName === 'usuarios') {
      return `usuarios/${userId}`;
    }
    
    return `usuarios/${userId}/${this.collectionName}`;
  }

  /**
   * Busca um documento específico
   */
  async findById(documentId) {
    try {
      const docRef = doc(db, this.getCollectionPath(), documentId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      console.error(`Erro ao buscar ${this.collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Busca todos os documentos
   */
  async findAll(filters = {}) {
    try {
      const collectionRef = collection(db, this.getCollectionPath());
      const querySnapshot = await getDocs(query(collectionRef));
      
      const documents = [];
      querySnapshot.forEach((docSnapshot) => {
        documents.push({
          id: docSnapshot.id,
          ...docSnapshot.data()
        });
      });

      return documents;
    } catch (error) {
      console.error(`Erro ao listar ${this.collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Cria um novo documento
   */
  async create(data) {
    try {
      const collectionRef = collection(db, this.getCollectionPath());
      const docRef = await addDoc(collectionRef, {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      
      return docRef.id;
    } catch (error) {
      console.error(`Erro ao criar ${this.collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Atualiza um documento
   */
  async update(documentId, data) {
    try {
      const docRef = doc(db, this.getCollectionPath(), documentId);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error(`Erro ao atualizar ${this.collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Deleta um documento
   */
  async delete(documentId) {
    try {
      const docRef = doc(db, this.getCollectionPath(), documentId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error(`Erro ao deletar ${this.collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Verifica se usuário está autenticado
   */
  isAuthenticated() {
    return !!auth.currentUser;
  }

  /**
   * Retorna o ID do usuário atual
   */
  getCurrentUserId() {
    return auth.currentUser?.uid || null;
  }
}

