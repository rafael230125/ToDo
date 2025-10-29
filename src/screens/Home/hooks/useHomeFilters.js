/**
 * Hook de filtros do Home
 * Gerencia filtros e busca
 */

import { useState, useCallback, useEffect, useMemo } from 'react';
import { getAllTasks } from '../../../services/firebaseService';

export function useHomeFilters(tasks, setTasks) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOption, setFilterOption] = useState(null);

  // Aplicar filtros de forma síncrona usando useMemo
  const filteredTasks = useMemo(() => {
    let result = [...tasks];

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
      result = result
        .filter((task) => {
          try {
            const dataFinal = converterParaDate(task.dataFinal);
            return dataFinal <= hoje;
          } catch {
            return false;
          }
        })
        .sort((a, b) => {
          try {
            return converterParaDate(a.dataFinal) - converterParaDate(b.dataFinal);
          } catch {
            return 0;
          }
        });
    }

    return result;
  }, [tasks, searchQuery, filterOption]);

  // Aplicar filtro de status (assíncrono)
  const applyStatusFilter = useCallback(async () => {
    if (filterOption === 'status') {
      try {
        const completedTasks = await getAllTasks({ status: 'Concluida' });
        setTasks(completedTasks);
      } catch (error) {
        console.error("Erro ao buscar tarefas concluídas:", error);
      }
    }
  }, [filterOption, setTasks]);

  // Atualizar quando filterOption muda para 'status'
  useEffect(() => {
    if (filterOption === 'status') {
      applyStatusFilter();
    }
  }, [filterOption, applyStatusFilter]);

  // Limpar filtros
  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setFilterOption(null);
  }, []);

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
  const [dia, mes, ano] = dataString.split('/').map(Number);
  return new Date(ano, mes - 1, dia);
}
