"use client";

import { useState, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast, Toaster } from "react-hot-toast";
import Link from "next/link";

interface FormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  track: string;
}

interface RegistrationResponse {
  message: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    track: string;
    agentId: string;
    updatedAt: string;
    createdAt: string;
  };
}

interface ErrorResponse {
  message?: string;
  error?: string;
}

export default function Register() {
  const router = useRouter();
  const { ref } = useParams(); // Get referral ID from dynamic route
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phoneNumber: "",
    track: "",
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (value: string) => {
    setFormData({ ...formData, track: value });
  };

  const validateForm = (): boolean => {
    if (!formData.fullName.trim()) {
      toast.error("Full name is required.");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error("Please enter a valid email address.");
      return false;
    }
    if (!/^\d{11}$/.test(formData.phoneNumber)) {
      toast.error("Phone number must be 11 digits (e.g., 08123456789).");
      return false;
    }
    if (!formData.track) {
      toast.error("Please select a track.");
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
      const endpoint = `${apiBaseUrl}/user/register/${ref}`;
      console.log("Submitting registration to:", endpoint);

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
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

      const successResult = result as RegistrationResponse;
      console.log("Registration Response:", successResult);

      toast.success(successResult.message || "Registration successful!", {
        duration: 3000,
        position: "top-right",
      });
      router.push("/signin"); // Redirect to sign-in page after success
    } catch (err: any) {
      console.error("Registration Error:", err);
      toast.error(err.message || "Failed to register. Please try again.", {
        duration: 5000,
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#ffff]/20 dark:bg-gray-900 font-poppins p-4">
      <Toaster />
      <Card className="w-full max-w-md bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Register with Referral
          </CardTitle>
          <p className="text-gray-600 dark:text-gray-300">Referred by: {ref}</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleInputChange}
                className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
                required
                disabled={loading}
              />
            </div>
            <div>
              <Input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
                required
                disabled={loading}
              />
            </div>
            <div>
              <Input
                type="tel"
                name="phoneNumber"
                placeholder="Phone Number (e.g., 08123456789)"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
                required
                disabled={loading}
              />
            </div>
            <div>
              <Select
                value={formData.track}
                onValueChange={handleSelectChange}
                disabled={loading}
              >
                <SelectTrigger className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
                  <SelectValue placeholder="Select a track" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Backend">Backend</SelectItem>
                  <SelectItem value="Frontend">Frontend</SelectItem>
                  <SelectItem value="Digital Marketing">
                    Digital Marketing
                  </SelectItem>
                  <SelectItem value="Data Analytics">Data Analytics</SelectItem>
                  <SelectItem value="UI/UX Design">UI/UX Design</SelectItem>
                  <SelectItem value="Mobile App Development">
                    Mobile App Development
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white hover:bg-gray-800 dark:bg-gray-300 dark:text-gray-900 dark:hover:bg-gray-400"
            >
              {loading ? "Registering..." : "Register"}
            </Button>
          </form>
          <p className="text-sm text-center text-gray-600 dark:text-gray-300 mt-4">
            Already have an account?{" "}
            <Link href="/signin" className="underline">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
