"use client";

import { useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { RiMenu2Line } from "react-icons/ri";

export default function WithdrawalsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  // Define withdrawal type
  interface Withdrawal {
    id: number;
    username: string;
    email: string;
    amount: number;
    status: "pending" | "approved" | "rejected";
    date: string;
  }

  // Dummy data
  const withdrawals: Withdrawal[] = [
    {
      id: 1001,
      username: "John Doe",
      email: "john@example.com",
      amount: 200,
      status: "pending",
      date: "2025-06-01",
    },
    {
      id: 1002,
      username: "Jane Smith",
      email: "jane@example.com",
      amount: 150,
      status: "pending",
      date: "2025-06-02",
    },
    {
      id: 1003,
      username: "Bob Johnson",
      email: "bob@example.com",
      amount: 300,
      status: "approved",
      date: "2025-06-03",
    },
  ];

  // Define handleAction with types
  const handleAction = (id: number, action: "Approve" | "Reject"): void => {
    toast.success(`${action} withdrawal ${id}`, {
      description: `Withdrawal ${action.toLowerCase()} successfully!`,
    });
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
          Withdrawal Management
        </h1>
        <Card>
          <CardHeader>
            <CardTitle>Withdrawal Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {withdrawals.map((withdrawal) => (
                  <TableRow key={withdrawal.id}>
                    <TableCell>{withdrawal.id}</TableCell>
                    <TableCell>{withdrawal.email}</TableCell>
                    <TableCell>${withdrawal.amount}</TableCell>
                    <TableCell>{withdrawal.status}</TableCell>
                    <TableCell>{withdrawal.date}</TableCell>
                    <TableCell className="space-x-2">
                      {withdrawal.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            onClick={() =>
                              handleAction(withdrawal.id, "Approve")
                            }
                          >
                            Approve
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() =>
                              handleAction(withdrawal.id, "Reject")
                            }
                          >
                            Reject
                          </Button>
                        </>
                      )}
                    </TableCell>
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
