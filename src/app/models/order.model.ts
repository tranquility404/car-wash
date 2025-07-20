export interface Order {
  id?: number;
  userId?: number;
  washerId?: number;
  cartId?: number;
  status: string; // PENDING, WASHING, COMPLETED, CANCELLED
  orderDate?: string;
  scheduledDate?: string;
  orderNow: boolean;
  paymentUrl?: string;
  paymentId?: number;
}