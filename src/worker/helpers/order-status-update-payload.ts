export interface OrderStatusUpdatePayload {
  order_id: string;
  old_status: string;
  new_status: string;
  timestamp: string;
  user_id: string;
}
