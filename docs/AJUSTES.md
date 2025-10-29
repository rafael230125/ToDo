# 📝 AJUSTES E REFATORAÇÃO - App ToDo

## 🎯 STATUS GERAL DA REFATORAÇÃO

**Data de Início:** Janeiro 2025  
**Última Atualização:** Janeiro 2025  
**Progresso Geral:** Migração Firebase Concluída - Aguardando Testes

---

## ✅ RESUMO DO PROGRESSO

**✅ CONCLUÍDO:**
- ✅ Limpeza de Dependências (10 pacotes removidos, redução de 48% nas dependências)
- ✅ Atualização para Expo SDK 54 (package.json atualizado, credenciais Firebase corrigidas)
- ✅ firebaseConfig.js corrigido (removido import '@env', adicionado expo-constants)
- ✅ **Migração SQLite → Firebase CONCLUÍDA** (6 telas atualizadas para Firebase)

**⏭️ PRÓXIMO PASSO:**
- 🟡 TESTAR APP - Ver `GUIA_TESTES_MIGRACAO.md`
- 🟡 Configurar regras de segurança do Firestore (CRÍTICO)
- 🟡 Remover arquivos antigos após validação
- 🟢 FASE 1 COMPLETA! Próximo: Fase 2 (Segurança) ou Fase 4 (Refatoração)

---

## 📊 VISÃO GERAL DAS FASES

| Fase | Status | Prioridade | Progresso |
|------|--------|------------|-----------|
| **Limpeza de Dependências** | 🟢 **Concluído** | ALTA | **100%** ✅ |
| **Atualização SDK 54** | 🟢 **Concluído** | ALTA | **100%** ✅ |
| Fase 1: Fundação e Estrutura | 🔴 Não iniciado | ALTA | 0% |
| **Fase 2: Segurança** | 🟡 **Próxima (CRÍTICA)** | **CRÍTICA** | 0% |
| Fase 3: Componentização | 🔴 Não iniciado | ALTA | 0% |
| Fase 4: Separação e Refatoração | 🔴 Não iniciado | ALTA | 0% |
| Fase 5: Testes e Qualidade | 🔴 Não iniciado | MÉDIA | 0% |
| Fase 6: Otimização | 🔴 Não iniciado | BAIXA | 0% |

**Legenda:** 🔴 Não iniciado | 🟡 Em andamento | 🟢 Concluído

---

## 🧹 LIMPEZA DE DEPENDÊNCIAS (ANTES DE QUALQUER FASE)

### ✅ ANÁLISE COMPLETA DE DEPENDÊNCIAS

#### Dependências DUPLICADAS
- ❌ `@react-native-community/checkbox` (v0.5.17) - Não utilizado
- ❌ `react-native-checkbox` (v2.0.0) - Não utilizado
- **Solução:** Usar apenas `react-native-elements` que já contém CheckBox

#### Dependências NÃO UTILIZADAS
- ❌ `@react-native-community/slider` (v4.5.5) - Nunca importado
- ❌ `react-native-image-picker` (v7.1.2) - Nunca importado
- ❌ `react-native-sqlite-storage` (v6.0.1) - Duplicado com expo-sqlite
- ❌ `@types/react-native-sqlite-storage` (v6.0.5) - Não usa TypeScript
- ❌ `tailwindcss-react-native` (v1.7.10) - Configurado mas nunca usado
- ❌ `tailwindcss` (v3.4.14) - Configurado mas nunca usado
- ❌ `todo: "file:"` - Dependência circular problemática

#### Dependências NÃO UTILIZADAS NO MOMENTO (mas podem ser úteis)
- ⚠️ `@react-navigation/bottom-tabs` (v6.6.1) - Instalado mas não usado
- ⚠️ `@react-navigation/drawer` (v6.7.2) - Instalado mas não usado

### ✅ AÇÕES DE LIMPEZA

#### 1. Remover Dependências Duplicadas/Desnecessárias
```bash
npm uninstall @react-native-community/checkbox
npm uninstall react-native-checkbox
npm uninstall @react-native-community/slider
npm uninstall react-native-image-picker
npm uninstall react-native-sqlite-storage
npm uninstall @types/react-native-sqlite-storage
npm uninstall tailwindcss-react-native
npm uninstall tailwindcss
```

