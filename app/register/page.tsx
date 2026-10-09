"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShoppingBag, Eye, EyeOff } from "lucide-react";

import api from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
const router = useRouter();

const [username, setUsername] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");

const [loading, setLoading] = useState(false);

const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);

const inputClasses =
"!h-11 !w-full !border !border-slate-300 !bg-white !text-slate-900 placeholder:!text-slate-500 focus-visible:!ring-2 focus-visible:!ring-blue-500";

const handleRegister = async (e: React.FormEvent) => {
e.preventDefault();


if (!username || !email || !password || !confirmPassword) {
  alert("Please fill all fields.");
  return;
}

if (password !== confirmPassword) {
  alert("Passwords do not match.");
  return;
}

try {
  setLoading(true);

  await api.post("/auth/register", {
    username,
    email,
    password,
    role: "customer",
  });

  alert("Registration successful!");
  router.push("/login");
} catch (error: any) {
  console.error("Registration error:", error.response);
  console.error("Registration details:", error.response?.data);

  alert(
    error.response?.data?.message
      ? Array.isArray(error.response.data.message)
        ? error.response.data.message.join("\n")
        : error.response.data.message
      : "Registration failed. Please try again."
  );
} finally {
  setLoading(false);
}


};

return ( <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 px-4 py-8"> <div className="w-full max-w-md"> <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
{/* Header */} <div className="mb-8 text-center"> <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 shadow-lg"> <ShoppingBag className="h-8 w-8 text-white" /> </div>


        <h2 className="text-xl font-bold text-blue-600">
          ShopEase
        </h2>

        <h1 className="mt-3 text-3xl font-bold text-slate-900">
          Create Account
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Create your account to start shopping
        </p>
      </div>

      <form onSubmit={handleRegister} className="space-y-5">
        {/* Username */}
        <div className="space-y-2">
          <Label htmlFor="username" className="text-slate-800">
            Username
          </Label>

          <Input
            id="username"
            type="text"
            autoComplete="username"
            placeholder="Enter your username"
            className={inputClasses}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-slate-800">
            Email
          </Label>

          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="Enter your email"
            className={inputClasses}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password" className="text-slate-800">
            Password
          </Label>

          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Enter your password"
              className={`${inputClasses} !pr-10`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <Label
            htmlFor="confirmPassword"
            className="text-slate-800"
          >
            Confirm Password
          </Label>

          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Confirm your password"
              className={`${inputClasses} !pr-10`}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
              aria-label={
                showConfirmPassword
                  ? "Hide confirm password"
                  : "Show confirm password"
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800"
            >
              {showConfirmPassword ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>
          </div>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-blue-600 text-white hover:bg-blue-700"
        >
          {loading ? "Creating Account..." : "Create Account"}
        </Button>

        {/* Login Link */}
        <div className="text-center">
          <p className="text-sm text-slate-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-blue-600 hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </form>
    </div>
  </div>
</div>


);
}
