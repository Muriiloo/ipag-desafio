import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { customersTable, orderTable } from "../../db/schema.ts";
import { db } from "../../db/connection.ts";
import { eq, count, sum, gte } from "drizzle-orm";
import { getOrderSummarySchema } from "./schemas/get-order-summary-schema.ts";

export const getOrderSummaryRoute: FastifyPluginCallbackZod = (app) => {
  app.get(
    "/orders/summary",
    {
      schema: getOrderSummarySchema,
    },
    async (request, reply) => {
      try {
        //total de pedidos
        const totalOrders = await db
          .select({ count: count() })
          .from(orderTable);

        //total de valor dos pedidos
        const totalValue = await db
          .select({ total: sum(orderTable.total_value) })
          .from(orderTable);

        //contagem de pedidos por status
        const ordersByStatus = await db
          .select({
            status: orderTable.status,
            count: count(),
          })
          .from(orderTable)
          .groupBy(orderTable.status);

        //total de clientes únicos
        const uniqueCustomers = await db
          .select({ count: count(customersTable.id) })
          .from(orderTable)
          .innerJoin(
            customersTable,
            eq(orderTable.customer_id, customersTable.id)
          );

        //pedidos dos últimos 30 dias
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        //pedidos dos últimos 30 dias
        const recentOrders = await db
          .select({ count: count() })
          .from(orderTable)
          .where(gte(orderTable.created_at, thirtyDaysAgo));

        //valor médio dos pedidos
        const avgValueResult = await db
          .select({
            avg: sum(orderTable.total_value),
            count: count(),
          })
          .from(orderTable);

        //calcular valor médio dos pedidos
        const averageValue =
          avgValueResult[0].count > 0
            ? Number(avgValueResult[0].avg) / avgValueResult[0].count
            : 0;

        //formatar dados por status
        const statusSummary = ordersByStatus.reduce((acc, item) => {
          acc[item.status] = item.count;
          return acc;
        }, {} as Record<string, number>);

        //retornar resumo estatístico
        return reply.status(200).send({
          summary: {
            total_orders: totalOrders[0].count,
            total_value: Number(totalValue[0].total) || 0,
            average_order_value: Math.round(averageValue),
            unique_customers: uniqueCustomers[0].count,
            orders_last_30_days: recentOrders[0].count,
          },
          orders_by_status: {
            pending: statusSummary.pending || 0,
            waiting_payment: statusSummary.waiting_payment || 0,
            paid: statusSummary.paid || 0,
            processing: statusSummary.processing || 0,
            shipped: statusSummary.shipped || 0,
            delivered: statusSummary.delivered || 0,
            canceled: statusSummary.canceled || 0,
          },
        });
      } catch (error) {
        console.error(error);
        return reply.status(500).send({ error: "Internal server error" });
      }
    }
  );
};