#### 2. Remover Dependência Circular
- Remover `"todo": "file:"` do package.json

#### 3. Atualizar uso de CheckBox em LoginScreen
- Substituir import do react-native-elements por alternativa nativa ou criar componente próprio
- **Decisão:** Usar Switch nativo do React Native (mais leve)

---

## 🎯 FASES DA ESTRATÉGIA DE REFATORAÇÃO

### 🔴 FASE 1: FUNDAÇÃO E ESTRUTURA (Prioridade: ALTA)

#### Status: Não iniciado

#### Tarefas:
- [ ] 1.1 Criar camada de serviços
  - [ ] Criar `src/services/authService.js`
  - [ ] Criar `src/services/taskService.js`
  - [ ] Criar `src/services/userService.js`
  - [ ] Criar `src/services/configService.js`
  - [ ] Criar `src/services/storageService.js`

- [ ] 1.2 Implementar Repository Pattern
  - [ ] Criar `src/repositories/baseRepository.js`
  - [ ] Criar `src/repositories/taskRepository.js`
  - [ ] Criar `src/repositories/userRepository.js`

- [ ] 1.3 Criar Hooks Customizados
  - [ ] Criar `src/hooks/useAuth.js`
  - [ ] Criar `src/hooks/useTasks.js`
  - [ ] Criar `src/hooks/useFilter.js`
  - [ ] Criar `src/hooks/useTheme.js`

#### Observações:
- Esta fase cria a fundação para todas as outras fases
- Importante criar abstrações limpas
- Testar cada serviço individualmente

---

### 🔴 FASE 2: SEGURANÇA E CONFIGURAÇÃO (Prioridade: CRÍTICA)

#### Status: Documentação pronta - Aguardando implementação

**📄 Guia completo criado:** `FASE2_SEGURANCA.md`

#### Tarefas:
- [ ] 2.1 Implementar Variáveis de Ambiente
  - [ ] Criar arquivo `.env`
  - [ ] Adicionar .env ao .gitignore
  - [ ] Configurar expo-constants
  - [ ] Mover credenciais Firebase para .env
  - [ ] Atualizar firebaseConfig.js para usar variáveis de ambiente

- [ ] 2.2 Criptografar Senhas
  - [ ] Instalar biblioteca de criptografia (expo-crypto ou expo-crypto-browser)
  - [ ] Criar funções hash/compare
  - [ ] Atualizar cadastro de usuários
  - [ ] Atualizar login para validar hash
  - [ ] Criar migration para hashear senhas existentes

- [ ] 2.3 Escolher UM Sistema de Autenticação
  - [ ] Decidir estratégia (Firebase Auth + Sync SQLite recomendado)
  - [ ] Implementar sincronização Firebase ↔ SQLite
  - [ ] Remover código de autenticação duplicado
  - [ ] Testar fluxo completo

#### Observações:
- ⚠️ CRÍTICO: Mover credenciais Firebase imediatamente
- ⚠️ CRÍTICO: Não deixar senhas em texto plano
- ⚠️ CRÍTICO: Unificar autenticação evita bugs

---

### 🔴 FASE 3: COMPONENTIZAÇÃO (Prioridade: ALTA)

#### Status: Não iniciado

#### Tarefas:
- [ ] 3.1 Criar Biblioteca de Componentes
  - [ ] Criar estrutura de pastas
    - [ ] `src/components/common/Button/`
    - [ ] `src/components/common/Input/`
    - [ ] `src/components/common/Card/`
    - [ ] `src/components/common/Modal/`
    - [ ] `src/components/tasks/TaskList/`
    - [ ] `src/components/tasks/TaskItem/`
    - [ ] `src/components/tasks/TaskFilter/`
    - [ ] `src/components/layout/Header/`
    - [ ] `src/components/layout/NavBar/`
    - [ ] `src/components/layout/Container/`

