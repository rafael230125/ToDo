# 🧪 GUIA DE TESTES - Migração SQLite → Firebase

## 📋 CHECKLIST COMPLETO DE TESTES

Execute os testes abaixo **na ordem** para verificar se tudo funciona corretamente.

---

## 🔐 1. AUTENTICAÇÃO E USUÁRIO

### ✅ Teste: Cadastrar Novo Usuário
1. Abra o app
2. Toque em "Registre-se"
3. Preencha todos os campos:
   - Nome: João Silva
   - Email: joao@exemplo.com
   - Data de nascimento: 01/01/1990
   - Senha: senha123
   - Confirmar senha: senha123
4. Toque em "Registrar"

**Resultado Esperado:**
- ✅ Loading aparece com "Registrando..."
- ✅ Mensagem de sucesso
- ✅ Volta para tela de login
- ✅ Usuário aparece no Firebase Console em Authentication

**Verificar Firebase Console:**
- Vá em Authentication → Users
- Deve aparecer o email cadastrado

---

### ✅ Teste: Login
1. Na tela de login
2. Digite: joao@exemplo.com
3. Digite: senha123
4. Toque em "Entrar"

**Resultado Esperado:**
- ✅ Loading aparece com "Entrando..."
- ✅ Vai para tela Home
- ✅ Mostra nome do usuário no topo

---

### ✅ Teste: Manter Conectado
1. Na tela de login
2. Ative o switch "Manter conectado?"
3. Faça login
4. Feche o app completamente
5. Abra o app novamente

**Resultado Esperado:**
- ✅ Vai direto para Home (sem login)
- ✅ Nome do usuário aparece

---

## 📝 2. TAREFAS

### ✅ Teste: Criar Nova Tarefa
1. Na tela Home, toque no botão "+" (amarelo no meio)
2. Preencha:
   - Nome: Estudar React
   - Descrição: Revisar hooks e state
   - Prioridade: Alta
   - Status: Pendente
   - Data Início: 01/01/2024
   - Data Final: 15/01/2024
3. Toque no botão "add" (amarelo)

**Resultado Esperado:**
- ✅ Toast "Tarefa salva com sucesso!"
- ✅ Volta para Home
- ✅ Tarefa aparece na lista
- ✅ Ícone de prioridade aparece (vermelho para Alta)

**Verificar Firebase Console:**
- Vá em Firestore Database
- Procure: usuarios → {seu-uid} → tarefas
- Deve ter um documento novo com a tarefa

---

### ✅ Teste: Buscar Tarefa
1. Na tela Home
2. Digite na busca: "Estudar"
3. Pressione Enter

**Resultado Esperado:**
- ✅ Mostra apenas tarefas com "Estudar" no nome ou descrição
- ✅ Lista filtra em tempo real

---

### ✅ Teste: Editar Tarefa
1. Na tela Home
2. Toque na tarefa para selecionar
3. Toque no ícone de editar (lápis)
4. Mude Status para "Concluída"
5. Toque no botão "edit" (amarelo)

**Resultado Esperado:**
- ✅ Toast "Tarefa editada com sucesso!"
- ✅ Volta para Home
- ✅ Tarefa editada aparece
- ✅ Status mudou para Concluída

---

### ✅ Teste: Filtrar por Status
1. Na tela Home
2. Toque no ícone de filtro (azul)
3. Toque em "Concluidas"

**Resultado Esperado:**
- ✅ Modal de filtros fecha
- ✅ Lista mostra apenas tarefas concluídas
- ✅ Filtro "Concluidas" fica destacado

---

### ✅ Teste: Filtrar por Prioridade
1. Na tela Home
2. Toque no ícone de filtro
3. Toque em "Prioridade"

**Resultado Esperado:**
- ✅ Lista ordenada: Alta, Média, Baixa
- ✅ Ícones de prioridade aparecem corretamente

---

### ✅ Teste: Filtrar por Data
1. Na tela Home
2. Toque no ícone de filtro
3. Toque em "Data final"

**Resultado Esperado:**
- ✅ Lista ordenada por data final
- ✅ Tarefas vencidas aparecem primeiro

---

### ✅ Teste: Excluir Tarefa
1. Na tela Home
2. Toque na tarefa para selecionar
3. Toque no ícone de lixeira (vermelho)
4. Toque em "Excluir" no Alert

**Resultado Esperado:**
- ✅ Alert de confirmação aparece
- ✅ Após confirmar, tarefa some da lista
- ✅ Toast "Tarefa excluída com sucesso!"

---

## ⚙️ 3. CONFIGURAÇÕES

### ✅ Teste: Mudar Tema
1. Na tela Home, toque no ícone de configurações (engrenagem)
2. Toque no switch "Tema Dark"
3. Toque em "Salvar Configurações"

