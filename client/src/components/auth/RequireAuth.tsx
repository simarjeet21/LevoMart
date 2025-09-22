"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RequireAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/auth/login"); // Redirect to login if not authenticated
    }
  }, [isLoggedIn, router]);

  return <>{isLoggedIn ? children : null}</>;
}
