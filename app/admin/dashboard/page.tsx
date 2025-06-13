"use client";

import { useState, useEffect } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TbCurrencyNaira } from "react-icons/tb";
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
import { Users, CreditCard } from "lucide-react";
import { RiMenu2Line } from "react-icons/ri";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

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

interface ActivityLog {
  id: string;
  action: string;
  user: string;
  date: string;
  details?: string;
}

export default function AdminDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  // Since the API doesn't provide time-series data, we'll create a static representation
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

  // Generate activity log from agents and users
  const generateActivityLog = (data: DashboardData): ActivityLog[] => {
    const logs: ActivityLog[] = [];
    data.stats.agents.forEach((agent, index) => {
      logs.push({
        id: agent.id,
        action: "Agent registered",
        user: agent.email,
        date: new Date().toISOString().split("T")[0], // Placeholder date
        details: `Fullname: ${agent.fullname}`,
      });
    });
    data.stats.users.forEach((user, index) => {
      logs.push({
        id: user.id,
        action: "User registered",
        user: user.email,
        date: new Date().toISOString().split("T")[0], // Placeholder date
        details: `Fullname: ${user.fullname}`,
      });
    });
    return logs.sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5); // Limit to 5 recent logs
  };

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
        console.log("Fetching dashboard data from:", endpoint);

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
        toast.success(result.message || "Dashboard data loaded successfully!", {
          duration: 3000,
          position: "top-right",
        });
      } catch (err: any) {
        console.error("Dashboard Fetch Error:", err);
        toast.error(err.message || "Failed to load dashboard data.", {
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
  const activityLog = generateActivityLog(dashboardData);

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
          Admin Dashboard
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="flex items-center p-4">
              <Users className="h-6 w-6 text-blue-600" />
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Agents
                </h3>
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  {dashboardData.stats.totalAgents}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-4">
              <Users className="h-6 w-6 text-green-600" />
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Users
                </h3>
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  {dashboardData.stats.totalUsers}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-4">
              <TbCurrencyNaira className="h-6 w-6 text-yellow-600" />
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Agent Earnings
                </h3>
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  ₦{dashboardData.stats.totalAgentEarnings.toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-4">
              <CreditCard className="h-6 w-6 text-red-600" />
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Withdrawals
                </h3>
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  ₦{dashboardData.stats.totalWithdrawals.toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Platform Metrics</CardTitle>
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
                    contentStyle={{
                      backgroundColor: "rgb(31 41 55 / 0.9)",
                      border: "none",
                      borderRadius: "8px",
                      color: "#f3f4f6",
                    }}
                    itemStyle={{ color: "#f3f4f6" }}
                  />
                  <Legend wrapperStyle={{ color: "#9ca3af" }} />
                  <Line
                    type="monotone"
                    dataKey="agents"
                    stroke="#8884d8"
                    name="Total Agents"
                    isAnimationActive={true}
                    animationDuration={1000}
                  />
                  <Line
                    type="monotone"
                    dataKey="users"
                    stroke="#82ca9d"
                    name="Total Users"
                    isAnimationActive={true}
                    animationDuration={1000}
                  />
                  <Line
                    type="monotone"
                    dataKey="earnings"
                    stroke="#ffc658"
                    name="Total Earnings (₦)"
                    isAnimationActive={true}
                    animationDuration={1000}
                  />
                  <Line
                    type="monotone"
                    dataKey="withdrawals"
                    stroke="#ff7300"
                    name="Total Withdrawals (₦)"
                    isAnimationActive={true}
                    animationDuration={1000}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Agents List</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Email</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dashboardData.stats.agents.map((agent) => (
                  <TableRow key={agent.id}>
                    <TableCell>{agent.id}</TableCell>
                    <TableCell>{agent.fullname}</TableCell>
                    <TableCell>{agent.email}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Users List</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Action</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activityLog.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>{log.action}</TableCell>
                    <TableCell>{log.user}</TableCell>
                    <TableCell>{log.date}</TableCell>
                    <TableCell>{log.details || "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
