import React, { useState, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, TextInput, Modal } from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BackHandler } from 'react-native';
import openDB from "../database/db";
import { FontContext } from '../context/FontContext';
import { ThemeContext } from '../context/ThemeContext';

const TelaPrincipal = () => {
  const db = openDB();
  const navigation = useNavigation();
  const [tarefas, setTarefas] = useState([]);
  const [tarefasFiltradas, setTarefasFiltradas] = useState([]);
  const [idTarefaSelecionada, setIdTarefaSelecionada] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [nomeUser, setUsuario] = useState('');
  const [filterOption, setFilterOption] = useState(null);
  const [isFilterMenuVisible, setFilterMenuVisible] = useState(false);

  const { fontSize } = useContext(FontContext);
  const { isDarkTheme } = useContext(ThemeContext);

  useFocusEffect(
    React.useCallback(() => {
      const handleBackPress = () => {
        BackHandler.exitApp();
        return true;
      };

      BackHandler.addEventListener("hardwareBackPress", handleBackPress);
      return () => BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
    }, [])
  );

  useFocusEffect(
    React.useCallback(() => {
      async function buscarTarefas() {
        const idUsuario = await AsyncStorage.getItem('idUser');
        const dadosUsu = await db.getAllAsync(
          `SELECT nome FROM usuario WHERE id = ?`,
          [idUsuario]
        );

        setUsuario(dadosUsu[0]?.nome || '');
        const todasAsLinhas = await db.getAllAsync(
          `SELECT * FROM tarefas WHERE idUser = ? AND status = "Pendente"`,
          [idUsuario]
        );

        setTarefas(todasAsLinhas);
        setTarefasFiltradas(todasAsLinhas);
      }

      setSearchQuery('');
      buscarTarefas();
    }, [])
  );

  const handleFilterChange = (filterType) => {
    setFilterOption(filterType);
  
    let sortedTarefas = [...tarefas];
  
    if (filterType === 'prioridade') {
      sortedTarefas = sortedTarefas.sort((a, b) => a.prioridade.localeCompare(b.prioridade));
    } else if (filterType === 'data') {
      sortedTarefas = sortedTarefas.sort((a, b) => {
        const dateA = a.data ? new Date(a.data.replace(/-/g, '/')) : null;
        const dateB = b.data ? new Date(b.data.replace(/-/g, '/')) : null;
        
        if (!dateA && !dateB) return 0; // Ambos indefinidos
        if (!dateA) return 1;          // a sem data, move para depois
        if (!dateB) return -1;         // b sem data, move para depois
        
        return dateA - dateB;          // Compara as datas normalmente
      });
    } else if (filterType === 'status') {
      sortedTarefas = sortedTarefas.sort((a, b) => a.status.localeCompare(b.status));
    }
  
    setTarefasFiltradas(sortedTarefas);
    setFilterMenuVisible(false);
  };

  const removerFiltros = () => {
    setTarefasFiltradas(tarefas);
    setFilterOption(null);
    setFilterMenuVisible(false);
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    const tarefasFiltradas = tarefas.filter((tarefa) =>
      tarefa.nome.toLowerCase().includes(text.toLowerCase()) ||
      tarefa.descricao.toLowerCase().includes(text.toLowerCase())
    );
    setTarefasFiltradas(tarefasFiltradas);
  };

  const selecionarTarefa = (id) => {
    setIdTarefaSelecionada(id === idTarefaSelecionada ? null : id);
  };

  async function atualizarLista() {
    const idUsuario = await AsyncStorage.getItem('idUser');
    const todasAsLinhas = await db.getAllAsync(
      `SELECT * FROM tarefas WHERE idUser = ? AND status = "Pendente"`,
      [idUsuario]
    );

    setTarefas(todasAsLinhas);
    setTarefasFiltradas(todasAsLinhas);
  }

  const excluirTarefa = async () => {
    if (idTarefaSelecionada !== null) {
      await db.runAsync(`DELETE FROM tarefas WHERE id = ?`, [idTarefaSelecionada]);
      setTarefas(tarefas.filter(tarefa => tarefa.id !== idTarefaSelecionada));
      setTarefasFiltradas(tarefasFiltradas.filter(tarefa => tarefa.id !== idTarefaSelecionada));
      setIdTarefaSelecionada(null);
    }
  };

  const obterIconePrioridade = (prioridade) => {
    switch (prioridade) {
      case 'Baixa':
        return <FontAwesome name="exclamation" size={24} color="#4CAF50" />;
      case 'Média':
        return <FontAwesome name="exclamation" size={24} color="#FF9800" />;
      case 'Alta':
        return <FontAwesome name="exclamation" size={24} color="#F44336" />;
      default:
        return <FontAwesome name="question-circle" size={24} color="#757575" />;
    }
  };

  return (
    <View style={[estilos.container, { backgroundColor: isDarkTheme ? '#333' : '#fff' }]}>
      <View style={estilos.header}>
        <View style={estilos.profileContainer}>
          <Image source={require('../images/favicon.png')} style={estilos.logoImage} />
          <Text style={[estilos.profileName, { fontSize }]}>{nomeUser}</Text>
        </View>
        <Text style={[estilos.headerTitle, { fontSize }]}>TO-DO</Text>
      </View>

      <View style={estilos.searchContainer}>
        <TextInput
          style={[estilos.searchInput, { fontSize, color: isDarkTheme ? '#fff' : '#333' }]}
          placeholder="Pesquisar tarefas..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
        <TouchableOpacity style={estilos.filterList} onPress={() => setFilterMenuVisible(true)}>
          <MaterialIcons name="filter-list" size={28} color="#51c1f5" />
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isFilterMenuVisible}
        onRequestClose={() => setFilterMenuVisible(false)}
      >
        <View style={estilos.modalContainer}>
          <View style={estilos.modalContent}>
            <Text style={estilos.modalTitle}>Filtrar por</Text>
            <TouchableOpacity onPress={() => handleFilterChange('prioridade')}>
              <Text style={estilos.modalOption}>Prioridade</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleFilterChange('data')}>
              <Text style={estilos.modalOption}>Data Final</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleFilterChange('status')}>
              <Text style={estilos.modalOption}>Status</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => removerFiltros()}>
              <Text style={estilos.modalOption}>Remover Filtros</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <FlatList
        data={tarefasFiltradas}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              estilos.todoItem,
              item.id === idTarefaSelecionada && estilos.selectedItem, // Aplica o estilo ao item selecionado
            ]}
            onPress={() => selecionarTarefa(item.id)}
          >
            {obterIconePrioridade(item.prioridade)}
            <View>
              <Text style={{ color: isDarkTheme ? '#fff' : '#000', fontSize }}>{item.nome}</Text>
              <Text style={{ color: isDarkTheme ? '#aaa' : '#757575', fontSize }}>{item.descricao}</Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={estilos.todoList}
      />

      <View style={estilos.bottomNav}>
        <TouchableOpacity style={estilos.navButton}>
          <MaterialIcons name="home" size={24} onPress={atualizarLista} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[estilos.navButton, { opacity: idTarefaSelecionada ? 1 : 0.5 }]}
          onPress={excluirTarefa}
          disabled={!idTarefaSelecionada}
        >
          <MaterialIcons name="delete" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[estilos.navButton, estilos.navButtonCenter]}
          onPress={() => navigation.navigate('AddTask')}
        >
          <MaterialIcons name="add" size={28} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[estilos.navButton, { opacity: idTarefaSelecionada ? 1 : 0.5 }]}
          onPress={() => navigation.navigate('AddTask', { idTarefa: idTarefaSelecionada })}
          disabled={!idTarefaSelecionada}
        >
          <MaterialIcons name="edit" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={estilos.navButton}>
          <MaterialIcons name="settings" onPress={() => navigation.navigate('Config')} size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    padding: 20,
    backgroundColor: '#51c1f5',
    alignItems: 'center',
  },
  profileContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    marginTop: 20,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logoImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 2,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    fontSize: 16,
  },
  filterList: {
    marginLeft: 10,
  },
  todoList: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f8f8f8',
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  selectedItem: {
    backgroundColor: '#757f88',
  },
  todoTextContainer: {
    marginLeft: 15,
  },
  todoText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  todoDesc: {
    fontSize: 16,
    color: '#757575',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 4,
    borderRadius: 30,
    backgroundColor: '#51c1f5',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  navButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
    backgroundColor: '#51c1f5',
    borderRadius: 25,
    marginTop: 10,
  },
  navButtonCenter: {
    backgroundColor: '#FFC107',
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalOption: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
    paddingVertical: 10,
    width: '100%',
  },
  modalOptionContainer: {
    width: '100%',
    borderRadius: 5,
    marginVertical: 5,
  },
  modalOptionSelected: {
    backgroundColor: '#51c1f5',
  },
  modalCancel: {
    fontSize: 16,
    color: '#F44336',
    marginTop: 20,
    textAlign: 'center',
  },
  concluidaItem: {
    backgroundColor: '#d3d3d3',
    opacity: 0.7,
  },
});

export default TelaPrincipal;
