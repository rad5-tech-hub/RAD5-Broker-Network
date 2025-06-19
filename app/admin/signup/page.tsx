"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
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
import { Eye, EyeOff, Copy } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface FormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface AdminSignUpResponse {
  message: string;
  admin: {
    id: string;
    fullName: string;
    email: string;
    password: string;
    role: string;
    updatedAt: string;
    createdAt: string;
  };
}

interface ErrorResponse {
  message?: string;
  error?: string;
}

export default function AdminSignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailErrors, setEmailErrors] = useState<string[]>([]);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [suggestedPassword, setSuggestedPassword] = useState<string>("");

  const validateEmail = (email: string) => {
    const errors: string[] = [];
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push("Please enter a valid email address.");
    }
    return errors;
  };

  const validatePassword = (password: string) => {
    const errors: string[] = [];
    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long.");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter.");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter.");
    }
    if (!/[0-9]/.test(password)) {
      errors.push("Password must contain at least one number.");
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push("Password must contain at least one special character.");
    }
    return errors;
  };

  const generatePassword = () => {
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";
    const allChars = upper + lower + numbers + symbols;
    let password = "";
    password += upper[Math.floor(Math.random() * upper.length)];
    password += lower[Math.floor(Math.random() * lower.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];
    for (let i = 4; i < 12; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }
    password = password
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");
    setSuggestedPassword(password);
  };

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(suggestedPassword);
    toast.success("Password copied to clipboard!");
    setFormData((prev) => ({
      ...prev,
      password: suggestedPassword,
      confirmPassword: suggestedPassword,
    }));
    setPasswordErrors([]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "email") {
      setFormData((prev) => ({ ...prev, [name]: value }));
      setEmailErrors(validateEmail(value));
    } else if (name === "password") {
      setFormData((prev) => ({ ...prev, [name]: value }));
      setPasswordErrors(validatePassword(value));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = (): boolean => {
    if (!formData.fullName.trim()) {
      toast.error("Full name is required.");
      return false;
    }
    const emailValidation = validateEmail(formData.email);
    if (emailValidation.length > 0) {
      toast.error("Please fix email errors.");
      setEmailErrors(emailValidation);
      return false;
    }
    const passwordValidation = validatePassword(formData.password);
    if (passwordValidation.length > 0) {
      toast.error("Please fix password errors.");
      setPasswordErrors(passwordValidation);
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const apiBaseUrl =
        process.env.NEXT_PUBLIC_RBN_API_BASE_URL ||
        "https://rbn.bookbank.com.ng/api/v1";
      const endpoint = `${apiBaseUrl}/admin/create`;
      console.log("Submitting admin signup to:", endpoint);

      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
      };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Non-JSON response:", text);
        throw new Error(
          `Invalid response format: Expected JSON, received ${
            contentType || "unknown"
          }`
        );
      }

      const result = await response.json();

      if (!response.ok) {
        const errorResult = result as ErrorResponse;
        throw new Error(
          errorResult.message ||
            errorResult.error ||
            `HTTP ${response.status}: ${response.statusText}`
        );
      }

      const successResult = result as AdminSignUpResponse;
      console.log("Admin SignUp Response:", successResult);

      setFormData({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      setSuggestedPassword("");
      setShowModal(true);
      toast.success(successResult.message || "Admin signup successful!", {
        duration: 3000,
        position: "top-right",
      });
    } catch (err: any) {
      console.error("Admin SignUp Error:", err);
      toast.error(err.message || "Failed to sign up. Please try again.", {
        duration: 5000,
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen min-h-screen flex items-center justify-center bg-blue-50 dark:bg-gray-900">
      <Toaster position="top-right" />
      {showModal && (
        <div className="fixed container px-[5vw] mx-auto inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              Success!
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Admin signup successful! Proceed to sign in.
            </p>
            <div className="flex justify-end space-x-4">
              <Button
                onClick={() => setShowModal(false)}
                className="bg-gray-400 text-gray-900 hover:bg-gray-300 dark:bg-gray-400 dark:hover:bg-gray-300"
              >
                Close
              </Button>
              <Link href="/admin/signin">
                <Button className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
                  Go to Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
      <form
        className="container px-4 sm:px-6 lg:px-8 mx-auto h-fit"
        onSubmit={handleSubmit}
      >
        <div className="grid lg:grid-cols-2 grid-cols-1 min-h-[600px] rounded-lg overflow-hidden shadow-xl">
          <div className="hidden lg:block bg-[url(/signupbg03.jpg)] bg-cover bg-center bg-no-repeat relative">
            <div className="absolute top-0 w-full h-full bg-gradient-to-r from-blue-900/45 to-blue-800/60"></div>
            <div className="absolute z-10 text-white p-6 space-y-4">
              <Link href="/" aria-label="RAD5 Brokers Network Home">
                <Image
                  src="/rad5hub.png"
                  alt="RAD5 Logo"
                  width={100}
                  height={100}
                />
              </Link>
              <h1 className="text-4xl font-bold">Join RAD5 Brokers Network</h1>
              <p className="text-sm max-w-xs">
                Register as an admin to manage the RAD5 Brokers Network
                platform.
              </p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 lg:px-6 lg:py-8 py-4 px-4 flex flex-col">
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
                Admin Sign Up
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                Create an admin account for RAD5 Brokers Network
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label
                  htmlFor="fullName"
                  className="text-gray-700 dark:text-gray-200"
                >
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="Enter full name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  className="text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                  disabled={loading}
                  aria-label="Full Name"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-gray-700 dark:text-gray-200"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                  disabled={loading}
                  aria-label="Email"
                />
                {emailErrors.length > 0 && (
                  <ul className="text-red-500 dark:text-red-400 text-sm mt-1">
                    {emailErrors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-gray-700 dark:text-gray-200"
                >
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                    disabled={loading}
                    aria-label="Password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
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
                {passwordErrors.length > 0 && (
                  <ul className="text-red-500 dark:text-red-400 text-sm mt-1">
                    {passwordErrors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                )}
                <div className="mt-2">
                  <Button
                    type="button"
                    onClick={generatePassword}
                    className="text-sm bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                  >
                    Generate Strong Password
                  </Button>
                  {suggestedPassword && (
                    <div className="flex items-center mt-2">
                      <p className="text-gray-600 dark:text-gray-300 text-sm mr-2">
                        Suggested: {suggestedPassword}
                      </p>
                      <button
                        type="button"
                        onClick={handleCopyPassword}
                        className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
                        aria-label="Copy suggested password"
                      >
                        <Copy className="h-5 w-5" />
                      </button>
                    </div>
                  )}
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
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    className="text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                    disabled={loading}
                    aria-label="Confirm Password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
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
            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full bg-gray-400 text-gray-900 hover:bg-gray-300 dark:bg-gray-400 dark:hover:bg-gray-300 transform hover:scale-103 transition-transform mt-6"
                disabled={
                  loading || emailErrors.length > 0 || passwordErrors.length > 0
                }
                aria-label="Sign Up"
              >
                {loading ? (
                  <svg
                    className="animate-spin h-5 w-5 mr-2 inline-block"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : null}
                {loading ? "Signing Up..." : "Sign Up"}
              </Button>
              <div className="text-center text-sm text-gray-600 dark:text-gray-300">
                Already have an admin account?{" "}
                <Link
                  href="/admin"
                  className="underline text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                >
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
