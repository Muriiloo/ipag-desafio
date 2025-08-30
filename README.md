# 🚀 IPAG Desafio - Sistema de Gerenciamento de Pedidos

Sistema completo de gerenciamento de pedidos desenvolvido com **Node.js**, **TypeScript**, **PostgreSQL** e **RabbitMQ**, utilizando Docker para orquestração de containers.

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Setup e Execução](#-setup-e-execução)
- [Documentação da API](#-documentação-da-api)
- [Endpoints Disponíveis](#-endpoints-disponíveis)
- [Sistema de Filas](#-sistema-de-filas)
- [Decisões Técnicas](#-decisões-técnicas)
- [Regras de Negócio](#-regras-de-negócio)

## 🎯 Visão Geral

Este projeto implementa um sistema completo de gerenciamento de pedidos com as seguintes funcionalidades principais:

- **Criação de Pedidos**: Cadastro de clientes e pedidos com múltiplos itens
- **Consulta de Pedidos**: Busca por ID específico e listagem com filtros
- **Atualização de Status**: Mudança de status seguindo regras de negócio
- **Relatórios**: Resumos estatísticos e dashboards
- **Notificações**: Sistema assíncrono via RabbitMQ para notificações

## 🛠 Tecnologias Utilizadas

### Backend

- **Node.js 20+** - Runtime JavaScript
- **TypeScript** - Tipagem estática
- **Fastify** - Framework web performático
- **Drizzle ORM** - ORM TypeScript-first

### Banco de Dados

- **PostgreSQL 16** - Banco relacional principal
- **Drizzle Kit** - Migrations e gerenciamento de schema

### Mensageria

- **RabbitMQ** - Sistema de filas para notificações
- **amqplib** - Cliente RabbitMQ para Node.js

### Validação e Documentação

- **Zod** - Validação de schemas TypeScript
- **Swagger/OpenAPI** - Documentação automática da API

### Infraestrutura

- **Docker & Docker Compose** - Containerização e orquestração
- **dotenv** - Gerenciamento de variáveis de ambiente

## 📁 Estrutura do Projeto

```
├── docker-compose.yml          # Orquestração dos containers
├── drizzle.config.ts          # Configuração do Drizzle ORM
├── package.json               # Dependências e scripts
├── tsconfig.json             # Configuração TypeScript
├── docs/                     # Documentação do projeto
│   └── TASKS.md             # Lista de tarefas implementadas
└── src/
    ├── server.ts            # Entrada principal da aplicação
    ├── db/                  # Configuração do banco de dados
    │   ├── connection.ts    # Conexão com PostgreSQL
    │   ├── schema.ts        # Schema das tabelas
    │   └── migrations/      # Arquivos de migração
    ├── http/                # Camada HTTP da API
    │   ├── routes/          # Definição das rotas
    │   │   ├── create-order.ts
    │   │   ├── get-order.ts
    │   │   ├── get-order-filters.ts
    │   │   ├── get-order-summary.ts
    │   │   ├── update-order-status.ts
    │   │   └── schemas/     # Schemas de validação Zod
    │   └── helpers/         # Utilitários HTTP
    ├── queue/               # Sistema de filas RabbitMQ
    │   ├── connection.ts    # Conexão RabbitMQ
    │   ├── producer.ts      # Publicação de mensagens
    │   └── queues.ts        # Definição das filas
    └── worker/              # Worker para processamento assíncrono
        ├── worker.ts        # Entrada do worker
        ├── consumer.ts      # Consumidor de mensagens
        ├── process-order-status-update.ts
        └── helpers/         # Utilitários do worker
```

## 🚀 Setup e Execução

### Pré-requisitos

- **Docker** (versão 20.0+)
- **Docker Compose** (versão 2.0+)
- **Node.js** (versão 20.0+) - apenas para desenvolvimento local

### 1. Clone o Repositório

```bash
git clone https://github.com/seu-usuario/ipag-desafio.git
cd ipag-desafio
```

### 2. Configuração de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ipag_db

# RabbitMQ
RABBITMQ_URL=amqp://docker:docker@localhost:5672

# API
PORT=3333
```

### 3. Executar com Docker (Recomendado)

```bash
# Subir os serviços (PostgreSQL + RabbitMQ)
docker-compose up -d

# Instalar dependências
npm install

# Executar migrations do banco
npx drizzle-kit migrate

# Iniciar a API
npm run dev

# Em outro terminal, iniciar o Worker
npm run worker:dev
```

### 4. Verificar Serviços

- **API**: http://localhost:3333
- **Swagger UI**: http://localhost:3333/docs
- **RabbitMQ Management**: http://localhost:15672 (docker/docker)
- **PostgreSQL**: localhost:5432 (postgres/postgres)

### Scripts Disponíveis

```bash
npm run dev          # Inicia API em modo desenvolvimento
npm run start        # Inicia API em modo produção
npm run worker:dev   # Inicia Worker em modo desenvolvimento
```

## 📚 Documentação da API

A documentação completa da API está disponível via **Swagger UI** em:

- **URL**: http://localhost:3333/docs
- **Formato**: OpenAPI 3.0
- **Recursos**: Teste interativo de todos os endpoints

## 🔌 Endpoints Disponíveis

### 1. Health Check

```http
GET /health
```

Verifica se a API está funcionando.

**Resposta:**

```json
"OK"
```

### 2. Criar Pedido

```http
POST /order
```

Cria um novo pedido com cliente e itens.

**Body:**

```json
{
  "customer": {
    "name": "João Silva",
    "document": "12345678901",
    "email": "joao@email.com",
    "phone": "11999999999"
  },
  "order": {
    "total_value": 150000,
    "items": [
      {
        "product_name": "Produto A",
        "quantity": 2,
        "unit_value": 75000
      }
    ]
  }
}
```

**Resposta (201):**

```json
{
  "order": "550e8400-e29b-41d4-a716-446655440000"
}
```

### 3. Buscar Pedido por ID

```http
GET /order/{id}
```

Retorna detalhes completos de um pedido específico.

**Resposta (200):**

```json
{
  "order": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "customer_id": "123e4567-e89b-12d3-a456-426614174000",
    "order_number": "ORD-1703001234567",
    "total_value": 150000,
    "status": "pending",
    "created_at": "2023-12-19T10:30:00Z",
    "updated_at": "2023-12-19T10:30:00Z"
  },
  "customer": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "João Silva",
    "document": "12345678901",
    "email": "joao@email.com",
    "phone": "11999999999",
    "created_at": "2023-12-19T10:30:00Z"
  },
  "items": [
    {
      "id": "789e0123-e45f-67g8-h901-234567890123",
      "order_id": "550e8400-e29b-41d4-a716-446655440000",
      "product_name": "Produto A",
      "quantity": 2,
      "unit_value": 75000
    }
  ]
}
```

### 4. Listar Pedidos com Filtros

```http
GET /orders
```

Lista pedidos com filtros opcionais e paginação.

**Query Parameters:**

- `status` (opcional): pending, waiting_payment, paid, processing, shipped, delivered, canceled
- `customer_email` (opcional): Email do cliente (busca parcial)
- `order_number` (opcional): Número do pedido (busca parcial)
- `created_from` (opcional): Data inicial (ISO 8601)
- `created_to` (opcional): Data final (ISO 8601)
- `page` (opcional): Número da página (padrão: 1)
- `limit` (opcional): Itens por página (padrão: 10)

**Exemplo:**

```http
GET /orders?status=paid&page=1&limit=5
```

**Resposta (200):**

```json
{
  "orders": [
    {
      "order": {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "order_number": "ORD-1703001234567",
        "total_value": 150000,
        "status": "paid",
        "created_at": "2023-12-19T10:30:00Z",
        "updated_at": "2023-12-19T11:45:00Z"
      },
      "customer": {
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "name": "João Silva",
        "email": "joao@email.com",
        "phone": "11999999999",
        "document": "12345678901"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 5,
    "total": 25,
    "total_pages": 5
  }
}
```

### 5. Atualizar Status do Pedido

```http
PUT /order/{id}/status
```

Atualiza o status de um pedido seguindo regras de negócio.

**Body:**

```json
{
  "status": "waiting_payment"
}
```

**Resposta (200):**

```json
{
  "message": "Order status updated",
  "order": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "customer_id": "123e4567-e89b-12d3-a456-426614174000",
    "order_number": "ORD-1703001234567",
    "total_value": 150000,
    "status": "waiting_payment",
    "created_at": "2023-12-19T10:30:00Z",
    "updated_at": "2023-12-19T12:00:00Z"
  }
}
```

### 6. Resumo Estatístico

```http
GET /orders/summary
```

Retorna estatísticas completas do sistema.

**Resposta (200):**

```json
{
  "summary": {
    "total_orders": 150,
    "total_value": 2250000,
    "average_order_value": 15000,
    "unique_customers": 85,
    "orders_last_30_days": 42
  },
  "orders_by_status": {
    "pending": 10,
    "waiting_payment": 15,
    "paid": 25,
    "processing": 20,
    "shipped": 18,
    "delivered": 55,
    "canceled": 7
  }
}
```

## 🔄 Sistema de Filas

### RabbitMQ Configuration

O projeto utiliza RabbitMQ para processamento assíncrono de notificações:

- **Fila**: `order_status_updates`
- **Tipo**: Direct Exchange
- **Durável**: Sim
- **Auto-delete**: Não

### Fluxo de Notificações

1. **Trigger**: Atualização de status via `PUT /order/{id}/status`
2. **Publisher**: API publica mensagem na fila
3. **Consumer**: Worker processa mensagem
4. **Persistência**: Log salvo em `notification_logs`
5. **Simulação**: Log da notificação ao cliente

### Estrutura da Mensagem

```json
{
  "order_id": "550e8400-e29b-41d4-a716-446655440000",
  "old_status": "pending",
  "new_status": "waiting_payment",
  "timestamp": "2023-12-19T12:00:00.000Z",
  "user_id": "system"
}
```

## 🏗 Decisões Técnicas

### 1. **Node.js com TypeScript**

- **Motivação**: Type safety, melhor DX, menos bugs em runtime
- **Benefício**: Autocompletar, refactoring seguro, documentação viva

### 2. **Fastify Framework**

- **Motivação**: Performance superior ao Express, built-in validation
- **Benefício**: Schema-based validation, serialização otimizada, plugins

### 3. **Drizzle ORM**

- **Motivação**: TypeScript-first, type-safe queries, performance
- **Benefício**: Migrations automáticas, schema como código, zero overhead

### 4. **Zod para Validação**

- **Motivação**: Runtime validation + TypeScript inference
- **Benefício**: Schemas reutilizáveis, error handling, documentation

### 5. **RabbitMQ para Mensageria**

- **Motivação**: Reliability, persistence, message acknowledgment
- **Benefício**: Guaranteed delivery, scalability, error handling

### 6. **Docker Compose**

- **Motivação**: Environment consistency, easy setup, service isolation
- **Benefício**: Zero configuration databases, reproducible environments

### 7. **Padrão Repository/Service**

- **Motivação**: Separation of concerns, testability
- **Benefício**: Business logic isolation, easier testing, maintainability

### 8. **Status como Enum no DB**

- **Motivação**: Data integrity, performance, consistency
- **Benefício**: DB-level validation, indexed queries, type safety

## 📋 Regras de Negócio

### Status Workflow

O sistema implementa um workflow rigoroso para mudanças de status:

```
pending → waiting_payment → paid → processing → shipped → delivered
   │              │           │          │          │
   └──────────────┴───────────┴──────────┴──────────┴─→ canceled
```

### Regras Implementadas

1. **Sequência Obrigatória**: Status deve seguir ordem lógica
2. **Cancelamento Flexível**: Permitido em qualquer etapa (exceto delivered)
3. **Delivered Final**: Pedidos entregues não podem mudar status
4. **Validação de Transição**: Transitions inválidas retornam erro 400
5. **Notificação Automática**: Toda mudança gera notificação via RabbitMQ

### Validações de Entrada

- **Customer**: Nome mínimo 3 chars, documento/telefone 11 chars, email válido
- **Order**: Valor positivo, pelo menos 1 item
- **Items**: Nome obrigatório, quantidade positiva, valor unitário positivo
- **UUID**: Todos os IDs validados como UUID v4

### Tratamento de Erros

- **400**: Bad Request (validação, regra de negócio)
- **404**: Resource não encontrado
- **500**: Erro interno (database, network)
- **Logs**: Todos erros logados com timestamp

---

## 🚀 Como Testar

### 1. Teste Manual via Swagger

Acesse http://localhost:3333/docs e teste todos os endpoints interativamente.

### 2. Teste de Fluxo Completo

```bash
# 1. Criar pedido
curl -X POST http://localhost:3333/order \
  -H "Content-Type: application/json" \
  -d '{
    "customer": {
      "name": "João Silva",
      "document": "12345678901",
      "email": "joao@test.com",
      "phone": "11999999999"
    },
    "order": {
      "total_value": 100000,
      "items": [
        {
          "product_name": "Produto Teste",
          "quantity": 1,
          "unit_value": 100000
        }
      ]
    }
  }'

# 2. Buscar pedido (use o ID retornado)
curl http://localhost:3333/order/{ORDER_ID}

# 3. Atualizar status
curl -X PUT http://localhost:3333/order/{ORDER_ID}/status \
  -H "Content-Type: application/json" \
  -d '{"status": "waiting_payment"}'

# 4. Listar pedidos
curl http://localhost:3333/orders

# 5. Ver resumo
curl http://localhost:3333/orders/summary
```

### 3. Verificar Worker

Monitore os logs do worker para ver o processamento das notificações:

```bash
# Logs do worker
docker-compose logs -f worker
```

---

**Desenvolvido como parte do desafio técnico IPAG** 🚀
