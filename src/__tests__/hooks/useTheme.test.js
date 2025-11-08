/**
 * Testes para o hook useTheme
 */

import { renderHook } from '@testing-library/react-native';
import { useTheme } from '../../hooks/useTheme';
import { ThemeProvider } from '../../context/ThemeContext';

describe('useTheme Hook', () => {
  it('deve retornar tema claro por padrão', () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });

    expect(result.current.isDarkTheme).toBe(false);
    expect(result.current.colors).toBeDefined();
    expect(result.current.typography).toBeDefined();
    expect(result.current.spacing).toBeDefined();
  });

  it('deve fornecer função toggleTheme', () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });

    expect(typeof result.current.toggleTheme).toBe('function');
  });

  it('deve fornecer cores do tema', () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });

    expect(result.current.colors.primary).toBeDefined();
    expect(result.current.colors.background).toBeDefined();
    expect(result.current.colors.text).toBeDefined();
  });
});

