import * as SQLite from 'expo-sqlite';

const DATABASE_NAME = 'todo';
let _db = null;

// SQL para criar a tabela e inserir uma entrada inicial
const SQL_CREATE_ENTRIES = `
CREATE TABLE IF NOT EXISTS tarefas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT,
  descricao TEXT,
  dataInicial TEXT,
  dataFinal TEXT,
  prioridade TEXT
);

INSERT INTO tarefas (nome, descricao, dataInicial, dataFinal, prioridade)
VALUES ('test1', '123', '10/11/2024', '10/11/2024', 'Baixa');
`;

// Função para abrir o banco de dados e executar o SQL de criação e inserção
export default function openDB() {
  if (!_db) {
    _db = SQLite.openDatabaseSync(DATABASE_NAME);
    _db.execAsync(SQL_CREATE_ENTRIES);
  }
  return _db;
}