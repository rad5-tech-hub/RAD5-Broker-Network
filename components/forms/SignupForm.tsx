"use client";

import Link from "next/link";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export function SignupForm() {
  return (
    <div className="w-[100vw] h-screen flex items-center justify-center">
      <form className="container px-[5vw] mx-auto h-fit">
        <div className="h-full grid lg:grid-cols-2 grid-cols-1">
          <div className="max-lg:hidden bg-[url(/signupbg03.jpg)] bg-cover bg-center bg-no-repeat relative">
            <div className="absolute top-0 w-full h-full bg-linear-to-r from-blue-900/40 to-blue-800/60"></div>
            <div className="absolute z-50 text-[22px] text-white p-6">
              <img src="/rad5hub.png" alt="RAD5_Logo" className="w-30" />
              <h1 className="font-bold">Welcome to RBN</h1>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Assumenda, tempora!
              </p>
            </div>
          </div>
          <div className="bg-white lg:px-4 lg:py-12 py-4 px-2">
            <CardHeader className="space-y-1">
              <img
                src="/rad5hub.png"
                alt="RAD5_Logo"
                className="w-30 lg:hidden"
              />

              <CardTitle className="text-3xl font-bold">Sign Up</CardTitle>
              <CardDescription className="">
                Enter your details to sign up for a new account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 mt-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="Enter first name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Enter last name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="username or email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="password"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <button className="w-full mt-4 cursor-pointer bg-gray-200 rounded-lg px-8 py-2 shadow-lg hover:bg-gray-300 transition-colors">
                Sign Up
              </button>
              <div className="w-full mt-4 text-center text-sm flex justify-center items-center">
                Already have an account?
                <Link href="/signin" className="underline ml-2 cursor-pointer">
                  Sign In
                </Link>
              </div>
            </CardFooter>
          </div>
        </div>
      </form>
    </div>
  );
}
