import { queues } from "../queue/queues.ts";
import type { Channel, ConsumeMessage } from "amqplib";
import { formatLogTimestamp } from "./helpers/format-log-timestamp.ts";
import type { OrderStatusUpdatePayload } from "./helpers/order-status-update-payload.ts";
import { processOrderStatusUpdate } from "./process-order-status-update.ts";
import { validateOrderStatusUpdatePayload } from "./helpers/validate-payload-msg.ts";

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
          //convertendo a mensagem para JSON
          const rawData = JSON.parse(msg.content.toString());

          //logando a mensagem recebida
          console.log(
            `${formatLogTimestamp()} DEBUG: Received message:`,
            rawData
          );

          //validar os dados da mensagem
          const payload: OrderStatusUpdatePayload =
            validateOrderStatusUpdatePayload(rawData);

          //logando a mensagem validada
          console.log(
            `${formatLogTimestamp()} DEBUG: Message validated successfully`
          );

          //processando a mensagem
          await processOrderStatusUpdate(payload);

          //confirmando a mensagem
          channel.ack(msg);
        } catch (error) {
          //logando o erro
          console.error(`${formatLogTimestamp()} ERROR: ${error}`);

          //se é erro de validação, rejeitar sem requeue (dead letter)
          if (
            error instanceof Error &&
            error.message.includes("Invalid payload")
          ) {
            console.error(
              `${formatLogTimestamp()} ERROR: Invalid message format - rejecting without requeue`
            );
            channel.nack(msg, false, false); //não recolocar na fila
          }
          //para outros erros, tentar novamente
          else {
            console.error(
              `${formatLogTimestamp()} ERROR: Processing error - rejecting with requeue`
            );
            channel.nack(msg, false, true); // Recolocar na fila
          }
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
