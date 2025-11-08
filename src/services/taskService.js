/**
 * Serviço de Tarefas
 * Gerencia operações CRUD de tarefas
 */

import { auth, db } from './firebaseConfig';
import { 
  collection, 
  getDocs, 
  getDoc,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  serverTimestamp
} from 'firebase/firestore';

const SUBCOLLECTION = 'tarefas';

/**
 * Busca todas as tarefas do usuário atual
 */
export async function getAllTasks(filters = {}) {
  const user = auth.currentUser;
  if (!user) return [];

  try {
    const tasksRef = collection(db, 'usuarios', user.uid, SUBCOLLECTION);
    
    // Buscar todas as tarefas SEM filtros no Firebase
    const querySnapshot = await getDocs(query(tasksRef));
    const tasks = [];
    
    querySnapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      tasks.push({ 
        id: docSnapshot.id, 
        ...data,
        // Converter Timestamps para formato legível
        createdAt: data.createdAt?.toDate?.() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
      });
    });

    // Aplicar filtros e ordenação no cliente
    return applyFiltersAndSort(tasks, filters);
  } catch (error) {
    throw error;
  }
}

/**
 * Aplica filtros e ordenação nas tarefas
 */
function applyFiltersAndSort(tasks, filters) {
  let filteredTasks = [...tasks];
  
  // Ordenar por data de criação por padrão (mais recentes primeiro)
  filteredTasks.sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
    const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
    return dateB - dateA;
  });

  // Filtro por status
  if (filters.status) {
    filteredTasks = filteredTasks.filter(task => task.status === filters.status);
  }

  // Ordenação adicional
  if (filters.orderBy === 'dataFinal') {
    filteredTasks = filteredTasks.sort((a, b) => {
      const dateA = new Date(a.dataFinal);
      const dateB = new Date(b.dataFinal);
      return dateA - dateB;
    });
  } else if (filters.orderBy === 'prioridade') {
    filteredTasks = filteredTasks.sort((a, b) => {
      const priorityOrder = { 'Alta': 1, 'Média': 2, 'Baixa': 3 };
      return (priorityOrder[a.prioridade] || 999) - (priorityOrder[b.prioridade] || 999);
    });
  }

  return filteredTasks;
}

/**
 * Busca uma tarefa específica
 */
export async function getTaskById(taskId) {
  const user = auth.currentUser;
  if (!user) return null;

  try {
    const taskRef = doc(db, 'usuarios', user.uid, SUBCOLLECTION, taskId);
    const taskSnap = await getDoc(taskRef);
    
    if (taskSnap.exists()) {
      return { id: taskSnap.id, ...taskSnap.data() };
    }
    return null;
  } catch (error) {
    throw error;
  }
}

/**
 * Cria uma nova tarefa
 */
export async function createTask(taskData) {
  const user = auth.currentUser;
  if (!user) throw new Error('Usuário não autenticado');

  try {
    const tasksRef = collection(db, 'usuarios', user.uid, SUBCOLLECTION);
    const docRef = await addDoc(tasksRef, {
      ...taskData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    
    return docRef.id;
  } catch (error) {
    throw error;
  }
}

/**
 * Atualiza uma tarefa
 */
export async function updateTask(taskId, taskData) {
  const user = auth.currentUser;
  if (!user) throw new Error('Usuário não autenticado');

  try {
    const taskRef = doc(db, 'usuarios', user.uid, SUBCOLLECTION, taskId);
    await updateDoc(taskRef, {
      ...taskData,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    throw error;
  }
}

/**
 * Deleta uma tarefa
 */
export async function deleteTask(taskId) {
  const user = auth.currentUser;
  if (!user) throw new Error('Usuário não autenticado');

  try {
    const taskRef = doc(db, 'usuarios', user.uid, SUBCOLLECTION, taskId);
    await deleteDoc(taskRef);
  } catch (error) {
    throw error;
  }
}

/**
 * Busca tarefas com filtro de texto
 */
export async function searchTasks(searchText) {
  const user = auth.currentUser;
  if (!user) return [];

  try {
    const allTasks = await getAllTasks();
    const search = searchText.toLowerCase();
    
    return allTasks.filter(task => 
      task.nome?.toLowerCase().includes(search) ||
      task.descricao?.toLowerCase().includes(search)
    );
  } catch (error) {
    return [];
  }
}

