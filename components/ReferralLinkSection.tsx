"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";

interface ReferralLinkSectionProps {
  sharableLink?: string;
}

export default function ReferralLinkSection({
  sharableLink,
}: ReferralLinkSectionProps) {
  const baseUrl =
    process.env.NEXT_PUBLIC_RBN_BASE_URL ||
    "https://rad-5-broker-network.vercel.app";
  const storedReferralLink = localStorage.getItem("rbn_referral_link") || "";
  const storedSharableLink = localStorage.getItem("rbn_sharable_link") || "";
  const expectedReferralLink = sharableLink
    ? `${baseUrl}/register-agent/${sharableLink}`
    : "";
  const [referralLink, setReferralLink] = useState(
    storedReferralLink || expectedReferralLink
  );
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    console.log(
      "ReferralLinkSection: Stored referral link:",
      storedReferralLink
    );
    console.log(
      "ReferralLinkSection: Stored sharable link:",
      storedSharableLink
    );
    console.log("ReferralLinkSection: Sharable link prop:", sharableLink);
    console.log(
      "ReferralLinkSection: Expected referral link:",
      expectedReferralLink
    );

    // Validate referral link
    if (
      sharableLink &&
      storedSharableLink &&
      storedSharableLink !== sharableLink
    ) {
      console.warn(
        "Sharable link mismatch. Stored:",
        storedSharableLink,
        "Props:",
        sharableLink,
        "Stored Referral Link:",
        storedReferralLink,
        "Expected Referral Link:",
        expectedReferralLink
      );
      console.log("Triggering warning toast for link mismatch");
      toast.warning("Referral link updated to match your account.");
      localStorage.setItem("rbn_referral_link", expectedReferralLink);
      localStorage.setItem("rbn_sharable_link", sharableLink);
      setReferralLink(expectedReferralLink);
    } else if (sharableLink && !storedReferralLink) {
      localStorage.setItem("rbn_referral_link", expectedReferralLink);
      localStorage.setItem("rbn_sharable_link", sharableLink);
      setReferralLink(expectedReferralLink);
    }
  }, [
    sharableLink,
    storedReferralLink,
    storedSharableLink,
    expectedReferralLink,
  ]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setIsCopied(true);
      console.log("Triggering success toast for copy");
      toast.success("Referral link copied!");
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Copy error:", err);
      toast.error("Failed to copy link.");
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <label
        htmlFor="referralLink"
        className="text-sm font-medium text-gray-700 dark:text-gray-200"
      >
        Your Referral Link
      </label>
      <div className="flex space-x-2">
        <Input
          id="referralLink"
          value={referralLink || "No referral link available"}
          readOnly
          className="text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
        />
        <Button
          onClick={handleCopy}
          disabled={!referralLink}
          className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          aria-label="Copy referral link"
        >
          {isCopied ? "Copied!" : <Copy className="h-5 w-5" />}
        </Button>
      </div>
      {referralLink && (
        <a
          href={referralLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 dark:text-blue-400 underline text-sm"
        >
          Open Referral Link
        </a>
      )}
      {!referralLink && (
        <p className="text-sm text-red-500 dark:text-red-400">
          Please sign up or sign in to generate a referral link.
        </p>
      )}
    </div>
  );
}
