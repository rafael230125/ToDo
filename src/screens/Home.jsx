import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, TextInput, Modal } from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BackHandler } from 'react-native';
import openDB from "../database/db";
import { FontContext } from '../context/FontContext'; // Contexto para tamanho da fonte
import { ThemeContext } from '../context/ThemeContext'; // Contexto para alternar tema

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

      <FlatList
        data={tarefasFiltradas}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              estilos.todoItem,
              item.id === idTarefaSelecionada && estilos.selectedItem,
              { backgroundColor: isDarkTheme ? '#555' : '#f8f8f8' },
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
  container: { flex: 1, padding: 20 },
  header: { padding: 10, backgroundColor: '#51c1f5', alignItems: 'center' },
  profileContainer: { flexDirection: 'row', alignItems: 'center' },
  logoImage: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  profileName: { fontWeight: 'bold', color: 'white' },
  headerTitle: { fontWeight: 'bold', color: 'white', marginTop: 10 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  searchInput: { flex: 1, padding: 12, borderWidth: 1, borderColor: '#ccc', borderRadius: 5 },
  todoList: { paddingHorizontal: 10 },
  todoItem: { flexDirection: 'row', alignItems: 'center', padding: 10, marginVertical: 5, borderRadius: 8 },
  selectedItem: { borderWidth: 1, borderColor: '#000' },
  bottomNav: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10, backgroundColor: '#51c1f5' },
  navButton: { justifyContent: 'center', alignItems: 'center', width: 50, height: 50 },
  navButtonCenter: { backgroundColor: '#FFC107', width: 70, height: 70, borderRadius: 35 },
});

export default TelaPrincipal;
