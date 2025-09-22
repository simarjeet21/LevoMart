"use client";
import { FaBox, FaPlusCircle, FaClipboardList } from "react-icons/fa";
export const sellerDashboardLinks = [
  {
    href: "/seller/products",
    icon: <FaBox className="text-2xl text-olive" />,
    title: "My Products",
  },
  {
    href: "/seller/add-product",
    icon: <FaPlusCircle className="text-2xl text-olive" />,
    title: "Add Product",
  },
  {
    href: "/seller/orders",
    icon: <FaClipboardList className="text-2xl text-olive" />,
    title: "Orders",
  },
];
