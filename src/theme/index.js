/**
 * Tema Centralizado
 * Exporta tudo relacionado ao tema
 */

import { getColors } from './colors';
import { fontSizes, fontWeights, lineHeights } from './typography';
import { spacing, borderRadius, getSpacing } from './spacing';

/**
 * Retorna o tema completo baseado no modo escuro/claro
 */
export const getTheme = (isDark = false) => {
  return {
    colors: getColors(isDark),
    typography: {
      fontSizes,
      fontWeights,
      lineHeights,
    },
    spacing,
    borderRadius,
    getSpacing,
  };
};

// Exportar tudo individualmente também
export * from './colors';
export * from './typography';
export * from './spacing';