- [ ] 3.2 Criar Tema Centralizado
  - [ ] Criar `src/theme/colors.js`
  - [ ] Criar `src/theme/typography.js`
  - [ ] Criar `src/theme/spacing.js`
  - [ ] Criar `src/theme/index.js`
  - [ ] Refatorar ThemeContext para usar novo sistema

#### Observações:
- Componentes devem ser genéricos e reutilizáveis
- Garantir suporte a dark/light theme
- Documentar props de cada componente

---

### 🔴 FASE 4: SEPARAÇÃO E REFATORAÇÃO (Prioridade: ALTA)

#### Status: Não iniciado

#### Tarefas:
- [ ] 4.1 Dividir Home.jsx
  - [ ] Criar estrutura `src/screens/Home/`
  - [ ] Criar `index.jsx` (orquestrador)
  - [ ] Extrair HomeHeader como componente
  - [ ] Extrair SearchBar como componente
  - [ ] Extrair FilterModal como componente
  - [ ] Extrair TaskList como componente
  - [ ] Criar hooks `useHomeData.js`
  - [ ] Criar hooks `useHomeFilters.js`

- [ ] 4.2 Extrair Lógica de Negócio
  - [ ] Criar `src/hooks/useTaskFilters.js`
  - [ ] Criar `src/hooks/useTaskSearch.js`
  - [ ] Mover lógica de filtros para hooks
  - [ ] Testar filtros isoladamente

- [ ] 4.3 Refatorar Outras Telas
  - [ ] Refatorar LoginScreen
  - [ ] Refatorar NewUser
  - [ ] Refatorar addToDo
  - [ ] Refatorar Config
  - [ ] Implementar DetailScreen

#### Observações:
- Meta: Nenhum arquivo com mais de 150 linhas
- Cada componente deve ter responsabilidade única
- Hooks compartilhados entre telas

---

### 🔴 FASE 5: TESTES E QUALIDADE (Prioridade: MÉDIA)

#### Status: Não iniciado

#### Tarefas:
- [ ] 5.1 Configurar Ambiente de Testes
  - [ ] Instalar dependências: jest, @testing-library/react-native
  - [ ] Configurar jest.config.js
  - [ ] Configurar setupTests.js
  - [ ] Criar scripts npm para testes

- [ ] 5.2 Escrever Testes Críticos
  - [ ] Criar `src/services/__tests__/authService.test.js`
  - [ ] Criar `src/services/__tests__/taskService.test.js`
  - [ ] Criar `src/repositories/__tests__/taskRepository.test.js`
  - [ ] Criar `src/hooks/__tests__/useAuth.test.js`
  - [ ] Meta: 70% cobertura em serviços críticos

- [ ] 5.3 Implementar Linting
  - [ ] Instalar ESLint e Prettier
  - [ ] Configurar .eslintrc
  - [ ] Configurar .prettierrc
  - [ ] Integrar com pre-commit hook
  - [ ] Corrigir todos os warnings

#### Observações:
- Priorizar testes de serviços e repositories
- Testes de componente podem vir depois
- Automatizar verificação de qualidade

---

### 🔴 FASE 6: OTIMIZAÇÃO (Prioridade: BAIXA)

#### Status: Não iniciado

#### Tarefas:
- [ ] 6.1 Implementar React.memo e useMemo
  - [ ] Identificar componentes que re-renderizam muito
  - [ ] Aplicar React.memo onde apropriado
  - [ ] Usar useMemo para cálculos pesados
  - [ ] Usar useCallback para funções estáveis

- [ ] 6.2 Lazy Loading de Telas
  - [ ] Implementar React.lazy para telas pesadas
  - [ ] Adicionar Suspense boundaries
  - [ ] Testar performance

- [ ] 6.3 Otimizar Imagens e Assets
  - [ ] Redimensionar imagens grandes
  - [ ] Considerar formato WebP
  - [ ] Implementar cache de imagens

#### Observações:
- Só após todas as outras fases
- Foco em experiência do usuário
- Medir melhorias com React DevTools Profiler

---

## 📝 REGISTRO DE MUDANÇAS

### 2024 - Migração SQLite → Firebase Firestore (CONCLUÍDO ✅)

