"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function CancelPage() {
  const router = useRouter();

  return (
    <div className="text-center p-8">
      <h1 className="text-2xl font-bold text-red-600">❌ Payment Cancelled</h1>
      <p className="mt-2 text-gray-600">
        It looks like your payment was not completed.
      </p>

      <div className="mt-6">
        <Button onClick={() => router.push("/cart")}>Return to Cart</Button>
      </div>
    </div>
  );
}
