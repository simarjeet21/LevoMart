"use client";

import { useEffect, useState } from "react";

import axiosInstance from "@/lib/axios";

import { toast } from "sonner";
import { motion } from "framer-motion";

import { Product } from "@/types/product";
import { useAuth } from "@/context/AuthContext";

import EmptyState from "@/components/layouts/emptyStates/EmptyState";

import Loading from "@/components/utility-component/Loading";
import { useProtectedRoute } from "@/lib/useProtectedRoute";
import SellerProductCard from "@/components/layouts/product/SellerProductCard";

export default function SellerProductPage() {
  useProtectedRoute("SELLER");
  //useProtectedRoute("SELLER");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();

  const fetchProducts = async () => {
    try {
      console.log(user);
      console.log(user?.userId);
      console.log(user?.role);
      if (!user?.userId || user?.role !== "SELLER") {
        console.log("hefwuhfweihwefgihgih returning");
        return;
      }
      const sellerId = user?.userId;
      console.log("hefwuhfweihwefgihgih" + sellerId);
      const res = await axiosInstance.get(
        `/product/seller/listProducts/${sellerId}`
      );
      console.log(res.data);
      setProducts(res.data);
    } catch {
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (user?.role === "SELLER") {
      fetchProducts();
    }
  }, [user]);

  const deleteProduct = async (id: string) => {
    try {
      if (user?.role !== "SELLER") return;
      await axiosInstance.delete(`/product/seller/${id}`);
      toast.success("Product deleted");
      fetchProducts(); // refresh
    } catch {
      toast.error("Failed to delete product");
    }
  };

  if (loading) {
    return <Loading message="Loading products" />;
  }

  if (!products.length) {
    return (
      <div className="flex flex-col py-20">
        <main className="flex-1 flex items-center justify-center">
          <EmptyState
            title="No Products Available"
            description="Please check back later or contact support."
          />
        </main>
      </div>
    );
  }

  return (
    <section className="bg-beige py-10 px-4 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto"
      >
        <h1 className="text-3xl font-bold text-olive mb-8 text-center">
          🛒 My Listed Products
        </h1>

        <div className="grid gap-6">
          {products.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <SellerProductCard product={product} onDelete={deleteProduct} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
