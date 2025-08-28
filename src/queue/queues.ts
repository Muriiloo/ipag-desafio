import type { Channel } from "amqplib";

//configurar as filas que vamos usar
export const queues = {
  orderStatusUpdates: "order_status_updates",
};

export async function setupQueues(channel: Channel) {
  //criar a fila order_status_updates
  await channel.assertQueue(queues.orderStatusUpdates, { durable: true });

  console.log("Queues setup completed");
}
