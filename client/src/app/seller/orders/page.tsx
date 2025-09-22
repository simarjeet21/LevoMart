"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";

import { motion } from "framer-motion";

import { OrderResponse, OrderStatus } from "@/types/order";

import Loading from "@/components/utility-component/Loading";
import EmptyState from "@/components/layouts/emptyStates/EmptyState";
import { useProtectedRoute } from "@/lib/useProtectedRoute";
import SellerOrderCard from "@/components/layouts/order/SellerOrderCard";

const STATUS_OPTIONS: OrderStatus[] = [
  "PENDING",
  "CANCELLED",
  "COMPLETED",
  "AWAITING_PAYMENT",
];
// const dummyOrderItems: OrderItemResponse[] = [
//   {
//     id: "dummy-item-id",
//     productId: "product-123",
//     productName: "Dummy Product",
//     productPrice: 99,
//     quantity: 1,
//     totalPrice: 99,
//     createdAt: new Date(),
//     updatedAt: new Date(),
//     version: 0,
//     orderId: "order-123",
//     sellerId: "seller-123",
//   },
// ];
// const dummyOrder: OrderResponse = {
//   id: "dummy-id",
//   userId: "buyer-123",
//   status: "PENDING",
//   expiresAt: null,
//   createdAt: new Date(),
//   updatedAt: new Date(),
//   version: 0,
//   orderItems: dummyOrderItems,
// };

export default function SellerOrdersPage() {
  useProtectedRoute("SELLER");
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      console.log("fetching selelr orders");
      const res = await axiosInstance.get("/order/seller");
      console.log(res.data.orders);
      setOrders(res.data);
      // setOrders([dummyOrder]);
    } catch {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (itemId: string, newStatus: string) => {
    try {
      await axiosInstance.patch("/order/seller/update", {
        id: itemId,
        status: newStatus,
      });
      toast.success("Status updated");
      fetchOrders();
    } catch {
      toast.error("Failed to update status");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <Loading message="Loading orders..." />;
  if (!orders.length)
    return (
      <div className="flex flex-col py-20">
        <main className="flex-1 flex items-center justify-center">
          <EmptyState
            title="No Orders Available"
            description="Please check back later or contact support."
          />
        </main>
      </div>
    );

  return (
    <motion.div
      className="max-w-5xl mx-auto mt-10 px-4 space-y-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="text-3xl font-bold text-olive">📦 Seller Orders</h1>

      {orders.map((order) => (
        <SellerOrderCard
          key={order.id}
          order={order}
          handleStatusChange={handleStatusChange}
          statusOptions={STATUS_OPTIONS}
        />
      ))}
    </motion.div>
  );
}
