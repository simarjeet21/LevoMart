"use client";

import { motion } from "framer-motion";
import { useProtectedRoute } from "@/lib/useProtectedRoute";

import CartItemCard from "@/components/layouts/cart/CartItemCard";
import CartSummary from "@/components/layouts/cart/CartSummary";
import { useCart } from "@/hooks/useCart";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { CreateOrderDto, OrderItemDto, OrderResponse } from "@/types/order";
import { paymentRequestDto } from "@/types/payment";
import RequireAuth from "@/components/auth/RequireAuth";
import CartEmptyState from "@/components/layouts/emptyStates/cartEmptyState";
//import { CartItem } from "@/types/cart";
// const SAMPLE_CART_ITEMS = [
//   {
//     productId: "1",
//     productName: "HandBag",
//     sellerId: "seller1",
//     price: 999,
//     quantity: 2,
//     totalPrice: 1998,
//     imageUrl: "/images/handbag.png",
//   },
//   {
//     productId: "2",
//     productName: "Mens sneakers",
//     sellerId: "seller2",
//     price: 799,
//     quantity: 1,
//     totalPrice: 799,
//     imageUrl: "/images/sneakers.png",
//   },
//   {
//     productId: "3",
//     productName: "Headphones",
//     sellerId: "seller3",
//     price: 1299,
//     quantity: 1,
//     totalPrice: 1299,
//     imageUrl: "/images/headphones.png",
//   },
// ];
export default function CartPage() {
  useProtectedRoute(); // must be logged in
  const { items, total, loading, updateQuantity, removeItem, clearCart } =
    useCart();
  // const items = SAMPLE_CART_ITEMS;
  // const total = items.reduce((sum, item) => sum + item.totalPrice, 0);
  // const loading = false;
  // const updateQuantity = () => {};
  // const removeItem = () => {};
  // const clearCart = () => {};

  const router = useRouter();
  const handleCheckout = async () => {
    try {
      const payload: CreateOrderDto = {
        items: items.map<OrderItemDto>((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      };

      const orderRes = await axiosInstance.post("/order/create", payload);
      const order: OrderResponse = orderRes.data;

      const totalAmount = order.orderItems.reduce(
        (sum, item) => sum + item.totalPrice,
        0
      );
      const paymentPayload: paymentRequestDto = {
        orderId: order.id,
        amount: totalAmount,
        userId: order.userId,
        currency: "INR",
      };
      try {
        const paymentRes = await axiosInstance.post(
          "/payment/checkout",
          paymentPayload
        );
        //console.log(paymentRes);
        const paymentUrl = paymentRes.data?.checkoutUrl;

        if (paymentUrl && typeof paymentUrl === "string") {
          console.log("✅ Redirecting to payment:", paymentUrl);
          window.location.href = paymentUrl;
        } else {
          console.warn("⚠️ paymentUrl is missing or invalid", paymentUrl);
          toast.success("Order placed successfully!");
          router.push("/orders");
        }
        toast.success("Order placed successfully!");
      } catch (error) {
        console.error("Error in payment request ", error);
      }
    } catch (error) {
      console.error("❌ Checkout failed", error);
      toast.error("Checkout failed");
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
          <span className="text-lg font-medium">Loading cart...</span>
        </div>
      </motion.div>
    );
  }

  if (!items.length)
    return (
      <div className="flex flex-col py-20">
        <main className="flex-1 flex items-center justify-center">
          <CartEmptyState />
        </main>
      </div>
    );

  return (
    <RequireAuth>
      <section className="bg-beige py-6 px-6 text-olive">
        <motion.div
          className="container mx-auto mt-10 p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* <div className="max-w-3xl mx-auto mt-10 p-4"> */}
          <h1 className="text-3xl font-bold mb-6 text-olive">🛒 Your Cart</h1>

          <ul className="space-y-4">
            {items.map((item) => (
              <CartItemCard
                key={item.productId}
                item={{
                  productId: item.productId,
                  productName: item.productName,
                  sellerId: item.sellerId,
                  productPrice: item.price,
                  quantity: item.quantity,
                  totalPrice: item.totalPrice,
                  imageUrl: item.imageUrl,
                }}
                onQuantityChange={updateQuantity}
                onRemove={removeItem}
                onClearCart={clearCart}
              />
            ))}
          </ul>

          <CartSummary total={total} onCheckout={handleCheckout} />
        </motion.div>
      </section>
    </RequireAuth>
  );
}
