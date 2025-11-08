/**
 * Testes para o componente ConfirmModal
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ConfirmModal } from '../../components/common/ConfirmModal';

// Mock simples do useTheme
jest.mock('../../hooks/useTheme', () => ({
  useTheme: () => ({
    colors: {
      surface: '#FFFFFF',
      text: '#000000',
      textSecondary: '#666666',
      primary: '#6366F1',
      border: '#E0E0E0',
    },
    semanticColors: {
      priority: {
        medium: '#F59E0B',
      },
      error: '#EF4444',
    },
  }),
}));

// Mock do @expo/vector-icons já está no jest.config.js

describe('ConfirmModal Component', () => {
  it('deve renderizar quando visible for true', () => {
    const { getAllByText } = render(
      <ConfirmModal 
        visible={true}
        onClose={jest.fn()}
        onConfirm={jest.fn()}
      />
    );

    // Pode haver múltiplos elementos com o texto "Confirmar"
    expect(getAllByText('Confirmar').length).toBeGreaterThan(0);
  });

  it('deve renderizar título customizado', () => {
    const { getByText } = render(
      <ConfirmModal 
        visible={true}
        title="Excluir item"
        onClose={jest.fn()}
        onConfirm={jest.fn()}
      />
    );

    expect(getByText('Excluir item')).toBeTruthy();
  });

  it('deve chamar onClose quando cancelar', () => {
    const onClose = jest.fn();
    const { getByText } = render(
      <ConfirmModal 
        visible={true}
        onClose={onClose}
        onConfirm={jest.fn()}
      />
    );

    fireEvent.press(getByText('Cancelar'));
    expect(onClose).toHaveBeenCalled();
  });

  it('deve renderizar botão de confirmar', () => {
    const { getAllByText } = render(
      <ConfirmModal 
        visible={true}
        onClose={jest.fn()}
        onConfirm={jest.fn()}
      />
    );

    // Verifica se o botão "Confirmar" existe
    const confirmButtons = getAllByText('Confirmar');
    expect(confirmButtons.length).toBeGreaterThan(0);
  });
});
