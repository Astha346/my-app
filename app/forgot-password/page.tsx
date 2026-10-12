"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ShoppingBag } from "lucide-react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function ForgotPasswordPage() {
const [email, setEmail] = useState("");

const handleSubmit = async (e: React.FormEvent) => {
e.preventDefault();

try {
  const response = await api.post("/auth/forgot-password", {
    email,
  });

  const resetLink = response.data.resetLink;

  alert("Reset link generated");

  window.location.href = resetLink;
} catch (error: any) {
  alert(
    error.response?.data?.message ||
      "Something went wrong"
  );
}


};

return ( <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50 px-4 py-10 transition-colors duration-300 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950"> <Card className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl transition-colors duration-300 dark:border-slate-700 dark:bg-slate-900">
{/* Logo */} <div className="mb-8 flex flex-col items-center"> <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 dark:bg-blue-950"> <ShoppingBag className="h-8 w-8 text-blue-600 dark:text-blue-400" /> </div>

```
      <h1 className="mt-5 text-3xl font-bold text-slate-900 dark:text-white">
        Forgot Password
      </h1>

      <p className="mt-2 text-center text-sm text-slate-500 dark:text-slate-400">
        Enter your email and we will send you a reset password link.
      </p>
    </div>

    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="email"
          className="text-sm font-medium text-slate-700 dark:text-slate-200"
        >
          Email Address
        </label>

        <div className="relative mt-2">
          <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />

          <Input
            id="email"
            type="email"
            placeholder="admin@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-12 rounded-xl border-slate-200 bg-white pl-10 text-slate-900 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
          />
        </div>
      </div>

      <Button
        type="submit"
        className="h-12 w-full rounded-xl bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
      >
        Send Reset Link
      </Button>

      <div className="text-center">
        <Link
          href="/login"
          className="text-sm text-blue-600 hover:underline dark:text-blue-400"
        >
          Back to Login
        </Link>
      </div>
    </form>
  </Card>
</div>


);
}
