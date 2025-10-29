/**
 * Hook customizado para filtros
 * 
 * Gerencia estado e lógica de filtros de forma reutilizável
 */

import { useState, useMemo } from 'react';

export function useFilter(tasks = []) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOption, setFilterOption] = useState(null);

  // Filtrar tarefas por texto
  const filteredTasks = useMemo(() => {
    let result = tasks;

    // Filtrar por texto (nome ou descrição)
    if (searchQuery) {
      result = result.filter((task) =>
        task.nome?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.descricao?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filtrar por opção
    if (filterOption === 'prioridade') {
      result = [...result].sort((a, b) => {
        const priorityOrder = { 'Alta': 1, 'Média': 2, 'Baixa': 3 };
        const orderA = priorityOrder[a.prioridade] || 999;
        const orderB = priorityOrder[b.prioridade] || 999;
        return orderA - orderB;
      });
    } else if (filterOption === 'data') {
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
            const dateA = converterParaDate(a.dataFinal);
            const dateB = converterParaDate(b.dataFinal);
            return dateA - dateB;
          } catch {
            return 0;
          }
        });
    }

    return result;
  }, [tasks, searchQuery, filterOption]);

  // Limpar filtros
  const clearFilters = () => {
    setSearchQuery('');
    setFilterOption(null);
  };

  // Helper para converter data
  const converterParaDate = (dataString) => {
    const [dia, mes, ano] = dataString.split('/').map(Number);
    return new Date(ano, mes - 1, dia);
  };

  return {
    // Estado
    searchQuery,
    filterOption,
    filteredTasks,
    
    // Ações
    setSearchQuery,
    setFilterOption,
    clearFilters,
  };
}

