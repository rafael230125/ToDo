/**
 * HomeScreen Refatorada
 * Usa componentes e hooks criados nas Fases 3 e 4
 */

import React, { useState } from 'react';
import { View, StyleSheet, Alert, BackHandler } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import { Header } from '../../components/layout/Header';
import { SearchBar } from '../../components/layout/SearchBar';
import { TaskList } from '../../components/tasks/TaskList';
import { TaskFilter } from '../../components/tasks/TaskFilter';
import { NavBar } from '../../components/layout/NavBar';
import { useHomeData } from './hooks/useHomeData';
import { useHomeFilters } from './hooks/useHomeFilters';
import { deleteTask } from '../../services/firebaseService';
import { useTheme } from '../../hooks/useTheme';

export const HomeScreen = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [isFilterMenuVisible, setFilterMenuVisible] = useState(false);

  // Hooks de dados e filtros
  const { tasks, userName, loading, loadData, setTasks } = useHomeData();
  const {
    searchQuery,
    setSearchQuery,
    filterOption,
    setFilterOption,
    filteredTasks,
    setFilteredTasks,
    applyFilters,
    clearFilters,
  } = useHomeFilters(tasks, setTasks);

  // Back Handler
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        BackHandler.exitApp();
        return true;
      };

      const subscription = BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () => subscription.remove();
    }, [])
  );

  // Handlers
  const handleSearch = (text) => {
    setSearchQuery(text);
    applyFilters(text, filterOption);
  };

  const handleTaskSelect = (taskId) => {
    setSelectedTaskId(selectedTaskId === taskId ? null : taskId);
  };

  const handleDeleteTask = async () => {
    if (!selectedTaskId) return;

    Alert.alert(
      'Confirmar',
      'Deseja realmente excluir esta tarefa?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTask(selectedTaskId);
              setTasks(tasks.filter(t => t.id !== selectedTaskId));
              setFilteredTasks(filteredTasks.filter(t => t.id !== selectedTaskId));
              setSelectedTaskId(null);
              Alert.alert('Sucesso', 'Tarefa excluída com sucesso!');
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir a tarefa');
            }
          }
        }
      ]
    );
  };

  const handleFilterChange = async (option) => {
    setFilterOption(option);
    await applyFilters(searchQuery, option);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header userName={userName} />
      
      <SearchBar
        value={searchQuery}
        onChangeText={handleSearch}
        onFilterPress={() => setFilterMenuVisible(true)}
      />

      <TaskList
        tasks={filteredTasks}
        onTaskPress={handleTaskSelect}
        selectedTaskId={selectedTaskId}
        loading={loading}
      />

      <TaskFilter
        visible={isFilterMenuVisible}
        onClose={() => setFilterMenuVisible(false)}
        selectedFilter={filterOption}
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
      />

      <NavBar
        onHome={loadData}
        onDelete={handleDeleteTask}
        onAdd={() => navigation.navigate('AddTask')}
        onEdit={() => navigation.navigate('AddTask', { idTarefa: selectedTaskId })}
        onSettings={() => navigation.navigate('Config')}
        canDelete={!!selectedTaskId}
        canEdit={!!selectedTaskId}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

// Manter export padrão para compatibilidade
export default HomeScreen;

