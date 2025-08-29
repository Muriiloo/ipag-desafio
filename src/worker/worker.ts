import "dotenv/config";
import { connectRabbitMQ } from "../queue/connection.ts";
import { setupConsumer } from "./consumer.ts";
import { formatLogTimestamp } from "./helpers/format-log-timestamp.ts";

async function startWorker() {
  try {
    console.log(`${formatLogTimestamp()} INFO: Worker started`);

    const { connection, channel } = await connectRabbitMQ();

    await setupConsumer(channel);

    console.log(`${formatLogTimestamp()} INFO: Worker started`);
    console.log(
      `${formatLogTimestamp()} INFO: Waiting for messages on order_status_updates queue...`
    );

    process.on("SIGINT", async () => {
      console.log(`${formatLogTimestamp()} INFO: Worker stopped`);
      await channel.close();
      await connection.close();
      process.exit(0);
    });

    process.on("SIGTERM", async () => {
      console.log(`${formatLogTimestamp()} INFO: Stopping worker...`);
      await channel.close();
      await connection.close();
      process.exit(0);
    });
  } catch (error) {
    console.error(`${formatLogTimestamp()} ERROR: ${error}`);
    process.exit(1);
  }
}

startWorker();
