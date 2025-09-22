"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { FaEdit, FaTrash } from "react-icons/fa";

interface SellerProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    stock?: number;
  };
  onDelete: (id: string) => void;
}

export default function SellerProductCard({
  product,
  onDelete,
}: SellerProductCardProps) {
  return (
    <Card className="p-4 flex items-center justify-between bg-white shadow-sm rounded-xl">
      <div>
        <h2 className="text-lg font-semibold text-olive">{product.name}</h2>
        <p className="text-sm text-olive/70">
          ₹{product.price} | Stock: {product.stock ?? "N/A"}
        </p>
      </div>

      <div className="flex gap-3">
        <Link href={`/seller/products/${product.id}`}>
          <Button variant="outline" size="sm">
            <FaEdit className="mr-2" />
            Edit
          </Button>
        </Link>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(product.id)}
        >
          <FaTrash className="mr-2" />
          Delete
        </Button>
      </div>
    </Card>
  );
}
