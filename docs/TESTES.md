# 📋 Documentação de Testes

Este documento descreve os testes implementados no projeto ToDo App.

## 📚 Índice

- [Visão Geral](#visão-geral)
- [Configuração](#configuração)
- [Estrutura de Testes](#estrutura-de-testes)
- [Testes Implementados](#testes-implementados)
  - [Componentes](#componentes)
  - [Serviços](#serviços)
  - [Hooks](#hooks)
- [Executando os Testes](#executando-os-testes)
- [Cobertura de Código](#cobertura-de-código)
- [Mocks e Configurações](#mocks-e-configurações)
- [Próximos Passos](#próximos-passos)

---

## 🎯 Visão Geral

O projeto utiliza **Jest** como framework de testes e **React Native Testing Library** para testes de componentes React Native. Os testes estão organizados em uma estrutura modular seguindo as melhores práticas.

### Tecnologias Utilizadas

- **Jest** (v29.7.0) - Framework de testes
- **React Native Testing Library** (v12.4.3) - Utilitários para testes de componentes
- **Jest Expo** (v54.0.0) - Preset do Jest para projetos Expo
- **@testing-library/jest-native** (v5.4.3) - Matchers adicionais para React Native

---

## ⚙️ Configuração

### Arquivos de Configuração

#### `jest.config.js`
Configuração principal do Jest com:
- Preset `jest-expo` para compatibilidade com Expo
- Transformação de módulos React Native
- Configuração de cobertura de código
- Mapeamento de módulos

#### `jest.setup.js`
Configuração global executada antes de cada teste:
- Mocks do AsyncStorage
- Mocks do Expo Constants
- Mocks do React Navigation
- Mocks do Firebase (Auth e Firestore)
- Supressão de warnings do console durante testes

### Scripts NPM

```json
{
  "test": "jest",
  "test:watch": "jest --watch",
  "test:coverage": "jest --coverage"
}
```

---

## 📁 Estrutura de Testes

Os testes estão organizados na pasta `src/__tests__/` seguindo a estrutura do projeto:

```
src/
├── __tests__/
│   ├── components/
│   │   └── Header.test.jsx
│   ├── services/
│   │   └── taskService.test.js
│   └── hooks/
│       └── useTheme.test.js
├── components/
├── services/
└── hooks/
```

### Convenções de Nomenclatura

- Arquivos de teste: `*.test.js` ou `*.test.jsx`
- Localização: Mesma estrutura de pastas do código fonte
- Nome do arquivo: Mesmo nome do arquivo testado + `.test`

---

## 🧪 Testes Implementados

### 📦 Componentes

#### `Header.test.jsx`

Testa o componente `Header` que exibe informações do usuário e título do app.

**Testes Implementados:**

1. **Renderização com nome de usuário**
   - Verifica se o componente renderiza corretamente com um nome de usuário fornecido
   - Valida a exibição de "Olá,", nome do usuário e título "TO-DO"

2. **Nome padrão quando não fornecido**
   - Verifica se usa "Usuário" como nome padrão quando `userName` não é fornecido

3. **Truncamento de nomes longos**
   - Verifica se nomes muito longos são truncados corretamente
   - Valida as propriedades `numberOfLines={1}` e `ellipsizeMode="tail"`

4. **Título customizado**
   - Verifica se aceita e renderiza um título customizado via prop `appTitle`

**Cobertura:**
- ✅ Renderização básica
- ✅ Props e valores padrão
- ✅ Truncamento de texto
- ✅ Customização de título

---

### 🔧 Serviços

#### `taskService.test.js`

Testa o serviço de tarefas que gerencia operações CRUD no Firebase Firestore.

**Testes Implementados:**

1. **getAllTasks**
   - ✅ Retorna array vazio quando não há usuário autenticado
   - ⚠️ Retorna lista de tarefas quando há usuário autenticado (mock pendente)

2. **createTask**
   - ⚠️ Cria nova tarefa com dados válidos (mock pendente)

3. **updateTask**
   - ⚠️ Atualiza tarefa existente (mock pendente)

4. **deleteTask**
   - ⚠️ Deleta tarefa (mock pendente)

**Status:**
- ⚠️ Testes básicos implementados, mas mocks do Firebase precisam ser completados
- ✅ Estrutura de testes criada e pronta para expansão

**Mocks Configurados:**
- Firebase Auth (`auth.currentUser`)
- Firebase Firestore (`collection`, `getDocs`, `addDoc`, `updateDoc`, `deleteDoc`)

---

### 🎣 Hooks

#### `useTheme.test.js`

Testa o hook customizado `useTheme` que fornece acesso ao sistema de temas.

**Testes Implementados:**

1. **Tema claro por padrão**
   - Verifica se o tema padrão é claro (`isDarkTheme: false`)
   - Valida se todas as propriedades do tema estão definidas:
     - `colors`
     - `typography`
     - `spacing`

2. **Função toggleTheme**
   - Verifica se a função `toggleTheme` está disponível e é uma função

3. **Cores do tema**
   - Valida se as cores principais estão definidas:
     - `colors.primary`
     - `colors.background`
     - `colors.text`

**Cobertura:**
- ✅ Tema padrão
- ✅ Função de alternância
- ✅ Propriedades de cores
- ✅ Estrutura do objeto de tema

---

## 🚀 Executando os Testes

### Executar Todos os Testes

```bash
npm test
```

### Modo Watch (Reexecuta ao salvar arquivos)

```bash
npm run test:watch
```

### Com Cobertura de Código

```bash
npm run test:coverage
```

Isso gera um relatório de cobertura mostrando:
- Porcentagem de código testado
- Linhas cobertas/não cobertas
- Arquivos testados

### Executar Teste Específico

```bash
npm test -- Header.test.jsx
```

### Executar Testes de uma Pasta

```bash
npm test -- components/
```

---

## 📊 Cobertura de Código

### Configuração de Cobertura

O Jest está configurado para coletar cobertura de:
- Todos os arquivos `.js` e `.jsx` em `src/`
- Excluindo:
  - Arquivos de teste (`*.test.{js,jsx}`)
  - Pasta `__tests__`
  - Arquivos `index.js`

### Relatório de Cobertura

Após executar `npm run test:coverage`, o relatório será exibido no terminal e também gerado em:
- Terminal: Tabela resumida
- HTML: `coverage/lcov-report/index.html` (abrir no navegador)

### Metas de Cobertura

**Atual:**
- Componentes: ~60%
- Serviços: ~30% (mocks pendentes)
- Hooks: ~80%

**Recomendado:**
- Mínimo: 70% de cobertura geral
- Ideal: 80%+ de cobertura geral
- Crítico: 90%+ para serviços e hooks

---

## 🎭 Mocks e Configurações

### Mocks Implementados

#### AsyncStorage
```javascript
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);
```

#### Expo Constants
```javascript
jest.mock('expo-constants', () => ({
  default: {
    expoConfig: { extra: {} },
  },
}));
```

#### React Navigation
- `useNavigation`: Retorna funções mockadas (`navigate`, `goBack`, `replace`, `setOptions`)
- `useRoute`: Retorna objeto com `params` vazio
- `useFocusEffect`: Função mockada

#### Firebase Auth
- `getAuth`, `initializeAuth`, `getReactNativePersistence`
- `onAuthStateChanged`, `signInWithEmailAndPassword`
- `createUserWithEmailAndPassword`, `signOut`

#### Firebase Firestore
- `getFirestore`, `collection`, `getDocs`, `getDoc`
- `addDoc`, `updateDoc`, `deleteDoc`, `doc`
- `query`, `where`, `serverTimestamp`

### Console

Durante os testes, `console.warn` e `console.error` são suprimidos para manter a saída limpa.

---

## 📝 Próximos Passos

### Testes Prioritários a Implementar

#### Componentes
- [ ] `Button.test.jsx` - Testar componente de botão
- [ ] `Input.test.jsx` - Testar componente de input
- [ ] `TaskItem.test.jsx` - Testar item de tarefa
- [ ] `TaskList.test.jsx` - Testar lista de tarefas
- [ ] `NavBar.test.jsx` - Testar barra de navegação

#### Telas
- [ ] `Login.test.jsx` - Testar tela de login
- [ ] `Home.test.jsx` - Testar tela home
- [ ] `AddTask.test.jsx` - Testar tela de adicionar tarefa
- [ ] `Config.test.jsx` - Testar tela de configurações

#### Serviços
- [ ] Completar mocks do `taskService.test.js`
- [ ] `userService.test.js` - Testar serviço de usuário
- [ ] `authService.test.js` - Testar serviço de autenticação
- [ ] `configService.test.js` - Testar serviço de configurações
- [ ] `notificationService.test.js` - Testar serviço de notificações

#### Hooks
- [ ] `useTasks.test.js` - Testar hook de tarefas
- [ ] `useAuth.test.js` - Testar hook de autenticação
- [ ] `useHomeData.test.js` - Testar hook de dados do home
- [ ] `useHomeFilters.test.js` - Testar hook de filtros

### Melhorias Sugeridas

1. **Testes de Integração**
   - Testar fluxos completos (login → criar tarefa → editar → deletar)
   - Testar navegação entre telas

2. **Testes E2E**
   - Considerar adicionar Detox ou Maestro para testes end-to-end

3. **Testes de Performance**
   - Testar renderização de listas grandes
   - Testar otimizações de memória

4. **Testes de Acessibilidade**
   - Validar labels e roles
   - Testar navegação por teclado

5. **Snapshot Testing**
   - Adicionar snapshots para componentes críticos
   - Validar mudanças visuais não intencionais

---

## 📖 Recursos Adicionais

### Documentação Oficial

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
- [Jest Expo](https://github.com/expo/expo/tree/main/packages/jest-expo)

### Boas Práticas

1. **AAA Pattern** (Arrange, Act, Assert)
   ```javascript
   it('deve fazer algo', () => {
     // Arrange - Preparar
     const value = 'test';
     
     // Act - Executar
     const result = functionToTest(value);
     
     // Assert - Validar
     expect(result).toBe('expected');
   });
   ```

2. **Testes Isolados**
   - Cada teste deve ser independente
   - Usar `beforeEach` para resetar estado

3. **Nomes Descritivos**
   - Nomes de testes devem descrever o comportamento esperado
   - Usar formato: "deve [comportamento] quando [condição]"

4. **Mocks Apropriados**
   - Mock apenas o necessário
   - Manter mocks próximos aos testes quando possível

---

## ✅ Checklist de Qualidade

Antes de considerar um teste completo, verificar:

- [ ] Teste passa consistentemente
- [ ] Teste é isolado (não depende de outros)
- [ ] Nome do teste é descritivo
- [ ] Cobre casos de sucesso e erro
- [ ] Valida edge cases quando relevante
- [ ] Mocks estão configurados corretamente
- [ ] Não há console.logs ou código de debug
- [ ] Código do teste é legível e mantível

---

**Última atualização:** Dezembro 2024  
**Versão:** 1.0.0

