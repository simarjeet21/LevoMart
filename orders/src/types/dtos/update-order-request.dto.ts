import { OrderStatus } from "@prisma/client";

export interface UpdateOrderRequest {
  status: OrderStatus;
  expiresAt?: string; // ISO date string
}
