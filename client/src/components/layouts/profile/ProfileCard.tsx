// "use client";

// export default function ProfileCard() {
//   return (
//     <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
//       <h2 className="text-2xl font-bold text-olive mb-4">My Profile</h2>
//       <p className="mb-2 text-olive">Name: Rajan Bansal</p>
//       <p className="mb-2 text-olive">Email: rajan@example.com</p>
//       {/* Add more user data */}
//     </div>
//   );
// }
"use client";

// import Image from "next/image";
import { format } from "date-fns";

const dummyUser = {
  id: "user123",
  name: "Rajan Bansal",
  email: "rajan@example.com",
  joinedAt: new Date("2024-01-10"),
  profilePic: "https://i.pravatar.cc/150?img=3", // you can use avatar generator or static image
};

export default function ProfileCard() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full space-y-6 text-olive">
      <div className="flex items-center space-x-4">
        {/* <Image
          src={dummyUser.profilePic}
          alt={dummyUser.name}
          width={64}
          height={64}
          className="rounded-full object-cover"
        /> */}
        <div>
          <h2 className="text-2xl font-bold">{dummyUser.name}</h2>
          <p className="text-sm text-olive/60">{dummyUser.email}</p>
        </div>
      </div>

      <div className="text-sm text-olive/60">
        Member since:{" "}
        <span className="font-medium text-olive">
          {format(dummyUser.joinedAt, "MMMM yyyy")}
        </span>
      </div>

      <div className="flex flex-col gap-3">
        <button className="w-full bg-olive text-white py-2 rounded-xl font-semibold hover:bg-olive/90 transition">
          Edit Profile
        </button>
        <button className="w-full border border-olive text-olive py-2 rounded-xl font-semibold hover:bg-olive/10 transition">
          View My Orders
        </button>
        <button className="w-full text-red-600 font-semibold py-2 hover:underline">
          Logout
        </button>
      </div>
    </div>
  );
}
