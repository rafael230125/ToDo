/**
 * Testes para o componente EmptyState
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { EmptyState } from '../../components/common/EmptyState';

// Mock simples do useTheme
jest.mock('../../hooks/useTheme', () => ({
  useTheme: () => ({
    colors: {
      text: '#000000',
      textSecondary: '#666666',
      textInverse: '#FFFFFF',
      primary: '#6366F1',
    },
    spacing: {},
    shadows: {
      button: {},
    },
  }),
}));

// Mock do FadeInView
jest.mock('../../components/animations/FadeInView', () => ({
  FadeInView: ({ children }) => children,
}));

// Mock do @expo/vector-icons já está no jest.config.js

describe('EmptyState Component', () => {
  it('deve renderizar com valores padrão', () => {
    const { getByText } = render(<EmptyState />);

    expect(getByText('Nada aqui ainda')).toBeTruthy();
    expect(getByText('Comece adicionando uma nova tarefa')).toBeTruthy();
  });

  it('deve renderizar título customizado', () => {
    const { getByText } = render(
      <EmptyState title="Nenhum item encontrado" />
    );

    expect(getByText('Nenhum item encontrado')).toBeTruthy();
  });

  it('deve renderizar mensagem customizada', () => {
    const { getByText } = render(
      <EmptyState message="Adicione seu primeiro item" />
    );

    expect(getByText('Adicione seu primeiro item')).toBeTruthy();
  });

  it('deve chamar onAction quando botão for pressionado', () => {
    const onAction = jest.fn();
    const { getByText } = render(
      <EmptyState 
        actionLabel="Criar Item" 
        onAction={onAction}
      />
    );

    fireEvent.press(getByText('Criar Item'));
    expect(onAction).toHaveBeenCalled();
  });
});
