/**
 * Repository de Tarefas
 * 
 * Abstração do banco de dados para operações com tarefas
 */

import { BaseRepository } from './baseRepository';

export class TaskRepository extends BaseRepository {
  constructor() {
    super('tarefas');
  }

  async findWithFilters(filters = {}) {
    const allTasks = await this.findAll();
    
    let filteredTasks = [...allTasks];
    
    filteredTasks.sort((a, b) => {
      const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
      const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
      return dateB - dateA;
    });

    if (filters.status) {
      filteredTasks = filteredTasks.filter(task => task.status === filters.status);
    }

    if (filters.orderBy === 'dataFinal') {
      filteredTasks = filteredTasks.sort((a, b) => {
        try {
          const dateA = this.converterParaDate(a.dataFinal);
          const dateB = this.converterParaDate(b.dataFinal);
          return dateA - dateB;
        } catch {
          return 0;
        }
      });
    } else if (filters.orderBy === 'prioridade') {
      filteredTasks = filteredTasks.sort((a, b) => {
        const priorityOrder = { 'Alta': 1, 'Média': 2, 'Baixa': 3 };
        const orderA = priorityOrder[a.prioridade] || 999;
        const orderB = priorityOrder[b.prioridade] || 999;
        return orderA - orderB;
      });
    }

    return filteredTasks;
  }

  async search(searchText) {
    const allTasks = await this.findAll();
    const search = searchText.toLowerCase();
    
    return allTasks.filter(task =>
      task.nome?.toLowerCase().includes(search) ||
      task.descricao?.toLowerCase().includes(search)
    );
  }

  converterParaDate(dataString) {
    const [dia, mes, ano] = dataString.split('/').map(Number);
    return new Date(ano, mes - 1, dia);
  }
}

