"use client";
import { OrderResponse } from "@/types/order";
import { format } from "date-fns";
import { toast } from "sonner";
import Link from "next/link";
import { jsPDF } from "jspdf";
import axiosInstance from "@/lib/axios";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Truck, X, Download, Repeat } from "lucide-react";
import { AddToCartDto } from "@/types/cart";
type Props = {
  order: OrderResponse;
  onCancel?: (orderId: string) => void;
};

const StatusBadge = ({ status }: { status: string }) => {
  const colorMap: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-700",
    PAID: "bg-blue-100 text-blue-700",
    COMPLETED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
  };
  return (
    <span
      className={`px-4 py-1 rounded-xl text-sm font-semibold ${
        colorMap[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
};

export default function OrderCard({ order, onCancel }: Props) {
  const deliveryDate = format(
    new Date(new Date(order.createdAt).getTime() + 5 * 24 * 60 * 60 * 1000),
    "dd MMM yyyy"
  );
  const orderTotal = useMemo(
    () =>
      order.orderItems.reduce(
        (total, item) => total + item.productPrice * item.quantity,
        0
      ),
    [order]
  );

  const [reorderLoading, setReorderLoading] = useState(false);

  const handleReorder = async () => {
    try {
      setReorderLoading(true);
      //makwe a payload first of cart request dto then make request
      const cartRequests: AddToCartDto[] = order.orderItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        productName: item.productName,
        productPrice: item.productPrice,
        sellerId: item.sellerId,
      }));
      await Promise.all(
        cartRequests.map((payload) =>
          axiosInstance.post("/api/cart/add", payload)
        )
      );
      toast.success("Items added to cart!");
    } catch (err) {
      toast.error("Some items couldn't be added.");
      console.error(err);
    } finally {
      setReorderLoading(false);
    }
  };
  const downloadInvoice = () => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text("LevoMart Invoice", 20, 20);
      doc.setFontSize(12);
      doc.text(`Order ID: ${order.id}`, 20, 35);
      doc.text(
        `Date: ${format(new Date(order.createdAt), "dd MMM yyyy")}`,
        20,
        45
      );

      let y = 60;
      order.orderItems.forEach((item, index) => {
        doc.text(
          `${index + 1}. ${item.productName} - ₹${item.productPrice} × ${
            item.quantity
          }`,
          20,
          y
        );
        y += 10;
      });

      doc.text(`Total: ₹${orderTotal.toFixed(2)}`, 20, y + 10);
      doc.save(`invoice-${order.id}.pdf`);
    } catch (error) {
      toast.error("Failed to generate invoice.");
      console.error(error);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl shadow-md p-6 space-y-4"
    >
      <div className="flex justify-between items-center">
        <Link href={`/orders/${order.id}`} className="block hover:underline">
          <div>
            <h2 className="text-xl font-semibold text-olive mb-1">
              Order ID: {order.id}
            </h2>
            <p className="text-sm text-olive/60">
              Placed on {format(new Date(order.createdAt), "dd MMM yyyy")}
            </p>
            <p className="text-sm text-olive/50">
              Est. Delivery: {deliveryDate}
            </p>
          </div>
        </Link>
        <StatusBadge status={order.status} />
      </div>

      <div className="divide-y divide-olive/10">
        {order.orderItems.map((item) => (
          <div
            key={item.productId}
            className="flex justify-between py-4 items-center"
          >
            <div className="flex items-center gap-3">
              {/* <img
                src={`/images/products/${item.productId}.jpg`}
                alt={`Image of ${item.productName}`}
                loading="lazy"
                className="w-14 h-14 object-cover rounded-md"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "/images/placeholder.jpg";
                }}
              /> */}
              <div>
                <p className="font-medium text-olive">{item.productName}</p>
                <p className="text-sm text-olive/60">
                  ₹{item.productPrice} × {item.quantity}
                </p>
              </div>
            </div>
            <div className="text-right font-bold text-olive">
              ₹{item.productPrice * item.quantity}
            </div>
          </div>
        ))}
      </div>

      <div className="text-right font-bold text-olive text-lg mt-2">
        Total: ₹{orderTotal}
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4 flex-wrap">
        {order.status === "PENDING" && (
          <>
            <button
              className="px-4 py-2 bg-olive text-white rounded-xl font-semibold hover:bg-olive/90 focus:outline-none focus:ring-2 focus:ring-olive/60 transition inline-flex items-center gap-2"
              onClick={() => {
                toast.info(`Tracking order ${order.id}... 🚚`);
              }}
              aria-label="Track Order"
            >
              <Truck size={16} /> Track Order
            </button>
            <button
              className="px-4 py-2 border border-red-600 text-red-600 rounded-xl font-semibold hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-400 transition inline-flex items-center gap-2"
              onClick={() => {
                if (onCancel) onCancel(order.id);
                toast.success("Order cancelled successfully!");
              }}
              aria-label="Cancel Order"
            >
              <X size={16} /> Cancel Order
            </button>
          </>
        )}

        {order.status === "COMPLETED" && (
          <>
            <button
              onClick={handleReorder}
              disabled={reorderLoading}
              aria-label="Reorder Items"
              className={`px-4 py-2 bg-olive text-white rounded-xl font-semibold transition inline-flex items-center gap-2 ${
                reorderLoading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-olive/90"
              }`}
            >
              <Repeat size={16} /> Reorder
            </button>
            <button
              onClick={downloadInvoice}
              aria-label="Download Invoice"
              className="px-4 py-2 border border-olive text-olive rounded-xl font-semibold hover:bg-olive/10 transition inline-flex items-center gap-2"
            >
              <Download size={16} /> Download Invoice
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
}
