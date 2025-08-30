// Factory para criar dados mockados de cliente para testes
export const createMockCustomer = () => ({
  name: "João Silva",
  document: "12345678901",
  email: "joao@test.com",
  phone: "11999999999",
});

// Factory para criar dados mockados de item de pedido para testes
export const createMockOrderItem = () => ({
  product_name: "Produto Teste",
  quantity: 2,
  unit_value: 5000,
});

// Factory para criar dados mockados de pedido para testes
export const createMockOrder = () => ({
  total_value: 10000,
  items: [createMockOrderItem()],
});

// Factory para criar payload completo de criação de pedido para testes
export const createMockCreateOrderPayload = () => ({
  customer: createMockCustomer(),
  order: createMockOrder(),
});

// Factory para criar payload de atualização de status de pedido para testes
export const createMockOrderStatusUpdatePayload = () => ({
  order_id: "550e8400-e29b-41d4-a716-446655440000",
  old_status: "pending",
  new_status: "waiting_payment",
  timestamp: new Date().toISOString(),
  user_id: "system",
});

export const createMockDatabaseOrder = () => ({
  id: "550e8400-e29b-41d4-a716-446655440000",
  customer_id: "123e4567-e89b-12d3-a456-426614174000",
  order_number: "ORD-1703001234567",
  total_value: 10000,
  status: "pending" as const,
  created_at: new Date(),
  updated_at: new Date(),
});

export const createMockDatabaseCustomer = () => ({
  id: "123e4567-e89b-12d3-a456-426614174000",
  name: "João Silva",
  document: "12345678901",
  email: "joao@test.com",
  phone: "11999999999",
  created_at: new Date(),
});

export const createMockDatabaseOrderItem = () => ({
  id: "789e0123-e45f-67g8-h901-234567890123",
  order_id: "550e8400-e29b-41d4-a716-446655440000",
  product_name: "Produto Teste",
  quantity: 2,
  unit_value: 5000,
});
