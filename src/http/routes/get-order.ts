import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import {
  customersTable,
  orderItemsTable,
  orderTable,
} from "../../db/schema.ts";
import { db } from "../../db/connection.ts";
import { eq } from "drizzle-orm";
import { getOrderSchema } from "./schemas/get-order-schema.ts";

export const getOrderRoute: FastifyPluginCallbackZod = (app) => {
  app.get(
    "/order/:id",
    {
      //validar os parametros da rota
      schema: getOrderSchema,
    },
    async (request, reply) => {
      try {
        //desestruturar o id da rota
        const { id } = request.params;

        //buscar o pedido no banco comparando com o id da rota
        const order = await db
          .select()
          .from(orderTable)
          .where(eq(orderTable.id, id))
          .limit(1);

        //se o pedido nao for encontrado, retornar erro 404
        if (order.length === 0) {
          return reply.status(404).send({ error: "Order not found" });
        }

        //buscar o customer do pedido
        const customer = await db
          .select()
          .from(customersTable)
          .where(eq(customersTable.id, order[0].customer_id))
          .limit(1);

        //se o customer nao for encontrado, retornar erro 404
        if (customer.length === 0) {
          return reply.status(404).send({ error: "Customer not found" });
        }

        //buscar os itens do pedido
        const orderItems = await db
          .select()
          .from(orderItemsTable)
          .where(eq(orderItemsTable.order_id, id));

        //retornar o pedido, o customer e os itens
        return reply
          .status(200)
          .send({ order: order[0], customer: customer[0], items: orderItems });
      } catch (error) {
        console.error(error);
        return reply.status(500).send({ error: "Internal server error" });
      }
    }
  );
};
