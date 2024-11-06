import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons,FontAwesome } from '@expo/vector-icons'; 
import { useNavigation } from '@react-navigation/native';
import * as SQLite from 'expo-sqlite';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [tarefas, setTarefas] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState(null); // Novo estado para armazenar a tarefa selecionada

  useEffect(() => {
    async function buscarTarefas() {
      const db = await SQLite.openDatabaseAsync('todo');  
      // await db.execAsync(`
      //   PRAGMA journal_mode = WAL;
      //   CREATE TABLE IF NOT EXISTS tarefas (id INTEGER PRIMARY KEY NOT NULL, nome TEXT, descricao TEXT,dataInical DATE,dataFinal DATE,prioridade TEXT);
      //   INSERT INTO tarefas (nome, descricao,dataInical,dataFinal,prioridade) VALUES ('test1', '123','05/11/2024','05/11/2024','Baixa');
      //   `);

      const allRows = await db.getAllAsync('SELECT * FROM tarefas');
      setTarefas(allRows); 
    }

    buscarTarefas();
  }, []);

  // Função para selecionar/deselecionar tarefa
  const selecionarTarefa = (id) => {
    setSelectedTaskId(id === selectedTaskId ? null : id);
  };

  async function atualizarLista() {
    const db = await SQLite.openDatabaseAsync('todo');  
       const allRows = await db.getAllAsync('SELECT * FROM tarefas');
    setTarefas(allRows); 
  }

  const dropaTabela = async () => {
    const db = await SQLite.openDatabaseAsync('todo');
    await db.runAsync('DROP TABLE tarefas');
  };

  // Função para excluir a tarefa selecionada
  const excluirTarefa = async () => {
    if (selectedTaskId !== null) {
      const db = await SQLite.openDatabaseAsync('todo');
      await db.execAsync(`DELETE FROM tarefas WHERE id = ?`, [selectedTaskId]);

      // Atualize a lista de tarefas
      setTarefas(tarefas.filter(task => task.id !== selectedTaskId));
      setSelectedTaskId(null);
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>TO-DO</Text>
      </View>
      
      <FlatList
        data={tarefas}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={[
              styles.todoItem, 
              item.id === selectedTaskId && styles.selectedItem
            ]}
            onPress={() => selecionarTarefa(item.id)}
          >
            {obterIconePrioridade(item.prioridade)}
            <View style={styles.todoTextContainer}>
              <Text style={styles.todoText}>{item.nome}</Text>
              <Text style={styles.todoDesc}>{item.descricao}</Text>
              <Text style={styles.todoTime}>{item.dataFinal}</Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.todoList}
      />

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton}>
          <MaterialIcons name="home" size={24} onPress={atualizarLista} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={excluirTarefa}>
          <MaterialIcons name="delete" size={24} onPress={excluirTarefa}  color="white" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.navButton, styles.navButtonCenter]} 
          onPress={() => navigation.navigate('AddTask')}
        >
          <MaterialIcons name="add" size={28} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <MaterialIcons name="edit" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <MaterialIcons name="settings" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    padding: 20,
    backgroundColor: '#51c1f5',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    paddingVertical: 20,
    width: '100%',
    backgroundColor: '#51c1f5',
    borderRadius: 101,
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
    marginTop: 10
  },
  navButtonCenter: {
    backgroundColor: '#FFC107',
    width: 70,
    height: 70,
    borderRadius: 35,
    marginTop: 0,
  },
});

export default HomeScreen;
