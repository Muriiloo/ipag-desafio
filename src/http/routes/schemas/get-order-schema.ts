import { z } from "zod";

export const getOrderSchema = {
  tags: ["Orders"],
  summary: "Buscar pedido por ID",
  description: `
Retorna os detalhes completos de um pedido específico.

**Informações incluídas:**
- Dados completos do pedido (ID, número, valor, status, datas)
- Informações do cliente associado
- Lista de todos os itens do pedido

**Útil para:**
- Visualizar detalhes de um pedido específico
- Confirmar informações antes de processar
- Exibir dados completos em interfaces de usuário
  `,
  params: z.object({
    id: z
      .string()
      .uuid("ID do pedido deve ser um UUID válido")
      .describe("ID único do pedido a ser consultado"),
  }),
  response: {
    200: z.object({
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
            .describe("Status atual do pedido"),
          created_at: z.date().describe("Data de criação"),
          updated_at: z.date().describe("Data da última atualização"),
        })
        .describe("Dados do pedido"),
      customer: z
        .object({
          id: z.string().uuid().describe("ID único do cliente"),
          name: z.string().describe("Nome completo do cliente"),
          document: z.string().describe("Documento do cliente"),
          email: z.string().email().describe("Email do cliente"),
          phone: z.string().describe("Telefone do cliente"),
          created_at: z.date().describe("Data de cadastro do cliente"),
        })
        .describe("Dados do cliente"),
      items: z
        .array(
          z.object({
            id: z.string().uuid().describe("ID único do item"),
            order_id: z.string().uuid().describe("ID do pedido"),
            product_name: z.string().describe("Nome do produto"),
            quantity: z.number().int().positive().describe("Quantidade"),
            unit_value: z.number().positive().describe("Valor unitário"),
          })
        )
        .describe("Lista de itens do pedido"),
    }),
    404: z.object({
      error: z.string().describe("Pedido ou cliente não encontrado"),
    }),
    400: z.object({
      error: z.string().describe("ID do pedido inválido (deve ser UUID)"),
    }),
    500: z.object({
      error: z.string().describe("Erro interno do servidor"),
    }),
  },
};
