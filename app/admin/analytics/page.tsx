"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { RiMenu2Line } from "react-icons/ri";
import { toast } from "react-hot-toast";

interface DashboardData {
  stats: {
    totalAgentEarnings: number;
    totalAgents: number;
    totalWithdrawals: number;
    totalUsers: number;
    agents: {
      id: string;
      fullname: string;
      email: string;
    }[];
    users: {
      id: string;
      fullname: string;
      email: string;
    }[];
  };
  message: string;
}

interface DataPoint {
  month: string;
  agents: number;
  users: number;
  earnings: number;
  withdrawals: number;
}

export default function AnalyticsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [metric, setMetric] = useState<string>("users");
  const router = useRouter();

  // Generate graph data from API response
  const generateGraphData = (data: DashboardData): DataPoint[] => {
    const currentMonth = new Date().toLocaleString("default", {
      month: "short",
    });
    const year = new Date().getFullYear();
    return [
      {
        month: `${currentMonth} ${year}`,
        agents: data.stats.totalAgents,
        users: data.stats.totalUsers,
        earnings: data.stats.totalAgentEarnings,
        withdrawals: data.stats.totalWithdrawals,
      },
    ];
  };

  const metricOptions = [
    { value: "agents", label: "Agents", color: "#3b82f6" },
    { value: "users", label: "Users", color: "#10b981" },
    { value: "earnings", label: "Earnings (₦)", color: "#f59e0b" },
    { value: "withdrawals", label: "Withdrawals (₦)", color: "#ef4444" },
  ];

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("rbn_admin_token");
        if (!token) {
          throw new Error("No authentication token found. Please sign in.");
        }

        const apiBaseUrl =
          process.env.NEXT_PUBLIC_RBN_API_BASE_URL ||
          "https://rbn.bookbank.com.ng/api/v1";
        const endpoint = `${apiBaseUrl}/admin/dashboard`;
        console.log("Fetching analytics data from:", endpoint);

        const response = await fetch(endpoint, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
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
          throw new Error(
            result.message ||
              result.error ||
              `HTTP ${response.status}: ${response.statusText}`
          );
        }

        setDashboardData(result);
        toast.success(result.message || "Analytics data loaded successfully!", {
          duration: 3000,
          position: "top-right",
        });
      } catch (err: any) {
        console.error("Analytics Fetch Error:", err);
        toast.error(err.message || "Failed to load analytics data.", {
          duration: 5000,
          position: "top-right",
        });
        if (err.message.includes("token")) {
          router.push("/admin/signin");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [router]);

  if (isLoading || !dashboardData) {
    return (
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 justify-center items-center">
        <div className="text-gray-800 dark:text-gray-100">Loading...</div>
      </div>
    );
  }

  const graphData = generateGraphData(dashboardData);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminSidebar
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
          Analytics
        </h1>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Platform Analytics</CardTitle>
            <Select value={metric} onValueChange={setMetric}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select metric" />
              </SelectTrigger>
              <SelectContent>
                {metricOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={graphData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-gray-800/90 text-gray-100 p-3 rounded-lg border-none">
                            <p className="font-semibold">{label}</p>
                            {payload.map((entry, index) => (
                              <p key={index} style={{ color: entry.stroke }}>
                                {entry.name}: {entry.toLocaleString()}
                              </p>
                            ))}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend wrapperStyle={{ color: "#9ca3af" }} />
                  <Line
                    type="monotone"
                    dataKey={metric}
                    stroke={
                      metricOptions.find((opt) => opt.value === metric)?.color
                    }
                    name={
                      metricOptions.find((opt) => opt.value === metric)?.label
                    }
                    strokeWidth={2}
                    isAnimationActive={true}
                    animationDuration={1000}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>User Details</CardTitle>
          </CardHeader>
          <CardContent>
            {dashboardData.stats.users.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Full Name</TableHead>
                    <TableHead>Email</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dashboardData.stats.users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.id}</TableCell>
                      <TableCell>{user.fullname}</TableCell>
                      <TableCell>{user.email}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">
                No users found.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
