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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RiMenu2Line, RiSearchLine } from "react-icons/ri";
import { toast } from "react-hot-toast";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Toaster } from "react-hot-toast";

interface User {
  id: string;
  fullname: string;
  email: string;
  phoneNumber: string;
  track?: string;
}

interface DashboardData {
  stats: {
    users: User[];
  };
  message: string;
}

export default function ManageUsers() {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;
  const router = useRouter();

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
        setDashboardData(result);
        toast.success(result.message || "User data loaded successfully!", {
          duration: 3000,
          position: "top-right",
        });
      } catch (err: any) {
        toast.error(err.message || "Failed to load user data.", {
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

  const filteredUsers = dashboardData.stats.users.filter(
    (user) =>
      user.fullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.phoneNumber && user.phoneNumber.includes(searchQuery))
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
          aria-label="Open sidebar"
        >
          <RiMenu2Line className="h-6 w-6" />
        </button>
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">
          User Management
        </h1>
        <Card className="mb-6">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <CardTitle>Users</CardTitle>
              <div className="relative w-full md:w-auto md:min-w-[300px]">
                <RiSearchLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search by name, email or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full"
                  aria-label="Search users"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {paginatedUsers.length > 0 ? (
              <>
                <div className="hidden sm:block overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Full Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead className="whitespace-nowrap">
                          Phone Number
                        </TableHead>
                        <TableHead>Track</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">
                            {user.fullname}
                          </TableCell>
                          <TableCell className="truncate max-w-[150px] md:max-w-[250px]">
                            {user.email}
                          </TableCell>
                          <TableCell>{user.phoneNumber || "N/A"}</TableCell>
                          <TableCell>{user.track || "N/A"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="block sm:hidden space-y-4">
                  {paginatedUsers.map((user) => (
                    <Card key={user.id} className="p-4">
                      <div className="flex flex-col gap-2">
                        <p className="font-semibold text-sm">
                          Name: {user.fullname}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                          Email: {user.email}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Phone: {user.phoneNumber || "N/A"}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Track: {user.track || "N/A"}
                        </p>
                      </div>
                    </Card>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-gray-600 dark:text-gray-400 py-4 text-center">
                No users found matching your search.
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
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          className: "bg-gray-800 text-white",
          duration: 5000,
          style: {
            fontSize: "14px",
          },
        }}
      />
    </div>
  );
}
