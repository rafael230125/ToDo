# 🔥 MIGRAÇÃO COMPLETA: SQLite → Firebase Firestore

## 🎯 OBJETIVO

Descontinuar completamente o SQLite e migrar **100% dos dados** para o Firebase Firestore.

---

## 📊 ESTRUTURA DE COLEÇÕES

### 📁 Coleção: `usuarios`

```javascript
{
  id: "string",              // UID do Firebase Auth (document ID)
  nome: "string",
  email: "string",           // username
  dataNasc: "string",
  foto: "string",            // Base64 ou URL
  createdAt: "timestamp",
  updatedAt: "timestamp"
}
```

**Regras:**
- Document ID = UID do usuário (Firebase Auth)
- Senhas NÃO armazenadas (usar Firebase Auth)

---

### 📁 Coleção: `usuarios/{uid}/tarefas`

```javascript
{
  id: "string",              // Auto-generated
  nome: "string",
  descricao: "string",
  dataInicial: "string",
  dataFinal: "string",
  prioridade: "string",      // "Alta" | "Média" | "Baixa"
  status: "string",          // "Pendente" | "Concluída"
  createdAt: "timestamp",
  updatedAt: "timestamp"
}
```

**Regras:**
- Subcoleção de cada usuário
- Queries sempre filtradas por `uid`
- Ordenação por data de criação

---

### 📁 Coleção: `usuarios/{uid}/config`

```javascript
{
  id: "string",              // Auto-generated (apenas 1 por usuário)
  tema: "string",           // "true" ou "false" (dark theme)
  logado: "string",         // "true" ou "false"
  notificacoes: "string",   // "true" ou "false"
  fontSize: "number",       // Tamanho da fonte
  updatedAt: "timestamp"
}
```

**Regras:**
- Subcoleção de cada usuário
- Apenas 1 documento por usuário
- Sempre sobrescrever (setDoc)

---

## 🔧 ESTRUTURA DE ARQUIVOS

### Arquivos a SER REMOVIDOS:
- ❌ `src/database/db.js`
- ❌ Toda referência a SQLite

### Arquivos a SER CRIADOS:
- ✅ `src/services/firebaseService.js` - Serviços Firestore
- ✅ `src/utils/authUtils.js` - Utilitários de autenticação

### Arquivos a SER ATUALIZADOS:
- ✅ `src/screens/LoginScreen.jsx`
- ✅ `src/screens/NewUser.jsx`
- ✅ `src/screens/Home.jsx`
- ✅ `src/screens/addToDo.jsx`
- ✅ `src/screens/Config.jsx`
- ✅ `src/screens/Galeria.jsx`

---

## 📋 CHECKLIST DE MIGRAÇÃO

### Fase 1: Preparação
- [ ] Criar serviços Firebase
- [ ] Configurar regras de segurança do Firestore
- [ ] Testar conexão com Firebase

### Fase 2: Migração de Usuários
- [ ] Atualizar NewUser.jsx
- [ ] Remover senhas do Firestore (usar Auth)
- [ ] Atualizar LoginScreen.jsx
- [ ] Testar fluxo de autenticação

### Fase 3: Migração de Tarefas
- [ ] Criar serviço de tarefas
- [ ] Atualizar Home.jsx
- [ ] Atualizar addToDo.jsx
- [ ] Testar CRUD de tarefas

### Fase 4: Migração de Configurações
- [ ] Atualizar Config.jsx
- [ ] Sincronizar com Firestore
- [ ] Testar persistência de configurações

### Fase 5: Limpeza
- [ ] Remover db.js
- [ ] Remover importações de SQLite
- [ ] Atualizar package.json
- [ ] Testar app completo

---

## ⏱️ TEMPO ESTIMADO

**Total:** 4-6 horas

- Fase 1: 30 min
- Fase 2: 1-2 horas
- Fase 3: 2-3 horas
- Fase 4: 1 hora
- Fase 5: 30 min

---

## 🚨 IMPORTANTE

⚠️ **Backup:** Fazer backup do código atual antes de começar
⚠️ **Testes:** Testar cada fase antes de prosseguir
⚠️ **Dados:** Usuários precisam criar novas contas (sem migração de dados)

