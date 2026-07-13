"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, ShoppingBag, Eye, EyeOff } from "lucide-react";

import api from "@/lib/api";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";


export default function ResetPasswordPage() {

  const router = useRouter();

  const params = useParams();

  const token = params?.token;


  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);



  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();


    if(password !== confirmPassword){

      alert("Passwords do not match");
      return;

    }


    try {

      const response = await api.post(
        "/auth/reset-password",
        {
          token,
          password
        }
      );


      alert(response.data.message);


      router.push("/login");


    } catch(error:any){

      alert(
        error.response?.data?.message ||
        "Reset failed"
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


        {/* Header */}

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
            Reset Password
          </h1>


          <p className="
            mt-2
            text-sm
            text-center
            text-slate-500
          ">
            Enter your new password below.
          </p>


        </div>




        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >



          {/* New Password */}

          <div>

            <label className="
              text-sm
              font-medium
              text-slate-700
            ">
              New Password
            </label>


            <div className="relative mt-2">


              <Lock
                className="
                  absolute
                  left-3
                  top-1/2
                  -translate-y-1/2
                  h-5
                  w-5
                  text-gray-400
                "
              />


              <Input

                type={
                  showPassword
                    ? "text"
                    : "password"
                }

                placeholder="Enter new password"

                value={password}

                onChange={(e)=>
                  setPassword(e.target.value)
                }

                className="
                  h-12
                  rounded-xl
                  pl-10
                  pr-10
                "

              />



              <button

                type="button"

                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }

                className="
                  absolute
                  right-3
                  top-1/2
                  -translate-y-1/2
                  text-slate-500
                "

              >

                {
                  showPassword
                    ?
                  <EyeOff size={20}/>
                    :
                  <Eye size={20}/>
                }

              </button>


            </div>


          </div>





          {/* Confirm Password */}


          <div>


            <label className="
              text-sm
              font-medium
              text-slate-700
            ">
              Confirm Password
            </label>



            <div className="relative mt-2">


              <Input

                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }

                placeholder="Confirm password"

                value={confirmPassword}

                onChange={(e)=>
                  setConfirmPassword(
                    e.target.value
                  )
                }


                className="
                  h-12
                  rounded-xl
                  pr-10
                "

              />



              <button

                type="button"

                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }

                className="
                  absolute
                  right-3
                  top-1/2
                  -translate-y-1/2
                  text-slate-500
                "

              >

                {
                  showConfirmPassword
                    ?
                  <EyeOff size={20}/>
                    :
                  <Eye size={20}/>
                }


              </button>


            </div>


          </div>





          <Button

            type="submit"

            className="
              h-12
              w-full
              rounded-xl
              bg-blue-600
              hover:bg-blue-700
            "

          >

            Reset Password

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