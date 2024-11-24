import React, { createContext, useState } from 'react';

const FontContext = createContext();

const FontProvider = ({ children }) => {
  const [fontSize, setFontSize] = useState(16); // Tamanho padrão das letras

  const increaseFontSize = () => setFontSize((prev) => Math.min(prev + 2, 32)); // Limite máximo
  const decreaseFontSize = () => setFontSize((prev) => Math.max(prev - 2, 12)); // Limite mínimo

  return (
    <FontContext.Provider value={{ fontSize, increaseFontSize, decreaseFontSize }}>
      {children}
    </FontContext.Provider>
  );
};

export { FontContext, FontProvider };
