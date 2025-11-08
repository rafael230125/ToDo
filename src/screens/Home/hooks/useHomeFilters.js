/**
 * Hook de filtros do Home
 * Gerencia filtros e busca
 */

import { useState, useCallback, useEffect, useMemo } from 'react';
import { getAllTasks } from '../../../services/firebaseService';

export function useHomeFilters(tasks, setTasks, loadData) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOption, setFilterOption] = useState(null);
  const [allTasks, setAllTasks] = useState([]); // Armazena todas as tarefas para filtros

  // Carregar todas as tarefas quando necessário para filtros
  useEffect(() => {
    const loadAllTasks = async () => {
      if (filterOption === 'status') {
        try {
          // Buscar todas as tarefas (sem filtro de status)
          const allFetchedTasks = await getAllTasks();
          setAllTasks(allFetchedTasks);
        } catch (error) {
          setAllTasks([]);
        }
      } else {
        // Limpar allTasks quando não estiver usando filtro de status
        setAllTasks([]);
      }
    };
    loadAllTasks();
  }, [filterOption]);

  // Aplicar filtros de forma síncrona usando useMemo
  const filteredTasks = useMemo(() => {
    // Usar allTasks quando o filtro for 'status', senão usar tasks
    let result = filterOption === 'status' ? [...allTasks] : [...tasks];

    // Filtro por status (tarefas concluídas)
    if (filterOption === 'status') {
      result = result.filter((task) => {
        const taskStatus = task.status?.toLowerCase() || '';
        return taskStatus === 'concluída' || taskStatus === 'concluida';
      });
    }

    // Busca por texto
    if (searchQuery) {
      result = result.filter((task) =>
        task.nome?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.descricao?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filtro por prioridade
    if (filterOption === 'prioridade') {
      result = result.sort((a, b) => {
        const priorityOrder = { 'Alta': 1, 'Média': 2, 'Baixa': 3 };
        return (priorityOrder[a.prioridade] || 999) - (priorityOrder[b.prioridade] || 999);
      });
    }
    // Filtro por data
    else if (filterOption === 'data') {
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0); // Resetar horas para comparação correta
      result = result
        .filter((task) => {
          try {
            if (!task.dataFinal) return false;
            const dataFinal = converterParaDate(task.dataFinal);
            dataFinal.setHours(0, 0, 0, 0);
            return dataFinal <= hoje;
          } catch {
            return false;
          }
        })
        .sort((a, b) => {
          try {
            if (!a.dataFinal || !b.dataFinal) return 0;
            return converterParaDate(a.dataFinal) - converterParaDate(b.dataFinal);
          } catch {
            return 0;
          }
        });
    }

    return result;
  }, [tasks, allTasks, searchQuery, filterOption]);

  // Limpar filtros e recarregar tarefas pendentes
  const clearFilters = useCallback(async () => {
    setSearchQuery('');
    setFilterOption(null);
    setAllTasks([]);
    // Recarregar tarefas pendentes
    if (loadData) {
      await loadData();
    }
  }, [loadData]);

  return {
    searchQuery,
    setSearchQuery,
    filterOption,
    setFilterOption,
    filteredTasks,
    clearFilters,
  };
}

// Helper
function converterParaDate(dataString) {
  if (!dataString) return new Date();
  // Verificar se já é uma data
  if (dataString instanceof Date) return dataString;
  // Tentar diferentes formatos
  if (typeof dataString === 'string') {
    // Formato DD/MM/YYYY
    if (dataString.includes('/')) {
      const [dia, mes, ano] = dataString.split('/').map(Number);
      if (dia && mes && ano) {
        return new Date(ano, mes - 1, dia);
      }
    }
    // Tentar parse direto
    const parsed = new Date(dataString);
    if (!isNaN(parsed.getTime())) {
      return parsed;
    }
  }
  return new Date();
}
