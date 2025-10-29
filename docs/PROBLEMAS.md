
## ⚠️ PROBLEMAS IDENTIFICADOS

### 1. 🏛️ ARQUITETURA E ESTRUTURA

#### 1.1 Arquivos Monolíticos
- **Arquivo Home.jsx**: 509 linhas (muito extenso)
  - Mistura lógica de negócio, UI, filtros e manipulação de dados
  - Viola o princípio de responsabilidade única
  - Dificulta manutenção e testes

#### 1.2 Falta de Separação de Responsabilidades
- Tela principal contém:
  - Lógica de busca/filtro
  - Manipulação de banco de dados
  - Gerenciamento de estado local
  - Renderização de UI
  - Handlers de eventos

#### 1.3 Duplicação de Código
```javascript
// Código duplicado para busca de tarefas em múltiplos lugares
const todasAsLinhas = await db.getAllAsync(
  `SELECT * FROM tarefas WHERE idUser = ? AND status = "Pendente"`,
  [id]
);
```

#### 1.4 Absence of Service Layer
- Não existe camada de serviços dedicada
- Acesso direto ao banco de dados nas telas
- Lógica de negócio misturada com componentes

### 2. 💾 GERENCIAMENTO DE DADOS

#### 2.1 Inconsistência entre Firebase e SQLite
- **LoginScreen.jsx (linha 24-36)**: Usa Firebase Auth
- **LoginScreen.jsx (linha 38-66)**: Valida via SQLite local
- Dois sistemas de autenticação rodando simultaneamente
- Risco de divergência de dados

#### 2.2 Falta de Camada de Abstração para DB
```javascript
// Acesso direto ao banco em múltiplos lugares
await db.getAllAsync(`SELECT * FROM tarefas WHERE idUser = ?`, [id])
```
- Sem reutilização
- Código acoplado ao SQLite
- Dificulta migração futura

#### 2.3 Query SQL Hardcoded
- Queries SQL espalhadas pelo código
- Difícil manutenção
- Risco de SQL injection
- Sem validação de dados

#### 2.4 Mistura de Tipos de Estado
- AsyncStorage para login persistente
- SQLite para dados principais
- Context API para tema/fonte
- Firebase para autenticação
- **4 sistemas diferentes de gerenciamento**

### 3. 🔐 SEGURANÇA

#### 3.1 Credenciais Expostas
```javascript
// firebaseConfig.js (linhas 8-15)
const firebaseConfig = {
  apiKey: "AIzaSyChh3kLFcckM2LKHW4Hq61B9LyKDvYx1Fg", // ❌ Hardcoded
  // ...
};
```
- Credenciais Firebase no código
- Risco de exposição se o repositório for público

#### 3.2 Armazenamento de Senhas em Texto Claro
```javascript
// db.js - Tabela usuario
senha TEXT NOT NULL, // ❌ Senha armazenada sem hash
```
- Senhas não criptografadas no banco local
- Grave problema de segurança

#### 3.3 SQL Injection Vulnerabilities
```javascript
// Exemplo de código vulnerável
await db.execAsync(`DELETE FROM tarefas WHERE id = $idTarefaSelecionada`, 
  {id: idTarefaSelecionada}
);
// ❌ Uso correto, mas falta validação de entrada
```

### 4. 📱 COMPONENTIZAÇÃO

#### 4.1 Falta de Componentes Reutilizáveis
- Estilos duplicados entre telas
- Lógica de UI repetida
- Sem biblioteca de componentes
- Exemplo: Input fields repetidos em todas as telas

#### 4.2 Estilos Inline e Duplicados
```javascript
// Estilos repetidos em múltiplos arquivos
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  // ...
});
// ❌ Criado em 5 arquivos diferentes
```

### 5. 🧪 TESTABILIDADE

#### 5.1 Ausência Total de Testes
- Zero testes unitários
- Zero testes de integração
- Sem mocks para dependências externas
- Impossível garantir qualidade

#### 5.2 Código Altamente Acoplado
- Componentes dependem diretamente de:
  - Contextos globais
  - Banco de dados
  - Navegação
  - Dificulta criação de testes isolados

### 6. 🔄 GERENCIAMENTO DE ESTADO

#### 6.1 Estado Desnecessário
```javascript
// Home.jsx - Estado que pode ser derivado
const [tarefasFiltradas, setTarefasFiltradas] = useState([]);
// ❌ Pode ser calculado a partir de 'tarefas' + filtros
```

#### 6.2 Múltiplos Re-renders Desnecessários
- Falta de useMemo/useCallback
- Estados relacionados não agrupados
- Callbacks recriados a cada render

### 7. 🐛 BUGS E INCONSISTÊNCIAS

#### 7.1 Função Concluidas() Chamada Incorretamente
```javascript
// Home.jsx linha 146
} else if (option === 'status') {
  Concluidas(); // ❌ Async function sem await
  // Não atualiza o estado corretamente
}
```

#### 7.2 Parâmetros de Rota Inconsistentes
```javascript
// Diferentes nomes para o mesmo parâmetro
route.params.id
route.params.idUsu
route.params.uid
// ❌ Dificulta manutenção
```

#### 7.3 Tela DetailScreen Não Implementada
```javascript
// DetailScreen.jsx - Apenas placeholder
export default function DetailsScreen() {
  return <Text>Details Screen</Text>;
}
```

### 8. 📦 DEPENDÊNCIAS

#### 8.1 Dependências Duplicadas
```json
// package.json
"@react-native-community/checkbox": "^0.5.17",
"react-native-checkbox": "^2.0.0",
// ❌ Duas bibliotecas para a mesma funcionalidade
```

#### 8.2 Dependências Não Utilizadas
- `react-native-masked-text`: Usada apenas em NewUser.jsx
- `tailwindcss-react-native`: Configurado mas não usado
- `todo: "file:"`: Dependência circular

### 9. 🎨 UI/UX

#### 9.1 Falta de Feedback de Carregamento
- Não há loading states
- Usuário não sabe se operação está processando
- Falta de mensagens de erro visuais

#### 9.2 Modo Tema Inconsistente
- Tema aplicado apenas parcialmente
- Alguns componentes ignoram isDarkTheme
- Textos com cor fixa não adaptam ao tema

#### 9.3 Navegação Confusa
- Comentários em português misturados com código
- Nomes de variáveis inconsistentes
- UI não padronizada entre telas

### 10. 📝 CÓDIGO E PADRÕES

#### 10.1 Nomenclatura Inconsistente
```javascript
// Múltiplas convenções
const [nomeUser, setUsuario] = useState(''); // ❌ Nome inconsistente
const [searchQuery, setSearchQuery] = useState(''); // ✅ Correto
```

#### 10.2 Código Comentado
```javascript
// Home.jsx linha 82
// const idUsuario = await AsyncStorage.getItem('idUser');
// ❌ Código comentado deve ser removido
```

#### 10.3 Console.logs em Produção
```javascript
// Múltiplos arquivos
console.log(firstRow.id);
console.log('Novo:', userId);
// ❌ Deve usar sistema de logging apropriado
```