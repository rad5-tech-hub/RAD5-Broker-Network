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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
  const [selectedLog, setSelectedLog] = useState<ActivityLog | null>(null);
  const router = useRouter();

  const generateGraphData = (data: DashboardData): DataPoint[] => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    const year = 2025;
    const baseAgents = data.stats.totalAgents;
    const baseUsers = data.stats.totalUsers;
    const baseEarnings = data.stats.totalAgentEarnings;
    const baseWithdrawals = data.stats.totalWithdrawals;

    return months.map((month, index) => ({
      month: `${month} ${year}`,
      agents: baseAgents * (0.9 + index * 0.02),
      users: baseUsers * (0.85 + index * 0.03),
      earnings: baseEarnings * (0.8 + index * 0.05),
      withdrawals: baseWithdrawals * (0.75 + index * 0.06),
    }));
  };

  const generateActivityLog = (data: DashboardData): ActivityLog[] => {
    const logs: ActivityLog[] = [];
    data.stats.agents.forEach((agent, index) => {
      logs.push({
        id: agent.id,
        action: "Agent registered",
        user: agent.email,
        date: new Date().toISOString().split("T")[0],
        details: `Fullname: ${agent.fullname}`,
      });
    });
    data.stats.users.forEach((user, index) => {
      logs.push({
        id: user.id,
        action: "User registered",
        user: user.email,
        date: new Date().toISOString().split("T")[0],
        details: `Fullname: ${user.fullname}`,
      });
    });
    return logs.sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
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
  const activityLog = generateActivityLog(dashboardData).slice(0, 3);

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <AdminSidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <div className="flex-1 p-2 sm:p-4 lg:p-6 xl:ml-64 transition-all duration-300 max-w-full overflow-x-hidden">
        <button
          className="lg:hidden mb-2 sm:mb-4 p-2 bg-gray-800 text-white rounded-md"
          onClick={() => setIsSidebarOpen(true)}
        >
          <RiMenu2Line className="h-5 sm:h-6 w-5 sm:w-6" />
        </button>
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-800 dark:text-gray-100">
          Admin Dashboard
        </h1>
        <div className="max-w-screen-xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6">
            <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300 min-h-[80px] sm:min-h-[100px]">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Users className="h-5 sm:h-6 w-5 sm:w-6 text-blue-500" />
                  <CardTitle className="text-sm sm:text-lg">
                    Total Agents
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="p-2 text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100">
                  {dashboardData.stats.totalAgents}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300 min-h-[80px] sm:min-h-[100px]">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Users className="h-5 sm:h-6 w-5 sm:w-6 text-green-500" />
                  <CardTitle className="text-sm sm:text-lg">
                    Total Users
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="p-2 text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100">
                  {dashboardData.stats.totalUsers}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300 min-h-[80px] sm:min-h-[100px]">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <TbCurrencyNaira className="h-5 sm:h-6 w-5 sm:w-6 text-yellow-500" />
                  <CardTitle className="text-sm sm:text-lg">
                    Total Earnings
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="p-2 text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100">
                  ₦{dashboardData.stats.totalAgentEarnings.toLocaleString()}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300 min-h-[80px] sm:min-h-[100px]">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <CreditCard className="h-5 sm:h-6 w-5 sm:w-6 text-red-500" />
                  <CardTitle className="text-sm sm:text-lg">
                    Total Withdrawals
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="p-2 text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100">
                  ₦{dashboardData.stats.totalWithdrawals.toLocaleString()}
                </div>
              </CardContent>
            </Card>
          </div>
          {/* <Card className="mb-4 sm:mb-6">
            <CardHeader>
              <CardTitle>Platform Growth Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] sm:h-[300px] md:h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={graphData}
                    margin={{ top: 10, right: 20, left: 10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                      dataKey="month"
                      stroke="#9ca3af"
                      interval="preserveStartEnd"
                    />
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
                      animationDuration={1500}
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="users"
                      stroke="#82ca9d"
                      name="Total Users"
                      isAnimationActive={true}
                      animationDuration={1500}
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="earnings"
                      stroke="#ffc658"
                      name="Total Earnings (₦)"
                      isAnimationActive={true}
                      animationDuration={1500}
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="withdrawals"
                      stroke="#ff7300"
                      name="Total Withdrawals (₦)"
                      isAnimationActive={true}
                      animationDuration={1500}
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card> */}
          {/* <Card className="mb-6">
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
          </Card> */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Action</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activityLog.map((log) => (
                      <Dialog key={log.id}>
                        <DialogTrigger asChild>
                          <TableRow
                            className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                            onClick={() => setSelectedLog(log)}
                          >
                            <TableCell>{log.action}</TableCell>
                            <TableCell>{log.user}</TableCell>
                            <TableCell>{log.date}</TableCell>
                          </TableRow>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Activity Details</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-2">
                            <p>
                              <strong>Action:</strong> {log.action}
                            </p>
                            <p>
                              <strong>User:</strong> {log.user}
                            </p>
                            <p>
                              <strong>Date:</strong> {log.date}
                            </p>
                            <p>
                              <strong>Details:</strong> {log.details || "-"}
                            </p>
                          </div>
                        </DialogContent>
                      </Dialog>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
