export interface AdminProduct {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  sellerId: string;
}
export interface Product {
  id: string;
  name: string;
  description?: string;
  userId: string;
  price: number;
  category?: string;
  orderId?: string;
  imageUrl?: string;
  stock?: number;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}
// export interface ProductFormData extends Product {
//   id: string;
//   name: string;
//   category?: string;
//   price: number;
//   stock?: number;
//   description?: string;
//   imageUrl?: string;
//   userId: string;
// }
export type ProductFormData = Partial<
  Omit<Product, "createdAt" | "updatedAt" | "version">
>;
