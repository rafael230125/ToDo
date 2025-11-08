/**
 * Design System - Espaçamentos
 * Sistema de espaçamento consistente baseado em múltiplos de 4
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
  '6xl': 64,
  '7xl': 80,
  '8xl': 96,
};

/**
 * Border Radius - Cantos arredondados
 */
export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  full: 9999,
};

/**
 * Helper para obter espaçamento
 */
export const getSpacing = (size) => spacing[size] || size;

/**
 * Padding padrão para containers
 */
export const containerPadding = {
  xs: spacing.sm,
  sm: spacing.md,
  md: spacing.lg,
  lg: spacing.xl,
  xl: spacing['2xl'],
};

