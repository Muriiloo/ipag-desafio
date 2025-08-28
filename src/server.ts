import fastify from "fastify";
import fastifyCors from "@fastify/cors";
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { createOrderRoute } from "./http/routes/create-order.ts";
import { getOrderRoute } from "./http/routes/get-order.ts";
import { connectRabbitMQ } from "./queue/connection.ts";
import { updateOrderStatusRoute } from "./http/routes/update-order-status.ts";
import { getOrderFiltersRoute } from "./http/routes/get-order-filters.ts";
import { getOrderSummaryRoute } from "./http/routes/get-order-summary.ts";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.register(fastifyCors, {
  origin: "http://localhost:3000",
});

//Validações nas requisições com Zod
app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.get("/health", () => {
  return "OK";
});

//Rotas
app.register(createOrderRoute);
app.register(getOrderRoute);
app.register(updateOrderStatusRoute);
app.register(getOrderFiltersRoute);
app.register(getOrderSummaryRoute);
async function startServer() {
  try {
    // Conectar ao RabbitMQ
    await connectRabbitMQ();

    // Iniciar servidor
    await app.listen({ port: Number(process.env.PORT ?? 3333) });
    console.log("Server is running!");
  } catch (err) {
    console.error("Error starting server:", err);
    process.exit(1);
  }
}

startServer();
