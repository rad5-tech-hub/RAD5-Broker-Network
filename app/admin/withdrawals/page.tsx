"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { toast } from "react-hot-toast";
import { RiMenu2Line, RiSearchLine } from "react-icons/ri";

interface Withdrawal {
  id: string;
  username: string;
  email: string;
  amount: number;
  status: "pending" | "approved" | "rejected";
  date: string;
}

export default function WithdrawalsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;
  const router = useRouter();

  useEffect(() => {
    const fetchWithdrawals = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("rbn_admin_token");
        if (!token) {
          throw new Error("No authentication token found. Please sign in.");
        }

        const apiBaseUrl =
          process.env.NEXT_PUBLIC_RBN_API_BASE_URL ||
          "https://rbn.bookbank.com.ng/api/v1";
        const endpoint = `${apiBaseUrl}/withdrawal/withdrawals`;
        console.log("Fetching withdrawals data from:", endpoint);

        const response = await fetch(endpoint, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || `HTTP ${response.status}`);
        }

        const result = await response.json();
        setWithdrawals(result.data || result);
        toast.success("Withdrawals loaded successfully!", {
          duration: 3000,
          position: "top-right",
        });
      } catch (err: any) {
        console.error("Fetch Withdrawals Error:", err);
        toast.error(err.message || "Failed to load withdrawals.", {
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

    fetchWithdrawals();
  }, [router]);

  const handleAction = async (id: string, action: "approve" | "reject") => {
    try {
      const token = localStorage.getItem("rbn_admin_token");
      if (!token) {
        throw new Error("No authentication token found. Please sign in.");
      }

      // Placeholder endpoint; replace with actual API if different
      const apiBaseUrl =
        process.env.NEXT_PUBLIC_RBN_API_BASE_URL ||
        "https://rbn.bookbank.com.ng/api/v1";
      const endpoint = `${apiBaseUrl}/admin/withdrawals/${id}/status`;
      console.log(`Sending ${action} request to:`, endpoint);

      const response = await fetch(endpoint, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: action }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `HTTP ${response.status}`);
      }

      setWithdrawals((prev) =>
        prev.map((w) =>
          w.id === id ? { ...w, status: action as Withdrawal["status"] } : w
        )
      );
      toast.success(
        `${
          action.charAt(0).toUpperCase() + action.slice(1)
        }d withdrawal ${id} successfully!`,
        {
          duration: 3000,
          position: "top-right",
        }
      );
    } catch (err: any) {
      console.error(`${action} Withdrawal Error:`, err);
      toast.error(err.message || `Failed to ${action} withdrawal.`, {
        duration: 5000,
        position: "top-right",
      });
    }
  };

  const filteredWithdrawals = withdrawals.filter(
    (withdrawal) =>
      withdrawal.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      withdrawal.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredWithdrawals.length / itemsPerPage);
  const paginatedWithdrawals = filteredWithdrawals.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 justify-center items-center">
        <div className="text-gray-800 dark:text-gray-100">Loading...</div>
      </div>
    );
  }

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
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Withdrawal Requests</CardTitle>
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <RiSearchLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search withdrawals by username or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {paginatedWithdrawals.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Avatar</TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedWithdrawals.map((withdrawal) => (
                    <TableRow key={withdrawal.id}>
                      <TableCell>
                        <Avatar>
                          <AvatarFallback>
                            {withdrawal.username
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell>{withdrawal.id}</TableCell>
                      <TableCell>
                        {withdrawal.username} ({withdrawal.email})
                      </TableCell>
                      <TableCell>
                        ₦{withdrawal.amount.toLocaleString()}
                      </TableCell>
                      <TableCell className="capitalize">
                        {withdrawal.status}
                      </TableCell>
                      <TableCell>
                        {new Date(withdrawal.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="space-x-2">
                        {withdrawal.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              onClick={() =>
                                handleAction(withdrawal.id, "approve")
                              }
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              Approve
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() =>
                                handleAction(withdrawal.id, "reject")
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
            ) : (
              <p className="text-gray-600 dark:text-gray-400">
                No withdrawal requests found.
              </p>
            )}
            {totalPages > 1 && (
              <Pagination className="mt-4">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                  {[...Array(totalPages)].map((_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink
                        href="#"
                        onClick={() => setCurrentPage(i + 1)}
                        isActive={currentPage === i + 1}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
