import { z } from "zod";

//validando o payload da mensagem
const OrderStatusUpdateSchema = z.object({
  order_id: z.string().uuid("Invalid UUID format"),
  old_status: z.enum([
    "pending",
    "waiting_payment",
    "paid",
    "processing",
    "shipped",
    "delivered",
    "canceled",
  ]),
  new_status: z.enum([
    "pending",
    "waiting_payment",
    "paid",
    "processing",
    "shipped",
    "delivered",
    "canceled",
  ]),
  timestamp: z.string().datetime("Invalid ISO date format"),
  user_id: z.string().min(1, "User ID cannot be empty"),
});

//função para validar o payload da mensagem
export function validateOrderStatusUpdatePayload(data: unknown) {
  return OrderStatusUpdateSchema.parse(data);
}
