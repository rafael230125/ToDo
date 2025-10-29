/**
 * Paletas de Cores
 * Centraliza todas as cores do app
 */

export const lightColors = {
  // Cores primárias
  primary: '#51c1f5',
  secondary: '#FFC107',
  
  // Backgrounds
  background: '#f9f9f9',
  surface: '#fff',
  card: '#f8f8f8',
  
  // Texto
  text: '#333',
  textSecondary: '#757575',
  
  // Status
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',
  
  // Borders
  border: '#ddd',
  borderLight: '#eee',
  
  // Estados
  selected: '#757f88',
  disabled: '#d3d3d3',
  placeholder: '#aaa',
};

export const darkColors = {
  // Cores primárias
  primary: '#51c1f5',
  secondary: '#FFC107',
  
  // Backgrounds
  background: '#333',
  surface: '#444',
  card: '#444',
  
  // Texto
  text: '#fff',
  textSecondary: '#bbb',
  
  // Status
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',
  
  // Borders
  border: '#555',
  borderLight: '#444',
  
  // Estados
  selected: '#555',
  disabled: '#666',
  placeholder: '#888',
};

export const getColors = (isDark) => isDark ? darkColors : lightColors;

