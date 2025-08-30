// Importa o schema de validação para criação de pedidos
import { createOrderSchema } from "../../../src/http/routes/schemas/create-order-schema";
// Importa factory para criar dados de teste de criação de pedidos
import { createMockCreateOrderPayload } from "../../utils/test-factories";

// Descreve o conjunto de testes para o schema de criação de pedidos
describe("Create Order Schema", () => {
  // Agrupa testes para payloads válidos
  describe("Valid Payloads", () => {
    // Testa se o schema valida corretamente um payload válido de pedido
    it("should validate correct order payload", () => {
      // Cria um payload válido usando a factory de teste
      const validPayload = createMockCreateOrderPayload();

      // Executa a validação do schema com o payload
      const result = createOrderSchema.body.safeParse(validPayload);

      // Verifica se a validação foi bem-sucedida
      expect(result.success).toBe(true);
    });

    // Testa se o schema valida corretamente um pedido com múltiplos itens
    it("should validate order with multiple items", () => {
      // Cria um payload com dois itens diferentes
      const payload = {
        customer: {
          name: "Maria Silva",
          document: "98765432109",
          email: "maria@test.com",
          phone: "11888888888",
        },
        order: {
          total_value: 25000,
          items: [
            {
              product_name: "Produto A",
              quantity: 1,
              unit_value: 10000,
            },
            {
              product_name: "Produto B",
              quantity: 3,
              unit_value: 5000,
            },
          ],
        },
      };

      // Executa a validação do schema
      const result = createOrderSchema.body.safeParse(payload);

      // Verifica se a validação foi bem-sucedida
      expect(result.success).toBe(true);
    });
  });

  // Agrupa testes para validação de dados do cliente
  describe("Customer Validation", () => {
    // Testa se rejeita cliente com nome muito curto
    it("should reject customer with short name", () => {
      // Cria payload válido e modifica o nome para ser inválido
      const payload = createMockCreateOrderPayload();
      payload.customer.name = "Jo";

      // Executa a validação
      const result = createOrderSchema.body.safeParse(payload);

      // Verifica se a validação falhou e retorna a mensagem correta
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Name must be at least 3 characters long"
        );
      }
    });

    // Testa se rejeita cliente com documento muito curto
    it("should reject customer with short document", () => {
      // Cria payload válido e modifica o documento para ser inválido
      const payload = createMockCreateOrderPayload();
      payload.customer.document = "123456789";

      // Executa a validação
      const result = createOrderSchema.body.safeParse(payload);

      // Verifica se a validação falhou e retorna a mensagem correta
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Document must be at least 11 characters long"
        );
      }
    });

    // Testa se rejeita cliente com email inválido
    it("should reject customer with invalid email", () => {
      // Cria payload válido e modifica o email para ser inválido
      const payload = createMockCreateOrderPayload();
      payload.customer.email = "invalid-email";

      // Executa a validação
      const result = createOrderSchema.body.safeParse(payload);

      // Verifica se a validação falhou e retorna a mensagem correta
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Invalid email");
      }
    });

    it("should reject customer with short phone", () => {
      const payload = createMockCreateOrderPayload();
      payload.customer.phone = "1199999";

      const result = createOrderSchema.body.safeParse(payload);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Phone must be at least 11 characters long"
        );
      }
    });
  });

  // Agrupa testes para validação de dados do pedido
  describe("Order Validation", () => {
    // Testa se rejeita pedido com valor total negativo
    it("should reject order with negative total value", () => {
      // Cria payload válido e modifica o valor total para ser negativo
      const payload = createMockCreateOrderPayload();
      payload.order.total_value = -100;

      // Executa a validação
      const result = createOrderSchema.body.safeParse(payload);

      // Verifica se a validação falhou e retorna a mensagem correta
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Total value must be positive"
        );
      }
    });

    it("should reject order with zero total value", () => {
      const payload = createMockCreateOrderPayload();
      payload.order.total_value = 0;

      const result = createOrderSchema.body.safeParse(payload);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Total value must be positive"
        );
      }
    });

    it("should reject order with empty items array", () => {
      const payload = createMockCreateOrderPayload();
      payload.order.items = [];

      const result = createOrderSchema.body.safeParse(payload);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "At least one item is required"
        );
      }
    });
  });

  describe("Order Items Validation", () => {
    it("should reject item with empty product name", () => {
      const payload = createMockCreateOrderPayload();
      payload.order.items[0].product_name = "";

      const result = createOrderSchema.body.safeParse(payload);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Product name is required");
      }
    });

    it("should reject item with negative quantity", () => {
      const payload = createMockCreateOrderPayload();
      payload.order.items[0].quantity = -1;

      const result = createOrderSchema.body.safeParse(payload);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Quantity must be positive"
        );
      }
    });

    it("should reject item with zero quantity", () => {
      const payload = createMockCreateOrderPayload();
      payload.order.items[0].quantity = 0;

      const result = createOrderSchema.body.safeParse(payload);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Quantity must be positive"
        );
      }
    });

    it("should reject item with decimal quantity", () => {
      const payload = createMockCreateOrderPayload();
      payload.order.items[0].quantity = 1.5;

      const result = createOrderSchema.body.safeParse(payload);

      expect(result.success).toBe(false);
    });

    it("should reject item with negative unit value", () => {
      const payload = createMockCreateOrderPayload();
      payload.order.items[0].unit_value = -100;

      const result = createOrderSchema.body.safeParse(payload);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Unit value must be positive"
        );
      }
    });

    it("should reject item with zero unit value", () => {
      const payload = createMockCreateOrderPayload();
      payload.order.items[0].unit_value = 0;

      const result = createOrderSchema.body.safeParse(payload);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Unit value must be positive"
        );
      }
    });
  });

  describe("Missing Fields", () => {
    it("should reject payload without customer", () => {
      const payload = { order: createMockCreateOrderPayload().order };

      const result = createOrderSchema.body.safeParse(payload);

      expect(result.success).toBe(false);
    });

    it("should reject payload without order", () => {
      const payload = { customer: createMockCreateOrderPayload().customer };

      const result = createOrderSchema.body.safeParse(payload);

      expect(result.success).toBe(false);
    });

    it("should reject customer without required fields", () => {
      const payload = createMockCreateOrderPayload();
      delete (payload.customer as any).name;

      const result = createOrderSchema.body.safeParse(payload);

      expect(result.success).toBe(false);
    });
  });
});
