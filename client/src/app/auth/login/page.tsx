"use client";

import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  // console.log("LoginPage");
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-beige px-4 py-20">
      <div>
        <LoginForm />
      </div>
    </div>
  );
}
