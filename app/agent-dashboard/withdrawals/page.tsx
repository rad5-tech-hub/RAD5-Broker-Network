"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
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
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RiMenu2Line } from "react-icons/ri";

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
    withdrawals?: Array<{
      id: string;
      amount: number;
      bankName: string;
      accountNumber: string;
      accountName: string;
      status: "Pending" | "Completed" | "Failed";
      date: string;
    }>;
  };
  message: string;
  agent: {
    fullName: string;
    profileImage: string;
    sharableLink: string;
  };
}

interface WithdrawalFormData {
  amount: string;
  description: string;
  bankName: string;
  bankNameOther: string;
  accountNumber: string;
  accountName: string;
}

interface WithdrawalResponse {
  message: string;
  data: {
    id: string;
    amount: number;
    status: string;
    date: string;
  };
}

interface ErrorResponse {
  message?: string;
  error?: string;
}

const nigerianBanks = [
  "Access Bank",
  "Citibank Nigeria",
  "Ecobank Nigeria",
  "Fidelity Bank",
  "First Bank of Nigeria",
  "First City Monument Bank (FCMB)",
  "Guaranty Trust Bank (GTB)",
  "Heritage Bank",
  "Keystone Bank",
  "Polaris Bank",
  "Stanbic IBTC Bank",
  "Standard Chartered Bank",
  "Sterling Bank",
  "Union Bank of Nigeria",
  "United Bank for Africa (UBA)",
  "Wema Bank",
  "Zenith Bank",
  "Other",
];

