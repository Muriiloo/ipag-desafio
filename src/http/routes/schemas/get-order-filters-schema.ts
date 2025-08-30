import { z } from "zod";

export const getOrderFiltersSchema = {
  tags: ["Orders"],
  summary: "Listar pedidos com filtros opcionais",
  description: `
Lista todos os pedidos do sistema com possibilidade de aplicar filtros opcionais.

**Filtros disponíveis:**
- Status do pedido
- Email do cliente
- Número do pedido (busca parcial)
- Data de criação (intervalo)

**Paginação:**
- Página atual (padrão: 1)
- Limite de itens por página (padrão: 10)

**Ordenação:**
- Ordenado por data de criação (mais recente primeiro)
  `,
  querystring: z.object({
    //filtros opcionais
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
      .optional()
      .describe("Filtrar por status do pedido"),
    customer_email: z
      .string()
      .email()
      .optional()
      .describe("Filtrar por email do cliente (busca parcial)"),
    order_number: z
      .string()
      .optional()
      .describe("Filtrar por número do pedido (busca parcial)"),

    //filtros de data
    created_from: z
      .date()
      .optional()
      .describe("Data inicial para filtro de criação (ISO 8601)"),
    created_to: z
      .date()
      .optional()
      .describe("Data final para filtro de criação (ISO 8601)"),

    //paginação
    page: z
      .string()
      .optional()
      .default("1")
      .transform(Number)
      .describe("Número da página (padrão: 1)"),
    limit: z
      .string()
      .optional()
      .default("10")
      .transform(Number)
      .describe("Limite de itens por página (padrão: 10)"),
  }),

  response: {
    200: z.object({
      orders: z
        .array(
          z.object({
            order: z.object({
              id: z.string().uuid().describe("ID único do pedido"),
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
            }),
            customer: z.object({
              id: z.string().uuid().describe("ID único do cliente"),
              name: z.string().describe("Nome do cliente"),
              email: z.string().email().describe("Email do cliente"),
              phone: z.string().describe("Telefone do cliente"),
              document: z.string().describe("Documento do cliente"),
            }),
          })
        )
        .describe("Lista de pedidos encontrados"),
      pagination: z
        .object({
          page: z.number().describe("Página atual"),
          limit: z.number().describe("Limite de itens por página"),
          total: z.number().describe("Total de itens encontrados"),
          total_pages: z.number().describe("Total de páginas disponíveis"),
        })
        .describe("Informações de paginação"),
    }),
    400: z.object({
      error: z.string().describe("Erro de validação dos parâmetros"),
      details: z.any().optional().describe("Detalhes do erro de validação"),
    }),
    500: z.object({
      error: z.string().describe("Erro interno do servidor"),
    }),
  },
};
