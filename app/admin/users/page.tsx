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

export default function AnalyticsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [visibleLines, setVisibleLines] = useState<{
    users: boolean;
    referrals: boolean;
    earnings: boolean;
  }>({
    users: true,
    referrals: true,
    earnings: true,
  });

  // Define data type
  interface DataPoint {
    month: string;
    users: number;
    referrals: number;
    earnings: number;
  }

  // Dummy data
  const data: DataPoint[] = [
    { month: "Jan 2025", users: 200, referrals: 500, earnings: 5000 },
    { month: "Feb 2025", users: 250, referrals: 600, earnings: 6000 },
    { month: "Mar 2025", users: 300, referrals: 800, earnings: 8000 },
    { month: "Apr 2025", users: 280, referrals: 700, earnings: 7000 },
    { month: "May 2025", users: 320, referrals: 900, earnings: 9000 },
    { month: "Jun 2025", users: 350, referrals: 1000, earnings: 10000 },
  ];

  const metrics = [
    { key: "users", label: "Users", gradientId: "gradientUsers" },
    { key: "referrals", label: "Referrals", gradientId: "gradientReferrals" },
    { key: "earnings", label: "Earnings", gradientId: "gradientEarnings" },
  ] as const;

  type MetricKey = (typeof metrics)[number]["key"];

  const handleLegendClick = (dataKey: MetricKey) => {
    setVisibleLines((prev) => ({
      ...prev,
      [dataKey]: !prev[dataKey],
    }));
  };

  interface CustomTooltipProps {
    active?: boolean;
    payload?: Array<{ name: string; value: number; stroke: string }>;
    label?: string;
  }

  const CustomTooltip: React.FC<CustomTooltipProps> = ({
    active,
    payload,
    label,
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800/90 text-gray-100 p-3 rounded-lg border-none">
          <p className="font-semibold">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.stroke }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
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
          Open Sidebar
        </button>
        <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">
          Analytics
        </h1>
        <Card>
          <CardHeader>
            <CardTitle>Platform Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={data}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <defs>
                    <linearGradient
                      id="gradientUsers"
                      x1="0"
                      y1="0"
                      x2="1"
                      y2="0"
                    >
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.9} />
                      <stop
                        offset="95%"
                        stopColor="#10b981"
                        stopOpacity={0.9}
                      />
                    </linearGradient>
                    <linearGradient
                      id="gradientReferrals"
                      x1="0"
                      y1="0"
                      x2="1"
                      y2="0"
                    >
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.9} />
                      <stop
                        offset="95%"
                        stopColor="#f59e0b"
                        stopOpacity={0.9}
                      />
                    </linearGradient>
                    <linearGradient
                      id="gradientEarnings"
                      x1="0"
                      y1="0"
                      x2="1"
                      y2="0"
                    >
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.9} />
                      <stop
                        offset="95%"
                        stopColor="#ef4444"
                        stopOpacity={0.9}
                      />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    onClick={(e) => handleLegendClick(e.value as MetricKey)}
                    wrapperStyle={{ color: "#9ca3af", cursor: "pointer" }}
                  />
                  {metrics.map((metric) =>
                    visibleLines[metric.key] ? (
                      <Line
                        key={metric.key}
                        type="monotone"
                        dataKey={metric.key}
                        name={metric.label}
                        stroke={`url(#${metric.gradientId})`}
                        strokeWidth={2}
                        filter="url(#glow)"
                        isAnimationActive={true}
                        animationDuration={1000}
                      />
                    ) : null
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
