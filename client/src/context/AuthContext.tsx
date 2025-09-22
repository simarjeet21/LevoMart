"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";
import Role from "@/types/role";
// Define your user and role types

interface User {
  userId: string;
  name: string;
  email: string;
  role: Role;
}
interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
}
// const dummyUser: User = {
//   id: "user123",
//   name: "Rajan Bansal",
//   email: "rajan@example.com",
//   role: "SELLER",
// };

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get("/auth/current-user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(res.data);
        setUser(res.data); // Must match the User interface
        //setUser(dummyUser);
      } catch (err) {
        console.error("❌ AuthContext: Failed to fetch current user", err);
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    function isTokenExpired(token: string): boolean {
      try {
        const { exp } = jwtDecode<{ exp: number }>(token);
        return Date.now() >= exp * 1000;
      } catch {
        return true;
      }
    }
    isTokenExpired(token);

    fetchUser();
  }, []);

  const login = async (token: string) => {
    localStorage.setItem("token", token);
    try {
      const res = await axiosInstance.get("/auth/current-user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch (err) {
      console.error("❌ Login failed to fetch user", err);
      localStorage.removeItem("token");
      setUser(null);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/auth/login");
  };
  /**
   * Logs the user out by clearing the authentication token from localStorage,
   * setting the user state to null, and redirecting to the login page.
   */

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
