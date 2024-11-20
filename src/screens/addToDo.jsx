import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet,Alert, 
        TouchableOpacity, Text}       from 'react-native';
import { useNavigation,useRoute  }    from '@react-navigation/native';
import { Picker }                     from '@react-native-picker/picker';
import { MaterialIcons }              from '@expo/vector-icons'; 
import { ToastAndroid }               from 'react-native';
import Icon                           from 'react-native-vector-icons/FontAwesome';
import openDB                         from "../database/db" ;
import AsyncStorage                   from '@react-native-async-storage/async-storage';
import DateTimePicker                 from '@react-native-community/datetimepicker';

const AddTaskScreen = () => {
  const db            =  openDB();
  const navegacao     = useNavigation();
  const route         = useRoute();
  const { idTarefa }  = route.params || {};

  const [dataInicio,              setDataInicio]  = useState(new Date());
  const [dataFinal,               setDataFinal]   = useState(new Date());
  const [prioridade,              setPrioridade]  = useState("Baixa");
  const [status,                  setStatus]      = useState("Pendente");
  const [nomeTarefa,              setNomeTarefa]  = useState('');
  const [descricao,               setDescricao]   = useState('');
  const [modoEdicao,              setModoEdicao]  = useState(false);
  const [mostrarDataInicio,       setMostrarDataInicio] = useState(false);
  const [mostrarDataFinal,        setMostrarDataFinal]  = useState(false);
  const [textoDataInicio,         setTextoDataInicio]   = useState(dataInicio.toLocaleDateString('pt-BR'));
  const [textoDataFinal,          setTextoDataFinal]    = useState(dataFinal.toLocaleDateString('pt-BR'));
  const [idUser,                  setidUser]            = useState('');


  useEffect(() => {
    const fetchIdUser = async () => {
      const idUsuario = await AsyncStorage.getItem('idUser'); 
      setidUser(idUsuario); 
    };
  
    fetchIdUser();
  }, []);
  
  useEffect(() => {
    const editTarefa = async () => {
      if (idTarefa && idUser) { 
        const tarefaEdit = await db.getAllAsync('SELECT * FROM tarefas WHERE id = ? AND idUser = ?', [idTarefa, idUser]);
  
        if (tarefaEdit) {
          setNomeTarefa(tarefaEdit[0].nome);
          setDescricao(tarefaEdit[0].descricao);
          setPrioridade(tarefaEdit[0].prioridade);
          setTextoDataInicio(tarefaEdit[0].dataInicial);
          setTextoDataFinal((tarefaEdit[0].dataFinal));
          setModoEdicao(true);
        };
      }
    };
  
    editTarefa();
  }, [idTarefa, idUser]); 


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

  const addNova = async () => {
    const idUser = await AsyncStorage.getItem('idUser'); 
    const statement = await db.prepareAsync(
      `INSERT INTO tarefas (nome, descricao, dataInicial, dataFinal, prioridade,status,idUser) 
       VALUES ($nome,$descricao,$dataInicial,$dataFinal,$prioridade,$status ,$idUsuario)`
    );
    
    try {
      let result = await statement.executeAsync({$nome:nomeTarefa ,$descricao: descricao,$dataInicial: textoDataInicio,
                                                $dataFinal:textoDataFinal,$prioridade: prioridade,$status: status ,$idUsuario: idUser});

      ToastAndroid.show('Tarefa salva com sucesso!', ToastAndroid.SHORT);
      navegacao.goBack();
    }catch (error) {
        ToastAndroid.show('Erro:',error, ToastAndroid.SHORT);
        
    }finally {
      await statement.finalizeAsync();  
    }
  };

  const atualizarTarefa = async () => {
     try {
      await db.runAsync("UPDATE tarefas SET nome = ?, descricao = ?, dataInicial = ?, dataFinal = ?, prioridade = ?, status = ? WHERE id = ? AND idUser = ?",
        [nomeTarefa, descricao, textoDataInicio, textoDataFinal, prioridade, status, idTarefa, idUser]); 

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

      <Text style={estilos.label}>Status</Text>
      <Picker
        selectedValue={status}
        onValueChange={(valor) => setStatus(valor)}
        style={estilos.picker}
      >
        <Picker.Item label="Pendente" value="Pendente" />
        <Picker.Item label="Concluida" value="Concluida" />
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
    marginBottom: 8,
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
    marginBottom: 25,
    // marginTop: 20
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