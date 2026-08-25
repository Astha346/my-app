"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { ShoppingBag, Eye, EyeOff } from "lucide-react";

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
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const handleLogin = async (data: LoginFormData) => {
    try {
      // ================================
      // LOGIN
      // ================================

      const response = await api.post(
        "/auth/login",
        data
      );

      console.log(
        "Login Response:",
        response.data
      );

      // ================================
      // GET TOKENS + USER
      // ================================

      const {
        access_token,
        refresh_token,
        user,
      } = response.data;

      // ================================
      // CHECK ACCESS TOKEN
      // ================================

      if (!access_token) {
        throw new Error(
          "Access token not received"
        );
      }

      // ================================
      // CHECK REFRESH TOKEN
      // ================================

      if (!refresh_token) {
        throw new Error(
          "Refresh token not received"
        );
      }

      // ================================
      // CHECK USER
      // ================================

      if (!user) {
        throw new Error(
          "User data not received"
        );
      }

      // ================================
      // SAVE ACCESS TOKEN
      // ================================

      localStorage.setItem(
        "token",
        access_token
      );

      // ================================
      // SAVE REFRESH TOKEN
      // ================================

      localStorage.setItem(
        "refresh_token",
        refresh_token
      );

      // ================================
      // SAVE USER
      // ================================

      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      // ================================
      // DEBUG
      // ================================

      console.log(
        "ACCESS TOKEN =",
        localStorage.getItem("token")
      );

      console.log(
        "REFRESH TOKEN =",
        localStorage.getItem("refresh_token")
      );

      console.log(
        "USER =",
        localStorage.getItem("user")
      );

      // ================================
      // LOGIN SUCCESS
      // ================================

      alert("Login successful!");

      // ================================
      // ROLE BASED REDIRECT
      // ================================

      if (
        ["admin", "manager", "staff"].includes(
          user.role
        )
      ) {
        console.log(
          "Going to admin"
        );

        router.push("/admin");
      } else {
        console.log(
          "Going to website"
        );

        router.push("/");
      }
    } catch (error: any) {
      console.error(
        "LOGIN ERROR =",
        error
      );

      alert(
        error.response?.data?.message ||
          error.message ||
          "Invalid email or password"
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
              Login to continue shopping
            </p>

          </div>

          {/* Login Form */}

          <form
            onSubmit={handleSubmit(handleLogin)}
            className="space-y-5"
          >

            {/* Email */}

            <div>

              <Label>
                Email
              </Label>

              <Input
                type="email"
                placeholder="Enter your email"
                {...register("email")}
              />

              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}

            </div>

            {/* Password */}

            <div>

              <Label>
                Password
              </Label>

              <div className="relative">

                <Input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your password"
                  className="pr-10"
                  {...register("password")}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                >
                  {showPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>

              </div>

              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}

            </div>

            {/* Forgot Password */}

            <div className="text-right">

              <Link
                href="/forgot-password"
                className="text-sm text-blue-600 hover:underline"
              >
                Forgot password?
              </Link>

            </div>

            {/* Login Button */}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 rounded-xl"
            >
              {isSubmitting
                ? "Signing In..."
                : "Sign In"}
            </Button>

            {/* Register */}

            <div className="text-center">

              <p className="text-sm text-slate-600">

                Don't have an account?{" "}

                <Link
                  href="/register"
                  className="font-semibold text-blue-600 hover:underline"
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