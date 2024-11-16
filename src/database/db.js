import * as SQLite from 'expo-sqlite';

const DATABASE_NAME = 'todo';
let _db = null;


// INSERT INTO tarefas (nome, descricao, dataInicial, dataFinal, prioridade)
// VALUES ('test1', '123', '10/11/2024', '10/11/2024', 'Baixa');

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

`;


const SQL_CREATE_usuarios = `
CREATE TABLE IF NOT EXISTS usuario (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  usuario TEXT NOT NULL,
  senha TEXT NOT NULL,
  dataNasc TEXT NOT NULL
);

`;

export default function openDB() {
  if (!_db) {
    _db = SQLite.openDatabaseSync(DATABASE_NAME);
    _db.execAsync(SQL_CREATE_ENTRIES);
    _db.execAsync(SQL_CREATE_usuarios);
  }
  return _db;
}