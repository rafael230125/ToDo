/**
 * Espaçamentos
 * Centraliza espaçamentos padronizados
 */

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
};

export const borderRadius = {
  sm: 5,
  md: 10,
  lg: 15,
  xl: 20,
  full: 50,
};

export const getSpacing = (size) => spacing[size] || size;

