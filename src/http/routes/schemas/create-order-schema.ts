import { z } from "zod";

export const createOrderSchema = {
  tags: ["Orders"],
  summary: "Criar novo pedido",
  description: "Cria um novo pedido com cliente e itens",
  body: z.object({
    customer: z.object({
      name: z.string().min(3, "Name must be at least 3 characters long"),
      document: z
        .string()
        .min(11, "Document must be at least 11 characters long"),
      email: z.email("Invalid email"),
      phone: z.string().min(11, "Phone must be at least 11 characters long"),
    }),
    order: z.object({
      total_value: z.number().positive("Total value must be positive"),
      items: z
        .array(
          z.object({
            product_name: z.string().min(1, "Product name is required"),
            quantity: z.number().int().positive("Quantity must be positive"),
            unit_value: z.number().positive("Unit value must be positive"),
          })
        )
        .min(1, "At least one item is required"),
    }),
  }),
  response: {
    201: z.object({
      order: z.string().uuid("Invalid order id").describe("Id created"),
    }),
    400: z.object({
      message: z.string().describe("Bad Request, invalid parameters"),
    }),
  },
};
