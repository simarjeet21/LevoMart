"use client";

import { useAuth } from "@/context/AuthContext";

import { motion } from "framer-motion";
import ProfileInfoCard from "./ProfileInfoCard";
import ProfileActions from "./ProfileActions";

export default function ProfileDashboard() {
  const { user } = useAuth();

  if (!user) {
    return (
      <motion.div
        className="flex items-center justify-center min-h-[60vh] text-olive"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-olive border-t-transparent"></div>
          <span className="text-lg font-medium">Loading Your Profile...</span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row"
    >
      {/* Profile Info Side */}

      <ProfileInfoCard user={user} />

      {/* Actions Panel */}
      <div className="md:w-2/3 p-8 bg-beige">
        <ProfileActions />
      </div>
    </motion.div>
  );
}
