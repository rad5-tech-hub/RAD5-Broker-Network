"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
export function SignupForm() {
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please upload a valid image file (e.g., JPG, PNG).");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB.");
        return;
      }
      setProfileImage(file);
      setImagePreview(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileImage) {
      setError("Profile image is required.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    // Add form submission logic here (e.g., API call)
    console.log("Form submitted:", { ...formData, profileImage });
    // Example: Save profileImage to localStorage or send to API
    // localStorage.setItem("userProfileImage", imagePreview || "");
  };

  return (
    <div className="w-[100vw] h-screen flex items-center justify-center">
      <form
        className="container px-[5vw] mx-auto h-fit"
        onSubmit={handleSubmit}
      >
        <div className="h-full grid lg:grid-cols-2 grid-cols-1">
          <div className="max-lg:hidden bg-[url(/signupbg03.jpg)] bg-cover bg-center bg-no-repeat relative">
            <div className="absolute top-0 w-full h-full bg-linear-to-r from-blue-900/40 to-blue-800/60"></div>
            <div className="absolute z-50 text-[22px] text-white p-6">
              <Link href="/">
                <Image src="/rad5hub.png" alt="RAD5_Logo" className="w-30" />
              </Link>{" "}
              <h1 className="font-bold">Welcome to RBN</h1>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Assumenda, tempora!
              </p>
            </div>
          </div>
          <div className="bg-white lg:px-4 lg:py-12 py-4 px-2">
            <CardHeader className="space-y-1">
              <Link href="/">
                <Image
                  src="/rad5hub.png"
                  alt="RAD5_Logo"
                  className="w-30 lg:hidden"
                />
              </Link>
              <CardTitle className="text-3xl font-bold">Sign Up</CardTitle>
              <CardDescription>
                Enter your details to sign up for a new account
              </CardDescription>{" "}
            </CardHeader>
            <CardContent className="space-y-4 mt-2">
              <div className="space-y-2">
                <Label htmlFor="profileImage">Profile Image</Label>
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={imagePreview || "/default-avatar.png"}
                      alt="Profile Preview"
                    />
                    <AvatarFallback>UN</AvatarFallback>
                  </Avatar>
                  <Input
                    id="profileImage"
                    name="profileImage"
                    type="file"
                    accept="image/*"
                    required
                    onChange={handleImageChange}
                    className="cursor-pointer"
                  />
                </div>
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="Enter first name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Enter last name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="username or email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
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
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
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
            <CardFooter className="flex flex-col">
              <button
                type="submit"
                className="w-full mt-4 cursor-pointer bg-gray-200 rounded-lg px-8 py-2 shadow-lg hover:bg-gray-300 transition-colors"
              >
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
