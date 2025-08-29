import { eq } from "drizzle-orm";
import { db } from "../db/connection.ts";
import {
  customersTable,
  notificationLogsTable,
  orderTable,
  type statusEnum,
} from "../db/schema.ts";
import type { OrderStatusUpdatePayload } from "./helpers/order-status-update-payload.ts";
import { formatLogTimestamp } from "./helpers/format-log-timestamp.ts";

export async function processOrderStatusUpdate(
  payload: OrderStatusUpdatePayload
) {
  try {
    //buscando o pedido com o cliente
    const orderWithCustomer = await db
      .select({
        orderNumber: orderTable.order_number,
        customerEmail: customersTable.email,
        customerName: customersTable.name,
      })
      .from(orderTable)
      .innerJoin(customersTable, eq(orderTable.customer_id, customersTable.id))
      .where(eq(orderTable.id, payload.order_id))
      .limit(1);

    //se o pedido não for encontrado, retornar erro
    if (orderWithCustomer.length === 0) {
      throw new Error(`Order ${payload.order_id} not found`);
    }

    //extraindo os dados do pedido
    const { orderNumber, customerEmail, customerName } = orderWithCustomer[0];

    //criando o log de notificação
    console.log(
      `${formatLogTimestamp()} INFO: Order ${orderNumber} status changed from ${payload.old_status.toUpperCase()} to ${payload.new_status.toUpperCase()}`
    );

    //criando a mensagem de notificação
    const msg = `${formatLogTimestamp()} INFO: Order ${orderNumber} status changed from ${payload.old_status.toUpperCase()} to ${payload.new_status.toUpperCase()}`;

    //inserindo a notificação e o log de notificação no banco de dados
    await db.insert(notificationLogsTable).values({
      order_id: payload.order_id,
      old_status: payload.old_status as (typeof statusEnum.enumValues)[number],
      new_status: payload.new_status as (typeof statusEnum.enumValues)[number],
      message: msg,
    });

    //logando a notificação
    console.log(
      `${formatLogTimestamp()} INFO: Notification sent to customer ${customerEmail}`
    );
  } catch (error) {
    console.error(`${formatLogTimestamp()} ERROR: ${error}`);
    throw error;
  }
}
