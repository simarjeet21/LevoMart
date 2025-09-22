import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";
import { CartItemResponse } from "@/types/cart";

export function useCart() {
  const [items, setItems] = useState<CartItemResponse[]>([]);
  const [totaiItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      const res = await axiosInstance.get("/cart");
      setItems(res.data.items);
      setTotalItems(res.data.totalItems);
      console.log(res.data);
    } catch {
      toast.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    try {
      await axiosInstance.put("/cart/update", { id, quantity });
      fetchCart();
      toast.success("Updated quantity");
    } catch {
      toast.error("Update failed");
    }
  };

  const removeItem = async (id: string) => {
    try {
      await axiosInstance.delete(`/cart/remove/${id}`);
      fetchCart();
      toast.success("Item removed");
    } catch {
      toast.error("Remove failed");
    }
  };
  const clearCart = async () => {
    try {
      await axiosInstance.delete("/cart/clear");
      fetchCart();
      toast.success("Cart cleared");
    } catch {
      toast.error("Clear failed");
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return {
    items,
    loading,
    total,
    updateQuantity,
    removeItem,
    totaiItems,
    clearCart,
  };
}
