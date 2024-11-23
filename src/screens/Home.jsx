import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, TextInput } from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BackHandler, Alert } from 'react-native'; 
import { Modal } from 'react-native';
import openDB from "../database/db";

const TelaPrincipal = () => {
  const db = openDB();
  const navigation = useNavigation();
  const [tarefas,             setTarefas]             = useState([]);
  const [tarefasFiltradas,    setTarefasFiltradas]    = useState([]); 
  const [idTarefaSelecionada, setIdTarefaSelecionada] = useState(null);
  const [searchQuery,         setSearchQuery]         = useState('');  
  const [nomeUser,            setUsuario]             = useState('');  
  const [filterOption,        setFilterOption]        = useState(null);
  const [isFilterMenuVisible, setFilterMenuVisible]   = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);

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

        const dadosUsu = await db.getAllAsync(`  SELECT nome,tema FROM usuario USU
                                                 JOIN config CFG ON CFG.iduser = USU.id
                                                 WHERE id = ?`, [idUsuario]); 
        setUsuario(dadosUsu[0].nome); 
        setIsDarkTheme(dadosUsu[0].tema);
        
        const todasAsLinhas = await db.getAllAsync(`  SELECT * 
                                                      FROM tarefas 
                                                      WHERE idUser = ?
                                                      AND status = "Pendente"`,
                                                      [idUsuario]);

        setTarefas(todasAsLinhas);
        setTarefasFiltradas(todasAsLinhas);        
      }
      setSearchQuery('');
      buscarTarefas();
    }, [])
  );

  // Função para filtrar tarefas com base no texto da pesquisa
  const handleSearch = (text) => {
    setSearchQuery(text);
    const tarefasFiltradas = tarefas.filter((tarefa) =>
      tarefa.nome.toLowerCase().includes(text.toLowerCase()) || 
      tarefa.descricao.toLowerCase().includes(text.toLowerCase()) // Filtra por nome ou descrição
    );
    setTarefasFiltradas(tarefasFiltradas); // Atualiza as tarefas filtradas
  };

  // Função para selecionar/deselecionar tarefa
  const selecionarTarefa = (id) => {
    setIdTarefaSelecionada(id === idTarefaSelecionada ? null : id);
  };

  async function atualizarLista() {
    const idUsuario = await AsyncStorage.getItem('idUser');
    const todasAsLinhas = await db.getAllAsync(`  
      SELECT *
      FROM tarefas 
      WHERE idUser = ?
      AND status = "Pendente"`,
      [idUsuario]);

    setTarefas(todasAsLinhas);
    setTarefasFiltradas(todasAsLinhas); 
  }

  const excluirTarefa = async () => {
    console.log(idTarefaSelecionada);
    if (idTarefaSelecionada !== null) {
      await db.execAsync(`DELETE FROM tarefas WHERE id = $idTarefaSelecionada`, {id: idTarefaSelecionada});

      setTarefas(tarefas.filter(tarefa => tarefa.id !== idTarefaSelecionada));
      setTarefasFiltradas(tarefasFiltradas.filter(tarefa => tarefa.id !== idTarefaSelecionada)); // Remove da lista filtrada
      setIdTarefaSelecionada(null);
    }
  };

  const obterIconePrioridade = (prioridade) => {
    switch (prioridade) {
      case 'Baixa':
        return <FontAwesome name="exclamation" size={24} color="#4CAF50" />; // Verde
      case 'Média':
        return <FontAwesome name="exclamation" size={24} color="#FF9800" />; // Laranja
      case 'Alta':
        return <FontAwesome name="exclamation" size={24} color="#F44336" />; // Vermelho
      default:
        return <FontAwesome name="question-circle" size={24} color="#757575" />; // Cinza para casos indefinidos
    }
  };


  const applyFilters = (text = searchQuery, option = filterOption) => {
    let filteredTasks = tarefas;
  
    // Filtro por texto (nome ou descrição)
    if (text) {
      filteredTasks = filteredTasks.filter((tarefa) =>
        tarefa.nome.toLowerCase().includes(text.toLowerCase()) ||
        tarefa.descricao.toLowerCase().includes(text.toLowerCase())
      );
    }
  
    // Filtro por prioridade
    if (option === 'prioridade') {
      filteredTasks = filteredTasks.sort((a, b) => {
        const priorityOrder = { 'Alta': 1, 'Média': 2, 'Baixa': 3 };
        return priorityOrder[a.prioridade] - priorityOrder[b.prioridade];
      });
  
    // Filtro por data
    } else if (option === 'data') {
      const hoje = new Date();
      filteredTasks = filteredTasks
        .filter((tarefa) => converterParaDate(tarefa.dataFinal) <= hoje)
        .sort((a, b) => converterParaDate(a.dataFinal) - converterParaDate(b.dataFinal));
  
    // Filtro por status
    } else if (option === 'status') {
      Concluidas();
      // filteredTasks = filteredTasks.filter((tarefa) => tarefa.status === 'Concluida');
    }
  
    setTarefasFiltradas(filteredTasks);
  };

  const  Concluidas = async () => {
    const idUsuario = await AsyncStorage.getItem('idUser'); 
    const todasAsLinhas = await db.getAllAsync(`  SELECT * 
                                                  FROM tarefas 
                                                  WHERE idUser = ?
                                                  AND status = "Concluida"`,
                                                  [idUsuario]);

    setTarefas(todasAsLinhas);
    setTarefasFiltradas(todasAsLinhas); 
  };

  const converterParaDate = (dataString) => {
    const [dia, mes, ano] = dataString.split('/').map(Number);
    return new Date(ano, mes - 1, dia);
  };

  const handleFilterChange = (option) => {
    setFilterOption(option);
    applyFilters(searchQuery, option);
  };

  const removerFiltros = () => {
    setSearchQuery(''); 
    setFilterOption(null); 
    setTarefasFiltradas(tarefas); 
    atualizarLista();
  };
  
  return (
    <View style={[estilos.container,{ backgroundColor: isDarkTheme ? '#333' : '#fff' }]}>
      <View style={[estilos.header, { color: isDarkTheme ? '#fff' : '#333' }]}>
        <View style={estilos.profileContainer}>
          <View style={estilos.leftContainer}>
            <Image
              source={require('../images/favicon.png')}
              style={estilos.logoImage}
            />
            <Text style={estilos.profileName}>{nomeUser}</Text>
          </View>
          <Text style={estilos.headerTitle}>TO-DO</Text>
        </View>
      </View>

      <View style={[estilos.searchContainer,{ color: isDarkTheme ? '#333' : '#fff' }]}>
        <TextInput
          style={[estilos.searchInput,{ color: isDarkTheme ? '#fff' : '#333' }]}
          placeholder="Pesquisar tarefas..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
        <TouchableOpacity style={estilos.filterList} onPress={() => setFilterMenuVisible(true)}>
          <MaterialIcons name="filter-list" size={28} color="#51c1f5" />
        </TouchableOpacity>
      </View>

      <View> 
      <Modal
        animationType="slide"
        transparent={true}
        visible={isFilterMenuVisible}
        onRequestClose={() => setFilterMenuVisible(false)}
      >
        <View style={[estilos.modalContainer,{ color: isDarkTheme ? '#333' : '#fff' }]}>
          <View style={[estilos.modalContent,{ backgroundColor: isDarkTheme ? '#333' : '#fff' }]}>
            <Text style={[estilos.modalTitle,{ color: isDarkTheme ? '#fff' : '#333' }]}>Filtrar por</Text>

            <TouchableOpacity
              onPress={() => {
                setFilterMenuVisible(false);
                handleFilterChange('prioridade');
              }}
              style={[
                estilos.modalOptionContainer,
                filterOption === 'prioridade' && estilos.modalOptionSelected, 
              ]}
            >
              <Text style={[estilos.modalOption,{ color: isDarkTheme ? '#fff' : '#333' }]}>Prioridade</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setFilterMenuVisible(false);
                handleFilterChange('data');
              }}
              style={[
                estilos.modalOptionContainer,
                filterOption === 'data' && [estilos.modalOptionSelected,],
              ]}
            >
              <Text style={[estilos.modalOption,{ color: isDarkTheme ? '#fff' : '#333' }]}>Data final </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setFilterMenuVisible(false);
                handleFilterChange('status');
              }}
              style={[
                estilos.modalOptionContainer,
                filterOption === 'status' && estilos.modalOptionSelected,
              ]}
            >
              <Text style={[estilos.modalOption,{ color: isDarkTheme ? '#fff' : '#333' }]}>Concluidas </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setFilterMenuVisible(false);
                removerFiltros();
              }}
              style={[
                estilos.modalOptionContainer,
                filterOption === null && estilos.modalOptionSelected, 
              ]}
            >
              <Text style={[estilos.modalOption,{ color: isDarkTheme ? '#fff' : '#333' }]}>Sem Filtros</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setFilterMenuVisible(false)}>
              <Text style={estilos.modalCancel}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
      
      <FlatList
        data={tarefasFiltradas} // Usa as tarefas filtradas para exibição
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[estilos.todoItem, 
                    item.id === idTarefaSelecionada && estilos.selectedItem,
                    item.status === 'Concluida' && estilos.concluidaItem]}
            onPress={() => selecionarTarefa(item.id)}
          >
            {obterIconePrioridade(item.prioridade)}
            <View style={estilos.todoTextContainer}>
              <Text style={estilos.todoText}>{item.nome}</Text>
              <Text style={estilos.todoDesc}>{item.descricao}</Text>
              <Text style={estilos.todoTime}>{item.dataFinal}</Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id.toString()}
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
          onPress={() => navigation.navigate('AddTask', { idTarefa: idTarefaSelecionada})}
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
    flexDirection: 'row', // Coloca a imagem e o nome na horizontal
    alignItems: 'center', // Alinha a imagem e o nome verticalmente no centro
    flex: 1,
  },
  
  logoImage: {
    width: 40,  // Ajuste o tamanho da imagem
    height: 40,
    borderRadius: 20, // Torna a imagem redonda
    marginRight: 10,  // Espaço entre a imagem e o nome
  },
  
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white', // Altere a cor se necessário
  },
  
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center', // Centraliza o texto
    // flex: 1, // Faz o título ocupar o espaço restante e manter-se centralizado
    alignContent: 'flex-end',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 2,
    marginBottom: 10,
  },
  filterList: {
    marginLeft: 10,
  },
  searchInput: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    // marginTop: 10,
    fontSize: 16,
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
    backgroundColor: '#757f88', // Cor diferente para item selecionado
  },
  todoTextContainer: {
    marginLeft: 15,
  },
  todoText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  todoTime: {
    fontSize: 12,
    color: '#757575',
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
    marginTop: 0,
  },

  modalOptionContainer: {
    padding: 4,
    borderRadius: 5,
    marginVertical: 5,
  },
  modalOptionSelected: {
    backgroundColor: '#51c1f5', // Fundo azul para item selecionado
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fundo transparente com escurecimento
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
    marginBottom: 1,
  },
  modalOption: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
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
