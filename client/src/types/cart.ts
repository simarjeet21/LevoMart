// types/cart.ts

// DTO for OrderService `/order/create` endpoint

// Cart item returned by CartService `/cart/index`
export interface CartItem {
  productId: string;
  productName: string;
  sellerId: string;
  productPrice: number;
  quantity: number;
  totalPrice: number;
  imageUrl?: string;
}

export interface CartItemResponse {
  productId: string;
  productName: string;
  sellerId: string;
  price: number;
  quantity: number;
  totalPrice: number;
  imageUrl?: string;
}
export type AddToCartDto = {
  productId: string;
  quantity: number;
  productName: string;
  productPrice: number;
  sellerId: string;
};
