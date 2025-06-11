"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RiMenu2Line } from "react-icons/ri";
import {
  FaTwitter,
  FaWhatsapp,
  FaFacebook,
  FaLinkedin,
  FaTelegram,
  FaInstagram,
  FaEnvelope,
  FaShareAlt,
} from "react-icons/fa";
import { Copy } from "lucide-react";

interface DashboardResponse {
  agentId: string;
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
    referrals?: Array<{
      userId: string;
      date: string;
      status: "Active" | "Pending";
    }>;
  };
  message: string;
  agent: {
    fullName: string;
    profileImage: string;
    sharableLink: string;
  };
}

interface ErrorResponse {
  message?: string;
  error?: string;
}

export default function ReferralsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [referralLink, setReferralLink] = useState<string>("");

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
          "https://rad5brokersnetwork.com";
        const token = localStorage.getItem("rbn_token");
        if (!token) {
          throw new Error("No authentication token found. Please sign in.");
        }

        console.log(
          "Fetching dashboard data from:",
          `${apiBaseUrl}/agent/dashboard`
        );
        const response = await fetch(`${apiBaseUrl}/agent/dashboard`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        });

        console.log("Response status:", response.status, response.statusText);
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

        const data: DashboardResponse = result as DashboardResponse;
        console.log("API Response:", data);

        const storedReferralLink = localStorage.getItem("rbn_referral_link");
        const newReferralLink =
          storedReferralLink ||
          (data.agent.sharableLink
            ? `${baseUrl}/ref/${data.agent.sharableLink}`
            : `${baseUrl}/ref/${data.agentId}`);
        setReferralLink(newReferralLink);
        if (!storedReferralLink && data.agent.sharableLink) {
          localStorage.setItem("rbn_referral_link", newReferralLink);
          console.log("Set referral link:", newReferralLink);
        }

        if (mounted) {
          setDashboardData(data);
          toast.success(data.message || "Referrals data loaded successfully!", {
            duration: 3000,
          });
        }
      } catch (err: any) {
        if (err.name === "AbortError") return;
        console.error("Referrals Error:", err);
        const errorMessage =
          err instanceof Error ? err.message : "Something went wrong.";
        if (mounted) {
          toast.error(errorMessage, { duration: 5000 });
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

  const handleCopyLink = async () => {
    if (referralLink) {
      try {
        await navigator.clipboard.writeText(referralLink);
        toast.success("Referral link copied to clipboard!", { duration: 3000 });
      } catch (err) {
        console.error("Copy error:", err);
        toast.error("Failed to copy link.", { duration: 5000 });
      }
    } else {
      toast.error("No referral link available.", { duration: 5000 });
    }
  };

  const handleShare = async (platform: string) => {
    const tagline =
      localStorage.getItem("userReferralTagline") ||
      "Join RBN and earn rewards!";
    const message = `${tagline} ${referralLink}`;
    let url = "";

    switch (platform) {
      case "twitter":
        url = `https://x.com/intent/tweet?text=${encodeURIComponent(message)}`;
        break;
      case "whatsapp":
        url = `https://wa.me/?text=${encodeURIComponent(message)}`;
        break;
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          referralLink
        )}`;
        break;
      case "linkedin":
        url = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
          referralLink
        )}&title=${encodeURIComponent(tagline)}`;
        break;
      case "telegram":
        url = `https://t.me/share/url?url=${encodeURIComponent(
          referralLink
        )}&text=${encodeURIComponent(tagline)}`;
        break;
      case "email":
        url = `mailto:?subject=${encodeURIComponent(
          "Join RBN"
        )}&body=${encodeURIComponent(message)}`;
        break;
      case "native":
        if (navigator.share) {
          try {
            await navigator.share({
              title: "Join RBN",
              text: tagline,
              url: referralLink,
            });
            toast.success("Shared successfully!", { duration: 3000 });
            return;
          } catch (err) {
            console.error("Native share error:", err);
            toast.error("Failed to share.", { duration: 5000 });
          }
        } else {
          toast.error("Native sharing not supported.", { duration: 5000 });
          return;
        }
      default:
        return;
    }

    window.open(url, "_blank");
    toast.success(`Shared to ${platform}!`, { duration: 3000 });
  };

  const referrals = dashboardData?.stats.referrals || [];

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
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
        <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">
          Referrals
        </h1>
        {loading ? (
          <Card className="flex justify-center items-center p-6">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 dark:border-blue-400"></div>
            <span className="ml-2 text-gray-600 dark:text-gray-300">
              Loading referrals data...
            </span>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Total Referrals</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {dashboardData?.stats.totalReferrals || 0}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Your unique referral ID:{" "}
                    {dashboardData?.agent.sharableLink ||
                      dashboardData?.agentId ||
                      "N/A"}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Your Referral Link</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Input
                      value={referralLink}
                      readOnly
                      className="flex-1"
                      placeholder="Generating referral link..."
                    />
                    <Button
                      onClick={handleCopyLink}
                      aria-label="Copy referral link"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="mt-4">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full flex items-center justify-center"
                        >
                          <FaShareAlt className="mr-2 h-4 w-4" /> Share Link
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-64">
                        <div className="grid grid-cols-3 gap-2">
                          <Button
                            variant="ghost"
                            onClick={() => handleShare("twitter")}
                            title="Share on X"
                            className="flex flex-col items-center"
                          >
                            <FaTwitter className="h-6 w-6 text-blue-400" />
                            <span className="text-xs mt-1">X</span>
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={() => handleShare("whatsapp")}
                            title="Share on WhatsApp"
                            className="flex flex-col items-center"
                          >
                            <FaWhatsapp className="h-6 w-6 text-green-500" />
                            <span className="text-xs mt-1">WhatsApp</span>
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={() => handleShare("facebook")}
                            title="Share on Facebook"
                            className="flex flex-col items-center"
                          >
                            <FaFacebook className="h-6 w-6 text-blue-600" />
                            <span className="text-xs mt-1">Facebook</span>
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={() => handleShare("linkedin")}
                            title="Share on LinkedIn"
                            className="flex flex-col items-center"
                          >
                            <FaLinkedin className="h-6 w-6 text-blue-700" />
                            <span className="text-xs mt-1">LinkedIn</span>
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={() => handleShare("telegram")}
                            title="Share on Telegram"
                            className="flex flex-col items-center"
                          >
                            <FaTelegram className="h-6 w-6 text-blue-500" />
                            <span className="text-xs mt-1">Telegram</span>
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={() => handleShare("email")}
                            title="Share via Email"
                            className="flex flex-col items-center"
                          >
                            <FaEnvelope className="h-6 w-6 text-gray-500" />
                            <span className="text-xs mt-1">Email</span>
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={() => handleShare("native")}
                            title="Share via Native App"
                            className="flex flex-col items-center"
                          >
                            <FaShareAlt className="h-6 w-6 text-gray-600" />
                            <span className="text-xs mt-1">Native</span>
                          </Button>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          For Instagram, copy the link and share manually.
                        </p>
                      </PopoverContent>
                    </Popover>
                  </div>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Referral Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {referrals.length ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-left">User ID</TableHead>
                          <TableHead className="text-left">Date</TableHead>
                          <TableHead className="text-right">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {referrals.map((referral, index) => (
                          <TableRow key={index}>
                            <TableCell className="text-left">
                              {referral.userId}
                            </TableCell>
                            <TableCell className="text-left">
                              {referral.date}
                            </TableCell>
                            <TableCell className="text-right">
                              {referral.status}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <p className="text-center text-gray-500 dark:text-gray-400">
                    No referrals found.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
