/**
 * Testes para o componente FadeInView
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { FadeInView } from '../../components/animations/FadeInView';

describe('FadeInView Component', () => {
  it('deve renderizar children corretamente', () => {
    const { getByText } = render(
      <FadeInView>
        <Text>Teste</Text>
      </FadeInView>
    );

    expect(getByText('Teste')).toBeTruthy();
  });

  it('deve aceitar props customizadas', () => {
    const { getByText } = render(
      <FadeInView duration={500} delay={200}>
        <Text>Teste</Text>
      </FadeInView>
    );

    expect(getByText('Teste')).toBeTruthy();
  });
});
