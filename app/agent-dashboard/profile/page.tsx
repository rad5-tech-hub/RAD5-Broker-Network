"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { RiMenu2Line } from "react-icons/ri";
import { FaTwitter, FaLinkedin } from "react-icons/fa";

// TypeScript interface for API response
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
  };
  message: string;
}

interface SocialLinks {
  twitter: string;
  linkedin: string;
}

export default function ProfilePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [agentId, setAgentId] = useState<string | null>(null);
  const [bio, setBio] = useState<string>(
    typeof window !== "undefined" ? localStorage.getItem("userBio") || "" : ""
  );
  const [socialLinks, setSocialLinks] = useState<SocialLinks>(
    typeof window !== "undefined"
      ? JSON.parse(
          localStorage.getItem("userSocialLinks") ||
            '{"twitter":"","linkedin":""}'
        )
      : { twitter: "", linkedin: "" }
  );
  const [theme, setTheme] = useState<string>(
    typeof window !== "undefined"
      ? localStorage.getItem("userTheme") || "light"
      : "light"
  );
  const [referralTagline, setReferralTagline] = useState<string>(
    typeof window !== "undefined"
      ? localStorage.getItem("userReferralTagline") || ""
      : ""
  );
  const [profileImage, setProfileImage] = useState<string>(
    typeof window !== "undefined"
      ? localStorage.getItem("userProfileImage") || "/default-avatar.png"
      : "/default-avatar.png"
  );
  const [loading, setLoading] = useState(true);

  // Fetch agentId from dashboard endpoint
  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("rbn_token");
        if (!token) {
          throw new Error("No authentication token found. Please sign in.");
        }

        console.log("Fetching profile data...");
        const response = await fetch(
          "https://rbn.bookbank.com.ng/api/v1/agent/dashboard",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Response status:", response.status, response.statusText);
        const data: DashboardResponse = await response.json();
        console.log("API Response:", data);

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch profile data.");
        }

        setAgentId(data.agentId);
        toast.success(data.message || "Profile data loaded successfully!", {
          duration: 3000,
        });
      } catch (err) {
        console.error("Profile Error:", err);
        const errorMessage =
          err instanceof Error ? err.message : "Something went wrong.";
        toast.error(errorMessage, { duration: 5000 });
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  // Save profile image to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("userProfileImage", profileImage);
    }
  }, [profileImage]);

  // Save bio, social links, theme, and tagline to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("userBio", bio);
      localStorage.setItem("userSocialLinks", JSON.stringify(socialLinks));
      localStorage.setItem("userTheme", theme);
      localStorage.setItem("userReferralTagline", referralTagline);
      // Apply theme to document
      document.documentElement.classList.toggle("dark", theme === "dark");
    }
  }, [bio, socialLinks, theme, referralTagline]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file.", { duration: 5000 });
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size must be less than 2MB.", { duration: 5000 });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSocialLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSocialLinks((prev) => ({ ...prev, [name]: value }));
  };

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBio(e.target.value);
  };

  const handleTaglineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReferralTagline(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (bio.length > 160) {
      toast.error("Bio must be 160 characters or less.", { duration: 5000 });
      return;
    }
    if (referralTagline.length > 50) {
      toast.error("Referral tagline must be 50 characters or less.", {
        duration: 5000,
      });
      return;
    }
    if (
      socialLinks.twitter &&
      !socialLinks.twitter.match(/^https?:\/\/(www\.)?(x|twitter)\.com\/.+$/)
    ) {
      toast.error("Invalid Twitter/X URL.", { duration: 5000 });
      return;
    }
    if (
      socialLinks.linkedin &&
      !socialLinks.linkedin.match(/^https?:\/\/(www\.)?linkedin\.com\/.+$/)
    ) {
      toast.error("Invalid LinkedIn URL.", { duration: 5000 });
      return;
    }
    toast.success("Profile updated successfully!", { duration: 3000 });
  };

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
          Profile
        </h1>
        <Card>
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <Card className="flex justify-center items-center p-6">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 dark:border-blue-400"></div>
                <span className="ml-2 text-gray-600 dark:text-gray-300">
                  Loading profile data...
                </span>
              </Card>
            ) : (
              <>
                <div className="text-center text-sm text-gray-600 dark:text-gray-300">
                  Agent ID: {agentId ?? "N/A"}
                </div>
                <div className="flex justify-center">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={profileImage} alt="Profile" />
                    <AvatarFallback>UN</AvatarFallback>
                  </Avatar>
                </div>
                <div className="text-center">
                  <Label
                    htmlFor="profileImage"
                    className="cursor-pointer text-blue-600 hover:underline"
                  >
                    Change Profile Image
                  </Label>
                  <Input
                    id="profileImage"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="bio">Bio (max 160 characters)</Label>
                    <Textarea
                      id="bio"
                      value={bio}
                      onChange={handleBioChange}
                      placeholder="Tell us about yourself!"
                      maxLength={160}
                      className="h-24"
                    />
                    <p className="text-sm text-gray-500">{bio.length}/160</p>
                  </div>
                  <div>
                    <Label htmlFor="twitter">Twitter/X Profile</Label>
                    <div className="relative">
                      <FaTwitter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                      <Input
                        id="twitter"
                        name="twitter"
                        value={socialLinks.twitter}
                        onChange={handleSocialLinkChange}
                        placeholder="https://x.com/username"
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="linkedin">LinkedIn Profile</Label>
                    <div className="relative">
                      <FaLinkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                      <Input
                        id="linkedin"
                        name="linkedin"
                        value={socialLinks.linkedin}
                        onChange={handleSocialLinkChange}
                        placeholder="https://linkedin.com/in/username"
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="theme">Dark Mode</Label>
                    <Switch
                      id="theme"
                      checked={theme === "dark"}
                      onCheckedChange={() =>
                        setTheme(theme === "dark" ? "light" : "dark")
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="referralTagline">
                      Referral Tagline (max 50 characters)
                    </Label>
                    <Input
                      id="referralTagline"
                      value={referralTagline}
                      onChange={handleTaglineChange}
                      placeholder="Join RBN with me!"
                      maxLength={50}
                    />
                    <p className="text-sm text-gray-500">
                      {referralTagline.length}/50
                    </p>
                  </div>
                  <Button type="submit">Save Changes</Button>
                </form>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
