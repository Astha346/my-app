"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import api from "@/lib/api";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { User } from "@/types/types";

/* VALIDATION */
const authSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type AuthFormData = z.infer<typeof authSchema>;

export default function AuthForm({
  onLogin,
}: {
  onLogin: (user: User) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
  });

  const handleLogin = async (data: AuthFormData) => {
  try {
    const res = await api.post("/auth/login", data);

    // Save JWT token
    localStorage.setItem("token", res.data.token);

    // Create user object from backend response
    const user = res.data.user;

      onLogin(user);
      } catch (error: any) {
        console.error(error);

    alert(
      error.response?.data?.message || "Invalid email or password"
    );
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 px-4">

      <div className="w-full max-w-md">

        <div className="bg-white border border-slate-200 shadow-xl rounded-2xl p-8">

          {/* HEADER */}
          <div className="text-center mb-7">
            <h1 className="text-2xl font-semibold text-slate-900">
              Welcome back
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Sign in to continue
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit(handleLogin)} className="space-y-5">

            {/* EMAIL */}
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="you@example.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* PASSWORD */}
            <div>
              <Label>Password</Label>
              <Input
                type="password"
                placeholder="••••••••"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* BUTTON */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-2.5"
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </Button>

          </form>

        </div>
      </div>
    </div>
  );
}