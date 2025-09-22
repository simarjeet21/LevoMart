"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/lib/axios";
import { Product } from "@/types/product";

import { AddToCartDto } from "@/types/cart";
import EmptyState from "@/components/layouts/emptyStates/EmptyState";
import { motion } from "framer-motion";
import { useProtectedRoute } from "@/lib/useProtectedRoute";
export default function ProductPage() {
  useProtectedRoute("USER");
  const params = useParams();
  const id = params?.id;
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        //console.log(id);
        //const id = id.id;

        const res = await axiosInstance.get(`/product/user/${id}`);
        setProduct(res.data);
      } catch {
        toast.error("Product not found");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const addToCart = async () => {
    if (!product) return;

    const payload: AddToCartDto = {
      productId: product.id,
      quantity: quantity,
      productName: product.name,
      productPrice: product.price,
      sellerId: product.userId,
    };
    try {
      await axiosInstance.post("/cart/add", payload);
      toast.success("Added to cart");
    } catch {
      toast.error("Failed to add to cart");
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
  if (!product) {
    return (
      <div className="flex flex-col py-20">
        <main className="flex-1 flex items-center justify-center">
          <EmptyState
            title="Product Not Available"
            description="Please check back later or contact support."
          />
        </main>
      </div>
    );
  }

  return (
    <section className="bg-beige py-8 px-6 text-olive">
      <div className="max-w-5xl mx-auto p-6 bg-white rounded-2xl shadow-lg grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Image */}
        <div className="bg-[#f0f0f0] h-64 rounded-lg flex items-center justify-center overflow-hidden">
          {/* {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="object-cover h-full w-full"
            />
          ) : (
            <span className="text-5xl">📦</span>
          )} */}
          {product.imageUrl ? (
            // If using next/image, uncomment below and import Image from "next/image"
            // <Image
            //   src={product.imageUrl}
            //   alt={product.name}
            //   width={200}
            //   height={200}
            //   className="object-contain w-full h-full"
            // />
            <img
              src={product.imageUrl}
              alt={product.name}
              className="object-contain w-full h-full"
            />
          ) : (
            <span className="text-olive/40 text-6xl">📦</span>
          )}
        </div>

        {/* Info */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-xl font-semibold text-olive mb-2">
            ₹{product.price}
          </p>
          <p className="text-gray-600 mb-4">{product.description}</p>
          <p className="text-xs text-gray-500 mb-2">
            Category: {product.category}
          </p>
          <p className="text-xs text-gray-500 mb-4">
            Seller ID: {product.userId}
          </p>

          <div className="flex items-center gap-4 mb-4">
            <input
              type="number"
              min={1}
              max={product.stock || 100}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
              className="w-20 border border-olive/30 rounded px-3 py-2 text-sm text-olive focus:outline-none focus:ring-2 focus:ring-olive/40"
            />
            <Button
              onClick={addToCart}
              disabled={product.stock === 0}
              className={
                product.stock === 0 ? "opacity-50 cursor-not-allowed" : ""
              }
            >
              {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </Button>
          </div>

          <p className="text-sm text-gray-400">
            {product.stock === 0
              ? "Currently unavailable"
              : `In stock: ${product.stock}`}
          </p>
        </div>
      </div>
    </section>
  );
}
