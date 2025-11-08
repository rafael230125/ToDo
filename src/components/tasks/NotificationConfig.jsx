/**
 * Componente de Configuração de Notificações
 * Permite configurar quando e quantas vezes notificar sobre uma tarefa
 */

import React, { useState } from 'react';
import { View, Text, Switch, TouchableOpacity, StyleSheet, Platform, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '../../hooks/useTheme';

export const NotificationConfig = ({
  enabled,
  onEnabledChange,
  notificationDate,
  onNotificationDateChange,
  repeatCount,
  onRepeatCountChange,
  repeatInterval,
  onRepeatIntervalChange,
}) => {
  const { colors, shadows, spacing, borderRadius } = useTheme();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showRepeatModal, setShowRepeatModal] = useState(false);

  const styles = createStyles(colors, shadows, spacing, borderRadius);

  const formatDate = (date) => {
    if (!date) return 'Selecionar data';
    const now = new Date();
    const diffMs = date - now;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 0) return 'Data passada';
    if (diffMins < 60) return `Em ${diffMins} minuto${diffMins !== 1 ? 's' : ''}`;
    if (diffHours < 24) return `Em ${diffHours} hora${diffHours !== 1 ? 's' : ''}`;
    if (diffDays < 30) return `Em ${diffDays} dia${diffDays !== 1 ? 's' : ''}`;
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDateChange = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      onNotificationDateChange(selectedDate);
    }
  };

  const quickDateOptions = [
    { label: 'Agora', minutes: 0 },
    { label: 'Em 5 minutos', minutes: 5 },
    { label: 'Em 15 minutos', minutes: 15 },
    { label: 'Em 30 minutos', minutes: 30 },
    { label: 'Em 1 hora', minutes: 60 },
    { label: 'Em 2 horas', minutes: 120 },
    { label: 'Em 1 dia', minutes: 1440 },
    { label: 'Em 1 semana', minutes: 10080 },
    { label: 'Em 1 mês', minutes: 43200 },
  ];

  const setQuickDate = (minutes) => {
    const date = new Date();
    date.setMinutes(date.getMinutes() + minutes);
    onNotificationDateChange(date);
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <MaterialIcons name="notifications" size={24} color={colors.primary} />
          <Text style={[styles.title, { color: colors.text }]}>
            Notificações
          </Text>
        </View>
        <Switch
          value={enabled}
          onValueChange={onEnabledChange}
          thumbColor={enabled ? colors.primary : colors.border}
          trackColor={{
            true: colors.primary + '80',
            false: colors.border,
          }}
        />
      </View>

      {enabled && (
        <View style={styles.content}>
          {/* Data da Notificação */}
          <View style={styles.section}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>
              Quando notificar?
            </Text>
            
            {/* Opções Rápidas */}
            <View style={styles.quickOptions}>
              {quickDateOptions.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.quickOption,
                    {
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                    },
                  ]}
                  onPress={() => setQuickDate(option.minutes)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.quickOptionText, { color: colors.text }]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Seletor de Data Personalizado */}
            <TouchableOpacity
              style={[
                styles.dateButton,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  ...shadows.input,
                },
              ]}
              onPress={() => setShowDatePicker(true)}
              activeOpacity={0.7}
            >
              <MaterialIcons name="calendar-today" size={20} color={colors.primary} />
              <Text style={[styles.dateButtonText, { color: colors.text }]}>
                {formatDate(notificationDate)}
              </Text>
              <MaterialIcons name="arrow-drop-down" size={24} color={colors.textSecondary} />
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={notificationDate || new Date()}
                mode="datetime"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                minimumDate={new Date()}
                onChange={handleDateChange}
              />
            )}
          </View>

          {/* Repetição */}
          <View style={styles.section}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>
              Repetir notificação
            </Text>
            
            <TouchableOpacity
              style={[
                styles.repeatButton,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  ...shadows.input,
                },
              ]}
              onPress={() => setShowRepeatModal(true)}
              activeOpacity={0.7}
            >
              <Text style={[styles.repeatButtonText, { color: colors.text }]}>
                {repeatCount > 0
                  ? `${repeatCount} vez${repeatCount !== 1 ? 'es' : ''} a cada ${repeatInterval} minuto${repeatInterval !== 1 ? 's' : ''}`
                  : 'Não repetir'}
              </Text>
              <MaterialIcons name="arrow-drop-down" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Modal de Repetição */}
          <Modal
            visible={showRepeatModal}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowRepeatModal(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
                <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
                  <Text style={[styles.modalTitle, { color: colors.text }]}>
                    Configurar Repetição
                  </Text>
                  <TouchableOpacity
                    onPress={() => setShowRepeatModal(false)}
                    style={styles.modalCloseButton}
                  >
                    <MaterialIcons name="close" size={24} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>

                <View style={styles.modalBody}>
                  <Text style={[styles.modalLabel, { color: colors.textSecondary }]}>
                    Quantas vezes repetir?
                  </Text>
                  <View style={styles.repeatCountOptions}>
                    {[0, 1, 2, 3, 4, 5].map((count) => (
                      <TouchableOpacity
                        key={count}
                        style={[
                          styles.repeatCountOption,
                          {
                            backgroundColor:
                              repeatCount === count ? colors.primary + '20' : colors.background,
                            borderColor: repeatCount === count ? colors.primary : colors.border,
                          },
                        ]}
                        onPress={() => onRepeatCountChange(count)}
                        activeOpacity={0.7}
                      >
                        <Text
                          style={[
                            styles.repeatCountOptionText,
                            {
                              color: repeatCount === count ? colors.primary : colors.text,
                            },
                          ]}
                        >
                          {count === 0 ? 'Não repetir' : `${count} vez${count !== 1 ? 'es' : ''}`}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  {repeatCount > 0 && (
                    <>
                      <Text style={[styles.modalLabel, { color: colors.textSecondary, marginTop: 20 }]}>
                        Intervalo entre repetições (minutos)
                      </Text>
                      <View style={styles.intervalOptions}>
                        {[5, 15, 30, 60, 120, 240].map((interval) => (
                          <TouchableOpacity
                            key={interval}
                            style={[
                              styles.intervalOption,
                              {
                                backgroundColor:
                                  repeatInterval === interval
                                    ? colors.primary + '20'
                                    : colors.background,
                                borderColor:
                                  repeatInterval === interval ? colors.primary : colors.border,
                              },
                            ]}
                            onPress={() => onRepeatIntervalChange(interval)}
                            activeOpacity={0.7}
                          >
                            <Text
                              style={[
                                styles.intervalOptionText,
                                {
                                  color:
                                    repeatInterval === interval ? colors.primary : colors.text,
                                },
                              ]}
                            >
                              {interval} min
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </>
                  )}
                </View>
              </View>
            </View>
          </Modal>
        </View>
      )}
    </View>
  );
};

const createStyles = (colors, shadows, spacing, borderRadius) =>
  StyleSheet.create({
    container: {
      marginBottom: 20,
      backgroundColor: colors.surface,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      ...shadows.card,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    title: {
      fontSize: 18,
      fontWeight: '600',
      ...Platform.select({
        android: {
          includeFontPadding: false,
        },
      }),
    },
    content: {
      marginTop: spacing.md,
    },
    section: {
      marginBottom: spacing.lg,
    },
    label: {
      fontSize: 16,
      fontWeight: '500',
      marginBottom: spacing.sm,
      ...Platform.select({
        android: {
          includeFontPadding: false,
        },
      }),
    },
    quickOptions: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
      marginBottom: spacing.md,
    },
    quickOption: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.sm,
      borderWidth: 1,
    },
    quickOptionText: {
      fontSize: 14,
      fontWeight: '500',
      ...Platform.select({
        android: {
          includeFontPadding: false,
        },
      }),
    },
    dateButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: 56,
      borderRadius: borderRadius.md,
      borderWidth: 1.5,
      paddingHorizontal: spacing.md,
      gap: spacing.sm,
    },
    dateButtonText: {
      flex: 1,
      fontSize: 16,
      fontWeight: '500',
      ...Platform.select({
        android: {
          includeFontPadding: false,
        },
      }),
    },
    repeatButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: 56,
      borderRadius: borderRadius.md,
      borderWidth: 1.5,
      paddingHorizontal: spacing.md,
    },
    repeatButtonText: {
      flex: 1,
      fontSize: 16,
      fontWeight: '500',
      ...Platform.select({
        android: {
          includeFontPadding: false,
        },
      }),
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      maxHeight: '70%',
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.25,
          shadowRadius: 8,
        },
        android: {
          elevation: 8,
        },
      }),
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: spacing.lg,
      borderBottomWidth: 1,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: '700',
      ...Platform.select({
        android: {
          includeFontPadding: false,
        },
      }),
    },
    modalCloseButton: {
      padding: 4,
    },
    modalBody: {
      padding: spacing.lg,
    },
    modalLabel: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: spacing.md,
      ...Platform.select({
        android: {
          includeFontPadding: false,
        },
      }),
    },
    repeatCountOptions: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
    },
    repeatCountOption: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.sm,
      borderWidth: 1.5,
      minWidth: 100,
      alignItems: 'center',
    },
    repeatCountOptionText: {
      fontSize: 14,
      fontWeight: '500',
      ...Platform.select({
        android: {
          includeFontPadding: false,
        },
      }),
    },
    intervalOptions: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
    },
    intervalOption: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.sm,
      borderWidth: 1.5,
      minWidth: 80,
      alignItems: 'center',
    },
    intervalOptionText: {
      fontSize: 14,
      fontWeight: '500',
      ...Platform.select({
        android: {
          includeFontPadding: false,
        },
      }),
    },
  });

