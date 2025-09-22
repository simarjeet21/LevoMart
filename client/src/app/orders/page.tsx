"use client";

import OrderCard from "@/components/layouts/order/OrderCard";
import OrderEmptyState from "@/components/layouts/emptyStates/orderEmptyState";
import axiosInstance from "@/lib/axios";
import { useProtectedRoute } from "@/lib/useProtectedRoute";
import { OrderResponse } from "@/types/order";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { toast } from "sonner";
// const SAMPLE_ORDERS: OrderResponse[] = [
//   {
//     id: "order1",
//     userId: "user1",
//     status: "DELIVERED",
//     expiresAt: null,
//     createdAt: new Date("2025-07-10T10:00:00Z"),
//     updatedAt: new Date("2025-07-10T12:00:00Z"),
//     version: 1,
//     orderItems: [
//       {
//         id: "item1",
//         productId: "1",
//         productName: "HandBag",
//         productPrice: 999,
//         quantity: 2,
//         totalPrice: 1998,
//         createdAt: new Date("2025-07-10T10:00:00Z"),
//         updatedAt: new Date("2025-07-10T12:00:00Z"),
//         version: 1,
//         orderId: "order1",
//         sellerId: "seller1",
//         // You can add extra fields for UI
//       },
//     ],
//   },
//   {
//     id: "order2",
//     userId: "user1",
//     status: "PROCESSING",
//     expiresAt: null,
//     createdAt: new Date("2025-07-11T14:30:00Z"),
//     updatedAt: new Date("2025-07-11T15:00:00Z"),
//     version: 1,
//     orderItems: [
//       {
//         id: "item2",
//         productId: "2",
//         productName: "Mens sneakers",
//         productPrice: 799,
//         quantity: 1,
//         totalPrice: 799,
//         createdAt: new Date("2025-07-11T14:30:00Z"),
//         updatedAt: new Date("2025-07-11T15:00:00Z"),
//         version: 1,
//         orderId: "order2",
//         sellerId: "seller2",
//       },
//     ],
//   },
//   {
//     id: "order3",
//     userId: "user1",
//     status: "CANCELLED",
//     expiresAt: null,
//     createdAt: new Date("2025-07-09T09:15:00Z"),
//     updatedAt: new Date("2025-07-09T10:00:00Z"),
//     version: 1,
//     orderItems: [
//       {
//         id: "item3",
//         productId: "3",
//         productName: "Headphones",
//         productPrice: 1299,
//         quantity: 1,
//         totalPrice: 1299,
//         createdAt: new Date("2025-07-09T09:15:00Z"),
//         updatedAt: new Date("2025-07-09T10:00:00Z"),
//         version: 1,
//         orderId: "order3",
//         sellerId: "seller3",
//       },
//     ],
//   },
// ];
export default function OrdersPage() {
  useProtectedRoute("USER");
  // must be logged in

  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get("/order")
      .then((res) => setOrders(res.data))
      .catch(() => toast.error("Failed to fetch orders"))
      .finally(() => setLoading(false));
    //setOrders(SAMPLE_ORDERS);
    setLoading(false);
  }, []);

  const cancelOrder = async (orderId: string) => {
    try {
      const orderDeleteRes = await axiosInstance.delete(`/order/${orderId}`);
      const deletedOrderRes: OrderResponse = orderDeleteRes.data;
      if (!deletedOrderRes) throw new Error("Failed to cancel order");
      toast.success("Order cancelled successfully");
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: "CANCELLED" } : o))
      );
    } catch {
      toast.error("Failed to cancel order");
    }
  };

  if (loading) {
    return (
      <motion.div
        className="flex items-center justify-center min-h-[60vh] text-olive"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-olive border-t-transparent"></div>
          <span className="text-lg font-medium">Loading Products...</span>
        </div>
      </motion.div>
    );
  }

  if (!orders.length) {
    return (
      <div className="flex flex-col py-20">
        <main className="flex-1 flex items-center justify-center">
          <OrderEmptyState />
        </main>
      </div>
    );
  }

  return (
    <section className="bg-beige py-6 px-6 text-olive">
      <div className="max-w-4xl mx-auto mt-10 p-4">
        <h1 className="text-2xl font-bold mb-6 text-olive">📦 Your Orders</h1>
        <div className="space-y-6">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} onCancel={cancelOrder} />
          ))}
        </div>
      </div>
    </section>
  );
}
