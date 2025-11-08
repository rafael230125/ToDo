# 📱 ToDo App - Aplicativo de Gerenciamento de Tarefas

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

## 📋 Pré-requisitos

Antes de começar, você precisa ter instalado:

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (opcional, mas recomendado)
- [Git](https://git-scm.com/)
- Conta no [Firebase](https://firebase.google.com/) (para configuração do backend)

### Para desenvolvimento mobile:

- **Android**: 
  - [Android Studio](https://developer.android.com/studio) com Android SDK
  - Emulador Android ou dispositivo físico com USB debugging habilitado
  - [Expo Go](https://play.google.com/store/apps/details?id=host.exp.exponent) instalado no dispositivo

- **iOS** (apenas macOS):
  - [Xcode](https://developer.apple.com/xcode/) (versão mais recente)
  - [CocoaPods](https://cocoapods.org/)
  - Simulador iOS ou dispositivo físico
  - [Expo Go](https://apps.apple.com/app/expo-go/id982107779) instalado no dispositivo

## 🛠 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/todo-app.git
cd todo-app
```

### 2. Instale as dependências

```bash
npm install
```

ou com yarn:

```bash
yarn install
```

### 3. Configure o Firebase

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com/)
2. Ative o **Authentication** (Email/Password)
3. Crie um banco de dados **Firestore** em modo de produção
4. Copie o arquivo de exemplo de configuração:

```bash
cp config.json.example config.json
```

5. Edite o arquivo `config.json` e adicione suas credenciais do Firebase:

```json
{
  "apiKey": "sua-api-key",
  "authDomain": "seu-projeto.firebaseapp.com",
  "projectId": "seu-projeto-id",
  "storageBucket": "seu-projeto.appspot.com",
  "messagingSenderId": "seu-messaging-sender-id",
  "appId": "seu-app-id"
}
```

**⚠️ Importante**: O arquivo `config.json` está no `.gitignore` e não será commitado. Nunca compartilhe suas credenciais do Firebase publicamente.

### 4. Configure as permissões (Android)

Se você estiver desenvolvendo para Android, certifique-se de que as permissões necessárias estão configuradas no `app.config.js`:

- `READ_MEDIA_IMAGES` - Para acesso à galeria (opcional)
- `READ_MEDIA_AUDIO` - Necessário para expo-media-library

## 🚀 Executando o Projeto

### Modo Desenvolvimento (Recomendado)

1. **Inicie o servidor Expo**:

```bash
npm start
```

ou

```bash
npx expo start
```

2. **Escaneie o QR Code**:
   - **Android**: Abra o app Expo Go e escaneie o QR Code
   - **iOS**: Use a câmera do iPhone para escanear o QR Code

### Executar em plataforma específica

#### Android

```bash
npm run android
```

ou

```bash
npx expo start --android
```

#### iOS (apenas macOS)

```bash
npm run ios
```

ou

```bash
npx expo start --ios
```

#### Web

```bash
npm run web
```

ou

```bash
npx expo start --web
```

### Modo de Produção

Para gerar um build de produção:

```bash
# Android
npx expo build:android

# iOS (apenas macOS)
npx expo build:ios
```

Ou usando EAS Build (recomendado):

```bash
# Instalar EAS CLI
npm install -g eas-cli

# Login
eas login

# Configurar build
eas build:configure

# Criar build
eas build --platform android
eas build --platform ios
```

## 🧪 Executando Testes

### Instalar dependências de teste

```bash
npm install --save-dev jest @testing-library/react-native @testing-library/jest-native
```

### Executar testes

```bash
# Todos os testes
npm test

# Testes em modo watch
npm test -- --watch

# Testes com cobertura
npm test -- --coverage
```

### Estrutura de Testes

Os testes estão organizados em:

```
src/
├── __tests__/
│   ├── components/
│   ├── screens/
│   └── services/
```

## 📱 Funcionalidades

### CRUD Completo

- **Cadastrar**: Adicione novas tarefas, definindo título, descrição, data de inclusão, data de finalização, prioridade e status.
- **Alterar**: Edite os detalhes de qualquer tarefa a qualquer momento.
- **Excluir**: Remova tarefas que já não são mais necessárias.

### Filtros e Ordenação

- **Filtros** por Tipo de Tarefa: Pendente, Concluída
- **Ordenação**: Organize suas tarefas por data de vencimento ou prioridade (Alta, Média, Baixa)
- **Busca**: Pesquise tarefas por nome ou descrição

### Temas Personalizáveis

- Escolha entre um **Tema Claro** ou **Escuro** para adaptar o app ao seu gosto ou às condições de iluminação.
- Preferência salva automaticamente com AsyncStorage

### Autenticação

- Login com email e senha
- Cadastro de novos usuários
- Opção de salvar credenciais (apenas para preenchimento automático)
- Logout automático ao fechar o app

## 📊 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── common/         # Button, Input, Card, Modal
│   ├── tasks/          # TaskItem, TaskList, TaskFilter
│   └── layout/         # Header, SearchBar, NavBar
├── screens/             # Telas do app
│   ├── Home/           # HomeScreen com hooks
│   │   └── hooks/      # useHomeData, useHomeFilters
│   ├── Login/          # Tela de login
│   ├── NewUser/        # Tela de cadastro
│   ├── AddTask/        # Criar/Editar tarefa
│   └── Config/         # Configurações
├── services/            # Serviços Firebase
│   ├── authService.js
│   ├── taskService.js
│   ├── userService.js
│   ├── configService.js
│   └── firebaseConfig.js
├── hooks/               # Hooks customizados
│   ├── useAuth.js
│   ├── useTasks.js
│   ├── useFilter.js
│   └── useTheme.js
├── theme/               # Sistema de temas
│   ├── colors.js
│   ├── typography.js
│   ├── spacing.js
│   └── shadows.js
└── context/             # Contextos (Theme, Font)
    ├── ThemeContext.js
    └── FontContext.js
```

## 🐛 Solução de Problemas

### Erro ao iniciar o Expo

```bash
# Limpar cache
npx expo start -c

# Ou reinstalar dependências
rm -rf node_modules
npm install
```

### Erro de permissões no Android

Certifique-se de que as permissões estão corretas no `app.config.js` e execute:

```bash
npx expo prebuild --clean
```

### Erro do Firebase

Verifique se:
1. O arquivo `config.json` existe e está preenchido corretamente
2. O Firebase está configurado com Authentication (Email/Password)
3. O Firestore está criado e em modo de produção

### Problemas com fontes "pontilhadas"

Este é um problema conhecido do Android. O projeto já inclui correções com `includeFontPadding: false` nos estilos.

## 📝 Scripts Disponíveis

```bash
# Desenvolvimento
npm start              # Inicia o servidor Expo
npm run android        # Executa no Android
npm run ios            # Executa no iOS
npm run web            # Executa no navegador

# Testes
npm test               # Executa testes
npm test -- --watch    # Modo watch
npm test -- --coverage # Com cobertura

# Build
npx expo build:android # Build Android
npx expo build:ios     # Build iOS
```

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👨‍💻 Autor

Desenvolvido com ❤️ usando React Native e Expo

## 🔗 Links Úteis

- [Documentação Expo](https://docs.expo.dev/)
- [Documentação React Native](https://reactnative.dev/)
- [Documentação Firebase](https://firebase.google.com/docs)
- [React Navigation](https://reactnavigation.org/)

---

**Obrigado por utilizar o ToDo! Organize suas tarefas de forma simples e eficiente!** 🎉
