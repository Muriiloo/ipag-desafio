import { z } from "zod";

export const getOrderSummarySchema = {
  tags: ["Summary"],
  summary: "Obter resumo estatístico dos pedidos",
  description: `
Retorna um resumo completo com estatísticas dos pedidos do sistema.

**Informações incluídas:**
- Total de pedidos cadastrados
- Valor total de todos os pedidos
- Valor médio por pedido
- Número de clientes únicos
- Pedidos dos últimos 30 dias
- Contagem de pedidos agrupados por status

**Útil para:**
- Dashboards administrativos
- Relatórios gerenciais
- Métricas de negócio
- Análise de performance
  `,
  response: {
    200: z.object({
      summary: z
        .object({
          total_orders: z.number().describe("Total de pedidos cadastrados"),
          total_value: z.number().describe("Valor total de todos os pedidos"),
          average_order_value: z
            .number()
            .describe("Valor médio por pedido (arredondado)"),
          unique_customers: z.number().describe("Número de clientes únicos"),
          orders_last_30_days: z
            .number()
            .describe("Pedidos criados nos últimos 30 dias"),
        })
        .describe("Resumo geral das estatísticas"),
      orders_by_status: z
        .object({
          pending: z.number().describe("Pedidos pendentes"),
          waiting_payment: z.number().describe("Pedidos aguardando pagamento"),
          paid: z.number().describe("Pedidos pagos"),
          processing: z.number().describe("Pedidos em processamento"),
          shipped: z.number().describe("Pedidos enviados"),
          delivered: z.number().describe("Pedidos entregues"),
          canceled: z.number().describe("Pedidos cancelados"),
        })
        .describe("Contagem de pedidos agrupados por status"),
    }),
    500: z.object({
      error: z.string().describe("Erro interno do servidor"),
    }),
  },
};
