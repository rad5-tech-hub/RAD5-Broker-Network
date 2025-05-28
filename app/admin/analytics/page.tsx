"use client";

import { useState } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AnalyticsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [metric, setMetric] = useState("users");

  // Dummy data
  const data = [
    { month: "Jan 2025", users: 200, referrals: 500, earnings: 5000 },
    { month: "Feb 2025", users: 250, referrals: 600, earnings: 6000 },
    { month: "Mar 2025", users: 300, referrals: 800, earnings: 8000 },
    { month: "Apr 2025", users: 280, referrals: 700, earnings: 7000 },
    { month: "May 2025", users: 320, referrals: 900, earnings: 9000 },
    { month: "Jun 2025", users: 350, referrals: 1000, earnings: 10000 },
  ];

  const metricOptions = [
    { value: "users", label: "Users", color: "#3b82f6" },
    { value: "referrals", label: "Referrals", color: "#10b981" },
    { value: "earnings", label: "Earnings", color: "#f59e0b" },
  ];

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
          Open Sidebar
        </button>
        <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">
          Analytics
        </h1>
        <Card>
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
                  data={data}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey={metric}
                    stroke={
                      metricOptions.find((opt) => opt.value === metric)?.color
                    }
                    name={
                      metricOptions.find((opt) => opt.value === metric)?.label
                    }
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
