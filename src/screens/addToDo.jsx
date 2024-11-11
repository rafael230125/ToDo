import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Platform, Text, Button, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation,useRoute  } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Picker } from '@react-native-picker/picker';
import { collection, addDoc } from 'firebase/firestore';
import { MaterialIcons,FontAwesome } from '@expo/vector-icons'; 
import { ToastAndroid } from 'react-native';
import openDB from "../database/db" ;

const AddTaskScreen = () => {
  const db  =  openDB();
  const [dataInicio, setDataInicio] = useState(new Date());
  const [dataFinal, setDataFinal] = useState(new Date());
  const [mostrarDataInicio, setMostrarDataInicio] = useState(false);
  const [mostrarDataFinal, setMostrarDataFinal] = useState(false);
  const [textoDataInicio, setTextoDataInicio] = useState(dataInicio.toLocaleDateString('pt-BR'));
  const [textoDataFinal, setTextoDataFinal] = useState(dataFinal.toLocaleDateString('pt-BR'));
  const [prioridade, setPrioridade] = useState("Baixa");
  const [nomeTarefa, setNomeTarefa] = useState('');
  const [descricao, setDescricao] = useState('');
  const [modoEdicao, setModoEdicao] = useState(false);
  const navegacao = useNavigation();
  const route = useRoute();
  const { id } = route.params || {}; 
  const { todo } = route.params || {};
  
  useEffect(() => {
    if (todo) {
      carregarTarefa();
    }
  }, [todo]);

  const carregarTarefa = async () => {
    if (todo) {
      setNomeTarefa(todo.nome);
      setDescricao(todo.descricao);
      setPrioridade(todo.prioridade);
      setTextoDataInicio(todo.dataInicial);
      setTextoDataFinal((todo.dataFinal));
      setModoEdicao(true);
    }
};


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

  // const salvarTarefa = async () => {
  //   if (nomeTarefa.trim()) {
  //     try {
  //       await addDoc(collection(db, 'tarefas'), {
  //         nome: nomeTarefa,
  //         descricao: descricao,
  //         prioridade: prioridade,
  //         dataInicio: dataInicio,
  //         dataFinal: dataFinal,
  //       });
  //       ToastAndroid.show('Tarefa salva com sucesso!', ToastAndroid.SHORT);
  //       // console.log('Tarefa salva com sucesso!');
  //       navegacao.goBack();
  //     } catch (error) {
  //       console.error('Erro ao salvar a tarefa: ', error);
  //     }
  //   } else {
  //     alert('Por favor, insira um nome para a tarefa.');
  //   }
  // };


  const BuscarTarefa = async () => {
    const statement = await db.prepareAsync('SELECT * FROM tarefas WHERE id = ?');
    const result = await statement.executeAsync([todo.id]);
    const firstRow = await result.getFirstAsync(); 
    console.log(firstRow);
  };


  const addNova = async () => {
    const statement = await db.prepareAsync(
      'INSERT INTO tarefas (nome, descricao, dataInicial, dataFinal, prioridade) VALUES ($nome,$descricao,$dataInicial,$dataFinal,$prioridade)'
    );
    
    try {
      let result = await statement.executeAsync({$nome:nomeTarefa ,$descricao: descricao,$dataInicial: textoDataInicio,$dataFinal: textoDataFinal,$prioridade: prioridade});

      ToastAndroid.show('Tarefa salva com sucesso!', ToastAndroid.SHORT);
      navegacao.goBack();
    }finally {
      await statement.finalizeAsync();
    // }catch (error) {
    //   ToastAndroid.show('Erro:',error, ToastAndroid.SHORT);
      
    }
  };

  const atualizarTarefa = async () => {
     try {
      await db.runAsync("UPDATE tarefas SET nome = ?, descricao = ?, dataInicial = ?, dataFinal = ?, prioridade = ? WHERE id = ?",
        [nomeTarefa, descricao, textoDataInicio, textoDataFinal, prioridade, todo.id]); 

      ToastAndroid.show('Tarefa editada com sucesso!', ToastAndroid.SHORT);
      navegacao.goBack();
    } catch (error) {
      console.log('Erro:', error);
      ToastAndroid.show(`Erro: ${error}`, ToastAndroid.SHORT);
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

      {/* <Button title="Salvar" onPress={addNova} /> */}
      <View style={estilos.bottomNav}>
        <TouchableOpacity 
          style={[estilos.navButton, estilos.navButtonCenter]} 
          onPress={modoEdicao ? atualizarTarefa : addNova} 
        >
          <MaterialIcons name={modoEdicao ? "edit" : "add"} size={28} color="white" />
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

export default AddTaskScreen;