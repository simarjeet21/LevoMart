"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";
import { motion } from "framer-motion";

import { SellerOrder } from "@/types/order";
import { Card, CardContent } from "@/components/ui/card";
import { useProtectedRoute } from "@/lib/useProtectedRoute";

export default function SellerOrderDetailsPage() {
  useProtectedRoute("SELLER");
  const id = useParams();
  const [order, setOrder] = useState<SellerOrder | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = async () => {
    try {
      const res = await axiosInstance.get(`/order/seller/${id}`);
      setOrder(res.data); // assuming backend returns { order: {...} }
    } catch {
      toast.error("Failed to load order");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchOrder();
  }, [id]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (!order) return <div className="text-center mt-10">Order not found</div>;

  return (
    <motion.div
      className="max-w-3xl mx-auto mt-10 px-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h1 className="text-3xl font-bold text-olive mb-6">
        📄 Order Details: {order.orderId}
      </h1>

      <Card className="bg-white shadow-sm rounded-xl">
        <CardContent className="p-6 space-y-4">
          <div>
            <span className="font-medium text-olive">Buyer:</span>{" "}
            {order.buyerName}
          </div>
          {/* <div>
            <span className="font-medium text-olive">Created At:</span>{" "}
            {new Date(order.createdAt).toLocaleString()}
          </div> */}

          <div className="border-t pt-4 space-y-4">
            {order.items.map((item) => (
              <div
                key={item.itemId}
                className="flex justify-between items-center border-b pb-2"
              >
                <div>
                  <div className="font-medium text-olive">
                    {item.productName}
                  </div>
                  <div className="text-sm text-olive/70">
                    Quantity: {item.quantity}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-olive font-semibold">₹{item.price}</div>
                  <div className="text-sm text-olive/60">{item.status}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
