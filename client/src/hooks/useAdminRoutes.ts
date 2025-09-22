import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export function useAdminRoute() {
  const { user, isLoggedIn } = useAuth();
  const role = user?.role;
  const loading = !isLoggedIn;

  const router = useRouter();

  useEffect(() => {
    if (!loading && role !== "ADMIN") {
      router.push("/");
    }
  }, [role, loading]);
}
