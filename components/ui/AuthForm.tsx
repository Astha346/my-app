"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import api from "@/lib/api";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const authSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type AuthFormData = z.infer<typeof authSchema>;

type User = {
  id: number;
  username: string;
  email: string;
};

export default function AuthForm({
  onLogin,
}: {
  onLogin: (user: User) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
  });

  const handleLogin = async (data: AuthFormData) => {
    try {
      const res = await api.post("/auth/login", data);

      // store token
      localStorage.setItem("token", res.data.token);

      // simple frontend user (for UI only)
      const user: User = {
        id: 1,
        username: data.email.split("@")[0],
        email: data.email,
      };

      localStorage.setItem("user", JSON.stringify(user));

      onLogin(user);
    } catch (error) {
      console.log("Login error:", error);
      alert("Invalid email or password");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleLogin)}
      className="bg-white dark:bg-zinc-900 shadow-xl rounded-2xl p-10 w-full max-w-md border"
    >
      <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

      <div className="flex flex-col gap-4">
        <div>
          <Label>Email</Label>
          <Input type="email" {...register("email")} />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        <div>
          <Label>Password</Label>
          <Input type="password" {...register("password")} />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>

        <Button type="submit">Login</Button>
      </div>
    </form>
  );
}