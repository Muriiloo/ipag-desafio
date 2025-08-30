import { getOrderSchema } from "../../../src/http/routes/schemas/get-order-schema";

describe("Get Order Schema", () => {
  describe("Valid Parameters", () => {
    it("should validate correct UUID parameter", () => {
      const validUuid = "550e8400-e29b-41d4-a716-446655440000";

      const result = getOrderSchema.params.safeParse({ id: validUuid });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.id).toBe(validUuid);
      }
    });
  });

  describe("Invalid Parameters", () => {
    it("should reject invalid UUID format", () => {
      const invalidUuid = "invalid-uuid-format";

      const result = getOrderSchema.params.safeParse({ id: invalidUuid });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "ID do pedido deve ser um UUID válido"
        );
      }
    });

    it("should reject empty string", () => {
      const result = getOrderSchema.params.safeParse({ id: "" });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "ID do pedido deve ser um UUID válido"
        );
      }
    });

    it("should reject numeric ID", () => {
      const result = getOrderSchema.params.safeParse({ id: "123456" });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "ID do pedido deve ser um UUID válido"
        );
      }
    });

    it("should reject missing ID parameter", () => {
      const result = getOrderSchema.params.safeParse({});

      expect(result.success).toBe(false);
    });
  });

  describe("Response Schema", () => {
    it("should validate successful response structure", () => {
      const validResponse = {
        order: {
          id: "550e8400-e29b-41d4-a716-446655440000",
          customer_id: "123e4567-e89b-12d3-a456-426614174000",
          order_number: "ORD-1703001234567",
          total_value: 10000,
          status: "pending" as const,
          created_at: new Date(),
          updated_at: new Date(),
        },
        customer: {
          id: "123e4567-e89b-12d3-a456-426614174000",
          name: "João Silva",
          document: "12345678901",
          email: "joao@test.com",
          phone: "11999999999",
          created_at: new Date(),
        },
        items: [
          {
            id: "789e0123-e45f-6789-a901-234567890123",
            order_id: "550e8400-e29b-41d4-a716-446655440000",
            product_name: "Produto Teste",
            quantity: 2,
            unit_value: 5000,
          },
        ],
      };

      const result = getOrderSchema.response[200].safeParse(validResponse);

      expect(result.success).toBe(true);
    });

    it("should validate error response structures", () => {
      const notFoundResponse = { error: "Order not found" };
      const badRequestResponse = { error: "Invalid UUID format" };
      const serverErrorResponse = { error: "Internal server error" };

      expect(
        getOrderSchema.response[404].safeParse(notFoundResponse).success
      ).toBe(true);
      expect(
        getOrderSchema.response[400].safeParse(badRequestResponse).success
      ).toBe(true);
      expect(
        getOrderSchema.response[500].safeParse(serverErrorResponse).success
      ).toBe(true);
    });
  });
});
