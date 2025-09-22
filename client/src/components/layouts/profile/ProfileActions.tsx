"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

import { LogOut, Edit, MapPin, PackageCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProfileActions() {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!");
    router.push("/auth/login");
  };

  return (
    <div>
      <h3 className="text-xl font-bold text-olive mb-6">Account Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Solid Olive Button */}
        <Button
          className="w-full flex gap-2 justify-center hover:bg-olive/90"
          onClick={() => router.push("/profile/edit")}
        >
          <Edit size={18} /> Edit Profile
        </Button>

        {/* Outline buttons with olive hover background and text */}
        <Button
          variant="outline"
          className="w-full flex gap-2 justify-center border-olive text-olive hover:bg-olive hover:text-white"
          onClick={() => router.push("/profile/address")}
        >
          <MapPin size={18} /> Manage Address
        </Button>

        <Button
          variant="outline"
          className="w-full flex gap-2 justify-center border-olive text-olive hover:bg-olive hover:text-white"
          onClick={() => router.push("/orders")}
        >
          <PackageCheck size={18} /> View Orders
        </Button>

        {/* Logout with olive hover underline */}
        <Button
          variant="ghost"
          className="w-full flex gap-2 justify-center text-red-600 hover:text-olive hover:underline"
          onClick={handleLogout}
        >
          <LogOut size={18} /> Logout
        </Button>
      </div>
    </div>
  );
}