export default function WithdrawalsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<WithdrawalFormData>({
    amount: "",
    description: "",
    bankName: "",
    bankNameOther: "",
    accountNumber: "",
    accountName: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const apiBaseUrl =
          process.env.NEXT_PUBLIC_RBN_API_BASE_URL ||
          "https://rbn.bookbank.com.ng/api/v1";
        const token = localStorage.getItem("rbn_token");
        console.log("Token on load:", token);
        if (!token) {
          toast.error("Please sign in to continue.", { duration: 5000 });
          router.push("/signin");
          return;
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

        console.log(
          "Dashboard Response status:",
          response.status,
          response.statusText
        );
        if (!response.ok) {
          const errorResult = await response.json();
          throw new Error(errorResult.message || `HTTP ${response.status}`);
        }

        const data: DashboardResponse = await response.json();
        console.log("Dashboard API Response:", data);

        if (mounted) {
          setDashboardData(data);
          toast.success(data.message || "Data loaded successfully!", {
            duration: 3000,
          });
        }
      } catch (err: any) {
        console.error("Dashboard Fetch Error:", err);
        if (mounted && err.name !== "AbortError") {
          toast.error(err.message || "Failed to load data.", {
            duration: 5000,
          });
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchDashboardData();
    return () => {
      mounted = false;
      controller.abort();
    };
  }, [router]);

  const availableBalance =
    (dashboardData?.stats.totalEarnings || 0) -
    (dashboardData?.stats.totalWithdrawals || 0);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBankSelect = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      bankName: value,
      bankNameOther: value === "Other" ? prev.bankNameOther : "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log("Form submitted:", formData);

    try {
      console.log("Step 1: Validating amount");
      const amount = parseFloat(formData.amount);
      if (isNaN(amount) || amount <= 0) {
        console.log("Invalid amount:", formData.amount);
        throw new Error("Please enter a valid amount.");
      }

      console.log("Step 2: Checking balance", { amount, availableBalance });
      if (amount > availableBalance) {
        console.log("Amount exceeds balance");
        throw new Error("Amount exceeds available balance.");
      }

      console.log("Step 3: Validating description");
      if (!formData.description.trim()) {
        console.log("Empty description");
        throw new Error("Please enter a description.");
      }

      console.log("Step 4: Validating bank");
      const selectedBank =
        formData.bankName === "Other"
          ? formData.bankNameOther
          : formData.bankName;
      if (!selectedBank.trim()) {
        console.log("No bank selected");
        throw new Error("Please select or enter a bank name.");
      }

      console.log("Step 5: Validating account number");
      if (!formData.accountNumber.match(/^\d{10}$/)) {
        console.log("Invalid account number:", formData.accountNumber);
        throw new Error("Please enter a valid 10-digit account number.");
      }

      console.log("Step 6: Validating account name");
      if (!formData.accountName.trim()) {
        console.log("Empty account name");
        throw new Error("Please enter an account name.");
      }

      console.log("Step 7: Checking token");
      const token = localStorage.getItem("rbn_token");
      console.log("Token for submission:", token);
      if (!token) {
        console.log("No token found");
        toast.error("Session expired. Please sign in.", { duration: 5000 });
        router.push("/signin");
        return;
      }

      const apiBaseUrl =
        process.env.NEXT_PUBLIC_RBN_API_BASE_URL ||
        "https://rbn.bookbank.com.ng/api/v1";
      const body = {
        amount,
        description: formData.description,
        bankName: selectedBank,
        accountNumber: formData.accountNumber,
        accountName: formData.accountName,
      };

      console.log(
        "Step 8: Sending request to:",
        `${apiBaseUrl}/withdrawal/request`,
        body
      );
      const response = await fetch("/api/withdrawal-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      console.log("Step 9: Response received", { status: response.status });
      if (!response.ok) {
        const errorResult = await response.json();
        console.log("API Error:", errorResult);
        throw new Error(errorResult.message || `HTTP ${response.status}`);
      }

      const successResult: WithdrawalResponse = await response.json();
      console.log("Step 10: Success", successResult);

      toast.success(
        successResult.message ||
          `Withdrawal of ₦${amount.toFixed(2)} requested!`,
        { duration: 3000 }
      );
      setFormData({
        amount: "",
        description: "",
        bankName: "",
        bankNameOther: "",
        accountNumber: "",
        accountName: "",
      });

      console.log("Step 11: Refreshing dashboard");
      const dashboardResponse = await fetch(`${apiBaseUrl}/agent/dashboard`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (dashboardResponse.ok) {
        setDashboardData(await dashboardResponse.json());
      }
    } catch (err: any) {
      console.error("Submission Error:", err.message, err.stack);
      toast.error(err.message || "Failed to request withdrawal.", {
        duration: 5000,
      });
      alert(`Error: ${err.message || "Unknown error"}`); // Fallback
    } finally {
      setIsSubmitting(false);
      console.log("Step 12: Submission complete");
    }
  };

  const withdrawals = dashboardData?.stats.withdrawals || [];

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
          Withdrawals
        </h1>
        {loading ? (
          <Card className="flex justify-center items-center p-6">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 dark:border-blue-400"></div>
            <span className="ml-2 text-gray-600 dark:text-gray-300">
              Loading withdrawal data...
            </span>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Available Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  ₦{availableBalance.toFixed(2)}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Total Earnings: ₦
                  {(dashboardData?.stats.totalEarnings || 0).toFixed(2)}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Total Withdrawn: ₦
                  {(dashboardData?.stats.totalWithdrawals || 0).toFixed(2)}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Request a Withdrawal</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="amount">Amount (₦)</Label>
                    <Input
                      id="amount"
                      name="amount"
                      type="number"
                      value={formData.amount}
                      onChange={handleInputChange}
                      placeholder="Enter amount"
                      min="0"
                      step="0.01"
                      disabled={isSubmitting}
                      className="transition-all duration-200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="e.g., Weekly commission payout"
                      disabled={isSubmitting}
                      className="transition-all duration-200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bankName">Bank Name</Label>
                    <Select
                      name="bankName"
                      value={formData.bankName}
                      onValueChange={handleBankSelect}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger className="transition-all duration-300">
                        <SelectValue placeholder="Select a bank" />
                      </SelectTrigger>
                      <SelectContent>
                        {nigerianBanks.map((bank) => (
                          <SelectItem key={bank} value={bank}>
                            {bank}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {formData.bankName === "Other" && (
                    <div className="animate-in fade-in">
                      <Label htmlFor="bankNameOther">Other Bank Name</Label>
                      <Input
                        id="bankNameOther"
                        name="bankNameOther"
                        value={formData.bankNameOther}
                        onChange={handleInputChange}
                        placeholder="Enter bank name"
                        disabled={isSubmitting}
                        className="transition-all duration-200"
                      />
                    </div>
                  )}
                  <div>
                    <Label htmlFor="accountNumber">Account Number</Label>
                    <Input
                      id="accountNumber"
                      name="accountNumber"
                      value={formData.accountNumber}
                      onChange={handleInputChange}
                      placeholder="Enter 10-digit account number"
                      maxLength={10}
                      disabled={isSubmitting}
                      className="transition-all duration-200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="accountName">Account Name</Label>
                    <Input
                      id="accountName"
                      name="accountName"
                      value={formData.accountName}
                      onChange={handleInputChange}
                      placeholder="Enter account name"
                      disabled={isSubmitting}
                      className="transition-all duration-200"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full transition-all duration-200"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin h-5 w-5 mr-2 text-white"
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
                            d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                          ></path>
                        </svg>
                        Submitting...
                      </span>
                    ) : (
                      "Request Withdrawal"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Recent Withdrawals</CardTitle>
              </CardHeader>
              <CardContent>
                {withdrawals.length ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-left">Date</TableHead>
                          <TableHead className="text-left">Amount</TableHead>
                          <TableHead className="text-left">Bank</TableHead>
                          <TableHead className="text-left">Account</TableHead>
                          <TableHead className="text-right">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {withdrawals.map((tx, index) => (
                          <TableRow key={tx.id || index}>
                            <TableCell className="text-left">
                              {tx.date}
                            </TableCell>
                            <TableCell className="text-left">
                              ₦{tx.amount.toFixed(2)}
                            </TableCell>
                            <TableCell className="text-left">
                              {tx.bankName}
                            </TableCell>
                            <TableCell className="text-left">
                              {tx.accountNumber}
                            </TableCell>
                            <TableCell className="text-right">
                              {tx.status}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <p className="text-center text-gray-500 dark:text-gray-400">
                    No withdrawals found.
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
