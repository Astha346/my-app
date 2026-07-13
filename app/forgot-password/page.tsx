"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ShoppingBag } from "lucide-react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";


 export default function ForgotPasswordPage() {

  const [email, setEmail] = useState("");


  const handleSubmit = async (
  e: React.FormEvent
) => {

  e.preventDefault();

  try {

    const response = await api.post(
      "/auth/forgot-password",
      {
        email
      }
    );


    const resetLink = response.data.resetLink;


    alert("Reset link generated");


    window.location.href = resetLink;


  } catch(error:any){

    alert(
      error.response?.data?.message ||
      "Something went wrong"
    );

  }

};


  return (

    <div className="
      min-h-screen
      flex
      items-center
      justify-center
      bg-gradient-to-br
      from-slate-50
      via-white
      to-blue-50
      px-4
    ">


      <Card className="
        w-full
        max-w-md
        rounded-3xl
        bg-white
        p-8
        shadow-xl
      ">


        {/* Logo */}

        <div className="
          flex
          flex-col
          items-center
          mb-8
        ">

          <div className="
            h-16
            w-16
            flex
            items-center
            justify-center
            rounded-2xl
            bg-blue-100
          ">

            <ShoppingBag
              className="
                h-8
                w-8
                text-blue-600
              "
            />

          </div>


          <h1 className="
            mt-5
            text-3xl
            font-bold
            text-slate-900
          ">
            Forgot Password
          </h1>


          <p className="
            mt-2
            text-center
            text-sm
            text-slate-500
          ">
            Enter your email and we will send you a reset password link.
          </p>


        </div>




        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >


          <div>

            <label className="
              text-sm
              font-medium
              text-slate-700
            ">
              Email Address
            </label>



            <div className="relative mt-2">

              <Mail
                className="
                  absolute
                  left-3
                  top-1/2
                  -translate-y-1/2
                  h-5
                  w-5
                  text-slate-400
                "
              />


              <Input

                type="email"

                placeholder="admin@gmail.com"

                value={email}

                onChange={(e)=>
                  setEmail(e.target.value)
                }

                className="
                  h-12
                  rounded-xl
                  pl-10
                "

              />


            </div>


          </div>




          <Button
            type="submit"
            className="
              w-full
              h-12
              rounded-xl
              bg-blue-600
              hover:bg-blue-700
            "
          >

            Send Reset Link

          </Button>





          <div className="text-center">


            <Link

              href="/login"

              className="
                text-sm
                text-blue-600
                hover:underline
              "

            >

              Back to Login

            </Link>


          </div>



        </form>


      </Card>


    </div>

  );
}