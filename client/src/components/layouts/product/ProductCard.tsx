"use client";

import { Button } from "@/components/ui/button";
import { Product, ProductFormData } from "@/types/product";

import Link from "next/link";

interface ProductCardProps {
  product: Product | ProductFormData;
  quantity: number;
  onQuantityChange: (qty: number) => void;
  onAddToCart: () => void;
}

export default function ProductCard({
  product,
  onAddToCart,
  quantity,
  onQuantityChange,
}: ProductCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-6 flex flex-col">
      {/* Link wraps only non-interactive content */}
      <Link href={`/product/${product.id}`} className="cursor-pointer group">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-48 object-cover rounded mb-4"
          />
        ) : (
          <div className="bg-[#f0f0f0] h-48 mb-4 rounded-lg flex items-center justify-center">
            <span className="text-5xl">📦</span>
          </div>
        )}

        <h2 className="text-xl font-semibold text-olive mb-2">
          {product.name}
        </h2>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
      </Link>
      <div className="mt-auto">
        <p className="text-lg font-bold text-olive mb-1">₹{product.price}</p>
        <p className="text-xs text-gray-500">{product.category}</p>
        {product.stock !== undefined && (
          <p className="text-xs text-gray-400">In stock: {product.stock}</p>
        )}
        <div className="flex items-center gap-2 mt-2">
          <input
            type="number"
            min={1}
            max={product.stock || 100}
            value={quantity}
            onChange={(e) => {
              //setQuantity(Number(e.target.value));
              onQuantityChange(Number(e.target.value));
            }}
            className="w-16 border rounded px-2 py-1 text-sm"
          />
          <Button onClick={onAddToCart}>Add to Cart</Button>
        </div>
      </div>
    </div>
  );
}
