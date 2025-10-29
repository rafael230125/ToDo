# 🔥 STATUS DA MIGRAÇÃO: SQLite → Firebase

## ✅ O QUE JÁ FOI FEITO

### 1. 📊 Estrutura de Dados Definida
Criei 3 coleções principais no Firebase:

```
Firestore
├── usuarios/
│   └── {uid} (documento com dados do usuário)
│       ├── tarefas/ (subcoleção)
│       │   └── {taskId}
│       └── config/ (subcoleção)
│           └── userConfig (apenas 1 documento)
```

### 2. 🔧 Serviços Criados
**Arquivo:** `src/services/firebaseService.js`

**Funções disponíveis:**
- ✅ `getCurrentUser()` - Busca usuário atual
- ✅ `saveUser()` - Salva/atualiza usuário
- ✅ `updateUserPhoto()` - Atualiza foto
- ✅ `getAllTasks()` - Lista tarefas com filtros
- ✅ `getTaskById()` - Busca tarefa específica
- ✅ `createTask()` - Cria nova tarefa
- ✅ `updateTask()` - Atualiza tarefa
- ✅ `deleteTask()` - Deleta tarefa
- ✅ `getUserConfig()` - Busca configurações
- ✅ `saveUserConfig()` - Salva configurações
- ✅ `searchTasks()` - Busca por texto
- ✅ `exportUserData()` - Exporta dados do usuário

### 3. 🔐 Configuração Firebase
**Arquivo:** `src/services/firebaseConfig.js`

**Melhorias:**
- ✅ Auth com persistência AsyncStorage
- ✅ Firebase Auth + Firestore configurados
- ✅ Exports de utilitários do Firestore

### 4. 📚 Documentação
- ✅ `MIGRACAO_FIREBASE.md` - Plano completo
- ✅ `AJUSTES.md` - Registro de progresso

---

## ⏳ PRÓXIMOS PASSOS

### Fase 2: Atualizar Telas (Importante!)

Preciso atualizar **5 telas** para usar Firebase ao invés de SQLite:

#### 1. `src/screens/NewUser.jsx` 🔴
**Mudanças:**
- ❌ Remover: `openDB()`, lógica SQLite
- ✅ Adicionar: `createUserWithEmailAndPassword()` do Firebase Auth
- ✅ Adicionar: `saveUser()` para salvar dados do usuário
- ✅ Salvar apenas: nome, email, dataNasc, foto

#### 2. `src/screens/LoginScreen.jsx` 🔴
**Mudanças:**
- ❌ Remover: `validarUsuario()` (função SQLite, linhas 38-66)
- ✅ Manter: `LoginUser()` (já usa Firebase)
- ✅ Adicionar: Buscar dados do usuário após login

#### 3. `src/screens/Home.jsx` 🔴
**Mudanças:**
- ❌ Remover: `openDB()`, queries SQL diretas
- ✅ Adicionar: `getAllTasks()`, `deleteTask()`
- ✅ Usar subcoleções: `usuarios/{uid}/tarefas`
- ✅ Filtrar no cliente: status, prioridade, busca por texto

#### 4. `src/screens/addToDo.jsx` 🟡
**Mudanças:**
- ❌ Remover: `openDB()`, SQL INSERT/UPDATE
- ✅ Adicionar: `createTask()`, `updateTask()`
- ✅ Adicionar: `getTaskById()` para edição

#### 5. `src/screens/Config.jsx` 🟡
**Mudanças:**
- ❌ Remover: `openDB()`, queries de config
- ✅ Adicionar: `getUserConfig()`, `saveUserConfig()`
- ✅ Usar subcoleção: `usuarios/{uid}/config`

#### 6. Remover `src/database/db.js` 🗑️
- Remover arquivo completamente
- Atualizar imports em todos os lugares

---

## 🎯 COMO CONTINUAR

### Opção A: Continuar Agora (Recomendado)
Você diz "continue" e eu atualizo todas as telas uma por uma.

### Opção B: Fazer Você Mesmo
Você usa `firebaseService.js` como referência e atualiza as telas manualmente.

### Opção C: Uma Tela Por Vez
Você escolhe qual tela começar e eu faço ela por vez.

---

## 📊 PROGRESSO

```
Estrutura:         [████████████████████] 100%
Serviços:          [████████████████████] 100%
Telas:             [░░░░░░░░░░░░░░░░░░░░]   0%
Limpeza:           [░░░░░░░░░░░░░░░░░░░░]   0%

TOTAL:             [██████░░░░░░░░░░░░░░]  33%
```

---

## 🚨 IMPORTANTE

⚠️ **Regras de Segurança do Firestore**

Você precisa configurar as regras de segurança no Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuários: só pode ler/escrever seu próprio documento
    match /usuarios/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Tarefas: só o dono pode acessar
      match /tarefas/{taskId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
      
      // Config: só o dono pode acessar
      match /config/{document=**} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

⚠️ **Desabilitar SQLite**
Após migração completa, remover:
- `src/database/db.js`
- Imports de `openDB`
- Pacote `expo-sqlite` (manter se quiser usar localmente)

---

## 💬 DECISÃO NECESSÁRIA

**Como quer prosseguir?**

1. ✅ **Eu continuo**: Diga "continue" e eu atualizo todas as telas
2. 🎯 **Você faz**: Você usa o código como referência
3. 🤝 **Juntos**: Fazemos uma tela por vez juntos

Qual opção você prefere?

