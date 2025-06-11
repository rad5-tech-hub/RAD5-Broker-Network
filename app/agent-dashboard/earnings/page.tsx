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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RiMenu2Line } from "react-icons/ri";

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

export default function EarningsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [filterPeriod, setFilterPeriod] = useState<string>("all");

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("rbn_token");
        if (!token) {
          throw new Error("No authentication token found. Please sign in.");
        }

        console.log("Fetching dashboard data...");
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
          throw new Error(data.message || "Failed to fetch earnings data.");
        }

        setDashboardData(data);
        toast.success(data.message || "Earnings data loaded successfully!", {
          duration: 3000,
        });
      } catch (err) {
        console.error("Earnings Error:", err);
        const errorMessage =
          err instanceof Error ? err.message : "Something went wrong.";
        toast.error(errorMessage, { duration: 5000 });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Filter transactions by period
  const filteredTransactions =
    dashboardData?.stats.transactions.filter((tx) => {
      if (filterPeriod === "all") return true;
      const txDate = new Date(tx.month);
      const now = new Date();
      if (filterPeriod === "6months") {
        return txDate >= new Date(now.setMonth(now.getMonth() - 6));
      }
      if (filterPeriod === "year") {
        return txDate.getFullYear() === new Date().getFullYear();
      }
      return true;
    }) || [];

  // Download transactions as CSV
  const handleDownloadCSV = () => {
    if (!filteredTransactions.length) {
      toast.error("No transactions to download.", { duration: 5000 });
      return;
    }
    const headers = ["Month", "Referrals", "Earnings", "Withdrawals"];
    const rows = filteredTransactions.map((tx) => [
      tx.month,
      tx.referrals,
      `₦${tx.earnings.toFixed(2)}`,
      `₦${tx.withdrawals.toFixed(2)}`,
    ]);
    const csvContent = [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "earnings.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Earnings downloaded successfully!", { duration: 3000 });
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
          Earnings
        </h1>
        {loading ? (
          <Card className="flex justify-center items-center p-6">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 dark:border-blue-400"></div>
            <span className="ml-2 text-gray-600 dark:text-gray-300">
              Loading earnings data...
            </span>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Total Earnings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    ₦{(dashboardData?.stats.totalEarnings || 0).toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    From {dashboardData?.stats.transactionCount || 0}{" "}
                    transactions
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Filter Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select value={filterPeriod} onValueChange={setFilterPeriod}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="6months">Last 6 Months</SelectItem>
                      <SelectItem value="year">This Year</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button className="mt-4 w-full" onClick={handleDownloadCSV}>
                    Download CSV
                  </Button>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
              </CardHeader>
              <CardContent>
                {filteredTransactions.length ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-left">Month</TableHead>
                          <TableHead className="text-right">
                            Referrals
                          </TableHead>
                          <TableHead className="text-right">Earnings</TableHead>
                          <TableHead className="text-right">
                            Withdrawals
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredTransactions.map((tx, index) => (
                          <TableRow key={index}>
                            <TableCell className="text-left">
                              {tx.month}
                            </TableCell>
                            <TableCell className="text-right">
                              {tx.referrals}
                            </TableCell>
                            <TableCell className="text-right">
                              ₦{tx.earnings.toFixed(2)}
                            </TableCell>
                            <TableCell className="text-right">
                              ₦{tx.withdrawals.toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <p className="text-center text-gray-500 dark:text-gray-400">
                    No transactions found.
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
