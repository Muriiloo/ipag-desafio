import fastify from "fastify";
import fastifyCors from "@fastify/cors";
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { createOrderRoute } from "./http/routes/create-order.ts";
import { getOrderRoute } from "./http/routes/get-order.ts";

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

app.listen({ port: Number(process.env.PORT ?? 3333) }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server is running!`);
});
