/**
 * Hook customizado para tema
 * 
 * Combina FontContext e ThemeContext em um hook único
 */

import { useContext } from 'react';
import { FontContext } from '../context/FontContext';
import { ThemeContext } from '../context/ThemeContext';

export function useTheme() {
  const fontContext = useContext(FontContext);
  const themeContext = useContext(ThemeContext);

  return {
    // Fonte
    fontSize: fontContext?.fontSize || 16,
    increaseFontSize: fontContext?.increaseFontSize || (() => {}),
    decreaseFontSize: fontContext?.decreaseFontSize || (() => {}),
    
    // Tema
    isDarkTheme: themeContext?.isDarkTheme || false,
    toggleTheme: themeContext?.toggleTheme || (() => {}),
    
    // Cores dinâmicas
    colors: {
      background: themeContext?.isDarkTheme ? '#333' : '#f9f9f9',
      text: themeContext?.isDarkTheme ? '#fff' : '#333',
      primary: '#51c1f5',
      secondary: '#FFC107',
    },
  };
}

