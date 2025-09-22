import { Button } from "@/components/ui/button";

type Props = {
  total: number;
  onCheckout: () => void;
};

export default function CartSummary({ total, onCheckout }: Props) {
  return (
    <div className="mt-6 bg-white p-6 rounded-2xl shadow space-y-4">
      <div className="flex justify-between text-lg font-semibold text-olive">
        <span>Total Amount:</span>
        <span>₹{total}</span>
      </div>
      <Button
        className="w-full bg-olive text-beige hover:bg-olive/90"
        onClick={onCheckout}
      >
        Proceed to Checkout
      </Button>
    </div>
  );
}
