/**
 * Testes para o componente Skeleton
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { Skeleton } from '../../components/common/Skeleton';

// Mock simples do useTheme
jest.mock('../../hooks/useTheme', () => ({
  useTheme: () => ({
    colors: {
      border: '#E0E0E0',
    },
  }),
}));

describe('Skeleton Component', () => {
  it('deve renderizar corretamente', () => {
    const { UNSAFE_getByType } = render(
      <Skeleton width={100} height={50} />
    );

    const { Animated } = require('react-native');
    const view = UNSAFE_getByType(Animated.View);
    expect(view).toBeTruthy();
  });

  it('deve aceitar diferentes tamanhos', () => {
    const { UNSAFE_getByType } = render(
      <Skeleton width={200} height={100} />
    );

    const { Animated } = require('react-native');
    const view = UNSAFE_getByType(Animated.View);
    expect(view).toBeTruthy();
  });
});
