import z from "zod/v4";

export const updateOrderStatusSchema = {
  tags: ["Status"],
  summary: "Atualizar status do pedido",
  description: `
Atualiza o status de um pedido seguindo as regras de negócio estabelecidas.

**Regras aplicadas:**
- Status deve seguir sequência: pending → waiting_payment → paid → processing → shipped → delivered
- Cancelamento (canceled) é permitido em qualquer etapa, exceto delivered
- Pedidos entregues (delivered) não podem ter status alterado
- Status deve ser diferente do atual

**Notificações:**
- Toda mudança de status gera notificação automática via RabbitMQ
- Logs são registrados na tabela notification_logs

**Fluxo de estados válidos:**
\`\`\`
pending ──→ waiting_payment ──→ paid ──→ processing ──→ shipped ──→ delivered
   │              │               │           │            │
   └──────────────┴───────────────┴───────────┴────────────┴──→ canceled
\`\`\`
  `,
  params: z.object({
    id: z
      .string()
      .uuid("ID do pedido deve ser um UUID válido")
      .describe("ID único do pedido a ser atualizado"),
  }),
  body: z.object({
    status: z
      .enum([
        "pending",
        "waiting_payment",
        "paid",
        "processing",
        "shipped",
        "delivered",
        "canceled",
      ])
      .describe("Novo status a ser aplicado ao pedido"),
  }),
  response: {
    200: z.object({
      message: z.string().describe("Mensagem de sucesso"),
      order: z
        .object({
          id: z.string().uuid().describe("ID único do pedido"),
          customer_id: z.string().uuid().describe("ID do cliente"),
          order_number: z.string().describe("Número do pedido"),
          total_value: z.number().describe("Valor total do pedido"),
          status: z
            .enum([
              "pending",
              "waiting_payment",
              "paid",
              "processing",
              "shipped",
              "delivered",
              "canceled",
            ])
            .describe("Status atualizado do pedido"),
          created_at: z.date().describe("Data de criação"),
          updated_at: z.date().describe("Data da última atualização"),
        })
        .describe("Dados atualizados do pedido"),
    }),
    400: z.object({
      message: z.string().describe("Erro de validação de regra de negócio"),
      order: z
        .any()
        .optional()
        .describe("Dados do pedido (quando status não muda)"),
    }),
    404: z.object({
      error: z.string().describe("Pedido não encontrado"),
    }),
    500: z.object({
      error: z.string().describe("Erro interno do servidor"),
    }),
  },
};
