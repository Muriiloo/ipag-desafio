import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import z from "zod/v4";
import { db } from "../../db/connection.ts";
import {
  customersTable,
  orderItemsTable,
  orderTable,
} from "../../db/schema.ts";
import { eq } from "drizzle-orm";

export const createOrderRoute: FastifyPluginCallbackZod = (app) => {
  app.post(
    "/order",
    {
      //validações de entrada
      schema: {
        body: z.object({
          customer: z.object({
            name: z.string().min(3, "Name must be at least 3 characters long"),
            document: z
              .string()
              .min(11, "Document must be at least 11 characters long"),
            email: z.email("Invalid email"),
            phone: z
              .string()
              .min(11, "Phone must be at least 11 characters long"),
          }),
          order: z.object({
            total_value: z.number().positive("Total value must be positive"),
            items: z
              .array(
                z.object({
                  product_name: z.string().min(1, "Product name is required"),
                  quantity: z
                    .number()
                    .int()
                    .positive("Quantity must be positive"),
                  unit_value: z
                    .number()
                    .positive("Unit value must be positive"),
                })
              )
              .min(1, "At least one item is required"),
          }),
        }),
      },
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
        return reply.status(500).send({ error: "Internal server error" });
      }
    }
  );
};
