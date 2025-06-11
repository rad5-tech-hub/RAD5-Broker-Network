"use client";

import { useState, useEffect } from "react";
import { toast, Toaster } from "sonner";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ReferralLinkSection from "@/components/ReferralLinkSection";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Users, CreditCard } from "lucide-react";
import { TbCurrencyNaira } from "react-icons/tb";
import { RiMenu2Line } from "react-icons/ri";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera } from "lucide-react";

interface DashboardResponse {
  message: string;
  agent: {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    sharableLink: string;
    profileImage: string;
    isVerified: boolean;
    isActive: boolean;
    verificationToken: string | null;
    googleId: string | null;
    resetToken: string | null;
    resetTokenExpires: string | null;
    createdAt: string;
    updatedAt: string;
  };
  stats: {
    totalEarnings: number;
    totalWithdrawals: number;
    totalReferrals: number;
    transactionCount: number;
    currentPage: number;
    totalPages: number;
    transactions: Array<{
      month: string;
      referrals: number;
      withdrawals: number;
      earnings: number;
    }>;
  };
}

interface ProfileImageResponse {
  message: string;
  data: {
    profileImage: string;
  };
}

interface ErrorResponse {
  message?: string;
  error?: string;
}

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const apiBaseUrl =
          process.env.NEXT_PUBLIC_RBN_API_BASE_URL ||
          "https://rbn.bookbank.com.ng/api/v1";
        const baseUrl =
          process.env.NEXT_PUBLIC_RBN_BASE_URL ||
          "https://rad-5-broker-network.vercel.app";
        const token = localStorage.getItem("rbn_token");
        if (!token || typeof token !== "string" || token.length < 10) {
          throw new Error("Invalid authentication token. Please sign in.");
        }

        const storedReferralLink = localStorage.getItem("rbn_referral_link");
        const storedSharableLink = localStorage.getItem("rbn_sharable_link");

        const response = await fetch(`${apiBaseUrl}/agent/dashboard`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        });

        if (!response.ok) {
          const errorResult = (await response.json()) as ErrorResponse;
          throw new Error(
            errorResult.message ||
              errorResult.error ||
              `HTTP ${response.status}: ${response.statusText}`
          );
        }

        const data: DashboardResponse = await response.json();
        const expectedReferralLink = `${baseUrl}/register/agent/${data.agent.sharableLink}`;

        // Validate and update referral link
        if (
          storedReferralLink &&
          storedSharableLink !== data.agent.sharableLink
        ) {
          console.warn(
            "Referral link mismatch. Stored:",
            storedReferralLink,
            "Expected:",
            expectedReferralLink
          );
          toast.warning("Referral link updated to match your account.");
          localStorage.setItem("rbn_referral_link", expectedReferralLink);
          localStorage.setItem("rbn_sharable_link", data.agent.sharableLink);
        } else if (!storedReferralLink && data.agent.sharableLink) {
          localStorage.setItem("rbn_referral_link", expectedReferralLink);
          localStorage.setItem("rbn_sharable_link", data.agent.sharableLink);
        }

        if (mounted) {
          setDashboardData(data);
          setImagePreview(data.agent.profileImage || null);
          toast.success(data.message || "Dashboard data loaded successfully!");
        }
      } catch (err: any) {
        if (err.name === "AbortError") return;
        if (mounted) {
          toast.error(err.message || "Something went wrong.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchDashboardData();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload a valid image file (e.g., JPG, PNG).");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB.");
        return;
      }
      setProfileImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleImageUpload = async () => {
    if (!profileImageFile) {
      toast.error("Please select an image to upload.");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("profileImage", profileImageFile);

    try {
      const apiBaseUrl =
        process.env.NEXT_PUBLIC_RBN_API_BASE_URL ||
        "https://rbn.bookbank.com.ng/api/v1";
      const token = localStorage.getItem("rbn_token");
      if (!token) {
        throw new Error("Authentication token missing. Please sign in.");
      }

      const response = await fetch(`${apiBaseUrl}/agent/profile-picture`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorResult = (await response.json()) as ErrorResponse;
        throw new Error(
          errorResult.message ||
            errorResult.error ||
            `HTTP ${response.status}: ${response.statusText}`
        );
      }

      const successResult = (await response.json()) as ProfileImageResponse;
      setDashboardData((prev) =>
        prev
          ? {
              ...prev,
              agent: {
                ...prev.agent,
                profileImage: successResult.data.profileImage,
              },
            }
          : prev
      );
      setProfileImageFile(null);
      toast.success(
        successResult.message || "Profile image updated successfully!"
      );
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile image.");
      setImagePreview(dashboardData?.agent.profileImage || null);
    } finally {
      setIsUploading(false);
    }
  };

  const graphData = dashboardData?.stats.transactions || [];
  const totalReferrals = dashboardData?.stats.totalReferrals ?? 0;
  const totalWithdrawals = dashboardData?.stats.totalWithdrawals ?? 0;
  const totalEarnings = dashboardData?.stats.totalEarnings ?? 0;
  const fullName = dashboardData?.agent.fullName ?? "Agent";
  const profileImage =
    dashboardData?.agent.profileImage ?? "/default-avatar.png";
  const sharableLink = dashboardData?.agent.sharableLink ?? "";

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <Toaster />
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <div className="flex-1 lg:ml-64 p-4 lg:p-8 transition-all duration-300">
        <button
          className="lg:hidden mb-4 p-2 bg-gray-800 text-white rounded-md"
          onClick={() => setIsSidebarOpen(true)}
        >
          <RiMenu2Line className="h-6 w-6" />
        </button>
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative">
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={imagePreview || profileImage}
                alt={`${fullName}'s profile`}
              />
              <AvatarFallback>
                {fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <label
              htmlFor="profileImageInput"
              className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-1 cursor-pointer hover:bg-blue-700"
              title="Change profile image"
            >
              <Camera className="h-4 w-4" />
              <input
                id="profileImageInput"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            Welcome, {fullName}
          </h1>
          {profileImageFile && (
            <Button
              onClick={handleImageUpload}
              disabled={isUploading}
              className="ml-4 bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              {isUploading ? "Uploading..." : "Save Image"}
            </Button>
          )}
        </div>
        {loading ? (
          <Card className="flex justify-center items-center p-6">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 dark:border-blue-400"></div>
            <span className="ml-2 text-gray-600 dark:text-gray-300">
              Loading dashboard data...
            </span>
          </Card>
        ) : (
          <>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Your Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Quick access to your referral link and account overview.</p>
                <div className="mt-4">
                  <ReferralLinkSection sharableLink={sharableLink} />
                </div>
              </CardContent>
            </Card>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Users className="h-6 w-6 text-blue-500" />
                    <CardTitle className="text-lg">Total Referrals</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="p-2 text-3xl font-bold text-gray-800 dark:text-gray-100">
                    {totalReferrals}
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <CreditCard className="h-6 w-6 text-green-500" />
                    <CardTitle className="text-lg">Total Withdrawals</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="p-2 text-xl font-bold text-gray-800 dark:text-gray-100">
                    {totalWithdrawals}
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <TbCurrencyNaira className="h-6 w-6 text-yellow-500" />
                    <CardTitle className="text-lg">Total Earnings</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="p-2 text-xl font-bold text-gray-800 dark:text-gray-100">
                    ₦{totalEarnings.toLocaleString()}
                  </div>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
              </CardHeader>
              <CardContent>
                {graphData.length > 0 ? (
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={graphData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="referrals"
                          stroke="#8884d8"
                          name="Referrals"
                        />
                        <Line
                          type="monotone"
                          dataKey="withdrawals"
                          stroke="#82ca9d"
                          name="Withdrawals"
                        />
                        <Line
                          type="monotone"
                          dataKey="earnings"
                          stroke="#ffc658"
                          name="Total Earnings (₦)"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-[400px] flex items-center justify-center">
                    <p className="text-gray-600 dark:text-gray-300">
                      No performance data available yet.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
