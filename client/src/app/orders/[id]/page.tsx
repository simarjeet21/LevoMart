// app/orders/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axiosInstance from "@/lib/axios";
import { format } from "date-fns";
import { toast } from "sonner";
import { Order } from "@/types/order";
import { useProtectedRoute } from "@/lib/useProtectedRoute";

export default function OrderDetailPage() {
  useProtectedRoute("USER");
  const id = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get(`/orders/${id}`)
      .then((res) => setOrder(res.data))
      .catch(() => toast.error("Failed to fetch order"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-6 text-center">Loading order...</div>;
  if (!order) return <div className="p-6 text-center">Order not found</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Order Details</h1>

      <div className="bg-white p-4 rounded shadow">
        <div className="flex justify-between items-center mb-2">
          <div>
            <p className="text-sm text-gray-600">Order ID</p>
            <p className="font-medium">{order.id}</p>
          </div>
          <span
            className={`text-sm px-3 py-1 rounded-full ${
              order.status === "COMPLETED"
                ? "bg-green-100 text-green-700"
                : order.status === "PENDING"
                ? "bg-yellow-100 text-yellow-700"
                : order.status === "CANCELLED"
                ? "bg-red-100 text-red-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {order.status}
          </span>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          Placed on: {format(new Date(order.createdAt), "dd MMM yyyy")}
        </p>

        <div className="space-y-3 mb-4">
          {order.items.map((item) => (
            <div
              key={item.productId}
              className="flex justify-between border-b pb-2"
            >
              <div>
                <p className="font-medium">{item.productName}</p>
                <p className="text-sm text-gray-600">
                  Qty: {item.quantity} × ₹{item.productPrice}
                </p>
              </div>
              <p className="font-bold">₹{item.quantity * item.productPrice}</p>
            </div>
          ))}
        </div>

        <div className="text-right font-bold text-lg">
          Total: ₹{order.totalPrice}
        </div>

        {/* Optional Actions */}
        {order.status === "PENDING" && (
          <button
            onClick={() => cancelOrder(order.id)}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Cancel Order
          </button>
        )}
      </div>
    </div>
  );

  function cancelOrder(orderId: string) {
    axiosInstance
      .delete(`/order/${orderId}`)
      .then(() => {
        toast.success("Order cancelled");
        setOrder((prev) => prev && { ...prev, status: "CANCELLED" });
      })
      .catch(() => toast.error("Failed to cancel order"));
  }
}