**Resultado Esperado:**
- ✅ Tema muda para escuro
- ✅ Toast "Configurações salvas com sucesso!"
- ✅ Fundo fica #333
- ✅ Textos ficam brancos

**Verificar Firebase Console:**
- Vá em Firestore Database
- Procure: usuarios → {seu-uid} → config → userConfig
- Campo "tema" deve estar "true"

---

### ✅ Teste: Trocar Foto de Perfil
1. Na tela de Configurações
2. Toque na foto de perfil
3. Toque em "Carregar álbuns"
4. Selecione uma imagem
5. Toque em "Salvar imagem e voltar"

**Resultado Esperado:**
- ✅ Galeria abre
- ✅ Imagens aparecem
- ✅ Imagem selecionada fica destacada
- ✅ Toast "Imagem salva com sucesso!"
- ✅ Foto atualizada nas Configurações

---

### ✅ Teste: Notificações
1. Na tela de Configurações
2. Ative o switch "Permitir Notificações"
3. Toque em "Salvar Configurações"

**Resultado Esperado:**
- ✅ Switch ativa
- ✅ Configuração salva

---

### ✅ Teste: Tamanho da Fonte
1. Na tela de Configurações
2. Toque em "A+" (aumentar fonte)
3. Observe as mudanças
4. Toque em "A-" (diminuir fonte)

**Resultado Esperado:**
- ✅ Fonte aumenta/diminui
- ✅ Mudanças são visíveis em tempo real

---

## 🐛 CASOS DE ERRO

### ✅ Teste: Login com Senha Incorreta
1. Tente fazer login com senha errada
2. Observe o comportamento

**Resultado Esperado:**
- ✅ Alert de erro aparece
- ✅ "Erro: Senha incorreta"

---

### ✅ Teste: Cadastro sem Campos Obrigatórios
1. Vá em "Registre-se"
2. Tente registrar sem preencher campos

**Resultado Esperado:**
- ✅ Alert "Campos obrigatórios"
- ✅ Campos vazios ficam vermelhos

---

### ✅ Teste: Senhas Não Conferem
1. Vá em "Registre-se"
2. Digite senhas diferentes
3. Tente registrar

**Resultado Esperado:**
- ✅ Alert "Senhas não conferem!"
- ✅ Foco vai para campo de senha

---

### ✅ Teste: Tarefa sem Nome
1. Tente criar tarefa sem nome
2. Observe o comportamento

**Resultado Esperado:**
- ✅ Toast "Nome da tarefa é obrigatório!"

---

## ⚠️ VERIFICAÇÕES IMPORTANTES

### 🔍 No Firebase Console:

1. **Authentication**
   - ✅ Verificar se usuários aparecem
   - ✅ Verificar se emails estão corretos

2. **Firestore Database**
   - ✅ Verificar coleção `usuarios`
   - ✅ Verificar subcoleção `tarefas`
   - ✅ Verificar subcoleção `config`
   - ✅ Verificar se dados estão corretos

3. **Regras de Segurança**
   - ✅ Verificar se regras estão configuradas
   - ✅ Testar acesso com outro usuário (deve negar)

---

## 📊 MÉTRICAS DE SUCESSO

### ✅ Critérios de Aprovação:

- [ ] 100% dos fluxos principais funcionam
- [ ] Zero erros no console
- [ ] Dados persistem no Firebase
- [ ] Loading states aparecem
- [ ] Feedback visual adequado
- [ ] Regras de segurança ativas

---

## 🚨 PROBLEMAS CONHECIDOS

### ⚠️ Se aparecer erro de autenticação:
- Verificar credenciais em `firebaseConfig.js`
- Verificar se Firebase está habilitado no console

### ⚠️ Se dados não salvam:
- Verificar regras do Firestore (fora do escopo)
- Verificar conexão com internet
- Verificar console do navegador (Web) ou logs (mobile)

### ⚠️ Se foto não salva:
- Verificar permissão de galeria
- Verificar tamanho da imagem (pode estar muito grande)

---

## 📱 TESTAR EM DIFERENTES PLATAFORMAS

- [ ] Android (emulador ou físico)
- [ ] iOS (se disponível)
- [ ] Web (se configurado)

---

## 🎯 CONCLUSÃO DOS TESTES

Após completar todos os testes acima:

- ✅ Se 100% passou: Migração bem-sucedida!
- ⚠️ Se falhou algum: Ver erro específico e corrigir

**Documentar resultados:**
- Criar arquivo `TESTES_RESULTADOS.md`
- Anotar passou/falhou para cada teste
- Listar erros encontrados

---

**Boa sorte com os testes!** 🚀

