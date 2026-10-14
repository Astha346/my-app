
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { ShoppingBag, ShieldCheck, ArrowLeft, Mail } from "lucide-react";

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

  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [pendingEmail, setPendingEmail] = useState("");
  const [challengeId, setChallengeId] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpMessage, setOtpMessage] = useState("");
  const [otpSubmitting, setOtpSubmitting] = useState(false);
  const [resendingOtp, setResendingOtp] = useState(false);

  const {
  register,
  handleSubmit,
  formState: { errors, isSubmitting },
} = useForm<AuthFormData>({
  resolver: zodResolver(authSchema),
  defaultValues: {
    email: "",
    password: "",
  },
});
  const inputClasses =
    "!h-11 !w-full !border !border-slate-300 !bg-white !text-slate-900 placeholder:!text-slate-500 focus-visible:!ring-2 focus-visible:!ring-blue-500";

  const finishLogin = (user: User) => {
    localStorage.setItem("user", JSON.stringify(user));
    onLogin(user);

    if (["admin", "manager", "staff"].includes(user.role)) {
      router.push("/admin");
    } else {
      router.push("/");
    }
  };

  const handleLogin = async (data: AuthFormData) => {
    setOtpError("");
    setOtpMessage("");

    try {
      const res = await api.post("/auth/login", data);

      console.log("LOGIN RESPONSE =", res.data);

      // Enter the OTP screen when the backend requests 2FA.
      if (res.data.requiresTwoFactor === true) {
        if (!res.data.challengeId) {
          throw new Error("Two-factor challenge ID was not received");
        }

        setPendingEmail(data.email);
        setChallengeId(res.data.challengeId);
        setOtp("");
        setShowOtp(true);
        return;
      }

      // Keep the existing login behavior until backend 2FA is enabled.
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

      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("refresh_token", res.data.refresh_token);

      finishLogin(user);
    } catch (error: any) {
      console.error("LOGIN ERROR =", error);

      alert(
        error.response?.data?.message ||
          error.message ||
          "Invalid email or password"
      );
    }
  };

  const handleVerifyOtp = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setOtpError("");
    setOtpMessage("");

    if (!/^\d{6}$/.test(otp)) {
      setOtpError("Please enter a valid 6-digit verification code.");
      return;
    }

    setOtpSubmitting(true);

    try {
      // The backend endpoint will be implemented in the next step.
      const res = await api.post("/auth/verify-otp", {
        challengeId,
        otp,
      });

      const user = res.data.user;

      if (!user || !res.data.access_token || !res.data.refresh_token) {
        throw new Error("Verification response is incomplete");
      }

      // Save authentication tokens only after successful OTP verification.
      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("refresh_token", res.data.refresh_token);

      finishLogin(user);
    } catch (error: any) {
      console.error("OTP VERIFICATION ERROR =", error);

      setOtpError(
        error.response?.data?.message ||
          error.message ||
          "Unable to verify the code. Please try again."
      );
    } finally {
      setOtpSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    setOtpError("");
    setOtpMessage("");
    setResendingOtp(true);

    try {
      await api.post("/auth/resend-otp", {
        challengeId,
      });

      setOtp("");
      setOtpMessage("A new verification code has been requested.");
    } catch (error: any) {
      console.error("RESEND OTP ERROR =", error);

      setOtpError(
        error.response?.data?.message ||
          "Unable to resend the code. Please try again."
      );
    } finally {
      setResendingOtp(false);
    }
  };

  const handleBackToLogin = () => {
    setShowOtp(false);
    setOtp("");
    setChallengeId("");
    setPendingEmail("");
    setOtpError("");
    setOtpMessage("");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 shadow-lg">
              {showOtp ? (
                <ShieldCheck className="h-8 w-8 text-white" />
              ) : (
                <ShoppingBag className="h-8 w-8 text-white" />
              )}
            </div>

            <h2 className="text-xl font-bold text-blue-600">ShopEase</h2>

            <h1 className="mt-3 text-3xl font-bold text-slate-900">
              {showOtp ? "Verify Your Email" : "Welcome Back"}
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              {showOtp
                ? "Enter the 6-digit code to securely access your account."
                : "Sign in to continue shopping"}
            </p>
          </div>

          {showOtp ? (
            /* Two-Factor Authentication Screen */
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />

                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-800">
                      Verification code
                    </p>

                    <p className="mt-1 break-all text-sm text-slate-600">
                      {pendingEmail}
                    </p>

                    <p className="mt-2 text-xs text-slate-500">
                      Check your email for the 6-digit code.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="otp" className="text-slate-800">
                  Enter verification code
                </Label>

                <Input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  placeholder="000000"
                  maxLength={6}
                 value={otp ?? ""}
                  onChange={(event) => {
                    setOtp(event.target.value.replace(/\D/g, "").slice(0, 6));
                    setOtpError("");
                    setOtpMessage("");
                  }}
                  className={`${inputClasses} !h-14 text-center !text-2xl !font-bold !tracking-[0.5em]`}
                  aria-describedby="otp-error otp-message"
                  aria-invalid={!!otpError}
                  required
                />
              </div>

              {otpError && (
                <p
                  id="otp-error"
                  role="alert"
                  className="rounded-lg bg-red-50 p-3 text-sm text-red-600"
                >
                  {otpError}
                </p>
              )}

              {otpMessage && (
                <p
                  id="otp-message"
                  role="status"
                  className="rounded-lg bg-green-50 p-3 text-sm text-green-700"
                >
                  {otpMessage}
                </p>
              )}

              <Button
                type="submit"
                disabled={otpSubmitting || otp.length !== 6}
                className="w-full rounded-xl bg-blue-600 py-2.5 text-white hover:bg-blue-700"
              >
                {otpSubmitting ? "Verifying..." : "Verify Code"}
              </Button>

              <div className="text-center">
                <p className="text-sm text-slate-600">
                  Didn't receive the code?
                </p>

                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendingOtp}
                  className="mt-2 text-sm font-semibold text-blue-600 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {resendingOtp ? "Requesting code..." : "Resend Code"}
                </button>
              </div>

              <button
                type="button"
                onClick={handleBackToLogin}
                className="flex w-full items-center justify-center gap-2 pt-2 text-sm text-slate-600 hover:text-blue-600"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Login
              </button>
            </form>
          ) : (
            /* Existing Login Screen */
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
                  onClick={() => router.push("/forgot-password")}
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
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/register"
                    className="font-semibold text-blue-600 hover:underline"
                  >
                    Register
                  </Link>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
