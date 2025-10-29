/**
 * Serviço de Autenticação
 * Gerencia autenticação do usuário com Firebase Auth
 */

import { auth } from './firebaseConfig';

/**
 * Retorna o usuário atual autenticado
 */
export function getCurrentAuthUser() {
  return auth.currentUser;
}

/**
 * Verifica se há um usuário autenticado
 */
export function isAuthenticated() {
  return !!auth.currentUser;
}

/**
 * Retorna o UID do usuário atual
 */
export function getCurrentUserId() {
  return auth.currentUser?.uid || null;
}

/**
 * Realiza logout do usuário
 */
export async function logout() {
  try {
    await auth.signOut();
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
    throw error;
  }
}

