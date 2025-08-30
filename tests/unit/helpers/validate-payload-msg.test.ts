import { validateOrderStatusUpdatePayload } from "../../../src/worker/helpers/validate-payload-msg";
import { createMockOrderStatusUpdatePayload } from "../../utils/test-factories";

describe("Validate Payload Message", () => {
  describe("Valid Payloads", () => {
    it("should validate correct payload structure", () => {
      const validPayload = createMockOrderStatusUpdatePayload();

      expect(() =>
        validateOrderStatusUpdatePayload(validPayload)
      ).not.toThrow();

      const result = validateOrderStatusUpdatePayload(validPayload);
      expect(result).toEqual(validPayload);
    });

    it("should validate all valid status combinations", () => {
      const validStatuses = [
        "pending",
        "waiting_payment",
        "paid",
        "processing",
        "shipped",
        "delivered",
        "canceled",
      ];

      validStatuses.forEach((oldStatus) => {
        validStatuses.forEach((newStatus) => {
          const payload = {
            order_id: "550e8400-e29b-41d4-a716-446655440000",
            old_status: oldStatus,
            new_status: newStatus,
            timestamp: new Date().toISOString(),
            user_id: "system",
          };

          expect(() => validateOrderStatusUpdatePayload(payload)).not.toThrow();
        });
      });
    });

    it("should validate different user IDs", () => {
      const userIds = ["system", "admin", "user123", "api-service"];

      userIds.forEach((userId) => {
        const payload = {
          ...createMockOrderStatusUpdatePayload(),
          user_id: userId,
        };

        expect(() => validateOrderStatusUpdatePayload(payload)).not.toThrow();
      });
    });
  });

  describe("Invalid Order ID", () => {
    it("should reject invalid UUID format", () => {
      const payload = {
        ...createMockOrderStatusUpdatePayload(),
        order_id: "invalid-uuid",
      };

      expect(() => validateOrderStatusUpdatePayload(payload)).toThrow(
        "Invalid UUID format"
      );
    });

    it("should reject empty order ID", () => {
      const payload = {
        ...createMockOrderStatusUpdatePayload(),
        order_id: "",
      };

      expect(() => validateOrderStatusUpdatePayload(payload)).toThrow();
    });

    it("should reject missing order ID", () => {
      const payload = createMockOrderStatusUpdatePayload();
      delete (payload as any).order_id;

      expect(() => validateOrderStatusUpdatePayload(payload)).toThrow();
    });
  });

  describe("Invalid Status Values", () => {
    it("should reject invalid old status", () => {
      const payload = {
        ...createMockOrderStatusUpdatePayload(),
        old_status: "invalid_status",
      };

      expect(() => validateOrderStatusUpdatePayload(payload)).toThrow();
    });

    it("should reject invalid new status", () => {
      const payload = {
        ...createMockOrderStatusUpdatePayload(),
        new_status: "invalid_status",
      };

      expect(() => validateOrderStatusUpdatePayload(payload)).toThrow();
    });

    it("should reject empty old status", () => {
      const payload = {
        ...createMockOrderStatusUpdatePayload(),
        old_status: "",
      };

      expect(() => validateOrderStatusUpdatePayload(payload)).toThrow();
    });

    it("should reject empty new status", () => {
      const payload = {
        ...createMockOrderStatusUpdatePayload(),
        new_status: "",
      };

      expect(() => validateOrderStatusUpdatePayload(payload)).toThrow();
    });

    it("should reject missing status fields", () => {
      const payload1 = createMockOrderStatusUpdatePayload();
      delete (payload1 as any).old_status;

      const payload2 = createMockOrderStatusUpdatePayload();
      delete (payload2 as any).new_status;

      expect(() => validateOrderStatusUpdatePayload(payload1)).toThrow();
      expect(() => validateOrderStatusUpdatePayload(payload2)).toThrow();
    });
  });

  describe("Invalid Timestamp", () => {
    it("should reject invalid ISO date format", () => {
      const payload = {
        ...createMockOrderStatusUpdatePayload(),
        timestamp: "invalid-date",
      };

      expect(() => validateOrderStatusUpdatePayload(payload)).toThrow(
        "Invalid ISO date format"
      );
    });

    it("should reject empty timestamp", () => {
      const payload = {
        ...createMockOrderStatusUpdatePayload(),
        timestamp: "",
      };

      expect(() => validateOrderStatusUpdatePayload(payload)).toThrow();
    });

    it("should reject missing timestamp", () => {
      const payload = createMockOrderStatusUpdatePayload();
      delete (payload as any).timestamp;

      expect(() => validateOrderStatusUpdatePayload(payload)).toThrow();
    });

    it("should reject non-ISO date formats", () => {
      const invalidDates = [
        "2023-12-25",
        "25/12/2023",
        "12-25-2023",
        "Mon Dec 25 2023",
        "1703491200000",
      ];

      invalidDates.forEach((invalidDate) => {
        const payload = {
          ...createMockOrderStatusUpdatePayload(),
          timestamp: invalidDate,
        };

        expect(() => validateOrderStatusUpdatePayload(payload)).toThrow();
      });
    });
  });

  describe("Invalid User ID", () => {
    it("should reject empty user ID", () => {
      const payload = {
        ...createMockOrderStatusUpdatePayload(),
        user_id: "",
      };

      expect(() => validateOrderStatusUpdatePayload(payload)).toThrow(
        "User ID cannot be empty"
      );
    });

    it("should reject missing user ID", () => {
      const payload = createMockOrderStatusUpdatePayload();
      delete (payload as any).user_id;

      expect(() => validateOrderStatusUpdatePayload(payload)).toThrow();
    });
  });

  describe("Invalid Payload Structure", () => {
    it("should reject null payload", () => {
      expect(() => validateOrderStatusUpdatePayload(null)).toThrow();
    });

    it("should reject undefined payload", () => {
      expect(() => validateOrderStatusUpdatePayload(undefined)).toThrow();
    });

    it("should reject empty object", () => {
      expect(() => validateOrderStatusUpdatePayload({})).toThrow();
    });

    it("should reject string payload", () => {
      expect(() => validateOrderStatusUpdatePayload("invalid")).toThrow();
    });

    it("should reject number payload", () => {
      expect(() => validateOrderStatusUpdatePayload(123)).toThrow();
    });

    it("should reject array payload", () => {
      expect(() => validateOrderStatusUpdatePayload([])).toThrow();
    });
  });

  describe("Extra Fields", () => {
    it("should ignore extra fields in payload", () => {
      const payload = {
        ...createMockOrderStatusUpdatePayload(),
        extra_field: "should be ignored",
        another_field: 123,
      };

      expect(() => validateOrderStatusUpdatePayload(payload)).not.toThrow();

      const result = validateOrderStatusUpdatePayload(payload);
      expect(result).not.toHaveProperty("extra_field");
      expect(result).not.toHaveProperty("another_field");
    });
  });
});
