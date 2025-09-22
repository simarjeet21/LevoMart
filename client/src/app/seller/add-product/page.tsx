"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";
import ProductForm from "@/components/layouts/product/ProductForm";
import axiosInstance from "@/lib/axios";
import { ProductFormData } from "@/types/product";
import { useProtectedRoute } from "@/lib/useProtectedRoute";

export default function AddProductPage() {
  useProtectedRoute("SELLER");
  const router = useRouter();

  const handleSubmit = async (data: ProductFormData) => {
    try {
      await axiosInstance.post("/product/seller/add", data);
      toast.success("Product created successfully");
      router.push("/seller/products");
    } catch {
      toast.error("Failed to create product");
    }
  };

  return (
    <motion.div
      className="max-w-2xl mx-auto mt-12 px-4 space-y-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h1 className="text-3xl font-bold text-olive mb-4"> Add New Product</h1>

      <ProductForm onSubmit={handleSubmit} />
    </motion.div>
  );
}
