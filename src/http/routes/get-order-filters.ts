import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import z from "zod/v4";
import { customersTable, orderTable } from "../../db/schema.ts";
import { db } from "../../db/connection.ts";
import { eq, and, gte, lte, ilike, desc } from "drizzle-orm";

export const getOrderFiltersRoute: FastifyPluginCallbackZod = (app) => {
  app.get(
    "/orders",
    {
      //validações de entrada
      schema: {
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
            .optional(),
          customer_email: z.string().email().optional(),
          order_number: z.string().optional(),

          //filtros de data
          created_from: z.string().datetime().optional(),
          created_to: z.string().datetime().optional(),

          //paginação
          page: z.string().optional().default("1").transform(Number),
          limit: z.string().optional().default("10").transform(Number),
        }),
      },
    },
    async (request, reply) => {
      try {
        //desestruturar os filtros da query
        const {
          status,
          customer_email,
          order_number,
          created_from,
          created_to,
          page,
          limit,
        } = request.query;

        //construir condições do WHERE
        const conditions = [];

        //filtro por status
        if (status) {
          conditions.push(eq(orderTable.status, status));
        }

        //filtro por número do pedido
        if (order_number) {
          conditions.push(ilike(orderTable.order_number, `%${order_number}%`));
        }

        //filtro por email do customer
        if (customer_email) {
          conditions.push(ilike(customersTable.email, `%${customer_email}%`));
        }

        //filtro por data de criação
        if (created_from) {
          conditions.push(gte(orderTable.created_at, new Date(created_from)));
        }

        if (created_to) {
          conditions.push(lte(orderTable.created_at, new Date(created_to)));
        }

        //calcular offset para paginação
        const offset = (page - 1) * limit;

        //construir query base
        const baseQuery = db
          .select({
            order_id: orderTable.id,
            order_number: orderTable.order_number,
            total_value: orderTable.total_value,
            status: orderTable.status,
            created_at: orderTable.created_at,
            updated_at: orderTable.updated_at,
            customer_id: customersTable.id,
            customer_name: customersTable.name,
            customer_email: customersTable.email,
            customer_phone: customersTable.phone,
            customer_document: customersTable.document,
          })
          .from(orderTable)
          .innerJoin(
            customersTable,
            eq(orderTable.customer_id, customersTable.id)
          );

        //executar consulta final
        const orders = await (conditions.length > 0
          ? baseQuery
              .where(and(...conditions))
              .orderBy(desc(orderTable.created_at))
              .limit(limit)
              .offset(offset)
          : baseQuery
              .orderBy(desc(orderTable.created_at))
              .limit(limit)
              .offset(offset));

        //contar total para paginação
        const countQuery = db
          .select()
          .from(orderTable)
          .innerJoin(
            customersTable,
            eq(orderTable.customer_id, customersTable.id)
          );

        const totalResult = await (conditions.length > 0
          ? countQuery.where(and(...conditions))
          : countQuery);

        const total = totalResult.length;

        //formatar resposta
        const formattedOrders = orders.map((order) => ({
          order: {
            id: order.order_id,
            order_number: order.order_number,
            total_value: order.total_value,
            status: order.status,
            created_at: order.created_at,
            updated_at: order.updated_at,
          },
          customer: {
            id: order.customer_id,
            name: order.customer_name,
            email: order.customer_email,
            phone: order.customer_phone,
            document: order.customer_document,
          },
        }));

        //retornar pedidos com paginação
        return reply.status(200).send({
          orders: formattedOrders,
          pagination: {
            page,
            limit,
            total,
            //calcular total de páginas
            total_pages: Math.ceil(total / limit),
          },
        });
      } catch (error) {
        console.error(error);
        return reply.status(500).send({ error: "Internal server error" });
      }
    }
  );
};
