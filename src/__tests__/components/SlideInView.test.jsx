/**
 * Testes para o componente SlideInView
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { SlideInView } from '../../components/animations/SlideInView';

describe('SlideInView Component', () => {
  it('deve renderizar children corretamente', () => {
    const { getByText } = render(
      <SlideInView>
        <Text>Teste</Text>
      </SlideInView>
    );

    expect(getByText('Teste')).toBeTruthy();
  });

  it('deve aceitar diferentes direções', () => {
    const { getByText } = render(
      <SlideInView direction="down">
        <Text>Teste</Text>
      </SlideInView>
    );

    expect(getByText('Teste')).toBeTruthy();
  });
});