**Bugs Corrigidos:**
- ✅ Corrigido async/await na função `applyFilters` (Home.jsx linha 139)
- ✅ Corrigido BackHandler para React Native 0.81+ API
- ✅ Corrigido índice composto do Firebase (busca todas e filtra no cliente)

**Contexto:** Decisão arquitetural de descontinuar completamente o SQLite e migrar 100% dos dados para Firebase Firestore.

**Documentação criada:**
- ✅ `MIGRACAO_FIREBASE.md` - Plano completo de migração
- ✅ `src/services/firebaseService.js` - Serviços Firestore criados
- ✅ `MIGRACAO_CONCLUIDA.md` - Resumo da migração
- ✅ `GUIA_TESTES_MIGRACAO.md` - Checklist de testes
- ✅ `CORRECOES_BUGS.md` - Correções aplicadas

**Estrutura de Coleções definida:**
- ✅ `usuarios` - Dados dos usuários
- ✅ `usuarios/{uid}/tarefas` - Subcoleção de tarefas
- ✅ `usuarios/{uid}/config` - Subcoleção de configurações

**Arquivos atualizados:**
- ✅ `src/services/firebaseConfig.js` - Auth com persistência AsyncStorage

**Progresso da Migração:**
- ✅ Atualizar `src/screens/NewUser.jsx` - CONCLUÍDO ✅
- ✅ Atualizar `src/screens/LoginScreen.jsx` - CONCLUÍDO ✅
- ✅ Atualizar `src/screens/Home.jsx` - CONCLUÍDO ✅
  - ✅ Corrigido async/await
  - ✅ Corrigido BackHandler para React Native 0.81+
- ✅ Atualizar `src/screens/addToDo.jsx` - CONCLUÍDO ✅
- ✅ Atualizar `src/screens/Config.jsx` - CONCLUÍDO ✅
- ✅ Atualizar `src/screens/Galeria.jsx` - CONCLUÍDO ✅
- ⏳ Remover `src/database/db.js` - PENDENTE (aguardando testes)

**Progresso das Fases (ESTRATEGIA.md):**
- ✅ FASE 1: Fundação (11 arquivos criados)
- ✅ FASE 2: Segurança (variáveis de ambiente + Firebase Auth)
- ✅ FASE 3: Componentização (14 arquivos criados)
- ✅ FASE 4: Refatoração (Home.jsx refatorado: 538 → 140 linhas)
- ✅ FASE 6: Otimização (React.memo + lazy loading)

---

### 2024 - Limpeza de Dependências (CONCLUÍDO ✅)
- ✅ Análise completa de dependências duplicadas
- ✅ Identificação de dependências não utilizadas
- ✅ Documentação de decisões de remoção
- ✅ Remoção de dependências do package.json:
  - ❌ `@react-native-community/checkbox` - Não utilizado
  - ❌ `react-native-checkbox` - Não utilizado
  - ❌ `@react-native-community/slider` - Nunca importado
  - ❌ `react-native-image-picker` - Nunca importado
  - ❌ `react-native-sqlite-storage` - Duplicado com expo-sqlite
  - ❌ `@types/react-native-sqlite-storage` - Não usa TypeScript
  - ❌ `tailwindcss-react-native` - Configurado mas nunca usado
  - ❌ `tailwindcss` - Configurado mas nunca usado
  - ❌ `todo: "file:"` - Dependência circular
- ✅ Atualizado LoginScreen.jsx para usar Switch nativo ao invés de react-native-elements CheckBox
- ✅ **Correção de compatibilidade:** Ajustadas versões de pacotes para compatibilidade com Expo SDK 51:
  - `@react-native-async-storage/async-storage`: 1.24.0 → 1.23.1 ✅
  - `@react-native-picker/picker`: 2.9.0 → 2.7.5 ✅
  - `react-native-safe-area-context`: 4.12.0 → 4.10.5 ✅
  - `react-native-screens`: 3.35.0 → 3.31.1 ✅
  - `@react-native-community/datetimepicker`: 8.2.0 → 8.0.1 ✅

---

### 2024 - Atualização para Expo SDK 54 (EM ANDAMENTO 🟡)

