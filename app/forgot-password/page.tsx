"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ShoppingBag } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
const [email, setEmail] = useState("");

const handleSubmit = (
e: React.FormEvent
) => {
e.preventDefault();

console.log(email);

// await api.post("/auth/forgot-password", {
//   email,
// });

};

return ( <div className="min-h-screen flex items-center justify-center  px-4"> 
  <Card className="w-full max-w-md rounded-3xl border border-zinc-800 bg-white p-8 shadow-2xl">
     <div className="flex flex-col items-center mb-8"> 
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">
             <ShoppingBag className="h-8 w-8 text-blue-600" /> 
             </div>

      <h1 className="mt-5 text-3xl font-bold text-gray-900">
        Forgot Password
      </h1>

      <p className="mt-2 text-center text-sm text-gray-500">
        Enter your email address and we
        will send you a password reset link.
      </p>
    </div>

    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Email Address
        </label>

        <div className="relative">
          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

          <Input
            type="email"
            placeholder="admin@gmail.com"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="h-12 pl-10 rounded-xl"
          />
        </div>
      </div>

      <Button
        type="submit"
        className="h-12 w-full rounded-xl bg-blue-600 text-white hover:bg-blue-700"
      >
        Send Reset Link
      </Button>

      <div className="text-center">
        <Link
          href="/login"
          className="text-sm text-blue-600 hover:underline"
        >
          Back to Login
        </Link>
      </div>
    </form>
  </Card>
</div>


);
}
