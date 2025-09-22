// export default CartItemCard;
"use client";

//import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CartItem } from "@/types/cart";

type CartItemCardProps = {
  item: CartItem;
  onQuantityChange: (id: string, newQty: number) => void;
  onRemove: (id: string) => void;
  onClearCart: () => void;
};

export default function CartItemCard({
  item,
  onQuantityChange,
  onRemove,
  onClearCart,
}: CartItemCardProps) {
  return (
    <li className="flex justify-between items-center border p-4 rounded bg-white shadow-sm">
      <div className="flex items-center gap-4">
        {/* {item.imageUrl && (
          <Image
            src={item.imageUrl}
            alt={item.productName}
            width={60}
            height={60}
            className="rounded"
          />
        )} */}
        <div>
          <h2 className="text-lg font-semibold">{item.productName}</h2>
          <p>
            ₹ {item.productPrice} x {item.quantity}
          </p>
        </div>
      </div>

      <div className="flex gap-2 items-center">
        <input
          type="number"
          min={1}
          value={item.quantity}
          onChange={(e) =>
            onQuantityChange(item.productId, Number(e.target.value))
          }
          className="w-16 border px-2 py-1 rounded"
        />
        <Button variant="destructive" onClick={() => onRemove(item.productId)}>
          Remove
        </Button>
        <Button variant="destructive" onClick={() => onClearCart()}>
          Clear
        </Button>
      </div>
    </li>
  );
}
