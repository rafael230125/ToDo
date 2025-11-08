/**
 * firebaseService.js - Compatibilidade
 * 
 * Este arquivo mantém compatibilidade com imports antigos
 * Importa dos novos serviços separados
 * 
 * @deprecated Use imports diretos dos serviços específicos:
 * - import { getAllTasks } from './services/taskService'
 * - import { getCurrentUser } from './services/userService'
 */

// Re-exportar todos os serviços para compatibilidade
export * from './taskService';
export * from './userService';
export * from './configService';
export * from './authService';
export * from './notificationService';

// Exports específicos para facilitar migração
export {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  searchTasks,
} from './taskService';

export {
  getCurrentUser,
  saveUser,
  updateUserPhoto,
  updateUser,
} from './userService';

export {
  getUserConfig,
  saveUserConfig,
  updateConfigField,
} from './configService';

export {
  getCurrentAuthUser,
  isAuthenticated,
  getCurrentUserId,
  logout,
} from './authService';
