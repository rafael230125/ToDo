import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { getUserConfig } from './configService';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

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

export async function checkNotificationPermission() {
  try {
    const { status } = await Notifications.getPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    return false;
  }
}

export async function areNotificationsEnabled() {
  try {
    const config = await getUserConfig();
    return config?.notificacoes === 'true' || config?.notificacoes === true;
  } catch (error) {
    return false;
  }
}

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
    const notificationsEnabled = await areNotificationsEnabled();
    if (!notificationsEnabled) {
      return null;
    }

    const hasPermission = await checkNotificationPermission();
    if (!hasPermission) {
      return null;
    }

    const now = new Date();
    if (date <= now) {
      return null;
    }

    const priorityEmoji = {
      'Alta': '🔴',
      'Média': '🟡',
      'Baixa': '🟢',
    };

    const emoji = priorityEmoji[priority] || '📋';
    const title = `${emoji} ${taskName}`;
    const body = `Prioridade: ${priority} | Vencimento: ${dataFinal}`;

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

    const scheduledIds = [notificationId];
    
    if (repeatCount > 0 && repeatInterval > 0) {
      for (let i = 1; i <= repeatCount; i++) {
        const repeatDate = new Date(date);
        repeatDate.setMinutes(repeatDate.getMinutes() + (repeatInterval * i));

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
  }
}

export async function cancelAllNotifications() {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
  }
}

export async function getAllScheduledNotifications() {
  try {
    return await Notifications.getAllScheduledNotificationsAsync();
  } catch (error) {
    return [];
  }
}

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

