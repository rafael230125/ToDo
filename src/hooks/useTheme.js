/**
 * Hook customizado para tema
 * 
 * Combina FontContext e ThemeContext com o novo Design System
 */

import { useContext, useMemo } from 'react';
import { FontContext } from '../context/FontContext';
import { ThemeContext } from '../context/ThemeContext';
import { getTheme } from '../theme';

export function useTheme() {
  const fontContext = useContext(FontContext);
  const themeContext = useContext(ThemeContext);
  
  const isDarkTheme = themeContext?.isDarkTheme || false;
  
  // Memoiza o tema para evitar recálculos desnecessários
  const theme = useMemo(() => getTheme(isDarkTheme), [isDarkTheme]);

  return {
    // Fonte
    fontSize: fontContext?.fontSize || 16,
    increaseFontSize: fontContext?.increaseFontSize || (() => {}),
    decreaseFontSize: fontContext?.decreaseFontSize || (() => {}),
    
    // Tema
    isDarkTheme,
    toggleTheme: themeContext?.toggleTheme || (() => {}),
    
    // Design System completo
    colors: theme.colors,
    gradients: theme.gradients,
    semanticColors: theme.semanticColors,
    typography: theme.typography,
    spacing: theme.spacing,
    borderRadius: theme.borderRadius,
    shadows: theme.shadows,
    getSpacing: theme.getSpacing,
    containerPadding: theme.containerPadding,
  };
}

