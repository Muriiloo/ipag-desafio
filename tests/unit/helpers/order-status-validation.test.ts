// Importa a função de validação de transições de status de pedidos
import { isValidStatusTransition } from "../../../src/http/helpers/order-status-validation";

// Descreve o conjunto de testes para validação de status de pedidos
describe("Order Status Validation", () => {
  // Agrupa testes para transições sequenciais válidas
  describe("Valid Sequential Transitions", () => {
    // Define array com todas as transições válidas em sequência
    const validTransitions = [
      ["pending", "waiting_payment"],
      ["waiting_payment", "paid"],
      ["paid", "processing"],
      ["processing", "shipped"],
      ["shipped", "delivered"],
    ];

    // Testa cada transição válida usando it.each para parametrização
    it.each(validTransitions)(
      "should allow transition from %s to %s",
      (currentStatus, newStatus) => {
        // Executa a validação da transição
        const result = isValidStatusTransition(currentStatus, newStatus);
        // Verifica se a transição é permitida
        expect(result).toBe(true);
      }
    );
  });

  // Agrupa testes para regras de cancelamento de pedidos
  describe("Cancellation Rules", () => {
    // Define quais status permitem cancelamento
    const cancellableStatuses = [
      "pending",
      "waiting_payment",
      "paid",
      "processing",
      "shipped",
    ];

    it.each(cancellableStatuses)(
      "should allow cancellation from %s",
      (currentStatus) => {
        const result = isValidStatusTransition(currentStatus, "canceled");
        expect(result).toBe(true);
      }
    );

    it("should not allow cancellation from delivered status", () => {
      const result = isValidStatusTransition("delivered", "canceled");
      expect(result).toBe(false);
    });

    it("should not allow cancellation from already canceled status", () => {
      const result = isValidStatusTransition("canceled", "canceled");
      expect(result).toBe(false);
    });
  });

  describe("Invalid Sequential Transitions", () => {
    const invalidTransitions = [
      ["pending", "paid"],
      ["pending", "processing"],
      ["pending", "shipped"],
      ["pending", "delivered"],
      ["waiting_payment", "processing"],
      ["waiting_payment", "shipped"],
      ["waiting_payment", "delivered"],
      ["paid", "shipped"],
      ["paid", "delivered"],
      ["processing", "delivered"],
      ["shipped", "pending"],
      ["delivered", "pending"],
      ["delivered", "waiting_payment"],
      ["delivered", "paid"],
      ["delivered", "processing"],
      ["delivered", "shipped"],
    ];

    it.each(invalidTransitions)(
      "should reject transition from %s to %s",
      (currentStatus, newStatus) => {
        const result = isValidStatusTransition(currentStatus, newStatus);
        expect(result).toBe(false);
      }
    );
  });

  describe("Backwards Transitions", () => {
    const backwardsTransitions = [
      ["waiting_payment", "pending"],
      ["paid", "waiting_payment"],
      ["processing", "paid"],
      ["shipped", "processing"],
      ["delivered", "shipped"],
    ];

    it.each(backwardsTransitions)(
      "should reject backwards transition from %s to %s",
      (currentStatus, newStatus) => {
        const result = isValidStatusTransition(currentStatus, newStatus);
        expect(result).toBe(false);
      }
    );
  });

  describe("Same Status Transitions", () => {
    const allStatuses = [
      "pending",
      "waiting_payment",
      "paid",
      "processing",
      "shipped",
      "delivered",
      "canceled",
    ];

    it.each(allStatuses)(
      "should reject same status transition from %s to %s",
      (status) => {
        const result = isValidStatusTransition(status, status);
        expect(result).toBe(false);
      }
    );
  });

  describe("Invalid Status Values", () => {
    it("should reject unknown current status", () => {
      const result = isValidStatusTransition("unknown_status", "pending");
      expect(result).toBe(false);
    });

    it("should reject unknown new status", () => {
      const result = isValidStatusTransition("pending", "unknown_status");
      expect(result).toBe(false);
    });

    it("should reject both unknown statuses", () => {
      const result = isValidStatusTransition("unknown1", "unknown2");
      expect(result).toBe(false);
    });

    it("should reject empty strings", () => {
      const result1 = isValidStatusTransition("", "pending");
      const result2 = isValidStatusTransition("pending", "");
      const result3 = isValidStatusTransition("", "");

      expect(result1).toBe(false);
      expect(result2).toBe(false);
      expect(result3).toBe(false);
    });
  });

  describe("Edge Cases", () => {
    it("should handle null values gracefully", () => {
      const result1 = isValidStatusTransition(null as any, "pending");
      const result2 = isValidStatusTransition("pending", null as any);

      expect(result1).toBe(false);
      expect(result2).toBe(false);
    });

    it("should handle undefined values gracefully", () => {
      const result1 = isValidStatusTransition(undefined as any, "pending");
      const result2 = isValidStatusTransition("pending", undefined as any);

      expect(result1).toBe(false);
      expect(result2).toBe(false);
    });

    it("should be case-sensitive", () => {
      const result1 = isValidStatusTransition("PENDING", "waiting_payment");
      const result2 = isValidStatusTransition("pending", "WAITING_PAYMENT");

      expect(result1).toBe(false);
      expect(result2).toBe(false);
    });
  });
});
