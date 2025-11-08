/**
 * HomeScreen Refatorada
 * Usa componentes e hooks criados nas Fases 3 e 4
 */

import React, { useState, useEffect } from 'react';
import { View, Alert, BackHandler, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import { auth } from '../../services/firebaseConfig';
import { Header } from '../../components/layout/Header';
import { SearchBar } from '../../components/layout/SearchBar';
import { TaskList } from '../../components/tasks/TaskList';
import { TaskFilter } from '../../components/tasks/TaskFilter';
import { NavBar } from '../../components/layout/NavBar';
import { useHomeData } from './hooks/useHomeData';
import { useHomeFilters } from './hooks/useHomeFilters';
import { deleteTask } from '../../services/firebaseService';
import { useTheme } from '../../hooks/useTheme';
import { createStyles } from './styles';

export const HomeScreen = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const styles = createStyles(colors);

  // Verificação de autenticação - redireciona para Login se não autenticado
  useEffect(() => {
    if (!auth.currentUser) {
      navigation.replace('Login');
    }
  }, [navigation]);
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
    clearFilters,
  } = useHomeFilters(tasks, setTasks, loadData);

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
    // filteredTasks será recalculado automaticamente pelo useMemo
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
              // Atualizar lista de tasks - filteredTasks será recalculado automaticamente pelo useMemo
              const updatedTasks = tasks.filter(t => t.id !== selectedTaskId);
              setTasks(updatedTasks);
              setSelectedTaskId(null);
              // Não mostrar alerta de sucesso, apenas remover silenciosamente
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir a tarefa');
            }
          }
        }
      ]
    );
  };

  const handleFilterChange = (option) => {
    setFilterOption(option);
    // filteredTasks será recalculado automaticamente pelo useMemo
  };

  return (
    <>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor={colors.primary}
        translucent={false}
      />
      <SafeAreaView 
        style={styles.container}
        edges={['top']}
      >
        <View style={styles.content}>
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

        </View>
        <SafeAreaView edges={['bottom']} style={{ backgroundColor: colors.background }}>
          <NavBar
            onHome={loadData}
            onDelete={handleDeleteTask}
            onAdd={() => navigation.navigate('AddTask')}
            onEdit={() => navigation.navigate('AddTask', { idTarefa: selectedTaskId })}
            onSettings={() => navigation.navigate('Config')}
            canDelete={!!selectedTaskId}
            canEdit={!!selectedTaskId}
          />
        </SafeAreaView>
      </SafeAreaView>
    </>
  );
};

// Manter export padrão para compatibilidade
export default HomeScreen;

