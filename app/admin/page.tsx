"use client";

import { useState } from "react";
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

export default function AdminDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  // Define data type
  interface DataPoint {
    month: string;
    referrals: number;
    withdrawals: number;
    earnings: number;
  }

  // Dummy data
  const overviewData: DataPoint[] = [
    { month: "Jan 2025", referrals: 50, withdrawals: 5, earnings: 500 },
    { month: "Feb 2025", referrals: 60, withdrawals: 3, earnings: 600 },
    { month: "Mar 2025", referrals: 80, withdrawals: 7, earnings: 800 },
    { month: "Apr 2025", referrals: 70, withdrawals: 4, earnings: 700 },
    { month: "May 2025", referrals: 90, withdrawals: 6, earnings: 900 },
    { month: "Jun 2025", referrals: 100, withdrawals: 8, earnings: 1000 },
  ];

  const activityLog = [
    {
      id: 1,
      action: "User signed up",
      user: "john@example.com",
      date: "2025-06-01",
    },
    {
      id: 2,
      action: "Withdrawal requested",
      user: "jane@example.com",
      date: "2025-06-02",
      amount: "₦200",
    },
    {
      id: 3,
      action: "Referral added",
      user: "bob@example.com",
      date: "2025-06-03",
    },
  ];

  const totals = {
    referrals: overviewData.reduce((sum, item) => sum + item.referrals, 0),
    withdrawals: overviewData.reduce((sum, item) => sum + item.withdrawals, 0),
    earnings: overviewData.reduce((sum, item) => sum + item.earnings, 0),
  };

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
                  Total Referrals
                </h3>
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  {totals.referrals}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-4">
              <CreditCard className="h-6 w-6 text-green-600" />
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Withdrawals
                </h3>
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  {totals.withdrawals}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-4">
              <TbCurrencyNaira className="h-6 w-6 text-yellow-600" />
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Earnings
                </h3>
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  ₦{totals.earnings.toLocaleString()}
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
                  data={overviewData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgb(31 41 55 / 0.9)", // gray-800
                      border: "none",
                      borderRadius: "8px",
                      color: "#f3f4f6", // gray-100
                    }}
                    itemStyle={{ color: "#f3f4f6" }}
                  />
                  <Legend wrapperStyle={{ color: "#9ca3af" }} />
                  <Line
                    type="monotone"
                    dataKey="referrals"
                    stroke="#8884d8"
                    name="Referrals"
                    isAnimationActive={true}
                    animationDuration={1000}
                  />
                  <Line
                    type="monotone"
                    dataKey="withdrawals"
                    stroke="#82ca9d"
                    name="Withdrawals"
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
                </LineChart>
              </ResponsiveContainer>
            </div>
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
                    <TableCell>{log.amount || "-"}</TableCell>
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
