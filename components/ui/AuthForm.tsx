"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
}

export default function AuthForm({
  onLogin,
}: {
  onLogin: (user:User) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
  });

  
  const handleLogin = (data: AuthFormData) => {
    localStorage.setItem("user", JSON.stringify(data));
    onLogin({id:1 , username:data.email.split("@")[0], email: data.email});
  };

  return (
    <form
      onSubmit={handleSubmit(handleLogin)}
      className="bg-white dark:bg-zinc-900 shadow-xl rounded-2xl p-10 w-full max-w-md border border-gray-200 dark:border-zinc-700"
    >
      <h2 className="text-3xl font-bold text-center text-zinc-800 dark:text-zinc-100 mb-6">
        Welcome
      </h2>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <Label>Email</Label>
          <Input
            type="email"
            placeholder="Enter your email"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <Label>Password</Label>
          <Input
            type="password"
            placeholder="Enter your password"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>

        <Button
          type="submit"
          className="mt-4 bg-black text-white font-semibold py-2 rounded-xl"
        >
          Login
        </Button>
      </div>
    </form>
  );
}