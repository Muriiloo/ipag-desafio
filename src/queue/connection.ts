import { connect } from "amqplib";
import { setupQueues } from "./queues.ts";

export async function connectRabbitMQ() {
  //url do rabbitmq
  const rabbitmqUrl = process.env.RABBITMQ_URL!;

  //conectar ao rabbitmq
  const connection = await connect(rabbitmqUrl);

  //criar um canal de comunicação com o rabbitmq
  const channel = await connection.createChannel();

  //criar fila
  await setupQueues(channel);

  //verificar se a conexão e o canal foram criados
  if (!connection || !channel) {
    throw new Error("Failed to connect to RabbitMQ");
  }

  //logar a conexão
  console.log("Connected to RabbitMQ");

  //retornar a conexão e o canal
  return { connection, channel };
}
