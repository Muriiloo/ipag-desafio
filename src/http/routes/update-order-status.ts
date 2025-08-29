import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import z from "zod/v4";
import { db } from "../../db/connection.ts";
import { orderTable } from "../../db/schema.ts";
import { eq } from "drizzle-orm";
import { connectRabbitMQ } from "../../queue/connection.ts";
import { publishOrderStatusUpdate } from "../../queue/producer.ts";
import { isValidStatusTransition } from "../helpers/order-status-validation.ts";

export const updateOrderStatusRoute: FastifyPluginCallbackZod = (app) => {
  app.put(
    "/order/:id/status",
    {
      schema: {
        //validar o id do pedido
        params: z.object({
          id: z.uuid("Invalid order id"),
        }),
        //validar o status do pedido
        body: z.object({
          status: z.enum(
            [
              "pending",
              "waiting_payment",
              "paid",
              "processing",
              "shipped",
              "delivered",
              "canceled",
            ],
            "Invalid status"
          ),
        }),
      },
    },
    async (request, reply) => {
      try {
        //desestruturar o id e o status da rota
        const { id } = request.params;
        const { status } = request.body;

        //buscar o pedido no banco comparando com o id da rota
        const currentOrder = await db
          .select()
          .from(orderTable)
          .where(eq(orderTable.id, id))
          .limit(1);

        //se o pedido nao for encontrado, retornar erro 404
        if (currentOrder.length === 0) {
          return reply.status(404).send({ error: "Order not found" });
        }

        //armazena o pedido e o status atual
        const order = currentOrder[0];
        const orderStatus = order.status;

        //se o status atual for o mesmo do status da rota, retornar erro 400
        if (orderStatus === status) {
          return reply.status(400).send({ message: "Status unchanged", order });
        }

        if (orderStatus === "delivered") {
          return reply.status(400).send({ message: "Order already delivered" });
        }

        if (!isValidStatusTransition(orderStatus, status)) {
          return reply
            .status(400)
            .send({ message: "Invalid status transition" });
        }

        //atualizar o status do pedido
        const updatedOrder = await db
          .update(orderTable)
          .set({ status: status, updated_at: new Date() })
          .where(eq(orderTable.id, id))
          .returning();

        //conectar ao rabbitmq
        const { channel } = await connectRabbitMQ();

        //publicar a mensagem na fila order_status_updates
        await publishOrderStatusUpdate(channel, {
          order_id: id,
          old_status: orderStatus,
          new_status: status,
          timestamp: new Date().toISOString(),
          user_id: "system",
        });

        //retornar o pedido atualizado
        return reply
          .status(200)
          .send({ message: "Order status updated", order: updatedOrder[0] });
      } catch (error) {
        console.error(error);
        return reply.status(500).send({ error: "Internal server error" });
      }
    }
  );
};
