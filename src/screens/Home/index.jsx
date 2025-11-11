import React, { useState, useEffect } from 'react';
import { View, BackHandler, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import { auth } from '../../services/firebaseConfig';
import { Header } from '../../components/layout/Header';
import { SearchBar } from '../../components/layout/SearchBar';
import { TaskList } from '../../components/tasks/TaskList';
import { TaskFilter } from '../../components/tasks/TaskFilter';
import { useHomeData } from './hooks/useHomeData';
import { useHomeFilters } from './hooks/useHomeFilters';
import { deleteTask, updateTask, logout } from '../../services/firebaseService';
import { useTheme } from '../../hooks/useTheme';
import { useToast } from '../../context/ToastContext';
import { useHapticFeedback } from '../../hooks/useHapticFeedback';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { createStyles } from './styles';

export const HomeScreen = () => {
  const navigation = useNavigation();
  const { colors, isDarkTheme } = useTheme();
  const { showSuccess, showError } = useToast();
  const { mediumImpact } = useHapticFeedback();
  const styles = createStyles(colors);

  useEffect(() => {
    if (!auth.currentUser) {
      navigation.getParent()?.navigate('Login');
    }
  }, [navigation]);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [isFilterMenuVisible, setFilterMenuVisible] = useState(false);
  const [mostrarModalConfirmacao, setMostrarModalConfirmacao] = useState(false);
  const [taskIdParaExcluir, setTaskIdParaExcluir] = useState(null);
  const [mostrarModalSair, setMostrarModalSair] = useState(false);

  const { tasks, userName, loading, loadData, setTasks } = useHomeData();
  const {
    searchQuery,
    setSearchQuery,
    filterOption,
    setFilterOption,
    filteredTasks,
    clearFilters,
  } = useHomeFilters(tasks, setTasks, loadData);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        setMostrarModalSair(true);
        return true;
      };

      const subscription = BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () => subscription.remove();
    }, [])
  );

  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  const handleTaskSelect = (taskId) => {
    setSelectedTaskId(selectedTaskId === taskId ? null : taskId);
  };

  const handleDeleteTask = (taskId) => {
    if (!taskId) return;
    setTaskIdParaExcluir(taskId);
    setMostrarModalConfirmacao(true);
  };

  const confirmarExclusao = async () => {
    if (!taskIdParaExcluir) return;

    try {
      mediumImpact();
      await deleteTask(taskIdParaExcluir);
      const updatedTasks = tasks.filter(t => t.id !== taskIdParaExcluir);
      setTasks(updatedTasks);
      setSelectedTaskId(null);
      showSuccess('Tarefa excluída com sucesso!');
    } catch (error) {
      showError('Não foi possível excluir a tarefa');
    } finally {
      setTaskIdParaExcluir(null);
    }
  };

  const handleEditTask = (taskId) => {
    if (!taskId) return;
    navigation.getParent()?.navigate('AddTask', { idTarefa: taskId });
  };

  const handleCompleteTask = async (taskId) => {
    if (!taskId) return;

    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      const newStatus = task.status === 'Concluida' ? 'Pendente' : 'Concluida';
      await updateTask(taskId, { status: newStatus });
      const updatedTasks = tasks.map(t => 
        t.id === taskId ? { ...t, status: newStatus } : t
      );
      setTasks(updatedTasks);
      
      showSuccess(
        newStatus === 'Concluida' 
          ? 'Tarefa marcada como concluída!' 
          : 'Tarefa marcada como pendente!'
      );
    } catch (error) {
      showError('Não foi possível atualizar a tarefa');
    }
  };

  const handleFilterChange = (option) => {
    setFilterOption(option);
  };

  const handleSairSistema = async () => {
    try {
      await logout();
      navigation.getParent()?.navigate('Login');
      showSuccess('Sessão encerrada com sucesso!');
    } catch (error) {
      showError('Não foi possível encerrar a sessão');
    }
  };

  return (
    <>
      <StatusBar 
        barStyle={isDarkTheme ? "light-content" : "dark-content"}
        backgroundColor={colors.surface}
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
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onCompleteTask={handleCompleteTask}
            onRefresh={loadData}
          />

          <TaskFilter
            visible={isFilterMenuVisible}
            onClose={() => setFilterMenuVisible(false)}
            selectedFilter={filterOption}
            onFilterChange={handleFilterChange}
            onClearFilters={clearFilters}
          />

          <ConfirmModal
            visible={mostrarModalConfirmacao}
            onClose={() => {
              setMostrarModalConfirmacao(false);
              setTaskIdParaExcluir(null);
            }}
            onConfirm={confirmarExclusao}
            title="Confirmar Exclusão"
            message="Deseja realmente excluir esta tarefa? Esta ação não pode ser desfeita."
            confirmText="Excluir"
            cancelText="Cancelar"
            type="danger"
          />

          <ConfirmModal
            visible={mostrarModalSair}
            onClose={() => setMostrarModalSair(false)}
            onConfirm={handleSairSistema}
            title="Sair do Sistema"
            message="Deseja realmente sair do sistema? Você será deslogado e precisará fazer login novamente."
            confirmText="Sair"
            cancelText="Cancelar"
            type="warning"
          />

        </View>
      </SafeAreaView>
    </>
  );
};

export default HomeScreen;

