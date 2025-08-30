import { getOrderFiltersSchema } from "../../../src/http/routes/schemas/get-order-filters-schema";

describe("Get Order Filters Schema", () => {
  describe("Valid Query Parameters", () => {
    it("should validate empty query parameters with defaults", () => {
      const result = getOrderFiltersSchema.querystring.safeParse({});

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.page).toBe(1);
        expect(result.data.limit).toBe(10);
      }
    });

    it("should validate all optional filters", () => {
      const query = {
        status: "paid",
        customer_email: "joao@test.com",
        order_number: "ORD-123",
        created_from: new Date("2023-01-01"),
        created_to: new Date("2023-12-31"),
        page: "2",
        limit: "20",
      };

      const result = getOrderFiltersSchema.querystring.safeParse(query);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.status).toBe("paid");
        expect(result.data.customer_email).toBe("joao@test.com");
        expect(result.data.order_number).toBe("ORD-123");
        expect(result.data.page).toBe(2);
        expect(result.data.limit).toBe(20);
      }
    });

    const validStatuses = [
      "pending",
      "waiting_payment",
      "paid",
      "processing",
      "shipped",
      "delivered",
      "canceled",
    ] as const;

    it.each(validStatuses)("should validate status: %s", (status) => {
      const result = getOrderFiltersSchema.querystring.safeParse({ status });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.status).toBe(status);
      }
    });
  });

  describe("Invalid Query Parameters", () => {
    it("should reject invalid status", () => {
      const result = getOrderFiltersSchema.querystring.safeParse({
        status: "invalid_status",
      });

      expect(result.success).toBe(false);
    });

    it("should reject invalid email format", () => {
      const result = getOrderFiltersSchema.querystring.safeParse({
        customer_email: "invalid-email",
      });

      expect(result.success).toBe(false);
    });

    it("should transform string page to number", () => {
      const result = getOrderFiltersSchema.querystring.safeParse({
        page: "5",
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.page).toBe(5);
        expect(typeof result.data.page).toBe("number");
      }
    });

    it("should transform string limit to number", () => {
      const result = getOrderFiltersSchema.querystring.safeParse({
        limit: "25",
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.limit).toBe(25);
        expect(typeof result.data.limit).toBe("number");
      }
    });
  });

  describe("Date Filters", () => {
    it("should validate valid date objects", () => {
      const query = {
        created_from: new Date("2023-01-01"),
        created_to: new Date("2023-12-31"),
      };

      const result = getOrderFiltersSchema.querystring.safeParse(query);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.created_from).toBeInstanceOf(Date);
        expect(result.data.created_to).toBeInstanceOf(Date);
      }
    });
  });

  describe("Response Schema", () => {
    it("should validate successful response structure", () => {
      const validResponse = {
        orders: [
          {
            order: {
              id: "550e8400-e29b-41d4-a716-446655440000",
              order_number: "ORD-1703001234567",
              total_value: 10000,
              status: "paid" as const,
              created_at: new Date(),
              updated_at: new Date(),
            },
            customer: {
              id: "123e4567-e89b-12d3-a456-426614174000",
              name: "João Silva",
              email: "joao@test.com",
              phone: "11999999999",
              document: "12345678901",
            },
          },
        ],
        pagination: {
          page: 1,
          limit: 10,
          total: 25,
          total_pages: 3,
        },
      };

      const result =
        getOrderFiltersSchema.response[200].safeParse(validResponse);

      expect(result.success).toBe(true);
    });

    it("should validate empty orders array", () => {
      const validResponse = {
        orders: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          total_pages: 0,
        },
      };

      const result =
        getOrderFiltersSchema.response[200].safeParse(validResponse);

      expect(result.success).toBe(true);
    });

    it("should validate error response structures", () => {
      const badRequestResponse = {
        error: "Invalid parameters",
        details: { field: "status", message: "Invalid value" },
      };
      const serverErrorResponse = { error: "Internal server error" };

      expect(
        getOrderFiltersSchema.response[400].safeParse(badRequestResponse)
          .success
      ).toBe(true);
      expect(
        getOrderFiltersSchema.response[500].safeParse(serverErrorResponse)
          .success
      ).toBe(true);
    });
  });
});
