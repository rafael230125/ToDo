import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import openDB from "../database/db" ;


const TelaPrincipal = () => {
  const db  =  openDB();
  const navigation = useNavigation();
  const [tarefas, setTarefas] = useState([]);
  const [idTarefaSelecionada, setIdTarefaSelecionada] = useState(null); // Estado para armazenar a tarefa selecionada

  useFocusEffect(
    React.useCallback(() => {
      async function buscarTarefas() {
        const todasAsLinhas = await db.getAllAsync('SELECT * FROM tarefas');
        setTarefas(todasAsLinhas);
      }
  
      buscarTarefas();
    }, [])
  );


  // Função para selecionar/deselecionar tarefa
  const selecionarTarefa = (id) => {
    setIdTarefaSelecionada(id === idTarefaSelecionada ? null : id);
  };

  async function atualizarLista() {
    const todasAsLinhas = await db.getAllAsync('SELECT * FROM tarefas');
    setTarefas(todasAsLinhas);
  }

  const excluirTabela = async () => {
    await db.runAsync('DROP TABLE tarefas');
  };

  const BuscarTarefa = async () => {
    const statement = await db.prepareAsync('SELECT * FROM tarefas WHERE id = ?');
    const result = await statement.executeAsync([idTarefaSelecionada]);
    const firstRow = await result.getFirstAsync(); 
    console.log(firstRow);
  };

  // Função para excluir a tarefa selecionada
  const excluirTarefa = async () => {
    if (idTarefaSelecionada !== null) {
      await db.execAsync(`DELETE FROM tarefas WHERE id = ?`, [idTarefaSelecionada]);

      setTarefas(tarefas.filter(tarefa => tarefa.id !== idTarefaSelecionada));
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

  return (
    <View style={estilos.container}>
      <View style={estilos.header}>
        <Text style={estilos.headerTitle}>TO-DO</Text>
      </View>

      <FlatList
        data={tarefas}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              estilos.todoItem,
              item.id === idTarefaSelecionada && estilos.selectedItem,
            ]}
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
          onPress={() => navigation.navigate('AddTask', { id: idTarefaSelecionada, todo: tarefas[idTarefaSelecionada-1] })}
          disabled={!idTarefaSelecionada}
        >
          <MaterialIcons name="edit" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={estilos.navButton}>
          <MaterialIcons name="settings" onPress={BuscarTarefa} size={24} color="white" />
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
    marginTop: 10,
  },
  navButtonCenter: {
    backgroundColor: '#FFC107',
    width: 70,
    height: 70,
    borderRadius: 35,
    marginTop: 0,
  },
});

export default TelaPrincipal;
