/**
 * Testes para o componente Header
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { Header } from '../../components/layout/Header';
import { ThemeProvider } from '../../context/ThemeContext';

// Mock do ThemeProvider
const MockThemeProvider = ({ children }) => {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  );
};

describe('Header Component', () => {
  it('deve renderizar corretamente com nome de usuário', () => {
    const { getByText } = render(
      <MockThemeProvider>
        <Header userName="João Silva" />
      </MockThemeProvider>
    );

    expect(getByText('Olá,')).toBeTruthy();
    expect(getByText('João Silva')).toBeTruthy();
    // TO-DO foi removido e substituído por ícone
  });

  it('deve usar nome padrão quando userName não for fornecido', () => {
    const { getByText } = render(
      <MockThemeProvider>
        <Header />
      </MockThemeProvider>
    );

    expect(getByText('Usuário')).toBeTruthy();
  });

  it('deve truncar nomes muito longos', () => {
    const longName = 'João da Silva Santos Oliveira Pereira';
    const { getByText } = render(
      <MockThemeProvider>
        <Header userName={longName} />
      </MockThemeProvider>
    );

    const nameElement = getByText(longName);
    expect(nameElement.props.numberOfLines).toBe(1);
    expect(nameElement.props.ellipsizeMode).toBe('tail');
  });

  it('deve renderizar ícone do app', () => {
    const { UNSAFE_getByType } = render(
      <MockThemeProvider>
        <Header userName="Teste" />
      </MockThemeProvider>
    );

    // Verifica se o componente Image (ícone) está presente
    const image = UNSAFE_getByType(require('react-native').Image);
    expect(image).toBeTruthy();
  });
});

