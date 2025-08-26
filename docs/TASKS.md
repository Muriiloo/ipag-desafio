# Lista de Tasks

📌 Etapa 1 – Preparação do Ambiente

- [ ] Configurar estrutura inicial do projeto.
- [ ] Criar Dockerfile para aplicação
- [ ] Configurar docker-compose.yml com PostgreSQL, RabbitMQ, API.
- [ ] Testar ambiente inicial com containers rodando corretamente
      ⏱️ Estimativa: 3h

  📌 Etapa 2 – Modelagem do Banco de Dados

- [ ] Definir entidades e relacionamentos
- [ ] Criar migrations para as tabelas: customers, orders, order_items, notification_logs.
- [ ] Testar conexão com banco no container
      ⏱️ Estimativa: 4h

  📌 Etapa 3 – Implementação da API (CRUD Pedidos)

- [ ] Implementar POST /orders (criação de pedido com cliente + itens)
- [ ] Implementar GET /orders/{id} (consulta pedido específico)
- [ ] Implementar GET /orders (listar pedidos, com filtros opcionais)
- [ ] Implementar GET /orders/summary (resumo estatístico dos pedidos)
- [ ] Implementar PUT /orders/{id}/status (atualização de status)
- [ ] Adicionar validações de entrada (customer, order, items)
      ⏱️ Estimativa: 8h

📌 Etapa 4 – Integração com RabbitMQ

- [ ] Configurar conexão com RabbitMQ
- [ ] Criar publisher para enviar mensagem na fila order_status_updates ao atualizar status
- [ ] Criar Worker (consumer) para consumir mensagens da fila
- [ ] Implementar persistência em notification_logs
- [ ] Implementar logs simulando envio de notificação ao cliente
      ⏱️ Estimativa: 6h

📌 Etapa 5 – Regras de Negócio de Status

- [ ] Garantir transições válidas (PENDING → WAITING_PAYMENT → … → DELIVERED)
- [ ] Bloquear cancelamento de pedidos já entregues
- [ ] Validar que status só avança sequencialmente (exceto cancelamento)
- [ ] Garantir que toda mudança de status gera notificação no RabbitMQ
      ⏱️ Estimativa: 3h

📌 Etapa 6 – Documentação

- [ ] Criar README.md explicando o projeto: estrutura, setup com docker, endpoints com exemplos, decisões técnicas e como rodar API e o Worker
- [ ] Documentar com Swagger
      ⏱️ Estimativa: 3h
