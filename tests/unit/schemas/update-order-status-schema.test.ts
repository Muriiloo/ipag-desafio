import { updateOrderStatusSchema } from '../../../src/http/routes/schemas/update-order-status-schema';

describe('Update Order Status Schema', () => {
  describe('Valid Parameters', () => {
    it('should validate correct UUID parameter', () => {
      const validUuid = '550e8400-e29b-41d4-a716-446655440000';
      
      const result = updateOrderStatusSchema.params.safeParse({ id: validUuid });
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.id).toBe(validUuid);
      }
    });
  });

  describe('Valid Body', () => {
    const validStatuses = [
      'pending',
      'waiting_payment', 
      'paid',
      'processing',
      'shipped',
      'delivered',
      'canceled'
    ] as const;

    it.each(validStatuses)('should validate status: %s', (status) => {
      const result = updateOrderStatusSchema.body.safeParse({ status });
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.status).toBe(status);
      }
    });
  });

  describe('Invalid Parameters', () => {
    it('should reject invalid UUID format', () => {
      const invalidUuid = 'invalid-uuid-format';
      
      const result = updateOrderStatusSchema.params.safeParse({ id: invalidUuid });
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('ID do pedido deve ser um UUID válido');
      }
    });

    it('should reject missing ID parameter', () => {
      const result = updateOrderStatusSchema.params.safeParse({});
      
      expect(result.success).toBe(false);
    });
  });

  describe('Invalid Body', () => {
    it('should reject invalid status', () => {
      const result = updateOrderStatusSchema.body.safeParse({ status: 'invalid_status' });
      
      expect(result.success).toBe(false);
    });

    it('should reject missing status', () => {
      const result = updateOrderStatusSchema.body.safeParse({});
      
      expect(result.success).toBe(false);
    });

    it('should reject empty status', () => {
      const result = updateOrderStatusSchema.body.safeParse({ status: '' });
      
      expect(result.success).toBe(false);
    });

    it('should reject null status', () => {
      const result = updateOrderStatusSchema.body.safeParse({ status: null });
      
      expect(result.success).toBe(false);
    });
  });

  describe('Response Schema', () => {
    it('should validate successful response structure', () => {
      const validResponse = {
        message: 'Order status updated',
        order: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          customer_id: '123e4567-e89b-12d3-a456-426614174000',
          order_number: 'ORD-1703001234567',
          total_value: 10000,
          status: 'waiting_payment' as const,
          created_at: new Date(),
          updated_at: new Date()
        }
      };

      const result = updateOrderStatusSchema.response[200].safeParse(validResponse);
      
      expect(result.success).toBe(true);
    });

    it('should validate error response structures', () => {
      const badRequestResponse = { 
        message: 'Invalid status transition',
        order: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          status: 'delivered'
        }
      };
      const notFoundResponse = { error: 'Order not found' };
      const serverErrorResponse = { error: 'Internal server error' };

      expect(updateOrderStatusSchema.response[400].safeParse(badRequestResponse).success).toBe(true);
      expect(updateOrderStatusSchema.response[404].safeParse(notFoundResponse).success).toBe(true);
      expect(updateOrderStatusSchema.response[500].safeParse(serverErrorResponse).success).toBe(true);
    });
  });
});
