"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

export default function SuccessPageContent() {
  const params = useSearchParams();
  const sessionId = params?.get("session_id");
  const [paymentInfo, setPaymentInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      if (!sessionId) return;

      try {
        const res = await axios.get(
          `/api/payments/session-info?session_id=${sessionId}`
        );
        setPaymentInfo(res.data);
      } catch (err) {
        console.error("Failed to fetch session info", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [sessionId]);

  if (loading) return <p>Loading payment status...</p>;

  return (
    <div className="p-4 text-center">
      <h1 className="text-3xl font-bold text-green-600">
        ✅ Payment Successful
      </h1>
      <p className="text-gray-600 mt-2">Thank you for your order!</p>

      <div className="mt-6 text-left max-w-xl mx-auto bg-gray-100 p-4 rounded">
        <h2 className="font-semibold mb-2">Stripe Session Info:</h2>
        <pre className="text-xs overflow-x-scroll">
          {JSON.stringify(paymentInfo, null, 2)}
        </pre>
      </div>
    </div>
  );
}
