/**
 * Design System - Sombras e Elevações
 * Sistema de elevação para criar hierarquia visual
 */

import { Platform } from 'react-native';

/**
 * Sombras para iOS (shadowColor, shadowOffset, shadowOpacity, shadowRadius)
 */
export const iosShadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },
  '2xl': {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
  },
};

/**
 * Sombras para Android (elevation)
 */
export const androidShadows = {
  none: { elevation: 0 },
  sm: { elevation: 2 },
  md: { elevation: 4 },
  lg: { elevation: 8 },
  xl: { elevation: 12 },
  '2xl': { elevation: 16 },
};

/**
 * Retorna sombras apropriadas para a plataforma
 */
export const getShadow = (size = 'md') => {
  if (Platform.OS === 'ios') {
    return iosShadows[size] || iosShadows.md;
  }
  return androidShadows[size] || androidShadows.md;
};

/**
 * Sombras pré-configuradas para componentes comuns
 */
export const shadows = {
  card: getShadow('md'),
  cardHover: getShadow('lg'),
  button: getShadow('sm'),
  buttonPressed: getShadow('none'),
  modal: getShadow('2xl'),
  header: getShadow('sm'),
  input: getShadow('sm'),
  inputFocused: getShadow('md'),
};

