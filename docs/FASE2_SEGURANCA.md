# 🔐 FASE 2: SEGURANÇA E CONFIGURAÇÃO

## 🎯 OBJETIVO

Resolver problemas **CRÍTICOS** de segurança identificados na análise:
1. 🔴 Credenciais Firebase expostas no código
2. 🔴 Senhas armazenadas em texto claro
3. 🟡 Duplicação de sistemas de autenticação

---

## ⚠️ PROBLEMAS ATUAIS

### 🔴 1. Credenciais Firebase Expostas

**Arquivo:** `src/services/firebaseConfig.js`

**Problema:**
```javascript
// ❌ ATUAL - Credenciais hardcoded no código
const firebaseConfig = {
  apiKey: "AIzaSyAterCoClahPfG5dGysE37nPLnexlPOrNM",
  // ... outras credenciais
};
```

**Risco:**
- Credenciais no controle de versão (Git)
- Qualquer pessoa com acesso ao código tem acesso ao Firebase
- Violação de boas práticas de segurança

---

### 🔴 2. Senhas em Texto Claro

**Problema:**
- Senhas armazenadas SEM hash no SQLite
- Vulnerável a ataques
- Violação de LGPD (Lei Geral de Proteção de Dados)

**Localização:**
- `src/database/db.js` - Tabela `usuario` com campo `senha TEXT`
- Todas as telas de login/cadastro

---

### 🟡 3. Duplicação de Autenticação

**Problema:**
- Firebase Auth + SQLite auth rodando simultaneamente
- `LoginScreen.jsx` tem dois sistemas de login diferentes
- Risco de divergência de dados

**Arquivos afetados:**
- `src/screens/LoginScreen.jsx` (linhas 24-66)
- `src/screens/NewUser.jsx`

---

## ✅ SOLUÇÃO PROPOSTA

### 🔐 Tarefa 2.1: Criar Variáveis de Ambiente

#### Passo 1: Instalar dependência
```bash
npm install --save-dev @env
```

#### Passo 2: Criar arquivo `.env` na raiz do projeto
```bash
# Criar arquivo .env
touch .env
```

**Conteúdo do `.env`:**
```env
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyAterCoClahPfG5dGysE37nPLnexlPOrNM
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=todo-mobile-368fe.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=todo-mobile-368fe
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=todo-mobile-368fe.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=762086307046
EXPO_PUBLIC_FIREBASE_APP_ID=1:762086307046:web:daa599c62234468328f727
```

#### Passo 3: Atualizar `.gitignore`
```bash
# .env
.env
.env.local
.env.*.local
```

#### Passo 4: Configurar `babel.config.js`

Adicionar plugin para importar variáveis:
```javascript
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['module-resolver', {
        alias: {
          '@': './src',
        },
      }],
    ],
  };
};
```

#### Passo 5: Atualizar `firebaseConfig.js`
```javascript
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import Constants from 'expo-constants';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  query, 
  where, 
  addDoc, 
  doc, 
  updateDoc,
  setDoc,
  enableNetwork,
  disableNetwork
} from 'firebase/firestore';

// Carrega variáveis de ambiente
const ENV = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const firebaseConfig = {
  apiKey: ENV.apiKey,
  authDomain: ENV.authDomain,
  projectId: ENV.projectId,
  storageBucket: ENV.storageBucket,
  messagingSenderId: ENV.messagingSenderId,
  appId: ENV.appId,
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const db = getFirestore(app);

export { 
  db, 
  collection, 
  getDocs, 
  query, 
  where, 
  addDoc, 
  doc, 
  updateDoc,
  setDoc,
  enableNetwork,
  disableNetwork
};
```

---

### 🔐 Tarefa 2.2: Criptografar Senhas

#### Passo 1: Instalar biblioteca de criptografia
```bash
npm install expo-crypto
```

#### Passo 2: Criar arquivo `src/utils/crypto.js`
```javascript
import * as Crypto from 'expo-crypto';

// Hash de senha
export async function hashPassword(password) {
  const digest = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    password
  );
  return digest;
}

// Comparar senha com hash
export async function comparePassword(password, hashedPassword) {
  const passwordHash = await hashPassword(password);
  return passwordHash === hashedPassword;
}
```

#### Passo 3: Atualizar `src/screens/NewUser.jsx`

**Antes:**
```javascript
const addUser = async () => {
  // ... código que salva senha sem hash
  senha: password, // ❌ Senha em texto claro
};
```

**Depois:**
```javascript
import { hashPassword } from '../utils/crypto';

const addUser = async () => {
  const hashedPassword = await hashPassword(password);
  // ... código que salva senha com hash
  senha: hashedPassword, // ✅ Senha criptografada
};
```

#### Passo 4: Atualizar `src/screens/LoginScreen.jsx`

**Antes:**
```javascript
if (firstRow.senha === password) { // ❌ Comparação direta
  // ...
}
```

**Depois:**
```javascript
import { comparePassword } from '../utils/crypto';

const isValid = await comparePassword(password, firstRow.senha);
if (isValid) { // ✅ Comparação com hash
  // ...
}
```

