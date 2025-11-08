/**
 * Testes para o componente AnimatedButton
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Text } from 'react-native';
import { AnimatedButton } from '../../components/common/AnimatedButton';

// Mock simples do useHapticFeedback
jest.mock('../../hooks/useHapticFeedback', () => ({
  useHapticFeedback: () => ({
    lightImpact: jest.fn(),
    mediumImpact: jest.fn(),
    heavyImpact: jest.fn(),
  }),
}));

describe('AnimatedButton Component', () => {
  it('deve renderizar children corretamente', () => {
    const { getByText } = render(
      <AnimatedButton>
        <Text>Clique aqui</Text>
      </AnimatedButton>
    );

    expect(getByText('Clique aqui')).toBeTruthy();
  });

  it('deve chamar onPress quando pressionado', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <AnimatedButton onPress={onPress}>
        <Text>Clique aqui</Text>
      </AnimatedButton>
    );

    fireEvent.press(getByText('Clique aqui'));
    expect(onPress).toHaveBeenCalled();
  });

  it('não deve chamar onPress quando disabled', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <AnimatedButton onPress={onPress} disabled={true}>
        <Text>Clique aqui</Text>
      </AnimatedButton>
    );

    fireEvent.press(getByText('Clique aqui'));
    expect(onPress).not.toHaveBeenCalled();
  });
});
