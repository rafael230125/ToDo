import React, { useState, useEffect, useContext } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { MaterialIcons } from '@expo/vector-icons';
import { ToastAndroid } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import DateTimePicker from '@react-native-community/datetimepicker';
import { FontContext } from '../context/FontContext';
import { ThemeContext } from '../context/ThemeContext';
import { getTaskById, createTask, updateTask } from '../services/firebaseService';

const AddTaskScreen = () => {
  const navegacao = useNavigation();
  const route = useRoute();
  const { idTarefa } = route.params || {};

  const [dataInicio, setDataInicio] = useState(new Date());
  const [dataFinal, setDataFinal] = useState(new Date());
  const [prioridade, setPrioridade] = useState("Baixa");
  const [status, setStatus] = useState("Pendente");
  const [nomeTarefa, setNomeTarefa] = useState('');
  const [descricao, setDescricao] = useState('');
  const [modoEdicao, setModoEdicao] = useState(false);
  const [mostrarDataInicio, setMostrarDataInicio] = useState(false);
  const [mostrarDataFinal, setMostrarDataFinal] = useState(false);
  const [textoDataInicio, setTextoDataInicio] = useState(dataInicio.toLocaleDateString('pt-BR'));
  const [textoDataFinal, setTextoDataFinal] = useState(dataFinal.toLocaleDateString('pt-BR'));
  const [loading, setLoading] = useState(false);

  const { fontSize } = useContext(FontContext); 
  const { isDarkTheme } = useContext(ThemeContext); 

  useEffect(() => {
    const loadTask = async () => {
      if (idTarefa) {
        try {
          setLoading(true);
          const tarefa = await getTaskById(idTarefa);
          
          if (tarefa) {
            setNomeTarefa(tarefa.nome || '');
            setDescricao(tarefa.descricao || '');
            setPrioridade(tarefa.prioridade || 'Baixa');
            setTextoDataInicio(tarefa.dataInicial || dataInicio.toLocaleDateString('pt-BR'));
            setTextoDataFinal(tarefa.dataFinal || dataFinal.toLocaleDateString('pt-BR'));
            setModoEdicao(true);
          }
        } catch (error) {
          console.error('Erro ao carregar tarefa:', error);
          ToastAndroid.show('Erro ao carregar tarefa', ToastAndroid.SHORT);
        } finally {
          setLoading(false);
        }
      }
    };

    loadTask();
  }, [idTarefa]);

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
    if (!nomeTarefa.trim()) {
      ToastAndroid.show('Nome da tarefa é obrigatório!', ToastAndroid.SHORT);
      return;
    }

    try {
      setLoading(true);
      
      const taskData = {
        nome: nomeTarefa,
        descricao: descricao,
        dataInicial: textoDataInicio,
        dataFinal: textoDataFinal,
        prioridade: prioridade,
        status: status,
      };

      await createTask(taskData);
      ToastAndroid.show('Tarefa salva com sucesso!', ToastAndroid.SHORT);
      navegacao.goBack();
    } catch (error) {
      console.error('Erro ao salvar tarefa:', error);
      ToastAndroid.show('Erro ao salvar tarefa', ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
  };

  const atualizarTarefa = async () => {
    if (!nomeTarefa.trim()) {
      ToastAndroid.show('Nome da tarefa é obrigatório!', ToastAndroid.SHORT);
      return;
    }

    try {
      setLoading(true);
      
      const taskData = {
        nome: nomeTarefa,
        descricao: descricao,
        dataInicial: textoDataInicio,
        dataFinal: textoDataFinal,
        prioridade: prioridade,
        status: status,
      };

      await updateTask(idTarefa, taskData);
      ToastAndroid.show('Tarefa editada com sucesso!', ToastAndroid.SHORT);
      navegacao.goBack();
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
      ToastAndroid.show('Erro ao atualizar tarefa', ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={estilos.scrollContainer}>
      <View style={[estilos.container, { backgroundColor: isDarkTheme ? '#333' : '#fdfdfd' }]}>
        <Text style={[estilos.label, { fontSize, color: isDarkTheme ? '#fff' : '#333' }]}>Nome</Text>
        <TextInput
          style={[estilos.input, { fontSize, color: isDarkTheme ? '#fff' : '#000' }]}
          placeholder="Nome da tarefa"
          value={nomeTarefa}
          onChangeText={setNomeTarefa}
        />

        <Text style={[estilos.label, { fontSize, color: isDarkTheme ? '#fff' : '#333' }]}>Descrição</Text>
        <TextInput
          style={[estilos.input, { fontSize, color: isDarkTheme ? '#fff' : '#000' }]}
          placeholder="Breve descrição"
          value={descricao}
          onChangeText={setDescricao}
        />

        <Text style={[estilos.label, { fontSize, color: isDarkTheme ? '#fff' : '#333' }]}>Prioridade</Text>
        <Picker
          selectedValue={prioridade}
          onValueChange={(valor) => setPrioridade(valor)}
          style={[estilos.picker, { fontSize }]}
        >
          <Picker.Item label="Baixa" value="Baixa" />
          <Picker.Item label="Média" value="Média" />
          <Picker.Item label="Alta" value="Alta" />
        </Picker>

        <Text style={[estilos.label, { fontSize, color: isDarkTheme ? '#fff' : '#333' }]}>Status</Text>
        <Picker
          selectedValue={status}
          onValueChange={(valor) => setStatus(valor)}
          style={[estilos.picker, { fontSize }]}
        >
          <Picker.Item label="Pendente" value="Pendente" />
          <Picker.Item label="Concluída" value="Concluída" />
        </Picker>

        <Text style={[estilos.label, { fontSize, color: isDarkTheme ? '#fff' : '#333' }]}>Data de Início</Text>
        <View style={estilos.containerData}>
          <TouchableOpacity onPress={mostrarSelecionadorDataInicio}>
            <Icon name="calendar" size={24} color="#049faa" style={estilos.icone} />
          </TouchableOpacity>
          <TextInput style={[estilos.input, { fontSize }]} value={textoDataInicio} editable={false} />
        </View>

        <Text style={[estilos.label, { fontSize, color: isDarkTheme ? '#fff' : '#333' }]}>Data Final</Text>
        <View style={estilos.containerData}>
          <TouchableOpacity onPress={mostrarSelecionadorDataFinal}>
            <Icon name="calendar" size={24} color="#049faa" style={estilos.icone} />
          </TouchableOpacity>
          <TextInput style={[estilos.input, { fontSize }]} value={textoDataFinal} editable={false} />
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

        <View style={estilos.bottomNav}>
          <TouchableOpacity
            style={[estilos.navButton, estilos.navButtonCenter, loading && estilos.buttonDisabled]}
            onPress={modoEdicao ? atualizarTarefa : addNova}
            disabled={loading}
          >
            <MaterialIcons name={modoEdicao ? "edit" : "add"} size={28} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const estilos = StyleSheet.create({
  scrollContainer: { flexGrow: 1 },
  container: { flex: 1, padding: 20 },
  label: { marginBottom: 5 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 10, borderRadius: 5, marginBottom: 15 },
  picker: { borderWidth: 1, borderColor: '#ddd', borderRadius: 5, backgroundColor: '#fff', marginBottom: 15 },
  containerData: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  icone: { marginRight: 10 },
  bottomNav: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  navButton: { justifyContent: 'center', alignItems: 'center', backgroundColor: '#51c1f5', borderRadius: 25 },
  navButtonCenter: { backgroundColor: '#FFC107', width: 70, height: 70, borderRadius: 35 },
  buttonDisabled: { opacity: 0.5 },
});

export default AddTaskScreen;
