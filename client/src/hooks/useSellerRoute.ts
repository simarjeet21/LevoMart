import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export function useSellerRoute() {
  const { user, isLoggedIn } = useAuth();
  const router = useRouter();
  const role = user?.role;
  const loading = !isLoggedIn;
  useEffect(() => {
    if (!loading && role !== "SELLER") {
      router.push("/");
    }
  }, [role, loading]);
}
