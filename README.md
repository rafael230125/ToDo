# ToDo - README

## Apresentação do projeto Slides:
 ``` 
    https://www.canva.com/design/DAGXakI3RUs/AAe6R3RIdwpE_GTo5Ajikg/edit?utm_content=DAGXakI3RUs&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton
 ```

## 💻 Sobre o Projeto

**ToDo** é um aplicativo mobile desenvolvido para ajudá-lo a organizar e priorizar suas tarefas diárias de maneira simples e eficiente. Com um design minimalista e arquitetura moderna, ele permite que você cadastre, altere, exclua tarefas com sincronização em nuvem. O app oferece customização completa de tema (claro/escuro), notificações e múltiplos filtros para organizar suas atividades.

## ✨ Versão Atual

**v2.0.0** - Refatoração Completa

### O que mudou
- 🔥 **Migração para Firebase**: Sincronização em nuvem e backup automático
- 🎨 **Nova Arquitetura**: Componentes reutilizáveis e hooks customizados
- ⚡ **Performance**: Lazy loading, React.memo e otimizações de renderização
- 🔒 **Segurança**: Variáveis de ambiente e autenticação Firebase
- 📱 **UX Melhorada**: Interface mais responsiva e intuitiva

## 🚀 Tecnologias Utilizadas

- **Front-End**: React Native com Expo (SDK 54)
- **Back-End**: Firebase Firestore (cloud database)
- **Autenticação**: Firebase Auth
- **Estado**: React Hooks customizados
- **Navegação**: React Navigation
- **Armazenamento**: AsyncStorage para persistência local

## 🛠 Funcionalidades

O aplicativo **ToDo** oferece uma gama de funcionalidades para facilitar o gerenciamento das suas tarefas:

### CRUD Completo

- **Cadastrar**: Adicione novas tarefas, definindo título, descrição, data de inclusão, data de finalização, prioridade e status.
- **Alterar**: Edite os detalhes de qualquer tarefa a qualquer momento.
- **Excluir**: Remova tarefas que já não são mais necessárias.
  
### Alertas e Lembretes

- Receba notificações para alertá-lo sobre o vencimento das suas tarefas, principalmente aquelas com maior prioridade.

### Filtros e Ordenação

- **Filtros** por Tipo de Tarefa: Pendente, Concluída, Excluída.
- **Ordenação**: Organize suas tarefas por data de vencimento ou prioridade (Alta, Média, Baixa).

### Extra

- **Sincronização com o calendário**: Integração para importar ou exportar eventos de tarefas com o calendário do dispositivo.

### Temas Personalizáveis

- Escolha entre um **Tema Claro** ou **Escuro** para adaptar o app ao seu gosto ou às condições de iluminação.

## 📱 Telas do App

### Tela de Primeira Instalação

- Tela inicial onde o usuário define o seu **nome** e escolhe as configurações iniciais (como o tema claro ou escuro).

### Tela Principal

- Exibe a **listagem das ToDos**.
- Permite a aplicação de filtros (por status ou prioridade).
- Funcionalidade de **visualizar**, **editar** ou **excluir** tarefas.
- Opções rápidas de navegação para acessar as tarefas pendentes ou concluídas.

### Tela de Cadastro e Alteração de Tarefa

- **Campos**: Título, Descrição, Data de Inclusão, Data de Finalização.
- **Prioridade**: Alta, Média, Baixa.
- **Status**: Pendente, Concluída, Excluída.

### Tela de Configuração

- **Personalização de Tema**: Escolha entre os modos claro ou escuro.
- **Notificações**: Configure os lembretes, principalmente para tarefas com alta prioridade.

## 📦 Como Rodar o Projeto

1. **Clone o repositório**:
    ```bash
    git clone https://github.com/seu-usuario/todo-app.git
    ```

2. **Instale as dependências**:
    ```bash
    npm install
    ```

3. **Configure o Firebase**:
   - Renomeie `app.json.example` para `app.json` (se existir)
   - Edite `app.json` e adicione suas credenciais do Firebase na seção `extra`
   - Ou edite `src/services/firebaseConfig.js` diretamente

4. **Inicie o projeto**:
    ```bash
    npx expo start
    ```

5. **Escaneie o QR Code** com o app Expo Go (Android) ou Camera (iOS)

## 📊 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── common/         # Button, Input, Card, Modal
│   ├── tasks/          # TaskItem, TaskList, TaskFilter
│   └── layout/         # Header, SearchBar, NavBar
├── screens/             # Telas do app
│   └── Home/           # HomeScreen refatorada
│       └── hooks/      # Hooks de lógica de negócio
├── services/            # Serviços Firebase
│   ├── authService.js
│   ├── taskService.js
│   ├── userService.js
│   └── configService.js
├── repositories/        # Repository Pattern
│   ├── baseRepository.js
│   ├── taskRepository.js
│   └── userRepository.js
├── hooks/               # Hooks customizados
│   ├── useAuth.js
│   ├── useTasks.js
│   ├── useFilter.js
│   └── useTheme.js
├── theme/               # Sistema de temas
│   ├── colors.js
│   ├── typography.js
│   └── spacing.js
└── context/             # Contextos (Theme, Font)
```

## 🎯 Funcionalidades Implementadas

### ✅ v2.0.0 - Refatoração Completa

- [x] Migração SQLite → Firebase
- [x] Componentes modulares (21 componentes)
- [x] Hooks customizados (6 hooks)
- [x] Repository Pattern
- [x] Sistema de temas centralizado
- [x] Lazy loading de telas
- [x] React.memo para performance
- [x] Variáveis de ambiente
- [x] Autenticação Firebase
---
Obrigado por utilizar o **ToDo**! Organize suas tarefas de forma simples e eficiente!
