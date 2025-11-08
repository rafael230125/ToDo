/**
 * Hook de dados do Home
 * Gerencia busca e estado de tarefas
 */

import { useState, useEffect, useCallback } from 'react';
import React from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { getCurrentUser, getAllTasks } from '../../../services/firebaseService';

export function useHomeData() {
  const [tasks, setTasks] = useState([]);
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Buscar usuário
      const userData = await getCurrentUser();
      if (userData) {
        setUserName(userData.nome || 'Usuário');
      }

      // Buscar tarefas
      const fetchedTasks = await getAllTasks({ status: 'Pendente' });
      setTasks(fetchedTasks);
      
      return fetchedTasks;
    } catch (error) {
      // Erro silencioso ao buscar tarefas ou usuário
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

  return {
    tasks,
    setTasks,
    userName,
    loading,
    loadData,
  };
}

