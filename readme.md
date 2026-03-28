# LeBank

Aplicação Full Stack simulando um banco digital com autenticação JWT, gestão de conta e movimentações financeiras (depósito, saque e transferência).

<img border="0" data-original-height="1080" data-original-width="1920" height="600" src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgfn28Gq-4Pl_kIN-viI9Etx00WZkkuRjL43c5ee7RCVJMDt5GqNPPrJx9vLOrg9Km184qL_3dEThmsw6hidXU9bxHF0xmsKD_FAAdDPDDfVcked23LNy806-WUrjT-spvl4G3xNzH-9VnnMLLQIsHzz47ZCLd-fSzhpDWggZ5p6igNfmORl4-43gi_HkXk/s1920/2.jpg" width="1280" />

## Stack utilizada

### Backend
- Python 3
- Flask
- Flask-JWT-Extended
- Flask-SQLAlchemy
- SQLAlchemy + psycopg2

### Frontend
- React 19
- TypeScript
- Vite
- Tailwind
- Axios

### Infra
- Docker + Docker Compose (banco de dados)

## Estrutura do projeto

```text
lebank/
├── backend/
│   ├── run.py
│   └── app/
│       ├── controllers/
│       ├── routes/
│       ├── services/
│       ├── models/
│       ├── database/
│       └── config/
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   └── pages/
│   └── package.json
├── docker-compose.yml
└── requirements.txt
```

## Funcionalidades

- Cadastro de usuário com criação automática de conta.
- Login e logout com autenticação via JWT.
- Consulta dos dados do usuário autenticado.
- Consulta da conta do usuário (`/my-account`).
- Criação de transações:
	- `deposit`
	- `withdrawal`
	- `transfer`
- Listagem de transações por conta.
- Frontend com rotas protegidas (`/` e `/transactions`).

## Pré-requisitos

- Python 3.10+
- Node.js 20+
- npm 10+
- Docker Desktop (para subir o PostgreSQL)

## Configuração de ambiente

No backend, o projeto usa as variáveis abaixo (com defaults já definidos no código):

- `SECRET_KEY` (default: `sua-secret-key`)
- `DATABASE_URL` (default: `postgresql://admin:admin@localhost:5433/lebank`)

Você pode criar um arquivo `backend/.env` com:

```env
SECRET_KEY=sua-secret-key
DATABASE_URL=postgresql://admin:admin@localhost:5433/lebank
```

## Como rodar o projeto

### 1) Subir banco de dados (PostgreSQL)

Na raiz do projeto:

```bash
docker compose up -d
```

Banco ficará disponível em `localhost:5433`.

### 2) Rodar backend

```bash
cd backend
python -m venv .venv
```

Ativar venv:

- Windows (PowerShell):

```bash
.venv\Scripts\Activate.ps1
```

- Windows (CMD):

```bash
.venv\Scripts\activate.bat
```

Instalar dependências:

```bash
pip install -r ..\requirements.txt
```

Iniciar API:

```bash
python run.py
```

API em: `http://127.0.0.1:5000`

### 3) Rodar frontend

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend em: `http://localhost:5173`

## Endpoints principais da API

Base URL: `http://127.0.0.1:5000`

### Auth

- `POST /registrar`
- `POST /login`
- `POST /logout` (JWT)
- `GET /me` (JWT)
- `GET /user/<user_id>`

### Conta

- `GET /my-account` (JWT)

### Transações

- `GET /get-transaction/<account_id>` (JWT)
- `POST /criar-transaction` (JWT)

Payload esperado para criar transação:

```json
{
	"account_id": 1,
	"transaction_type": "deposit",
	"amount": 100.0,
	"target_account_id": 2
}
```

`transaction_type` aceita: `deposit`, `withdrawal`, `transfer`.

> Observação: `target_account_id` é obrigatório quando `transaction_type` for `transfer`.

## Rotas do frontend

- Públicas:
	- `/login`
	- `/registrar`
- Privadas:
	- `/`
	- `/transactions`

## Scripts úteis (frontend)

```bash
npm run dev      # desenvolvimento
npm run build    # build de produção
npm run preview  # preview do build
npm run lint     # lint
```

## CORS

O backend está configurado para aceitar requisições de:

- `http://localhost:5173`

## Observações

- As tabelas são criadas automaticamente na inicialização do backend (`db.create_all()`).
- Tokens revogados são armazenados em memória (`set`), portanto são resetados ao reiniciar a API.
