/**
 * Mock do @expo/vector-icons para testes
 */

import React from 'react';
import { View, Text } from 'react-native';

const Icon = ({ name, size, color, testID, ...props }) => (
  <View testID={testID || `icon-${name}`} {...props}>
    <Text>{name}</Text>
  </View>
);

export const MaterialIcons = Icon;
export const FontAwesome = Icon;

