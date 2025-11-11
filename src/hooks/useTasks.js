import { useState, useEffect, useCallback } from 'react';
import {
  getAllTasks as fetchAllTasks,
  createTask as addTask,
  updateTask as updateTaskService,
  deleteTask as removeTask,
  searchTasks as searchTasksService,
} from '../services/taskService';

export function useTasks(initialFilters = {}) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);

  const loadTasks = useCallback(async (customFilters = filters) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAllTasks(customFilters);
      setTasks(data);
      return data;
    } catch (err) {
      setError(err.message || 'Erro ao carregar tarefas');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const createTask = useCallback(async (taskData) => {
    try {
      setLoading(true);
      setError(null);
      const taskId = await addTask(taskData);
      await loadTasks(filters);
      
      return taskId;
    } catch (err) {
      setError(err.message || 'Erro ao criar tarefa');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [filters, loadTasks]);

  const updateTask = useCallback(async (taskId, taskData) => {
    try {
      setLoading(true);
      setError(null);
      await updateTaskService(taskId, taskData);
      await loadTasks(filters);
    } catch (err) {
      setError(err.message || 'Erro ao atualizar tarefa');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [filters, loadTasks]);

  const deleteTask = useCallback(async (taskId) => {
    try {
      setLoading(true);
      setError(null);
      await removeTask(taskId);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    } catch (err) {
      setError(err.message || 'Erro ao deletar tarefa');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const search = useCallback(async (searchText) => {
    try {
      setLoading(true);
      setError(null);
      const results = await searchTasksService(searchText);
      setTasks(results);
      return results;
    } catch (err) {
      setError(err.message || 'Erro ao buscar tarefas');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const applyFilters = useCallback(async (newFilters) => {
    setFilters(newFilters);
    await loadTasks(newFilters);
  }, [loadTasks]);

  const clearFilters = useCallback(async () => {
    setFilters(initialFilters);
    await loadTasks(initialFilters);
  }, [initialFilters, loadTasks]);

  return {
    tasks,
    loading,
    error,
    filters,
    loadTasks,
    createTask,
    updateTask,
    deleteTask,
    search,
    applyFilters,
    clearFilters,
    setFilters,
  };
}

