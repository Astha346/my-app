"use client";

import { useForm } from "react-hook-form";
import api from "@/lib/api";
type RegisterData = {
    username: String;
  email: string;
  password: string;
};

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<RegisterData>();

  const onSubmit = async (data: RegisterData) => {
  try {
    const res = await api.post("/auth/register", data);

    alert(res.data.message);

  } catch (error: any) {
    alert(
      error.response?.data?.message ||
      "Registration failed"
    );
      }
     };
  return (
    <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-6">
        Create Account
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        <div>
         <label>Username</label>
         <input
          type="text"
            {...register("username")}
           className="w-full border rounded-md p-2 mt-1"
            />
           </div>

        <div>
          <label>Email</label>
          <input
            type="email"
            {...register("email")}
            className="w-full border rounded-md p-2 mt-1"
          />
        </div>

        <div>
          <label>Password</label>
          <input
            type="password"
            {...register("password")}
            className="w-full border rounded-md p-2 mt-1"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white rounded-md py-2"
        >
          Register
        </button>

      </form>
    </div>
  );
}