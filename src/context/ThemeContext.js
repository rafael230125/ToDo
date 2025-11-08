import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ThemeContext = createContext();

const THEME_STORAGE_KEY = 'isDarkTheme';

export const ThemeProvider = ({ children }) => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar tema salvo ao inicializar
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme !== null) {
          setIsDarkTheme(savedTheme === 'true');
        }
      } catch (error) {
        // Erro silencioso ao carregar tema
      } finally {
        setIsLoading(false);
      }
    };

    loadTheme();
  }, []);

  // Salvar tema sempre que mudar
  useEffect(() => {
    const saveTheme = async () => {
      if (!isLoading) {
        try {
          await AsyncStorage.setItem(THEME_STORAGE_KEY, String(isDarkTheme));
        } catch (error) {
          // Erro silencioso ao salvar tema
        }
      }
    };

    saveTheme();
  }, [isDarkTheme, isLoading]);

  const toggleTheme = () => {
    setIsDarkTheme((prevTheme) => !prevTheme);
  };

  return (
    <ThemeContext.Provider value={{ isDarkTheme, toggleTheme, isLoading }}>
      {children}
    </ThemeContext.Provider>
  );
};
