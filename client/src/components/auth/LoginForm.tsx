"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
type ErrorResponse = {
  message: string;
};

export default function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  //const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // ✅ Stop the page from reloading

    try {
      const res = await axiosInstance.post("/auth/login", {
        username,
        password,
      });
      const { token } = res.data;

      if (token) {
        await login(token);
        router.push("/");
      } else {
        alert("Invalid credentials");
      }
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      alert(err.response?.data?.message || "Login failed");
      console.error("Login error:", err);
    }
  };

  return (
    <form
      className=" bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      onSubmit={handleLogin}
    >
      <h2 className="text-2xl font-bold text-olive mb-6">Login to LevoMart</h2>
      {/* <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full mb-4 p-3 border border-olive/30 rounded"
      /> */}
      <input
        // type="email"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full mb-4 p-3 border border-olive/30 rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full mb-6 p-3 border border-olive/30 rounded"
      />
      <Button
        type="submit"
        className="w-full bg-olive text-beige hover:bg-olive/90"
      >
        Login
      </Button>
    </form>
  );
}
