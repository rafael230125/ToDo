/**
 * Serviço de Notificações
 * Gerencia agendamento e cancelamento de notificações
 */

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { getUserConfig } from './configService';

// Configurar comportamento das notificações quando o app está em foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Solicita permissão para enviar notificações
 */
export async function requestNotificationPermission() {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      return false;
    }

    // Configurar canal de notificação para Android
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Tarefas',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
        sound: 'default',
      });
    }

    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Verifica se o usuário permitiu notificações
 */
export async function checkNotificationPermission() {
  try {
    const { status } = await Notifications.getPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    return false;
  }
}

/**
 * Verifica se as notificações estão habilitadas nas configurações do usuário
 */
export async function areNotificationsEnabled() {
  try {
    const config = await getUserConfig();
    return config?.notificacoes === 'true' || config?.notificacoes === true;
  } catch (error) {
    return false;
  }
}

/**
 * Agenda uma notificação para uma tarefa
 * @param {Object} options - Opções da notificação
 * @param {string} options.taskId - ID da tarefa
 * @param {string} options.taskName - Nome da tarefa
 * @param {string} options.priority - Prioridade da tarefa
 * @param {Date} options.date - Data/hora da notificação
 * @param {string} options.dataFinal - Data final da tarefa (formato DD/MM/YYYY)
 * @param {number} options.repeatCount - Quantas vezes repetir (0 = não repetir)
 * @param {number} options.repeatInterval - Intervalo entre repetições em minutos
 */
export async function scheduleTaskNotification({
  taskId,
  taskName,
  priority,
  date,
  dataFinal,
  repeatCount = 0,
  repeatInterval = 0,
}) {
  try {
    // Verificar se notificações estão habilitadas
    const notificationsEnabled = await areNotificationsEnabled();
    if (!notificationsEnabled) {
      return null;
    }

    // Verificar permissão
    const hasPermission = await checkNotificationPermission();
    if (!hasPermission) {
      return null;
    }

    // Verificar se a data é válida e no futuro
    const now = new Date();
    if (date <= now) {
      return null;
    }

    // Criar mensagem da notificação
    const priorityEmoji = {
      'Alta': '🔴',
      'Média': '🟡',
      'Baixa': '🟢',
    };

    const emoji = priorityEmoji[priority] || '📋';
    const title = `${emoji} ${taskName}`;
    const body = `Prioridade: ${priority} | Vencimento: ${dataFinal}`;

    // Agendar notificação principal
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: {
          taskId,
          taskName,
          priority,
          dataFinal,
        },
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: date,
    });

    // Se houver repetições, agendar notificações adicionais
    const scheduledIds = [notificationId];
    
    if (repeatCount > 0 && repeatInterval > 0) {
      for (let i = 1; i <= repeatCount; i++) {
        const repeatDate = new Date(date);
        repeatDate.setMinutes(repeatDate.getMinutes() + (repeatInterval * i));

        // Só agendar se ainda estiver no futuro
        if (repeatDate > now) {
          const repeatId = await Notifications.scheduleNotificationAsync({
            content: {
              title,
              body,
              data: {
                taskId,
                taskName,
                priority,
                dataFinal,
                isRepeat: true,
                repeatNumber: i,
              },
              sound: true,
              priority: Notifications.AndroidNotificationPriority.HIGH,
            },
            trigger: repeatDate,
          });
          scheduledIds.push(repeatId);
        }
      }
    }

    return scheduledIds;
  } catch (error) {
    return null;
  }
}

/**
 * Cancela todas as notificações de uma tarefa
 * @param {string|Array} notificationIds - ID(s) da(s) notificação(ões) a cancelar
 */
export async function cancelTaskNotifications(notificationIds) {
  try {
    if (Array.isArray(notificationIds)) {
      await Promise.all(
        notificationIds.map(id => Notifications.cancelScheduledNotificationAsync(id))
      );
    } else {
      await Notifications.cancelScheduledNotificationAsync(notificationIds);
    }
  } catch (error) {
    // Erro silencioso ao cancelar notificações
  }
}

/**
 * Cancela todas as notificações agendadas
 */
export async function cancelAllNotifications() {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    // Erro silencioso ao cancelar todas as notificações
  }
}

/**
 * Obtém todas as notificações agendadas
 */
export async function getAllScheduledNotifications() {
  try {
    return await Notifications.getAllScheduledNotificationsAsync();
  } catch (error) {
    return [];
  }
}

/**
 * Obtém notificações agendadas de uma tarefa específica
 * @param {string} taskId - ID da tarefa
 */
export async function getTaskNotifications(taskId) {
  try {
    const allNotifications = await getAllScheduledNotifications();
    return allNotifications.filter(
      notification => notification.content.data?.taskId === taskId
    );
  } catch (error) {
    return [];
  }
}

