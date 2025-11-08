# ⚡ Guia Rápido de Instalação

Este é um guia rápido para começar a usar o ToDo App em poucos minutos.

## 📋 Pré-requisitos Rápidos

- Node.js 18+ instalado
- Conta no Firebase (gratuita)
- Expo Go no celular (Android/iOS)

## 🚀 Instalação em 5 Passos

### 1. Clone e Instale

```bash
git clone <seu-repositorio>
cd todo-app
npm install
```

### 2. Configure o Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Crie um novo projeto
3. Ative **Authentication** → **Email/Password**
4. Crie um banco **Firestore** (modo produção)
5. Copie as credenciais do projeto

### 3. Configure o config.json

```bash
cp config.json.example config.json
```

Edite `config.json` com suas credenciais:

```json
{
  "firebase": {
    "apiKey": "sua-api-key",
    "authDomain": "seu-projeto.firebaseapp.com",
    "projectId": "seu-projeto-id",
    "storageBucket": "seu-projeto.appspot.com",
    "messagingSenderId": "seu-sender-id",
    "appId": "seu-app-id"
  }
}
```

### 4. Inicie o App

```bash
npm start
```

### 5. Escaneie o QR Code

- **Android**: Abra Expo Go → Escaneie QR Code
- **iOS**: Câmera → Toque na notificação → Abre no Expo Go

## ✅ Pronto!

Agora você pode:
- Criar uma conta
- Adicionar tarefas
- Usar filtros e busca
- Personalizar o tema

## 🐛 Problemas Comuns

### Erro: "Cannot find module"
```bash
rm -rf node_modules
npm install
```

### Erro: "Firebase not configured"
Verifique se o `config.json` existe e está preenchido corretamente.

### App não conecta
Certifique-se de que o celular e o computador estão na mesma rede Wi-Fi.

## 📚 Próximos Passos

- Leia o [README.md](README.md) completo
- Veja as [Sugestões de Interface](docs/SUGESTOES_INTERFACE.md)
- Execute os testes: `npm test`

---

**Dúvidas?** Abra uma issue no repositório!

