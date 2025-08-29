import { queues } from "../queue/queues.ts";
import type { Channel, ConsumeMessage } from "amqplib";
import { formatLogTimestamp } from "./helpers/format-log-timestamp.ts";
import type { OrderStatusUpdatePayload } from "./helpers/order-status-update-payload.ts";
import { processOrderStatusUpdate } from "./process-order-status-update.ts";

//função para configurar o consumidor
export async function setupConsumer(channel: Channel) {
  //consumindo a fila order_status_updates
  console.log(
    `${formatLogTimestamp()} INFO: Consuming from order_status_updates queue...`
  );

  //consumindo a fila order_status_updates
  await channel.consume(
    queues.orderStatusUpdates,
    async (msg: ConsumeMessage | null) => {
      if (msg !== null) {
        try {
          //convertendo a mensagem para o payload
          const payload: OrderStatusUpdatePayload = JSON.parse(
            msg.content.toString()
          );

          //processando a mensagem
          await processOrderStatusUpdate(payload);

          //confirmando a mensagem
          channel.ack(msg);
        } catch (error) {
          console.error(`${formatLogTimestamp()} ERROR: ${error}`);
          //rejeitar a mensagem e recolocar na fila para tentar novamente
          channel.nack(msg, false, true);
          throw error;
        }
      }
    },
    {
      //desativando o auto-ack
      noAck: false,
    }
  );

  //logando a configuração do consumidor
  console.log(
    `${formatLogTimestamp()} INFO: Consumer configured and waiting for messages...`
  );
}
