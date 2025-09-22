// /types/order.ts
export type OrderStatus =
  | "CREATED"
  | "PENDING"
  | "CANCELLED"
  | "COMPLETED"
  | "AWAITING_PAYMENT";

//   export type OrderItem = {
//   id: string;
//   orderId: string;
//   productId: string;
//   productName: string;
//   productPrice: number;
//   quantity: number;
//   totalPrice: number;
//   sellerId: string;
//   version: number;
//   createdAt: string;
//   updatedAt: string;
// };

export type OrderItem = {
  productId: string;
  productName: string;
  productPrice: number;
  quantity: number;
  totalPrice: number;
  sellerId: string;
};

// export type Order = {
//   id: string;
//   userId: string;
//   items: OrderItem[];
//   status: OrderStatus;
//   createdAt: string;
//   updatedAt: string;
//   expiresAt?: string;
//   version: number;
//   totalPrice: number;
// };

export type Order = {
  id: string;
  items: OrderItem[];
  status: OrderStatus;
  createdAt: string;
  totalPrice: number;
};
// export interface AdminOrder {
//   id: string;
//   userId: string;
//   status: string;
//   totalPrice: number;
//   createdAt: string;
// }

// export interface AdminOrderDetail {
//   id: string;
//   userId: string;
//   status: string;
//   totalPrice: number;
//   createdAt: string;
//   items: {
//     productId: string;
//     name: string;
//     price: number;
//     quantity: number;
//   }[];
// }
export interface SellerOrderItem {
  itemId: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  status: string;
}

export interface SellerOrder {
  orderId: string;
  buyerName: string;
  items: SellerOrderItem[];
}
// export interface SellerOrder {
//   orderId: string;
//   buyerName: string;
//   items: SellerOrderItem[];
// }
// export interface SellerOrderItem {
//   itemId: string;
//   productId: string;
//   productName: string;
//   quantity: number;
//   productPrice: number;
//   totalPrice: number;
// }

// export interface AdminOrderDetail {
//   id: string;
//   userId: string;
//   status: string;
//   totalPrice: number;
//   createdAt: string;
//   items: {
//   productId: string;
//   productName: string;
//   productPrice: number;
//   quantity: number;
//   totalPrice: number;
//   sellerId: string;
// }
// [];
// }
export interface OrderItemDto {
  productId: string;
  quantity: number;
}

export interface CreateOrderDto {
  items: OrderItemDto[];
}

export interface OrderResponse {
  id: string;
  userId: string;
  status: string;
  expiresAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  version: number;
  orderItems: OrderItemResponse[];
}
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
