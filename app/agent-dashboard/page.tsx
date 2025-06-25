"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ReferralLinkSection from "@/components/ReferralLinkSection";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Users, CreditCard, Share2 } from "lucide-react";
import { TbCurrencyNaira } from "react-icons/tb";
import { RiMenu2Line } from "react-icons/ri";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  FaTwitter,
  FaWhatsapp,
  FaFacebook,
  FaLinkedin,
  FaTelegram,
  FaEnvelope,
  FaShareAlt,
} from "react-icons/fa";

interface ReferredUser {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  track: string;
  paymentStatus: string;
  createdAt: string;
}

interface Transaction {
  id: string;
  agentId: string;
  type: string;
  amount: number;
  description: string;
  createdAt: string;
  updatedAt: string;
}

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
    referredUsers: ReferredUser[];
    transactionCount: number;
    currentPage: number;
    totalPages: number;
    transactions: Transaction[];
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
  const [selectedUser, setSelectedUser] = useState<ReferredUser | null>(null);

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
        const expectedReferralLink = `${baseUrl}/register/agent/${data.agent.sharableLink}`; // Correct path

        const storedReferralLink = localStorage.getItem("rbn_referral_link");
        const storedSharableLink = localStorage.getItem("rbn_sharable_link");

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
          console.error("Dashboard error:", err.message);
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
      console.error("Image upload error:", err.message);
      toast.error(err.message || "Failed to update profile image.");
      setImagePreview(dashboardData?.agent.profileImage || null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleShare = async (platform: string | null = null) => {
    const baseUrl =
      process.env.NEXT_PUBLIC_RBN_BASE_URL ||
      "https://rad-5-broker-network.vercel.app";
    const referralLink = dashboardData?.agent.sharableLink
      ? `${baseUrl}/register/agent/${dashboardData.agent.sharableLink}`
      : "";
    const shareText = `Hey! Join my RAD5 Brokers Network referral program and start earning with elite tech training. Use my link: ${referralLink}`;

    if (!referralLink) {
      toast.error("Referral link not available.");
      return;
    }

    if (!platform && navigator.share) {
      try {
        await navigator.share({
          title: "Join My RAD5 Referral Program",
          text: shareText,
          url: referralLink,
        });
        toast.success("Shared successfully!");
        return;
      } catch (err) {
        console.error("Web Share API error:", err);
      }
    }

    if (platform) {
      const encodedUrl = encodeURIComponent(referralLink);
      const encodedText = encodeURIComponent(shareText);
      let shareUrl = "";
      switch (platform) {
        case "twitter":
          shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
          break;
        case "whatsapp":
          shareUrl = `https://api.whatsapp.com/send?text=${encodedText}`;
          break;
        case "linkedin":
          shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
          break;
        case "facebook":
          shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
          break;
        case "email":
          shareUrl = `mailto:?subject=Join%20My%20RAD5%20Referral%20Program&body=${encodedText}`;
          break;
        case "telegram":
          shareUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;
          break;
        case "native":
          if (navigator.share) {
            await navigator.share({
              title: "Join My RAD5 Referral Program",
              text: shareText,
              url: referralLink,
            });
            toast.success("Shared successfully!");
            return;
          }
          break;
        default:
          return;
      }
      if (shareUrl) window.open(shareUrl, "_blank");
    }
  };

  // Process transaction data for bar graph
  const graphData =
    dashboardData?.stats.transactions.map((transaction) => ({
      date: new Date(transaction.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      earnings: transaction.type === "credit" ? transaction.amount : 0,
      withdrawals: transaction.type === "debit" ? transaction.amount : 0,
    })) || [];

  const totalReferrals = dashboardData?.stats.totalReferrals ?? 0;
  const totalWithdrawals = dashboardData?.stats.totalWithdrawals ?? 0;
  const totalEarnings = dashboardData?.stats.totalEarnings ?? 0;
  const fullName = dashboardData?.agent.fullName ?? "Agent";
  const profileImage =
    dashboardData?.agent.profileImage ?? "/default-avatar.png";
  const sharableLink = dashboardData?.agent.sharableLink ?? "";
  const referredUsers = dashboardData?.stats.referredUsers ?? [];

  // Debugging logs to inspect data
  console.log("dashboardData:", dashboardData);
  console.log("referredUsers:", referredUsers);

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        profileImage={
          dashboardData?.agent.profileImage ?? "/default-avatar.png"
        }
        imagePreview={imagePreview}
        agentName={dashboardData?.agent.fullName ?? "Agent"}
      />

      <div className="flex-1 p-4 sm:p-6 lg:p-8 xl:ml-64 transition-all duration-300 max-w-full overflow-x-hidden">
        <button
          className="lg:hidden mb-4 p-2 bg-gray-800 text-white rounded-md"
          onClick={() => setIsSidebarOpen(true)}
        >
          <RiMenu2Line className="h-6 w-6" />
        </button>
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-6">
          <div className="relative flex-shrink-0">
            <Avatar className="h-12 w-12 sm:h-16 sm:w-16">
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
          <div className="flex-1 mt-4 sm:mt-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 truncate">
              Welcome, {fullName}
            </h1>
            {profileImageFile && (
              <Button
                onClick={handleImageUpload}
                disabled={isUploading}
                className="mt-2 sm:mt-0 sm:ml-4 bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                {isUploading ? "Uploading..." : "Save Image"}
              </Button>
            )}
          </div>
        </div>
        {loading ? (
          <Card className="flex justify-center items-center p-6">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 dark:border-blue-400"></div>
            <span className="ml-2 text-gray-600 dark:text-gray-300">
              Loading dashboard data...
            </span>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Users className="h-6 w-6 text-blue-500" />
                    <CardTitle className="text-lg">Total Referrals</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="p-2 text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">
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
                  <div className="p-2 text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">
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
                  <div className="p-2 text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">
                    ₦{totalEarnings.toLocaleString()}
                  </div>
                </CardContent>
              </Card>
            </div>
            <Card className="w-full bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 shadow-2xl rounded-xl overflow-hidden transition-all duration-300 hover:shadow-3xl">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 sm:p-6 text-white">
                <CardTitle className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                  <Share2 className="h-6 w-6" /> Your Referral Hub
                </CardTitle>
                <p className="text-sm sm:text-base mt-1 opacity-90">
                  Unleash your earning potential with a single click—share,
                  track, and thrive!
                </p>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 space-y-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="w-full sm:w-2/3">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
                      Your Unique Referral Link
                    </h3>
                    <ReferralLinkSection sharableLink={sharableLink} />
                  </div>
                  <div className="w-full sm:w-1/3 flex justify-center">
                    <div className="relative w-24 h-24">
                      <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-blue-500 rounded-full animate-pulse opacity-20"></div>
                      <Avatar className="w-full h-full border-4 border-white dark:border-gray-800 shadow-md">
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
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="w-full sm:w-2/3">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
                      Share with the World
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Spread the word across your favorite platforms!
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            className="bg-gradient-to-r from-green-500 to-teal-500 text-white hover:from-green-600 hover:to-teal-600 transition-all duration-300 flex items-center px-4 py-2 rounded-lg"
                            aria-label="Share referral link"
                          >
                            <Share2 className="h-5 w-5 mr-2" /> Share Now
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-64 bg-white dark:bg-gray-800 shadow-lg rounded-xl p-3">
                          <div className="grid grid-cols-3 gap-8 p-2">
                            <Button
                              variant="ghost"
                              onClick={() => handleShare("twitter")}
                              title="Share on X"
                              className="flex flex-col items-center text-xs sm:text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md p-2 transition-all"
                              aria-label="Share on X"
                            >
                              <FaTwitter className="h-6 w-6 text-blue-400" />
                              <span className="mt-1">X</span>
                            </Button>
                            <Button
                              variant="ghost"
                              onClick={() => handleShare("whatsapp")}
                              title="Share on WhatsApp"
                              className="flex flex-col items-center text-xs sm:text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md p-2 transition-all"
                              aria-label="Share on WhatsApp"
                            >
                              <FaWhatsapp className="h-6 w-6 text-green-500" />
                              <span className="mt-1">WhatsApp</span>
                            </Button>
                            <Button
                              variant="ghost"
                              onClick={() => handleShare("facebook")}
                              title="Share on Facebook"
                              className="flex flex-col items-center text-xs sm:text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md p-2 transition-all"
                              aria-label="Share on Facebook"
                            >
                              <FaFacebook className="h-6 w-6 text-blue-600" />
                              <span className="mt-1">Facebook</span>
                            </Button>
                            <Button
                              variant="ghost"
                              onClick={() => handleShare("linkedin")}
                              title="Share on LinkedIn"
                              className="flex flex-col items-center text-xs sm:text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md p-2 transition-all"
                              aria-label="Share on LinkedIn"
                            >
                              <FaLinkedin className="h-6 w-6 text-blue-700" />
                              <span className="mt-1">LinkedIn</span>
                            </Button>
                            <Button
                              variant="ghost"
                              onClick={() => handleShare("telegram")}
                              title="Share on Telegram"
                              className="flex flex-col items-center text-xs sm:text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md p-2 transition-all"
                              aria-label="Share on Telegram"
                            >
                              <FaTelegram className="h-6 w-6 text-blue-500" />
                              <span className="mt-1">Telegram</span>
                            </Button>
                            <Button
                              variant="ghost"
                              onClick={() => handleShare("email")}
                              title="Share via Email"
                              className="flex flex-col items-center text-xs sm:text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md p-2 transition-all"
                              aria-label="Share via Email"
                            >
                              <FaEnvelope className="h-6 w-6 text-gray-500" />
                              <span className="mt-1">Email</span>
                            </Button>
                            <Button
                              variant="ghost"
                              onClick={() => handleShare("native")}
                              title="Share via Native App"
                              className="flex flex-col items-center text-xs sm:text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md p-2 transition-all"
                              aria-label="Share via Native App"
                            >
                              <FaShareAlt className="h-6 w-6 text-gray-600" />
                              <span className="mt-1">Native</span>
                            </Button>
                          </div>
                          <p className="text-xs text-gray-500 mt-2 text-center">
                            For Instagram, copy the link and share manually.
                          </p>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  <div className="w-full sm:w-1/3 flex justify-center">
                    <div className="text-center">
                      <p className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400">
                        ₦{totalEarnings.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Total Earnings
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* <Card>
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
              </CardHeader>
              <CardContent>
                {graphData.length > 0 ? (
                  <div className="h-[300px] sm:h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={graphData}
                        margin={{ top: 20, right: 10, left: 10, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(255, 255, 255, 0.9)",
                            borderRadius: "4px",
                            fontSize: "12px",
                          }}
                        />
                        <Legend wrapperStyle={{ fontSize: "12px" }} />
                        <Bar
                          dataKey="earnings"
                          fill="#8884d8"
                          name="Earnings (₦)"
                        />
                        <Bar
                          dataKey="withdrawals"
                          fill="#82ca9d"
                          name="Withdrawals (₦)"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-[300px] sm:h-[400px] flex items-center justify-center">
                    <p className="text-gray-600 dark:text-gray-300">
                      No performance data available yet.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card> */}
            {/* <Card>
              <CardHeader>
                <CardTitle>Referred Users</CardTitle>
              </CardHeader>
              <CardContent>
                {referredUsers ? (
                  referredUsers.length > 0 ? (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-left">Name</TableHead>
                            <TableHead className="text-left">Phone</TableHead>
                            <TableHead className="text-left">Track</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {referredUsers.map((user) => (
                            <Dialog key={user.id}>
                              <DialogTrigger asChild>
                                <TableRow
                                  className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                                  onClick={() => setSelectedUser(user)}
                                >
                                  <TableCell>{user.fullName}</TableCell>
                                  <TableCell>{user.phoneNumber}</TableCell>
                                  <TableCell>{user.track}</TableCell>
                                </TableRow>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                  <DialogTitle>{user.fullName}</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-2">
                                  <p>
                                    <strong>Email:</strong> {user.email}
                                  </p>
                                  <p>
                                    <strong>Phone:</strong> {user.phoneNumber}
                                  </p>
                                  <p>
                                    <strong>Track:</strong> {user.track}
                                  </p>
                                  <p>
                                    <strong>Payment Status:</strong>{" "}
                                    {user.paymentStatus}
                                  </p>
                                  <p>
                                    <strong>Joined:</strong>{" "}
                                    {new Date(
                                      user.createdAt
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                              </DialogContent>
                            </Dialog>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <p className="text-gray-600 dark:text-gray-300">
                      No referred users yet.
                    </p>
                  )
                ) : (
                  <p className="text-gray-600 dark:text-gray-300">
                    Unable to load referred users. Please try again later.
                  </p>
                )}
              </CardContent>
            </Card> */}
          </div>
        )}
      </div>
    </div>
  );
}
