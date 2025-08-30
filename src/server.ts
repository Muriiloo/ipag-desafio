import fastify from "fastify";
import fastifyCors from "@fastify/cors";
import {
  jsonSchemaTransform,
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
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.register(fastifyCors, {
  origin: "http://localhost:3000",
});

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "IPAG Desafio - Order Management API",
      description: "API para gerenciamento de pedidos",
      version: "1.0.0",
    },
    tags: [
      {
        name: "Orders",
        description: "Operações relacionadas a pedidos",
      },
      {
        name: "Summary",
        description: "Operações relacionadas a resumo",
      },
      {
        name: "Status",
        description: "Operações relacionadas a alteração de status do pedido",
      },
    ],
  },
  transform: jsonSchemaTransform,
});

app.register(fastifySwaggerUi, {
  routePrefix: "/docs",
  uiConfig: {
    docExpansion: "full",
    deepLinking: false,
  },
  staticCSP: true,
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
