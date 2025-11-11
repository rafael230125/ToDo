import React, { useState, useEffect, useLayoutEffect } from 'react';
import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  Text, 
  ScrollView,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
  Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/FontAwesome';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '../../hooks/useTheme';
import { useToast } from '../../context/ToastContext';
import { useHapticFeedback } from '../../hooks/useHapticFeedback';
import { AnimatedButton } from '../../components/common/AnimatedButton';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { getTaskById, createTask, updateTask } from '../../services/firebaseService';
import { NotificationConfig } from '../../components/tasks/NotificationConfig';
import {
  scheduleTaskNotification,
  cancelTaskNotifications,
  getTaskNotifications,
} from '../../services/notificationService';
import { createStyles } from './styles';

const AddTaskScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { idTarefa } = route.params || {};
  const { colors, shadows, semanticColors, isDarkTheme, spacing } = useTheme();
  const { showSuccess, showError, showWarning } = useToast();
  const { success, error } = useHapticFeedback();
  const styles = createStyles();
  
  const isTabNavigator = route.name === 'AddTaskTab';

  // Configurar header dinamicamente baseado no tema
  useLayoutEffect(() => {
    if (!isTabNavigator) {
      navigation.setOptions({
        title: 'Voltar',
        headerStyle: {
          backgroundColor: colors.surface,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          color: colors.text,
          fontWeight: '600',
        },
      });
    }
  }, [navigation, colors, isDarkTheme, isTabNavigator]);

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
  const [mostrarModalPrioridade, setMostrarModalPrioridade] = useState(false);
  const [mostrarModalStatus, setMostrarModalStatus] = useState(false);
  const [mostrarModalConfirmacao, setMostrarModalConfirmacao] = useState(false);
  const [acaoConfirmacao, setAcaoConfirmacao] = useState(null);
  const [notificationEnabled, setNotificationEnabled] = useState(false);
  const [notificationDate, setNotificationDate] = useState(null);
  const [repeatCount, setRepeatCount] = useState(0);
  const [repeatInterval, setRepeatInterval] = useState(0);
  const [scheduledNotificationIds, setScheduledNotificationIds] = useState([]);
  const [nomeFocused, setNomeFocused] = useState(false);
  const [descricaoFocused, setDescricaoFocused] = useState(false);

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
            setStatus(tarefa.status || 'Pendente');
            setTextoDataInicio(tarefa.dataInicial || dataInicio.toLocaleDateString('pt-BR'));
            setTextoDataFinal(tarefa.dataFinal || dataFinal.toLocaleDateString('pt-BR'));
            setModoEdicao(true);
            
            if (tarefa.notificationEnabled) {
              setNotificationEnabled(true);
              if (tarefa.notificationDate) {
                setNotificationDate(new Date(tarefa.notificationDate));
              }
              if (tarefa.repeatCount !== undefined) {
                setRepeatCount(tarefa.repeatCount);
              }
              if (tarefa.repeatInterval !== undefined) {
                setRepeatInterval(tarefa.repeatInterval);
              }
            
              const existingNotifications = await getTaskNotifications(idTarefa);
              if (existingNotifications.length > 0) {
                setScheduledNotificationIds(existingNotifications.map(n => n.identifier));
              }
            }
          }
        } catch (error) {
          showError('Não foi possível carregar a tarefa');
        } finally {
          setLoading(false);
        }
      }
    };

    loadTask();
  }, [idTarefa]);

  const aoSelecionarDataInicio = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setMostrarDataInicio(false);
    }
    const currentDate = selectedDate || dataInicio;
    setDataInicio(currentDate);
    setTextoDataInicio(currentDate.toLocaleDateString('pt-BR'));
  };

  const aoSelecionarDataFinal = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setMostrarDataFinal(false);
    }
    const currentDate = selectedDate || dataFinal;
    setDataFinal(currentDate);
    setTextoDataFinal(currentDate.toLocaleDateString('pt-BR'));
  };

  const mostrarSelecionadorDataInicio = () => setMostrarDataInicio(true);
  const mostrarSelecionadorDataFinal = () => setMostrarDataFinal(true);

  const addNova = async () => {
    if (!nomeTarefa.trim()) {
      showWarning('Nome da tarefa é obrigatório!');
      return;
    }

    try {
      setLoading(true);
      
      const finalNotificationEnabled = notificationEnabled && notificationDate ? true : false;
      
      const taskData = {
        nome: nomeTarefa,
        descricao: descricao,
        dataInicial: textoDataInicio,
        dataFinal: textoDataFinal,
        prioridade: prioridade,
        status: status,
        notificationEnabled: finalNotificationEnabled,
        notificationDate: notificationDate?.toISOString() || null,
        repeatCount: repeatCount,
        repeatInterval: repeatInterval,
      };

      const taskId = await createTask(taskData);
      
      if (finalNotificationEnabled && notificationDate) {
        const notificationIds = await scheduleTaskNotification({
          taskId,
          taskName: nomeTarefa,
          priority: prioridade,
          date: notificationDate,
          dataFinal: textoDataFinal,
          repeatCount,
          repeatInterval,
        });
        
        if (notificationIds) {
          setScheduledNotificationIds(notificationIds);
        }
      }
      
      success(); // Haptic feedback
      showSuccess('Tarefa salva com sucesso!');
      setTimeout(() => {
        navigation.goBack();
      }, 500);
    } catch (err) {
      error(); // Haptic feedback
      showError('Não foi possível salvar a tarefa');
    } finally {
      setLoading(false);
    }
  };

  const atualizarTarefa = async () => {
    if (!nomeTarefa.trim()) {
      showWarning('Nome da tarefa é obrigatório!');
      return;
    }

    try {
      setLoading(true);
    
      if (scheduledNotificationIds.length > 0) {
        await cancelTaskNotifications(scheduledNotificationIds);
      }
      
      const finalNotificationEnabled = notificationEnabled && notificationDate ? true : false;
      
      const taskData = {
        nome: nomeTarefa,
        descricao: descricao,
        dataInicial: textoDataInicio,
        dataFinal: textoDataFinal,
        prioridade: prioridade,
        status: status,
        notificationEnabled: finalNotificationEnabled,
        notificationDate: notificationDate?.toISOString() || null,
        repeatCount: repeatCount,
        repeatInterval: repeatInterval,
      };

      await updateTask(idTarefa, taskData);
    
      if (finalNotificationEnabled && notificationDate) {
        const notificationIds = await scheduleTaskNotification({
          taskId: idTarefa,
          taskName: nomeTarefa,
          priority: prioridade,
          date: notificationDate,
          dataFinal: textoDataFinal,
          repeatCount,
          repeatInterval,
        });
        
        if (notificationIds) {
          setScheduledNotificationIds(notificationIds);
        }
      }
      
      success(); // Haptic feedback
      showSuccess('Tarefa editada com sucesso!');
      setTimeout(() => {
        navigation.goBack();
      }, 500);
    } catch (err) {
      error(); // Haptic feedback
      showError('Não foi possível atualizar a tarefa');
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    const priorityMap = {
      'Baixa': semanticColors.priority.low,
      'Média': semanticColors.priority.medium,
      'Alta': semanticColors.priority.high,
    };
    return priorityMap[priority] || semanticColors.priority.none;
  };

  return (
    <SafeAreaView 
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={isTabNavigator ? ['top', 'bottom'] : ['bottom']}
    >
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={[
            styles.formContainer,
            isTabNavigator && { paddingTop: spacing.xl }
          ]}>
            <Text style={[styles.title, { color: colors.text }]}>
              {modoEdicao ? 'Editar Tarefa' : 'Nova Tarefa'}
            </Text>

            <View style={styles.inputWrapper}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>
                Nome da Tarefa *
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.surface,
                    borderColor: nomeFocused ? colors.primary : colors.border,
                    color: colors.text,
                    fontSize: 16,
                  },
                  nomeFocused && styles.inputFocused
                ]}
                placeholder="Digite o nome da tarefa"
                placeholderTextColor={colors.placeholder}
                value={nomeTarefa}
                onChangeText={setNomeTarefa}
                onFocus={() => setNomeFocused(true)}
                onBlur={() => setNomeFocused(false)}
              />
            </View>
            <View style={styles.inputWrapper}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>
                Descrição
              </Text>
              <TextInput
                style={[
                  styles.input,
                  styles.textArea,
                  {
                    backgroundColor: colors.surface,
                    borderColor: descricaoFocused ? colors.primary : colors.border,
                    color: colors.text,
                    fontSize: 16,
                  },
                  descricaoFocused && styles.inputFocused
                ]}
                placeholder="Breve descrição da tarefa (opcional)"
                placeholderTextColor={colors.placeholder}
                value={descricao}
                onChangeText={setDescricao}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                onFocus={() => setDescricaoFocused(true)}
                onBlur={() => setDescricaoFocused(false)}
              />
            </View>
            
            <View style={styles.inputWrapper}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>
                Prioridade
              </Text>
              <TouchableOpacity
                style={[
                  styles.pickerButton,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    ...shadows.input,
                  }
                ]}
                onPress={() => setMostrarModalPrioridade(true)}
                activeOpacity={0.7}
              >
                <Text style={[styles.pickerButtonText, { color: colors.text }]}>
                  {prioridade}
                </Text>
                <MaterialIcons name="arrow-drop-down" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
              <View style={[styles.priorityIndicator, { backgroundColor: `${getPriorityColor(prioridade)}20` }]}>
                <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(prioridade) }]} />
                <Text style={[styles.priorityText, { color: getPriorityColor(prioridade) }]}>
                  Prioridade {prioridade}
                </Text>
              </View>
            </View>
            
            <View style={styles.inputWrapper}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>
                Status
              </Text>
              <TouchableOpacity
                style={[
                  styles.pickerButton,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    ...shadows.input,
                  }
                ]}
                onPress={() => setMostrarModalStatus(true)}
                activeOpacity={0.7}
              >
                <Text style={[styles.pickerButtonText, { color: colors.text }]}>
                  {status}
                </Text>
                <MaterialIcons name="arrow-drop-down" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.inputWrapper}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>
                Data de Início
              </Text>
              <TouchableOpacity
                style={[
                  styles.dateContainer,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    ...shadows.input,
                  }
                ]}
                onPress={mostrarSelecionadorDataInicio}
                activeOpacity={0.7}
              >
                <Icon name="calendar" size={22} color={colors.primary} style={styles.dateIcon} />
                <Text style={[styles.dateText, { color: colors.text, fontSize: 16 }]}>
                  {textoDataInicio}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputWrapper}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>
                Data Final
              </Text>
              <TouchableOpacity
                style={[
                  styles.dateContainer,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    ...shadows.input,
                  }
                ]}
                onPress={mostrarSelecionadorDataFinal}
                activeOpacity={0.7}
              >
                <Icon name="calendar" size={22} color={colors.primary} style={styles.dateIcon} />
                <Text style={[styles.dateText, { color: colors.text, fontSize: 16 }]}>
                  {textoDataFinal}
                </Text>
              </TouchableOpacity>
            </View>

            {mostrarDataInicio && (
              <DateTimePicker
                value={dataInicio}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={aoSelecionarDataInicio}
              />
            )}
            {mostrarDataFinal && (
              <DateTimePicker
                value={dataFinal}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={aoSelecionarDataFinal}
              />
            )}

            <Modal
              visible={mostrarModalPrioridade}
              transparent={true}
              animationType="slide"
              onRequestClose={() => setMostrarModalPrioridade(false)}
            >
              <View style={styles.modalOverlay}>
                <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
                  <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
                    <Text style={[styles.modalTitle, { color: colors.text }]}>
                      Selecionar Prioridade
                    </Text>
                    <TouchableOpacity
                      onPress={() => setMostrarModalPrioridade(false)}
                      style={styles.modalCloseButton}
                    >
                      <MaterialIcons name="close" size={24} color={colors.textSecondary} />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.modalOptions}>
                    {['Baixa', 'Média', 'Alta'].map((opcao) => (
                      <TouchableOpacity
                        key={opcao}
                        style={[
                          styles.modalOption,
                          {
                            backgroundColor: prioridade === opcao ? `${getPriorityColor(opcao)}20` : 'transparent',
                            borderBottomColor: colors.border,
                          }
                        ]}
                        onPress={() => {
                          setPrioridade(opcao);
                          setMostrarModalPrioridade(false);
                        }}
                        activeOpacity={0.7}
                      >
                        <View style={styles.modalOptionContent}>
                          <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(opcao) }]} />
                          <Text style={[styles.modalOptionText, { color: colors.text }]}>
                            {opcao}
                          </Text>
                        </View>
                        {prioridade === opcao && (
                          <MaterialIcons name="check" size={24} color={getPriorityColor(opcao)} />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            </Modal>

            <Modal
              visible={mostrarModalStatus}
              transparent={true}
              animationType="slide"
              onRequestClose={() => setMostrarModalStatus(false)}
            >
              <View style={styles.modalOverlay}>
                <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
                  <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
                    <Text style={[styles.modalTitle, { color: colors.text }]}>
                      Selecionar Status
                    </Text>
                    <TouchableOpacity
                      onPress={() => setMostrarModalStatus(false)}
                      style={styles.modalCloseButton}
                    >
                      <MaterialIcons name="close" size={24} color={colors.textSecondary} />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.modalOptions}>
                    {['Pendente', 'Concluída'].map((opcao) => (
                      <TouchableOpacity
                        key={opcao}
                        style={[
                          styles.modalOption,
                          {
                            backgroundColor: status === opcao ? `${colors.primary}20` : 'transparent',
                            borderBottomColor: colors.border,
                          }
                        ]}
                        onPress={() => {
                          setStatus(opcao);
                          setMostrarModalStatus(false);
                        }}
                        activeOpacity={0.7}
                      >
                        <Text style={[styles.modalOptionText, { color: colors.text }]}>
                          {opcao}
                        </Text>
                        {status === opcao && (
                          <MaterialIcons name="check" size={24} color={colors.primary} />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            </Modal>
            
            <NotificationConfig
              enabled={notificationEnabled}
              onEnabledChange={setNotificationEnabled}
              notificationDate={notificationDate}
              onNotificationDateChange={setNotificationDate}
              repeatCount={repeatCount}
              onRepeatCountChange={setRepeatCount}
              repeatInterval={repeatInterval}
              onRepeatIntervalChange={setRepeatInterval}
            />

            <AnimatedButton
              style={[
                styles.saveButton,
                {
                  backgroundColor: colors.primary,
                  ...shadows.button,
                },
                loading && styles.buttonDisabled
              ]}
              onPress={modoEdicao ? atualizarTarefa : addNova}
              disabled={loading}
              haptic={true}
              hapticType="medium"
            >
              {loading ? (
                <ActivityIndicator color={colors.textInverse} />
              ) : (
                <>
                  <MaterialIcons 
                    name={modoEdicao ? "check" : "add"} 
                    size={24} 
                    color={colors.textInverse} 
                    style={styles.buttonIcon}
                  />
                  <Text style={[
                    styles.saveButtonText,
                    { color: colors.textInverse }
                  ]}>
                    {modoEdicao ? 'Salvar Alterações' : 'Criar Tarefa'}
                  </Text>
                </>
              )}
            </AnimatedButton>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AddTaskScreen;

