// sample products
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";

import { useAuth } from "@/context/AuthContext";
import axiosInstance from "@/lib/axios";

import { AxiosError } from "axios";
import { Product } from "@/types/product";
import { AddToCartDto } from "@/types/cart";
import EmptyState from "@/components/layouts/emptyStates/EmptyState";
import ProductCard from "@/components/layouts/product/ProductCard";

// const SAMPLE_PRODUCTS: ProductFormData[] = [
//   {
//     userId: "1",
//     name: "HandBag",
//     description: "Stylish and durable handbag for everyday use.",
//     price: 999,
//     category: "Fashion accessories",
//     imageUrl:
//       "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcRUSicaXmNwfpnpf7Mcry7XgBvjExZFFd745_vpzZ7x-5rWpK5wpnPF4QhznpvWLhRfcHeXH7tILpmlOMbFgQb0mS11QDKB59CvCFDAlKPu4Ud_zP-Z9DIvNXlyye5d6AFn_J2khD-C&usqp=CAc",
//     stock: 10,
//   },
//   {
//     userId: "2",
//     name: "Mens sneakers",
//     description: "Comfortable and stylish sneakers for Men.",
//     price: 799,
//     category: "Shoes",
//     imageUrl: "/images/sneakers.png",
//     stock: 5,
//   },
//   {
//     userId: "3",
//     name: "Headphones",
//     description: "Premium quality headphones with noise cancellation.",
//     price: 1299,
//     category: "Electronics",
//     imageUrl: "/images/headphones.png",
//     stock: 8,
//   },
//   {
//     userId: "4",
//     name: "Mens wallet",
//     description: "Genuine leather wallet with multiple compartments.",
//     price: 499,
//     category: "Fashion accessories",
//     imageUrl: "/images/wallet.png",
//     stock: 15,
//   },
//   {
//     userId: "5",
//     name: "Mens shirt",
//     description: "Stylish and comfortable shirt for every occasion.",
//     price: 1599,
//     category: "Fashion",
//     imageUrl: "/images/shirt.png",
//     stock: 3,
//   },
// {
//   userId: "6",
//   name: "Sample Product 6",
//   description: "High demand sample product.",
//   price: 899,
//   category: "Sample",
//   stock: 12,
// },
// {
//   userId: "7",
//   name: "Sample Product 7",
//   description: "Limited edition sample product.",
//   price: 1999,
//   category: "Sample",
//   stock: 2,
// },
// {
//   userId: "8",
//   name: "Sample Product 8",
//   description: "Eco-friendly sample product.",
//   price: 699,
//   category: "Sample",
//   stock: 20,
// },
// {
//   userId: "9",
//   name: "Sample Product 9",
//   description: "Popular sample product among customers.",
//   price: 1099,
//   category: "Sample",
//   stock: 7,
// },
// {
//   userId: "10",
//   name: "Sample Product 10",
//   description: "Top-rated sample product.",
//   price: 1399,
//   category: "Sample",
//   stock: 6,
// },
//];
export default function ProductsPage() {
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    axiosInstance
      .get("/product/user")
      .then((res) => setProducts(res.data))
      .catch((err) => {
        console.error(
          "❌ Failed product list request:",
          err?.response?.data || err.message
        );
        toast.error("Failed to load products");
      })
      .finally(() => setLoading(false));
    // setProducts(SAMPLE_PRODUCTS);
    // setLoading(false);
  }, []);

  const addToCart = async (payload: AddToCartDto) => {
    if (!isLoggedIn) {
      toast.error("Please log in to add to cart");
      return;
    }

    if (payload.quantity <= 0) {
      toast.error("Quantity must be greater than 0");
      return;
    }

    try {
      await axiosInstance.post("/cart/add", payload);
      toast.success("Added to cart!");
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      console.log(err);
      toast.error(err.response?.data?.message || "Error adding to cart");
    }
  };

  const handleQuantityChange = (productId: string, qty: number) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(1, qty),
    }));
  };

  const getQuantity = (productId: string) => quantities[productId] || 1;

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
    <section className="bg-beige py-6 px-6 text-olive">
      {/* <section className="bg-beige text-olive  flex items-center justify-center px-6 "></section> */}
      <div className="max-w-4xl mx-auto p-4 bg-beige rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Products</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              quantity={getQuantity(product.id)}
              onQuantityChange={(qty) => handleQuantityChange(product.id, qty)}
              onAddToCart={() =>
                addToCart({
                  productId: product.id,
                  quantity: getQuantity(product.id),
                  productName: product.name,
                  productPrice: product.price,
                  sellerId: product.userId,
                })
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}
