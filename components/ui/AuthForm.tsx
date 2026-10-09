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
password: z
.string()
.min(6, "Password must be at least 6 characters"),
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
console.log("AUTHFORM LOGIN HANDLER CALLED");


try {
  const res = await api.post("/auth/login", data);

  console.log("LOGIN RESPONSE =", res.data);

  const user = res.data.user;

  if (!user) {
    throw new Error("User data not found");
  }

  if (!res.data.access_token) {
    throw new Error("Access token not received from server");
  }

  if (!res.data.refresh_token) {
    throw new Error("Refresh token not received from server");
  }

  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("token", res.data.access_token);
  localStorage.setItem("refresh_token", res.data.refresh_token);

  console.log("LOGIN TOKENS SAVED");

  onLogin(user);

  if (["admin", "manager", "staff"].includes(user.role)) {
    router.push("/admin");
  } else {
    router.push("/");
  }
} catch (error: any) {
  console.error("LOGIN ERROR =", error);

  alert(
    error.response?.data?.message ||
      error.message ||
      "Invalid email or password"
  );
}


};

const inputClasses =
"!h-11 !w-full !border !border-slate-300 !bg-white !text-slate-900 placeholder:!text-slate-500 focus-visible:!ring-2 focus-visible:!ring-blue-500";

return ( <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 px-4"> <div className="w-full max-w-md"> <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
{/* Header */} <div className="mb-8 text-center"> <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 shadow-lg"> <ShoppingBag className="h-8 w-8 text-white" /> </div>

```
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

      <form
        onSubmit={handleSubmit(handleLogin)}
        className="space-y-5"
      >
        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-slate-800">
            Email
          </Label>

          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className={inputClasses}
            {...register("email")}
          />

          {errors.email && (
            <p className="mt-1 text-xs text-red-500">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password" className="text-slate-800">
            Password
          </Label>

          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            className={inputClasses}
            {...register("password")}
          />

          {errors.password && (
            <p className="mt-1 text-xs text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Forgot Password */}
        <div className="text-right">
          <button
            type="button"
            className="text-sm text-blue-600 hover:underline"
          >
            Forgot Password?
          </button>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-blue-600 py-2.5 text-white hover:bg-blue-700"
        >
          {isSubmitting ? "Signing in..." : "Sign In"}
        </Button>

        {/* Register */}
        <div className="pt-2 text-center">
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
