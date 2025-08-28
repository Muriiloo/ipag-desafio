import type { Channel } from "amqplib";
import { queues } from "./queues.ts";

//função para publicar uma mensagem na fila order_status_updates
export async function publishOrderStatusUpdate(
  //passamos o canal de comunicação com o rabbitmq
  channel: Channel,
  //passamos o payload que vai ser publicado na fila de acordo com o que foi passado no desafio
  payload: {
    order_id: string;
    old_status: string;
    new_status: string;
    timestamp: string;
    user_id: string;
  }
) {
  try {
    //transformamos o payload em uma string
    const message = JSON.stringify(payload);

    //publicamos a mensagem na fila
    channel.sendToQueue(queues.orderStatusUpdates, Buffer.from(message), {
      persistent: true,
    });

    console.log("Message sent to queue");
  } catch (error) {
    console.error("Error sending message to queue:", error);
    throw error;
  }
}
