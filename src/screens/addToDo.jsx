import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Platform, Text, Button } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Picker } from '@react-native-picker/picker';
import { db } from '../services/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

const TelaAdicionarTarefa = () => {
  const [dataInicio, setDataInicio] = useState(new Date());
  const [dataFinal, setDataFinal] = useState(new Date());
  const [mostrarDataInicio, setMostrarDataInicio] = useState(false);
  const [mostrarDataFinal, setMostrarDataFinal] = useState(false);
  const [textoDataInicio, setTextoDataInicio] = useState('');
  const [textoDataFinal, setTextoDataFinal] = useState('');
  const [prioridade, setPrioridade] = useState("Baixa");
  const [nomeTarefa, setNomeTarefa] = useState('');
  const [descricao, setDescricao] = useState('');
  const navegacao = useNavigation();

  const aoSelecionarDataInicio = (event, selectedDate) => {
    const currentDate = selectedDate || dataInicio;
    setMostrarDataInicio(Platform.OS === 'ios');
    setDataInicio(currentDate);
    setTextoDataInicio(currentDate.toLocaleDateString());
  };

  const aoSelecionarDataFinal = (event, selectedDate) => {
    const currentDate = selectedDate || dataFinal;
    setMostrarDataFinal(Platform.OS === 'ios');
    setDataFinal(currentDate);
    setTextoDataFinal(currentDate.toLocaleDateString());
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
        console.log('Tarefa salva com sucesso!');
        navegacao.goBack();
      } catch (error) {
        console.error('Erro ao salvar a tarefa: ', error);
      }
    } else {
      alert('Por favor, insira um nome para a tarefa.');
    }
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

      <Button title="Salvar" onPress={salvarTarefa} />
    </View>
  );
};

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
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
    borderRadius: 5,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 15,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    backgroundColor: '#fff',
    marginBottom: 15,
  },
  containerData: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  icone: {
    marginRight: 10,
  },
});

export default TelaAdicionarTarefa;
