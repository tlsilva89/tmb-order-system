# 📦 TMB Order System

Sistema de gestão de pedidos baseado em arquitetura orientada a eventos (EDA). O projeto utiliza **.NET 10** no backend, **Next.js 15** no frontend e **Azure Service Bus** para mensageria, totalmente orquestrado via **Docker**.

## 🚀 Tecnologias

* **Backend:** .NET 10 (Preview), Entity Framework Core, Health Checks.
* **Frontend:** Next.js 16 (App Router), TailwindCSS v4.
* **Banco de Dados:** PostgreSQL.
* **Mensageria:** Azure Service Bus (Producer/Consumer).
* **Infraestrutura:** Docker & Docker Compose.
* **Testes:** xUnit + EF Core In-Memory.
* **Extra:** Módulo de IA/Analytics (Processamento de Linguagem Natural).

## ⚙️ Pré-requisitos

* Docker e Docker Compose instalados.
* (Opcional) .NET SDK 10 e Node.js 20 para desenvolvimento local.

## 🏃‍♂️ Como Rodar (Docker)

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/tmb-order-system.git
cd tmb-order-system
```

### 2. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto (`tmb-order-system/.env`):

```env
POSTGRES_USER=admin
POSTGRES_PASSWORD=adminpassword
POSTGRES_DB=tmb_orders_db
PGADMIN_DEFAULT_EMAIL=admin@tmb.com
PGADMIN_DEFAULT_PASSWORD=admin
# Deixe vazio para rodar em modo Mock (sem Azure), ou insira sua string de conexão real
AZURE_SERVICE_BUS_CONNECTION_STRING=
```

### 3. Suba a aplicação

```bash
docker compose up -d --build
```

### 4. Acesse os serviços

* **Frontend:** http://localhost:3000
* **API Swagger:** http://localhost:5080/swagger
* **PgAdmin:** http://localhost:5050

## 🧪 Como Rodar os Testes

Para executar os testes unitários do backend (validação de domínio e regras de negócio):

```bash
dotnet test
```

## 🏗️ Arquitetura

O sistema é composto por 3 serviços principais desacoplados:

### API (Tmb.Api):

* Recebe requisições HTTP (POST/GET).
* Salva o pedido no Postgres com status `Pending`.
* Envia um evento `OrderCreated` para a fila do Service Bus.
* Fornece endpoint de IA para processamento de perguntas em linguagem natural.

### Worker (Tmb.Worker):

* Consome a fila em background de forma assíncrona.
* Garante idempotência (não reprocessa pedidos já finalizados).
* Simula o processamento: `Pending` → `Processing` → (5s) → `Completed`.

### Frontend (tmb-frontend):

* Interface moderna em Next.js.
* Exibe listagem e detalhes com atualização em tempo real (Polling).
* Inclui Chatbot de Analytics integrado.

## 🧠 Módulo de IA (Bônus)

No topo da tela inicial, há uma barra de perguntas ("Pergunte aos seus dados"). Experimente:

* "Quantos pedidos pendentes?"
* "Qual o valor total vendido?"
* "Média dos pedidos?"

O sistema interpreta a intenção e converte em queries SQL seguras para responder em tempo real.

## 📂 Estrutura do Projeto

```
tmb-order-system/
├── src/
│   ├── backend/
│   │   ├── Tmb.Api/              # API REST (.NET 10)
│   │   ├── Tmb.Worker/           # Worker Service (.NET 10)
│   │   ├── Tmb.Shared/           # Models e DTOs compartilhados
│   │   └── Tmb.Api.Tests/        # Testes Unitários (xUnit)
│   └── frontend/                 # Aplicação Next.js 16
├── docker-compose.yml            # Orquestração dos serviços
├── .env                          # Variáveis de ambiente
└── README.md                     # Documentação
```

## 🛠️ Desenvolvimento Local (Sem Docker)

Caso precise rodar/debugar os serviços individualmente fora do container:

### Backend (API):

```bash
cd src/backend/Tmb.Api
dotnet run
```

### Worker:

```bash
cd src/backend/Tmb.Worker
dotnet run
```

### Frontend:

```bash
cd src/frontend
npm install
npm run dev
```

## 🐛 Troubleshooting

### 1. Erro de conexão com PostgreSQL:

* Verifique se o container está rodando: `docker ps`.
* Se rodar localmente (fora do Docker), altere a connection string no `appsettings.json` para `localhost` em vez de `postgres`.

### 2. Frontend não carrega ou dá erro de build:

Limpe o cache do Next.js e Docker:

```bash
docker compose down -v
docker compose up -d --build
```

### 3. Worker não processa mensagens:

* Verifique os logs: `docker logs tmb_worker`.
* Se não configurou a connection string do Azure no `.env`, o worker rodará em modo ocioso (apenas logando o aviso).

## 📝 Licença

Este projeto foi desenvolvido como Prova de Conceito (POC).