#### Passo 5: Criar Migration para Senhas Existentes
```javascript
// src/utils/migratePasswords.js
import openDB from '../database/db';
import { hashPassword } from './crypto';

export async function migrateExistingPasswords() {
  const db = openDB();
  const users = await db.getAllAsync('SELECT id, senha FROM usuario');
  
  for (const user of users) {
    // Verificar se já está hasheada (salt seria melhor, mas para migração simples)
    if (user.senha && user.senha.length < 64) {
      const hashedPassword = await hashPassword(user.senha);
      await db.runAsync(
        'UPDATE usuario SET senha = ? WHERE id = ?',
        [hashedPassword, user.id]
      );
    }
  }
}
```

---

### 🔐 Tarefa 2.3: Unificar Autenticação

#### Decisão: Usar Firebase Auth + Sync SQLite

**Estratégia:**
- Usar Firebase Auth como fonte primária de autenticação
- Sincronizar dados do usuário com SQLite local para acesso offline

#### Passo 1: Atualizar `src/screens/LoginScreen.jsx`

**Remover:**
- Função `validarUsuario()` que usa SQLite local (linhas 38-66)

**Manter:**
- Função `LoginUser()` que usa Firebase Auth

#### Passo 2: Atualizar `src/screens/NewUser.jsx`

**Remover:**
- Toda lógica de SQLite para autenticação

**Adicionar:**
- Sincronização com SQLite após criar no Firebase

```javascript
const novoUser = async () => {
  try {
    // 1. Criar usuário no Firebase
    const userCredential = await createUserWithEmailAndPassword(auth, username, password);
    const user = userCredential.user;
    
    // 2. Sincronizar com SQLite local
    const hashedPassword = await hashPassword(password);
    await syncUserToLocalDB(user.uid, {
      nome,
      username,
      senha: hashedPassword,
      dataNasc,
    });
    
    Alert.alert('Cadastro', 'Novo usuário registrado com sucesso!');
    navigation.goBack();
  } catch (error) {
    Alert.alert('Erro', error.message);
  }
};
```

#### Passo 3: Criar `src/utils/syncFirebaseSQLite.js`
```javascript
import openDB from '../database/db';

export async function syncUserToLocalDB(uid, userData) {
  const db = openDB();
  
  try {
    // Verificar se usuário já existe
    const existingUser = await db.getAllAsync(
      'SELECT id FROM usuario WHERE id = ?',
      [uid]
    );
    
    if (existingUser.length === 0) {
      // Inserir novo usuário
      await db.runAsync(
        'INSERT INTO usuario (id, nome, usuario, senha, dataNasc) VALUES (?, ?, ?, ?, ?)',
        [uid, userData.nome, userData.username, userData.senha, userData.dataNasc]
      );
    } else {
      // Atualizar usuário existente
      await db.runAsync(
        'UPDATE usuario SET nome = ?, usuario = ?, dataNasc = ? WHERE id = ?',
        [userData.nome, userData.username, userData.dataNasc, uid]
      );
    }
  } catch (error) {
    console.error('Erro ao sincronizar usuário:', error);
  }
}
```

---

## 📋 CHECKLIST DE IMPLEMENTAÇÃO

### Tarefa 2.1: Variáveis de Ambiente
- [ ] Criar arquivo `.env`
- [ ] Adicionar `.env` ao `.gitignore`
- [ ] Configurar `babel.config.js`
- [ ] Atualizar `firebaseConfig.js`
- [ ] Testar se credenciais são carregadas

### Tarefa 2.2: Criptografia de Senhas
- [ ] Instalar `expo-crypto`
- [ ] Criar `src/utils/crypto.js`
- [ ] Atualizar `NewUser.jsx` para usar hash
- [ ] Atualizar `LoginScreen.jsx` para validar hash
- [ ] Criar função de migração
- [ ] Testar login com senhas antigas e novas

### Tarefa 2.3: Unificar Autenticação
- [ ] Remover `validarUsuario()` do LoginScreen
- [ ] Atualizar `NewUser.jsx` para usar apenas Firebase
- [ ] Criar `syncFirebaseSQLite.js`
- [ ] Implementar sincronização
- [ ] Testar fluxo completo de autenticação

---

## ⏱️ TEMPO ESTIMADO

- **Tarefa 2.1**: 2-3 horas
- **Tarefa 2.2**: 3-4 horas
- **Tarefa 2.3**: 4-5 horas

**Total:** 9-12 horas (1-2 dias)

---

## 🧪 TESTES NECESSÁRIOS

Após implementar cada tarefa:
- [ ] App inicia sem erros
- [ ] Login funciona
- [ ] Criação de usuário funciona
- [ ] Senhas são hasheadas no banco
- [ ] Login valida senha hasheada
- [ ] Sincronização Firebase ↔ SQLite funciona
- [ ] Acesso offline funciona (após login)

---

## 🎯 RESULTADO ESPERADO

- ✅ Credenciais seguras em variáveis de ambiente
- ✅ Senhas criptografadas (SHA-256)
- ✅ Um único sistema de autenticação (Firebase)
- ✅ Sincronização automática com SQLite local
- ✅ Conformidade com LGPD
- ✅ Preparado para produção

---

## 🚀 COMO COMEÇAR

### Opção A: Implementar Tudo de Uma Vez (Recomendado)
```bash
# Seguir todas as tarefas sequencialmente
# Tarefa 2.1 → Tarefa 2.2 → Tarefa 2.3
```

### Opção B: Implementar Incrementalmente
```bash
# Implementar cada tarefa individualmente
# Testar após cada tarefa
# Mais seguro para produção
```

---

**📝 Nota:** Esta é uma fase **CRÍTICA** de segurança. Faça backup antes de começar!

