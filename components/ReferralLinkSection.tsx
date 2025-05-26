"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Share2 } from "lucide-react";
import { toast } from "sonner";

export default function ReferralLinkSection() {
  const [referralLink] = useState("https://learnhub.com/ref/abc123");

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      toast.success("Copied!", {
        description: "Referral link copied to clipboard.",
      });
    } catch (err) {
      toast.error("Error", {
        description: "Failed to copy referral link.",
      });
    }
  };

  const shareLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join LearnHub!",
          text: "Sign up for courses and learn new skills!",
          url: referralLink,
        });
        toast.success("Shared!", {
          description: "Referral link shared successfully.",
        });
      } catch (err) {
        toast.error("Error", {
          description: "Failed to share referral link.",
        });
      }
    } else {
      copyToClipboard();
    }
  };

  return (
    <div className="rounded-lg border bg-white shadow-sm dark:bg-gray-800">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Your Referral Link
        </h3>
      </div>
      <div className="p-6 pt-0">
        <div className="flex items-center space-x-2">
          <Input value={referralLink} readOnly className="flex-1" />
          <Button onClick={copyToClipboard}>
            <Copy className="mr-2 h-4 w-4" />
            Copy
          </Button>
          <Button onClick={shareLink}>
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
      </div>
    </div>
  );
}
