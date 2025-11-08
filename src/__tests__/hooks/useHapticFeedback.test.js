/**
 * Testes para o hook useHapticFeedback
 */

import { renderHook } from '@testing-library/react-native';
import * as Haptics from 'expo-haptics';
import { useHapticFeedback } from '../../hooks/useHapticFeedback';

// Mock do expo-haptics
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy',
  },
  NotificationFeedbackType: {
    Success: 'success',
    Error: 'error',
    Warning: 'warning',
  },
}));

describe('useHapticFeedback Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve retornar todas as funções de feedback', () => {
    const { result } = renderHook(() => useHapticFeedback());

    expect(result.current.lightImpact).toBeDefined();
    expect(result.current.mediumImpact).toBeDefined();
    expect(result.current.heavyImpact).toBeDefined();
    expect(result.current.success).toBeDefined();
    expect(result.current.error).toBeDefined();
    expect(result.current.warning).toBeDefined();
  });

  it('deve chamar lightImpact corretamente', () => {
    const { result } = renderHook(() => useHapticFeedback());
    
    result.current.lightImpact();
    
    expect(Haptics.impactAsync).toHaveBeenCalledWith('light');
  });

  it('deve chamar success corretamente', () => {
    const { result } = renderHook(() => useHapticFeedback());
    
    result.current.success();
    
    expect(Haptics.notificationAsync).toHaveBeenCalledWith('success');
  });
});
