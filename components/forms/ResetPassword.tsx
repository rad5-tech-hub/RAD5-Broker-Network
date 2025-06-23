"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function ResetPasswordForm() {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (!token) {
      toast.error("Invalid or missing reset token.", {
        duration: 5000,
        position: "top-right",
      });
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!", {
        duration: 5000,
        position: "top-right",
      });
      setLoading(false);
      return;
    }

    try {
      console.log("Sending request to API with payload:", {
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      const response = await fetch(
        `https://rbn.bookbank.com.ng/api/v1/agent/reset-password/${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            password: formData.password,
            confirmPassword: formData.confirmPassword,
          }),
        }
      );

      console.log("Response status:", response.status, response.statusText);

      const data = await response.json();
      console.log("API Response:", data);

      if (!response.ok) {
        const errorMessage =
          data.message ||
          data.error ||
          `Password reset failed with status ${response.status}. Please try again.`;
        throw new Error(errorMessage);
      }

      setIsModalOpen(true);
      toast.success(data.message || "Password reset successful!", {
        duration: 3000,
        position: "top-right",
      });
    } catch (err) {
      console.error("Reset Password Error:", err);
      let errorMessage = "Something went wrong. Please try again.";
      if (err instanceof Error) {
        errorMessage = err.message;
        if (err.message.includes("Failed to fetch")) {
          errorMessage =
            "Unable to connect to the server. Please check your network or try again later.";
        }
      } else if (typeof err === "string") {
        errorMessage = err;
      }
      toast.error(errorMessage, {
        duration: 5000,
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRedirectToSignIn = () => {
    setIsModalOpen(false);
    router.push("/signin");
  };

  return (
    <div className="w-screen min-h-screen flex items-center justify-center bg-blue-50 dark:bg-gray-900">
      <Toaster />
      <form
        className="container px-4 sm:px-6 lg:px-16 mx-auto h-fit"
        onSubmit={handleSubmit}
      >
        <div className="grid lg:grid-cols-2 grid-cols-1 min-h-[500px] rounded-lg overflow-hidden shadow-xl">
          <div className="hidden lg:block bg-[url(/signupbg03.jpg)] bg-cover bg-center bg-no-repeat relative">
            <div className="absolute top-0 w-full h-full bg-gradient-to-r from-blue-800/45 to-blue-900/60"></div>
            <div className="absolute z-10 text-white p-6 space-y-0">
              <Link href="/" aria-label="RAD5 Brokers Network Home">
                <Image
                  src="/rad5hub.png"
                  alt="RAD5 Logo"
                  width={100}
                  height={100}
                />
              </Link>
              <h1 className="text-4xl font-bold">Welcome to RBN</h1>
              <p className="text-lg">
                Reset your password to access your RBN ambassador dashboard.
              </p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 lg:px-6 lg:py-8 py-4 px-4 flex flex-col justify-center">
            <CardHeader className="space-y-2">
              <Link
                href="/"
                className="lg:hidden"
                aria-label="RAD5 Brokers Network Home"
              >
                <Image
                  src="/rad5hub.png"
                  alt="RAD5 Logo"
                  width={80}
                  height={80}
                />
              </Link>
              <CardTitle className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                Reset Password
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                Enter your new password below
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-gray-700 dark:text-gray-200"
                >
                  New Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                    aria-label="New Password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-gray-700 dark:text-gray-200"
                >
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    className="text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                    aria-label="Confirm Password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                    disabled={loading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full bg-gray-400 text-gray-900 hover:bg-gray-300 dark:bg-gray-400 dark:hover:bg-gray-300 transform hover:scale-105 transition-transform mt-6"
                aria-label="Reset Password"
                disabled={loading || !token}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </Button>
              <div className="text-center text-sm text-gray-600 dark:text-gray-300">
                Remember your password?{" "}
                <Link
                  href="/signin"
                  className="underline text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                >
                  Sign In
                </Link>
              </div>
            </CardFooter>
          </div>
        </div>
      </form>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Password Reset Successful</DialogTitle>
            <DialogDescription>
              Your password has been successfully reset. You can now sign in
              with your new password.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end mt-4">
            <Button
              onClick={handleRedirectToSignIn}
              className="bg-blue-600 text-white hover:bg-blue-500"
            >
              Go to Sign In
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
