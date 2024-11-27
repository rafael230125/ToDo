import * as SQLite from 'expo-sqlite';

const DATABASE_NAME = 'todo';
let _db = null;



// SQL para criar a tabela e inserir uma entrada inicial
const SQL_CREATE_tarefas = `
CREATE TABLE IF NOT EXISTS tarefas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT,
  descricao TEXT,
  dataInicial TEXT,
  dataFinal TEXT,
  prioridade TEXT,
  status TEXT,
  idUser INTEGER
);

`;

const SQL_CREATE_usuarios = `
CREATE TABLE IF NOT EXISTS usuario (
  id TEXT NOT NULL,
  nome TEXT NOT NULL,
  usuario TEXT NOT NULL,
  senha TEXT NOT NULL,
  dataNasc TEXT NOT NULL,
  foto TEXT
);

`;

const SQL_CREATE_config = `
CREATE TABLE IF NOT EXISTS config (
  tema TEXT,
  logado TEXT ,
  notificacoes TEXT,
  idUser INTEGER
);
`;

const SQL_DELETE_Tables = `
  DROP TABLE IF EXISTS tarefas;
  DROP TABLE IF EXISTS usuario;
  
`;

export default function openDB() {
  if (!_db) {
    _db = SQLite.openDatabaseSync(DATABASE_NAME);
    _db.execAsync(SQL_CREATE_tarefas);
    _db.execAsync(SQL_CREATE_usuarios);
    _db.execAsync(SQL_CREATE_config);
    // _db.execAsync('DROP TABLE IF EXISTS config');
    // _db.execAsync(SQL_DELETE_Tables);
  }
  return _db;
}