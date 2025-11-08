/**
 * Hook de Haptic Feedback
 * Fornece feedback tátil (vibração) para melhorar a experiência do usuário
 */

import * as Haptics from 'expo-haptics';

export const useHapticFeedback = () => {
  const lightImpact = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const mediumImpact = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const heavyImpact = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  };

  const success = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const error = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  };

  const warning = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  };

  return { 
    lightImpact, 
    mediumImpact, 
    heavyImpact, 
    success, 
    error, 
    warning 
  };
};

