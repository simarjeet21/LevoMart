"use client";

import RequireAuth from "@/components/auth/RequireAuth";
import ProfileDashboard from "@/components/layouts/profile/ProfileDashboard";
//import ProfileCard from "@/components/layouts/ProfileCard";

export default function ProfilePage() {
  return (
    <RequireAuth>
      {/* <div className="min-h-screen bg-beige flex items-center justify-center px-6"> */}
      <div className="min-h-screen bg-beige py-10 px-6">
        <ProfileDashboard />
      </div>
    </RequireAuth>
  );
}
