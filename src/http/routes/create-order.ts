import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { db } from "../../db/connection.ts";
import {
  customersTable,
  orderItemsTable,
  orderTable,
} from "../../db/schema.ts";
import { eq } from "drizzle-orm";
import { createOrderSchema } from "./schemas/create-order-schema.ts";

export const createOrderRoute: FastifyPluginCallbackZod = (app) => {
  app.post(
    "/order",
    {
      //validações de entrada
      schema: createOrderSchema,
    },
    async (request, reply) => {
      const { customer, order } = request.body;

      try {
        //verificar se o customer ja existe
        let customerExists = await db
          .select()
          .from(customersTable)
          .limit(1)
          .where(eq(customersTable.email, customer.email));

        //se nao existir, criar o customer
        if (customerExists.length === 0) {
          const newCustomer = await db
            .insert(customersTable)
            .values({
              name: customer.name,
              document: customer.document,
              email: customer.email,
              phone: customer.phone,
            })
            .returning();

          customerExists = newCustomer;
        }

        const customerId = customerExists[0].id;

        //gerar numero do pedido
        const orderNumber = `ORD-${Date.now()}`;

        //criar o pedido
        const newOrder = await db
          .insert(orderTable)
          .values({
            customer_id: customerId,
            order_number: orderNumber,
            total_value: order.total_value,
            status: "pending",
          })
          .returning();

        const orderId = newOrder[0].id;

        //criar itens do pedido
        const orderItems = await db
          .insert(orderItemsTable)
          .values(
            order.items.map((item) => ({
              order_id: orderId,
              product_name: item.product_name,
              quantity: item.quantity,
              unit_value: item.unit_value,
            }))
          )
          .returning();

        //retornar o id do pedido criado
        return reply.status(201).send({
          order: orderId,
        });
      } catch (error) {
        console.error(error);
        throw new Error("Internal server error");
      }
    }
  );
};
