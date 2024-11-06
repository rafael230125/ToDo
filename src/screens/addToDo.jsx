import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Platform, Text, Button } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Picker } from '@react-native-picker/picker';
import { db } from '../services/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { MaterialIcons,FontAwesome } from '@expo/vector-icons'; 
import * as SQLite from 'expo-sqlite';
import { ToastAndroid } from 'react-native';

const TelaAdicionarTarefa = () => {
  const [dataInicio, setDataInicio] = useState(new Date());
  const [dataFinal, setDataFinal] = useState(new Date());
  const [mostrarDataInicio, setMostrarDataInicio] = useState(false);
  const [mostrarDataFinal, setMostrarDataFinal] = useState(false);
  const [textoDataInicio, setTextoDataInicio] = useState(dataInicio.toLocaleDateString('pt-BR'));
  const [textoDataFinal, setTextoDataFinal] = useState(dataFinal.toLocaleDateString('pt-BR'));
  const [prioridade, setPrioridade] = useState("Baixa");
  const [nomeTarefa, setNomeTarefa] = useState('');
  const [descricao, setDescricao] = useState('');
  const navegacao = useNavigation();

  const aoSelecionarDataInicio = (event, selectedDate) => {
    const currentDate = selectedDate || dataInicio;
    setMostrarDataInicio(false);
    setDataInicio(currentDate);
    setTextoDataInicio(currentDate.toLocaleDateString('pt-BR'));
  };

  const aoSelecionarDataFinal = (event, selectedDate) => {
    const currentDate = selectedDate || dataFinal;
    setMostrarDataFinal(false);
    setDataFinal(currentDate);
    setTextoDataFinal(currentDate.toLocaleDateString('pt-BR'));
  };

  const mostrarSelecionadorDataInicio = () => setMostrarDataInicio(true);
  const mostrarSelecionadorDataFinal = () => setMostrarDataFinal(true);

  const salvarTarefa = async () => {
    if (nomeTarefa.trim()) {
      try {
        await addDoc(collection(db, 'tarefas'), {
          nome: nomeTarefa,
          descricao: descricao,
          prioridade: prioridade,
          dataInicio: dataInicio,
          dataFinal: dataFinal,
        });
        ToastAndroid.show('Tarefa salva com sucesso!', ToastAndroid.SHORT);
        // console.log('Tarefa salva com sucesso!');
        navegacao.goBack();
      } catch (error) {
        console.error('Erro ao salvar a tarefa: ', error);
      }
    } else {
      alert('Por favor, insira um nome para a tarefa.');
    }
  };

  const addNova = async () => {
    const db = await SQLite.openDatabaseAsync('todo');
    try {
      await db.runAsync('INSERT INTO tarefas (nome, descricao, dataInical, dataFinal, prioridade) VALUES (?, ?, ?, ?, ?)', 
        nomeTarefa, descricao, textoDataInicio, textoDataFinal, prioridade);

      ToastAndroid.show('Tarefa salva com sucesso!', ToastAndroid.SHORT);
      navegacao.goBack();
    } catch (error) {
      ToastAndroid.show('Erro:',error, ToastAndroid.SHORT);
      
    };

    
  };

  return (
    <View style={estilos.container}>
      <Text style={estilos.label}>Nome</Text>
      <TextInput
        style={estilos.input}
        placeholder="Nome da tarefa"
        value={nomeTarefa}
        onChangeText={setNomeTarefa}
      />

      <Text style={estilos.label}>Descrição</Text>
      <TextInput
        style={estilos.input}
        placeholder="Breve descrição"
        value={descricao}
        onChangeText={setDescricao}
      />

      <Text style={estilos.label}>Prioridade</Text>
      <Picker
        selectedValue={prioridade}
        onValueChange={(valor) => setPrioridade(valor)}
        style={estilos.picker}
      >
        <Picker.Item label="Baixa" value="Baixa" />
        <Picker.Item label="Média" value="Média" />
        <Picker.Item label="Alta" value="Alta" />
      </Picker>

      <Text style={estilos.label}>Data de Início</Text>
      <View style={estilos.containerData}>
        <TouchableOpacity onPress={mostrarSelecionadorDataInicio}>
          <Icon name="calendar" size={24} color="#049faa" style={estilos.icone} />
        </TouchableOpacity>
        <TextInput style={estilos.input} value={textoDataInicio} editable={false} />
      </View>

      <Text style={estilos.label}>Data Final</Text>
      <View style={estilos.containerData}>
        <TouchableOpacity onPress={mostrarSelecionadorDataFinal}>
          <Icon name="calendar" size={24} color="#049faa" style={estilos.icone} />
        </TouchableOpacity>
        <TextInput style={estilos.input} value={textoDataFinal} editable={false} />
      </View>

      {mostrarDataInicio && (
        <DateTimePicker
          value={dataInicio}
          mode="date"
          display="default"
          onChange={aoSelecionarDataInicio}
        />
      )}
      {mostrarDataFinal && (
        <DateTimePicker
          value={dataFinal}
          mode="date"
          display="default"
          onChange={aoSelecionarDataFinal}
        />
      )}

      {/* <Button title="Salvar" onPress={addNova} /> */}
      <View style={estilos.bottomNav}>
        <TouchableOpacity 
          style={[estilos.navButton, estilos.navButtonCenter]} 
        >
          <MaterialIcons name="add" size={28} onPress={addNova} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fdfdfd',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 10,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 15,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#fff',
    marginBottom: 15,
  },
  containerData: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    width: 330,
    height: 60
  },
  icone: {
    marginRight: 10,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 4,
    borderRadius: 30,
    backgroundColor: '#51c1f5',
    marginHorizontal: 20,
    marginBottom: 20,
    marginTop: 20
  },
  navButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 10,
    height: 10,
    backgroundColor: '#51c1f5',
    borderRadius: 25,
  },
  navButtonCenter: {
    backgroundColor: '#FFC107',
    width: 70,
    height: 70,
    borderRadius: 35,
    marginTop: 0,
  },
});

export default TelaAdicionarTarefa;
