"use client";

import Link from "next/link";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

import { sellerDashboardLinks } from "@/constants/navLink";

export default function SellerDashboard() {
  return (
    <motion.div
      className="max-w-5xl mx-auto mt-12 px-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h1 className="text-3xl font-bold text-olive mb-6 text-center">
        Seller Dashboard
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sellerDashboardLinks.map((link) => (
          <Link key={link.href} href={link.href}>
            <Card className="hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer">
              <CardContent className="p-6 flex flex-col items-center justify-center gap-3">
                {link.icon}
                <CardTitle className="text-xl text-center text-olive">
                  {link.title}
                </CardTitle>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}
