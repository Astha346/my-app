"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";

import api from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { User } from "@/types/types";

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
  const router = useRouter();

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

      localStorage.setItem("token", res.data.token);

      const user = res.data.user;

      onLogin(user);

      // We will add role-based redirect later
      // if (user.role === "admin") {
      //   router.push("/admin");
      // } else {
      //   router.push("/");
      // }

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
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xl p-8">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 shadow-lg">
              <ShoppingBag className="h-8 w-8 text-white" />
            </div>

            <h2 className="text-xl font-bold text-blue-600">
              ShopEase
            </h2>

            <h1 className="mt-3 text-3xl font-bold text-slate-900">
              Welcome Back
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Sign in to continue shopping
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit(handleLogin)}
            className="space-y-5"
          >
            <div>
              <Label>Email</Label>

              <Input
                type="email"
                placeholder="you@example.com"
                {...register("email")}
              />

              {errors.email && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <Label>Password</Label>

              <Input
                type="password"
                placeholder="••••••••"
                {...register("password")}
              />

              {errors.password && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="text-right">
              <button
                type="button"
                className="text-sm text-blue-600 hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-blue-600 py-2.5 hover:bg-blue-700"
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </Button>

            <div className="text-center pt-2">
              <p className="text-sm text-slate-600">
                Don't have an account?{" "}
                <Link
                  href="/register"
                  className="font-semibold text-blue-600 hover:underline"
                >
                  Register
                </Link>
              </p>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}