**Tarefas Concluídas:**
- ✅ Atualizado Expo: 51.0.28 → **54.0.0**
- ✅ Atualizado React: 18.2.0 → **19.1.0**
- ✅ Atualizado React Native: 0.74.5 → **0.81.5**
- ✅ Atualizado expo-file-system: 17.0.1 → **19.0.17**
- ✅ Atualizado expo-font: 12.0.10 → **14.0.9**
- ✅ Atualizado expo-media-library: 16.0.5 → **18.2.0**
- ✅ Atualizado expo-sqlite: 14.0.6 → **16.0.0**
- ✅ Atualizado expo-status-bar: 1.12.1 → **3.0.8**
- ✅ Atualizado @babel/core: 7.20.0 → **7.25.0**
- ✅ Adicionado babel-preset-expo: **12.0.0**
- ✅ Atualizado babel.config.js para SDK 54

**⚠️ AÇÃO NECESSÁRIA:**
```bash
# 1. Limpar cache e reinstalar
npm cache clean --force
rm -rf node_modules package-lock.json

# 2. Instalar dependências atualizadas
npm install

# 3. Ajustar versões automaticamente
npx expo install --fix

# 4. Verificar problemas
npx expo-doctor

# 5. Limpar cache do Expo e iniciar
npx expo start -c
```

**Impacto:**
- Reduzido de 41 dependências para 21 dependências (48% de redução)
- Removidos 10 pacotes desnecessários
- Bundle size potencialmente reduzido
- Código mais limpo e mantível

**⚠️ AÇÃO NECESSÁRIA:**
```bash
# Executar para atualizar node_modules com as dependências corrigidas
npm install
```

**Próximos Passos:**
1. ✅ Executar `npm install` para aplicar correções de compatibilidade
2. ⏭️ Testar aplicação após limpeza
3. ⏭️ Iniciar Fase 2 (Segurança) - CRÍTICA - Próxima fase recomendada

**📋 Checklist para Testar:**
- [x] Ajustar versões de compatibilidade com Expo SDK 51
- [ ] Executar `npm install`
- [ ] Verificar se não há avisos de compatibilidade (`expo start`)
- [ ] Testar tela de Login (verificar se Switch funciona)
- [ ] Testar criação de usuário
- [ ] Testar listagem de tarefas na Home
- [ ] Verificar se não há erros no console

---

## 🚨 BLOQUEADORES E RISCOS

### Bloqueadores Atuais:
- Nenhum no momento ✅

### Riscos Identificados:
1. **Alta:** Credenciais Firebase expostas no código - ⚠️ PRÓXIMA PRIORIDADE
2. **Alta:** Senhas armazenadas em texto claro - ⚠️ PRÓXIMA PRIORIDADE
3. **Média:** Duplicação de sistemas de autenticação - ⚠️ PRÓXIMA PRIORIDADE
4. ~~**Baixa:** Dependências desnecessárias aumentando bundle size~~ - ✅ RESOLVIDO

---

## 📊 MÉTRICAS ACOMPANHADAS

| Métrica | Valor Antes | Valor Atual | Meta |
|---------|-------------|-------------|------|
| Dependências totais | 41 | 21 | < 25 |
| Dependências duplicadas | 2 | 0 | 0 |
| Dependências não utilizadas | 8 | 0 | 0 |
| Linhas no maior arquivo | 509 | 509 | < 150 |
| Cobertura de testes | 0% | 0% | > 70% |
| Componentes reutilizáveis | 0 | 0 | > 10 |

---

## 📚 RECURSOS E REFERÊNCIAS

- Arquivo de Análise Completa: `ANALISE_REFATORACAO.md`
- Arquivo de Estratégia: `ESTRATEGIA.md`
- Arquivo de Problemas: `PROBLEMAS.md` (se existir)

---

## ✅ CHECKLIST DE INÍCIO

Antes de começar qualquer refatoração:
- [ ] Fazer backup completo do código atual
- [ ] Criar branch `refactoring/main`
- [ ] Comunicar início da refatoração
- [ ] Configurar ambiente de desenvolvimento
- [ ] Garantir que app atual funciona corretamente

