
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { ShoppingBag, Eye, EyeOff, ArrowLeft } from "lucide-react";
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
  const [requiresOtp, setRequiresOtp] = useState(false);
  const [challengeId, setChallengeId] = useState("");
  const [otp, setOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

 const {
  register,
  handleSubmit,
  watch,
  formState: { errors, isSubmitting },
} = useForm<LoginFormData>({
  resolver: zodResolver(loginSchema),
  defaultValues: {
    email: "",
    password: "",
  },
});

  // Save tokens and navigate only after successful authentication.
  const completeLogin = (data: any) => {
    const { access_token, refresh_token, user } = data;

    if (!access_token || !refresh_token || !user) {
      throw new Error("Login response is missing required user or token data.");
    }

    localStorage.setItem("token", access_token);
    localStorage.setItem("refresh_token", refresh_token);
    localStorage.setItem("user", JSON.stringify(user));

    toast.success("Login successful!");

    if (["admin", "manager", "staff"].includes(user.role)) {
      router.push("/admin");
    } else {
      router.push("/");
    }
  };

  // Step 1: Verify email and password.
  const handleLogin = async (data: LoginFormData) => {
    try {
      const response = await api.post("/auth/login", data);
      const result = response.data;

      console.log("Login Response:", result);

      // New two-factor authentication flow.
      if (result.requiresTwoFactor === true) {
        if (!result.challengeId) {
          throw new Error("OTP challenge ID was not received from the server.");
        }

        setChallengeId(result.challengeId);
        setRequiresOtp(true);
        setOtp("");

        toast.success(
          result.message || "OTP sent. Check your Mailtrap inbox."
        );

        return;
      }

      // Backward compatibility if the backend returns tokens directly.
      completeLogin(result);
    } catch (error: any) {
      console.error("LOGIN ERROR =", error);

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Unable to sign in. Please try again."
      );
    }
  };

  // Step 2: Verify the OTP.
  const handleVerifyOtp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!challengeId) {
      toast.error("Your login challenge is missing. Please sign in again.");
      setRequiresOtp(false);
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      toast.error("Enter the 6-digit OTP.");
      return;
    }

    setOtpLoading(true);

    try {
      const response = await api.post("/auth/verify-otp", {
        challengeId,
        otp,
      });

      completeLogin(response.data);
    } catch (error: any) {
      console.error("OTP VERIFICATION ERROR =", error);

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "OTP verification failed. Please try again."
      );
    } finally {
      setOtpLoading(false);
    }
  };

  // Resend OTP to the email associated with the challenge.
  const handleResendOtp = async () => {
    if (!challengeId || resendLoading) return;

    setResendLoading(true);

    try {
      const response = await api.post("/auth/resend-otp", {
        challengeId,
      });

      toast.success(
        response.data?.message || "A new OTP has been requested."
      );

      setOtp("");
    } catch (error: any) {
      console.error("RESEND OTP ERROR =", error);

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Could not resend OTP. Please try again."
      );
    } finally {
      setResendLoading(false);
    }
  };

  const returnToLogin = () => {
    setRequiresOtp(false);
    setChallengeId("");
    setOtp("");
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

            <h2 className="text-xl font-bold text-primary">ShopEase</h2>

            <h1 className="mt-3 text-3xl font-bold text-foreground">
              {requiresOtp ? "Verify Your Email" : "Welcome Back"}
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              {requiresOtp
                ? "Enter the 6-digit verification code sent to your email."
                : "Login to continue shopping"}
            </p>
          </div>

          {!requiresOtp ? (
            /* Email and Password Form */
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
               value={watch("email") ?? ""}
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
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
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
          ) : (
            /* OTP Verification Form */
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="otp">6-digit OTP</Label>

                <Input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  placeholder="Enter your 6-digit OTP"
                  maxLength={6}
                  pattern="[0-9]{6}"
                  value={otp ?? ""}
                  onChange={(event) =>
                    setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  className="text-center text-xl tracking-[0.4em]"
                  required
                />

                <p className="text-xs text-muted-foreground">
                  Check Email Sandbox in your Mailtrap account. The code
                  expires after 5 minutes.
                </p>
              </div>

              <Button
                type="submit"
                disabled={otpLoading || otp.length !== 6}
                className="w-full rounded-xl"
              >
                {otpLoading ? "Verifying..." : "Verify OTP"}
              </Button>

              <div className="text-center">
                <Button
                  type="button"
                  variant="link"
                  disabled={resendLoading || otpLoading}
                  onClick={handleResendOtp}
                  className="text-primary"
                >
                  {resendLoading ? "Sending..." : "Resend OTP"}
                </Button>
              </div>

              <Button
                type="button"
                variant="outline"
                disabled={otpLoading || resendLoading}
                onClick={returnToLogin}
                className="w-full rounded-xl"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Sign In
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
