
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { ShoppingBag, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

import api from "@/lib/api";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const handleLogin = async (data: LoginFormData) => {
    try {
      const response = await api.post("/auth/login", data);

      console.log("Login Response:", response.data);

      const { access_token, refresh_token, user } = response.data;

      if (!access_token) {
        throw new Error("Access token not received");
      }

      if (!refresh_token) {
        throw new Error("Refresh token not received");
      }

      if (!user) {
        throw new Error("User data not received");
      }

      localStorage.setItem("token", access_token);
      localStorage.setItem("refresh_token", refresh_token);
      localStorage.setItem("user", JSON.stringify(user));

      console.log("ACCESS TOKEN =", localStorage.getItem("token"));
      console.log("REFRESH TOKEN =", localStorage.getItem("refresh_token"));
      console.log("USER =", localStorage.getItem("user"));

      toast.success("Login successful!");

      if (["admin", "manager", "staff"].includes(user.role)) {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (error: any) {
      console.error("LOGIN ERROR =", error);

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Invalid email or password"
      );
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10 text-foreground transition-colors duration-200">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-border bg-card p-8 text-card-foreground shadow-xl">

          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
              <ShoppingBag className="h-8 w-8" />
            </div>

            <h2 className="text-xl font-bold text-primary">
              ShopEase
            </h2>

            <h1 className="mt-3 text-3xl font-bold text-foreground">
              Welcome Back
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              Login to continue shopping
            </p>
          </div>

          {/* Login Form */}
          <form
            onSubmit={handleSubmit(handleLogin)}
            className="space-y-5"
          >
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>

              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                autoComplete="email"
                {...register("email")}
              />

              {errors.email && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>

              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="pr-10"
                  {...register("password")}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>

              {errors.password && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <Link
                href="/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl"
            >
              {isSubmitting ? "Signing In..." : "Sign In"}
            </Button>

            {/* Register */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}

                <Link
                  href="/register"
                  className="font-semibold text-primary hover:underline"
                >
                  Create Account
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

