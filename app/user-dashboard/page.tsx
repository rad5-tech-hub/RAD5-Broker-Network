"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ReferralLinkSection from "@/components/ReferralLinkSection";
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
import { Users, CreditCard } from "lucide-react";
import { TbCurrencyNaira } from "react-icons/tb";

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Dummy data for graph and cards (replace with API data)
  const graphData = [
    { month: "Jan 2025", referrals: 50, withdrawals: 5, earnings: 500 },
    { month: "Feb 2025", referrals: 60, withdrawals: 3, earnings: 600 },
    { month: "Mar 2025", referrals: 80, withdrawals: 7, earnings: 800 },
    { month: "Apr 2025", referrals: 70, withdrawals: 4, earnings: 700 },
    { month: "May 2025", referrals: 90, withdrawals: 6, earnings: 900 },
    { month: "Jun 2025", referrals: 100, withdrawals: 8, earnings: 1000 },
  ];

  // Aggregate data for cards
  const totalReferrals = graphData.reduce(
    (sum, item) => sum + item.referrals,
    0
  );
  const totalWithdrawals = graphData.reduce(
    (sum, item) => sum + item.withdrawals,
    0
  );
  const totalEarnings = graphData.reduce((sum, item) => sum + item.earnings, 0);

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
          Open Sidebar
        </button>
        <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">
          Dashboard
        </h1>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Welcome to Your Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Quick access to your referral link and account overview.</p>
            <div className="mt-4">
              <ReferralLinkSection />
            </div>
          </CardContent>
        </Card>
        {/* Responsive Grid Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex items-center space-x-2">
              <Users className="h-6 w-6 text-blue-500" />
              <CardTitle className="text-lg">Total Referrals</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                {totalReferrals}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex items-center space-x-2">
              <CreditCard className="h-6 w-6 text-green-500" />
              <CardTitle className="text-lg">Total Withdrawals</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                {totalWithdrawals}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex items-center space-x-2">
              <TbCurrencyNaira className="h-6 w-6 text-yellow-500" />
              <CardTitle className="text-lg">Total Earnings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                ₦{totalEarnings.toLocaleString()}
              </p>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Performance Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={graphData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="referrals"
                    stroke="#8884d8"
                    name="Referrals"
                  />
                  <Line
                    type="monotone"
                    dataKey="withdrawals"
                    stroke="#82ca9d"
                    name="Withdrawals"
                  />
                  <Line
                    type="monotone"
                    dataKey="earnings"
                    stroke="#ffc658"
                    name="Total Earnings (₦)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
