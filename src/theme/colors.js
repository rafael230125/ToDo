/**
 * Design System - Paleta de Cores
 * Paleta moderna e harmoniosa para o app ToDo
 */

// Cores base da marca
const brandColors = {
  primary: '#6366F1',      // Indigo moderno e confiável
  primaryLight: '#818CF8', // Indigo claro
  primaryDark: '#4F46E5',  // Indigo escuro
  secondary: '#EC4899',    // Rosa vibrante
  secondaryLight: '#F472B6',
  secondaryDark: '#DB2777',
};

// Gradientes
export const gradients = {
  primary: ['#6366F1', '#8B5CF6'],      // Indigo para roxo
  secondary: ['#EC4899', '#F472B6'],     // Rosa gradiente
  accent: ['#10B981', '#34D399'],        // Verde gradiente
  sunset: ['#F59E0B', '#EF4444'],        // Laranja para vermelho
};

// Tema Claro
export const lightColors = {
  // Cores primárias
  primary: brandColors.primary,
  primaryLight: brandColors.primaryLight,
  primaryDark: brandColors.primaryDark,
  secondary: brandColors.secondary,
  secondaryLight: brandColors.secondaryLight,
  secondaryDark: brandColors.secondaryDark,
  
  // Backgrounds
  background: '#FAFBFC',           // Branco suave
  backgroundSecondary: '#F3F4F6', // Cinza muito claro
  surface: '#FFFFFF',              // Branco puro
  surfaceElevated: '#FFFFFF',      // Para cards elevados
  card: '#FFFFFF',                 // Cards
  cardHover: '#F9FAFB',            // Hover state
  
  // Texto
  text: '#111827',                 // Quase preto
  textPrimary: '#111827',
  textSecondary: '#6B7280',        // Cinza médio
  textTertiary: '#9CA3AF',         // Cinza claro
  textInverse: '#FFFFFF',          // Texto em fundo escuro
  
  // Status
  success: '#10B981',              // Verde moderno
  successLight: '#D1FAE5',
  warning: '#F59E0B',              // Laranja
  warningLight: '#FEF3C7',
  error: '#EF4444',                // Vermelho moderno
  errorLight: '#FEE2E2',
  info: '#3B82F6',                 // Azul
  infoLight: '#DBEAFE',
  
  // Borders e divisores
  border: '#E5E7EB',               // Cinza claro
  borderLight: '#F3F4F6',          // Cinza muito claro
  divider: '#E5E7EB',
  
  // Estados interativos
  selected: '#EDE9FE',             // Indigo muito claro
  hover: '#F3F4F6',                // Cinza claro
  pressed: '#E5E7EB',              // Cinza médio
  disabled: '#D1D5DB',             // Cinza desabilitado
  disabledText: '#9CA3AF',          // Texto desabilitado
  placeholder: '#9CA3AF',          // Placeholder
  
  // Overlay
  overlay: 'rgba(0, 0, 0, 0.5)',    // Overlay escuro
  overlayLight: 'rgba(0, 0, 0, 0.1)', // Overlay claro
};

// Tema Escuro
export const darkColors = {
  // Cores primárias (mantém as mesmas, mas com mais contraste)
  primary: brandColors.primaryLight,
  primaryLight: '#A5B4FC',
  primaryDark: brandColors.primary,
  secondary: brandColors.secondaryLight,
  secondaryLight: '#F9A8D4',
  secondaryDark: brandColors.secondary,
  
  // Backgrounds
  background: '#0F172A',           // Azul escuro profundo
  backgroundSecondary: '#1E293B',  // Azul escuro
  surface: '#1E293B',              // Superfície escura
  surfaceElevated: '#334155',      // Superfície elevada
  card: '#1E293B',                 // Cards escuros
  cardHover: '#334155',            // Hover state
  
  // Texto
  text: '#F1F5F9',                 // Branco suave
  textPrimary: '#F1F5F9',
  textSecondary: '#CBD5E1',        // Cinza claro
  textTertiary: '#94A3B8',         // Cinza médio
  textInverse: '#111827',          // Texto em fundo claro
  
  // Status (cores mais suaves no escuro)
  success: '#34D399',
  successLight: '#065F46',
  warning: '#FBBF24',
  warningLight: '#78350F',
  error: '#F87171',
  errorLight: '#7F1D1D',
  info: '#60A5FA',
  infoLight: '#1E3A8A',
  
  // Borders e divisores
  border: '#334155',               // Cinza escuro
  borderLight: '#475569',          // Cinza médio escuro
  divider: '#334155',
  
  // Estados interativos
  selected: '#312E81',            // Indigo escuro
  hover: '#334155',                // Cinza escuro
  pressed: '#475569',              // Cinza médio
  disabled: '#475569',             // Desabilitado
  disabledText: '#64748B',          // Texto desabilitado
  placeholder: '#64748B',          // Placeholder
  
  // Overlay
  overlay: 'rgba(0, 0, 0, 0.7)',    // Overlay mais escuro
  overlayLight: 'rgba(0, 0, 0, 0.3)',
};

/**
 * Retorna as cores baseado no tema
 */
export const getColors = (isDark = false) => isDark ? darkColors : lightColors;

/**
 * Cores semânticas que funcionam em ambos os temas
 */
export const semanticColors = {
  // Prioridades de tarefas
  priority: {
    high: '#EF4444',      // Vermelho
    medium: '#F59E0B',    // Laranja
    low: '#10B981',       // Verde
    none: '#6B7280',      // Cinza
  },
  
  // Status de tarefas
  status: {
    pending: '#F59E0B',   // Laranja
    inProgress: '#3B82F6', // Azul
    completed: '#10B981',  // Verde
    cancelled: '#6B7280',  // Cinza
  },
};
