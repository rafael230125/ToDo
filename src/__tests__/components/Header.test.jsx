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
    expect(getByText('TO-DO')).toBeTruthy();
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

  it('deve renderizar título customizado', () => {
    const { getByText } = render(
      <MockThemeProvider>
        <Header userName="Teste" appTitle="Minhas Tarefas" />
      </MockThemeProvider>
    );

    expect(getByText('Minhas Tarefas')).toBeTruthy();
  });
});

