// dtos/orders/order-response.dto.ts
export interface OrderItemResponse {
  id: string;
  productId: string;
  productName: string;
  productPrice: number;
  quantity: number;
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
  version: number;
  orderId: string;
  sellerId: string;
}

export interface OrderResponse {
  id: string;
  userId: string;
  status: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
  version: number;
  orderItems: OrderItemResponse[];
}
