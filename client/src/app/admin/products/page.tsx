// "use client";

// import { useEffect, useState } from "react";

// import axiosInstance from "@/lib/axios";

// import { toast } from "sonner";
// import { motion } from "framer-motion";

// import { useAuth } from "@/context/AuthContext";

// import EmptyState from "@/components/layouts/emptyStates/EmptyState";

// export default function SellerProductPage() {
//   const [products, setProducts] = useState<SellerProduct[]>([]);
//   const [loading, setLoading] = useState(true);
//   const { user } = useAuth();
//   //if (user?.role !== "SELLER") return;
//   const fetchProducts = async () => {
//     try {
//       if (!user?.id || user?.role !== "ADMIN") return;
//       const sellerId = user?.id;
//       const res = await axiosInstance.get(`/product/admin/all`);
//       setProducts(res.data);
//     } catch {
//       toast.error("Failed to fetch products");
//     } finally {
//       setLoading(false);
//     }
//   };
//   useEffect(() => {
//     fetchProducts();
//   }, [user]);

//   const deleteProduct = async (id: string) => {
//     try {
//       if (user?.role !== "SELLER") return;
//       await axiosInstance.delete(`/product/seller/${id}`);
//       toast.success("Product deleted");
//       fetchProducts(); // refresh
//     } catch {
//       toast.error("Failed to delete product");
//     }
//   };
//   if (!user || user.role !== "SELLER") {
//     return (
//       <div className="text-center mt-10 text-red-600">Unauthorized Access</div>
//     );
//   }

//   if (loading) return <div className="text-center mt-10">Loading...</div>;
//   if (!products.length) return <EmptyState message="No products listed yet." />;

//   return (
//     <motion.div
//       className="max-w-4xl mx-auto mt-12 px-4"
//       initial={{ opacity: 0, y: 10 }}
//       animate={{ opacity: 1, y: 0 }}
//     >
//       <h1 className="text-3xl font-bold text-olive mb-6">📦 My Products</h1>

//       <div className="space-y-4">
//         {products.map((product) => (
//           <SellerProductCard
//             key={product.id}
//             product={product}
//             onDelete={deleteProduct}
//           />
//         ))}
//       </div>
//     </motion.div>
//   );
// }
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
import { useProtectedRoute } from "@/lib/useProtectedRoute";

export default function ProductsPage() {
  useProtectedRoute("ADMIN");
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
