"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FaUserCircle, FaBars, FaTimes } from "react-icons/fa";

import { useAuth } from "@/context/AuthContext";
import Logo from "./Logo";

type Role = "USER" | "SELLER" | "ADMIN" | null;

const roleLinks = {
  USER: [
    { label: "Home", href: "/" },
    { label: "Products", href: "/product" },
    { label: "Cart", href: "/cart" },
    { label: "Orders", href: "/orders" },
  ],
  SELLER: [
    { label: "Dashboard", href: "/seller/dashboard" },
    { label: "Products", href: "/seller/products" },
    { label: "Add Product", href: "/seller/add-product" },
    { label: "Orders", href: "/seller/orders" },
  ],
  ADMIN: [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Orders", href: "/admin/orders" },
    { label: "Products", href: "/admin/products" },
  ],
};

export default function Navbar() {
  const pathname = usePathname();
  const { isLoggedIn, user, logout, isLoading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  //const [loading, setLoading] = useState(true);

  // const [role, setRole] = useState<Role>(null);
  //const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (isLoading) {
    return (
      <div className="w-full bg-beige/90 backdrop-blur-md border-b border-olive/20 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto py-4 px-6 flex justify-between items-center">
          <Logo />
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-olive border-t-transparent"></div>
            <span className="text-olive font-medium">
              Checking login status...
            </span>
          </div>
        </div>
      </div>
    );
  }

  const role = user?.role?.toUpperCase() as Role;
  //const role = "USER"; // Default to USER for now, can be set based on user role

  const links = role ? roleLinks[role] : [];

  // useEffect(() => {
  //   setRole("USER");
  //   setIsLoggedIn(false);
  // }, []);

  //const links = role ? roleLinks[role] : [];

  return (
    <header className="w-full bg-beige/95 backdrop-blur-md border-b border-olive/20 shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto  py-1 ">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-lg font-medium text-olive/80 hover:text-olive transition-colors relative py-2",
                  pathname === link.href &&
                    "text-olive font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-olive after:rounded-full"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="hidden lg:flex items-center">
            {!isLoggedIn ? (
              <div className="flex gap-4">
                <Link href="/auth/login">
                  <Button
                    variant="outline"
                    className="border-2 border-olive text-olive hover:bg-olive hover:text-beige transition-colors px-6 py-2"
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button className="bg-olive text-beige hover:bg-olive/90 transition-colors px-6 py-2">
                    Sign Up
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-3 px-6 py-3 rounded-full bg-olive text-beige hover:bg-olive/90 transition-colors"
                >
                  <FaUserCircle className="text-xl" />
                  <span className="font-medium">{user?.name || "Profile"}</span>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-beige shadow-xl border border-olive/20 rounded-2xl z-50 py-2 overflow-hidden">
                    <Link
                      href="/profile"
                      className="block px-6 py-3 text-olive hover:bg-beige/50 transition-colors"
                    >
                      My Profile
                    </Link>
                    {/* <Link
                      href="/logout"
                      className="block px-6 py-3 text-red-600 hover:bg-red-50 transition-colors"
                    > */}
                    <button
                      onClick={logout}
                      className="w-full text-left px-6 py-3 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Logout
                    </button>
                    {/* </Link> */}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-olive"
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 p-4 bg-white rounded-2xl shadow-lg border border-olive/20">
            <div className="flex flex-col  gap-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-lg font-medium text-olive/80 hover:text-olive transition-colors py-2",
                    pathname === link.href && "text-olive font-semibold"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              {/* Mobile Auth */}
              <div className="border-t border-olive/20 pt-4 mt-4">
                {!isLoggedIn ? (
                  <div className="flex flex-col gap-3">
                    <Link href="/auth/login">
                      <Button
                        variant="outline"
                        className="border-2 border-olive text-olive hover:bg-olive hover:text-beige"
                      >
                        Login
                      </Button>
                    </Link>
                    <Link href="/auth/register">
                      <Button className="bg-olive text-beige hover:bg-olive/90">
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Link
                      href="/profile"
                      className="text-olive hover:text-olive/80 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      My Profile
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="text-red-600 hover:text-red-700 transition-colors text-left"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
