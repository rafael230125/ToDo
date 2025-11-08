/**
 * Design System - Tema Centralizado
 * Exporta todo o sistema de design do app
 */

import { getColors, gradients, semanticColors } from './colors';
import { fontSizes, fontWeights, lineHeights, textStyles } from './typography';
import { spacing, borderRadius, getSpacing, containerPadding } from './spacing';
import { getShadow, shadows } from './shadows';

/**
 * Retorna o tema completo baseado no modo escuro/claro
 */
export const getTheme = (isDark = false) => {
  const colors = getColors(isDark);
  
  return {
    colors,
    gradients,
    semanticColors,
    typography: {
      fontSizes,
      fontWeights,
      lineHeights,
      textStyles,
    },
    spacing,
    borderRadius,
    getSpacing,
    containerPadding,
    shadows: {
      ...shadows,
      get: getShadow,
    },
  };
};

// Exportar tudo individualmente também
export * from './colors';
export * from './typography';
export * from './spacing';
export * from './shadows';
