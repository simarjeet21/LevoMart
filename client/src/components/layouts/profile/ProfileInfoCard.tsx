// import Image from "next/image";
// import { format } from "date-fns";

import Role from "@/types/role";

interface Props {
  user: {
    userId: string;
    name: string;
    email: string;
    role?: Role;
    joinedAt?: string | Date;
    profilePic?: string;
    totalOrders?: number;
  };
}

export default function ProfileInfoCard({ user }: Props) {
  return (
    <div className="md:w-1/3 bg-olive/90 text-white p-8 flex flex-col items-center justify-center text-center gap-3">
      <img
        src={user.email || `https://i.pravatar.cc/150?u=${user.email}`}
        alt="profile"
        className="w-28 h-28 rounded-full object-cover border-4 border-white"
      />
      <h2 className="text-2xl font-bold">{user.name}</h2>
      <p className="text-white/80 text-sm">{user.email}</p>
      <p className="text-white/60 text-sm capitalize">
        Role: <span className="font-semibold">{user.role}</span>
      </p>
      {
        <p className="text-white/60 text-sm">
          Orders: <span className="font-semibold text-white"></span>
        </p>
      }
      {
        <p className="text-white/60 text-sm">
          Member since{" "}
          <span className="font-semibold text-white">
            {new Date().toLocaleDateString("en-IN", {
              month: "long",
              year: "numeric",
            })}
          </span>
        </p>
      }
    </div>
  );
}
