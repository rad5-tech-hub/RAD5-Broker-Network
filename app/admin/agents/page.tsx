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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "react-hot-toast";
import { RiMenu2Line, RiSearchLine, RiWallet3Line } from "react-icons/ri";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface Agent {
  id: string;
  fullname: string;
  email: string;
}

interface User {
  id: string;
  fullName: string;
  email: string;
}

interface Transaction {
  id: string;
  agentId: string;
  type: "credit" | "debit";
  amount: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
  Agent: {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
  };
}

interface AgentWallet {
  agent: { id: string; name: string; email: string };
  wallet: { balance: number };
  transactions: Transaction[];
  message?: string;
}

interface AgentUsersResponse {
  message: string;
  agent: { id: string; fullName: string; email: string };
  users: User[];
}

interface DashboardData {
  stats: { agents: Agent[] };
  message: string;
}

interface AllTransactionsResponse {
  message?: string;
  messsage?: string; // Typo handling
  data: Transaction[];
}

interface FundAgentResponse {
  message: string;
  commission: number;
  walletBalance: number;
}

export default function ManageAgents() {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [allTxPage, setAllTxPage] = useState<number>(1);
  const [fundData, setFundData] = useState<{
    userId: string;
    amountPaid: number;
    commissionRate: number;
  }>({ userId: "", amountPaid: 0, commissionRate: 0.1 });
  const [agentWallet, setAgentWallet] = useState<AgentWallet | null>(null);
  const [isFunding, setIsFunding] = useState<boolean>(false);
  const [openCollapsible, setOpenCollapsible] = useState<string | null>(null);
  const [agentUsers, setAgentUsers] = useState<User[]>([]);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const itemsPerPage = 10;
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("rbn_admin_token");
        if (!token) {
          throw new Error("No authentication token found. Please sign in.");
        }

        const apiBaseUrl =
          process.env.NEXT_PUBLIC_RBN_API_BASE_URL ||
          "https://rbn.bookbank.com.ng/api/v1";

        const dashboardEndpoint = `${apiBaseUrl}/admin/dashboard`;
        const dashboardResponse = await fetch(dashboardEndpoint, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!dashboardResponse.ok) {
          const error = await dashboardResponse.json();
          throw new Error(error.message || `HTTP ${dashboardResponse.status}`);
        }

        const dashboardResult = await dashboardResponse.json();
        setDashboardData(dashboardResult);
        toast.success(
          dashboardResult.message || "Agent data loaded successfully!",
          {
            id: "dashboard-load",
            duration: 3000,
            position: "top-right",
          }
        );

        const allTxEndpoint = `${apiBaseUrl}/wallet/all-transactions`;
        const allTxResponse = await fetch(allTxEndpoint, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!allTxResponse.ok) {
          const error = await allTxResponse.json();
          throw new Error(error.message || `HTTP ${allTxResponse.status}`);
        }

        const allTxResult: AllTransactionsResponse =
          await dashboardResponse.json();
        setAllTransactions(allTxResult.data || []);
        toast.success(
          allTxResult.message ||
            allTxResult.messsage ||
            "Transactions loaded successfully!",
          { id: "transactions-load", duration: 3000, position: "top-right" }
        );
      } catch (err: any) {
        toast.error(err.message || "Failed to load agent data.", {
          id: "dashboard-error",
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

    fetchData();
  }, [router]);

  const fetchAgentUsers = async (agentId: string) => {
    try {
      const token = localStorage.getItem("rbn_admin_token");
      if (!token) {
        throw new Error("No authentication token found.");
      }

      const apiBaseUrl =
        process.env.NEXT_PUBLIC_RBN_API_BASE_URL ||
        "https://rbn.bookbank.com.ng/api/v1";
      const endpoint = `${apiBaseUrl}/user/agent/${agentId}`;
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

      const result: AgentUsersResponse = await response.json();
      setAgentUsers(result.users || []);
      setSelectedAgentId(agentId);
      toast.success(result.message || "Agent users loaded successfully!", {
        id: "agent-users-load",
        duration: 3000,
        position: "top-right",
      });
    } catch (err: any) {
      toast.error(err.message || "Failed to load agent users.", {
        id: "agent-users-error",
        duration: 5000,
        position: "top-right",
      });
      setAgentUsers([]);
    }
  };

  const fetchAgentWallet = async (agentId: string) => {
    try {
      const token = localStorage.getItem("rbn_admin_token");
      if (!token) {
        throw new Error("No authentication token found.");
      }

      const apiBaseUrl =
        process.env.NEXT_PUBLIC_RBN_API_BASE_URL ||
        "https://rbn.bookbank.com.ng/api/v1";
      const endpoint = `${apiBaseUrl}/wallet/agent/${agentId}`;
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

      const result: AgentWallet = await response.json();
      setAgentWallet(result);
      toast.success(result.message || "Agent wallet loaded successfully!", {
        id: "agent-wallet-load",
        duration: 3000,
        position: "top-right",
      });
    } catch (err: any) {
      toast.error(err.message || "Failed to load agent wallet.", {
        id: "agent-wallet-error",
        duration: 5000,
        position: "top-right",
      });
    }
  };

  const handleFundAgent = async (closeModal: () => void) => {
    setIsFunding(true);
    try {
      const token = localStorage.getItem("rbn_admin_token");
      if (!token) {
        throw new Error("No authentication token found. Please sign in.");
      }

      const apiBaseUrl =
        process.env.NEXT_PUBLIC_RBN_API_BASE_URL ||
        "https://rbn.bookbank.com.ng/api/v1";
      const endpoint = `${apiBaseUrl}/wallet/mark-paid`;
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(fundData),
      });

      const result: FundAgentResponse = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("rbn_admin_token");
          router.push("/admin/signin");
          throw new Error("Session expired. Please sign in again.");
        }
        throw new Error(result.message || `HTTP ${response.status}`);
      }

      // Richer toast message including commission and wallet balance
      toast.success(
        `${
          result.message
        }. Commission: ₦${result.commission.toLocaleString()}. New balance: ₦${result.walletBalance.toLocaleString()}`,
        {
          id: "fund-agent-success",
          duration: 3000,
          position: "top-right",
        }
      );
      // Debug toast to confirm success block (remove after verification)
      toast.success("Funding toast triggered!", {
        id: "fund-agent-debug",
        duration: 3000,
        position: "top-right",
      });
      setFundData({ userId: "", amountPaid: 0, commissionRate: 0.1 });
      if (selectedAgentId) {
        await fetchAgentUsers(selectedAgentId); // Refresh user list
      }
      // Delay modal close for toast visibility
      setTimeout(() => {
        closeModal();
        setIsFunding(false);
      }, 1000);
    } catch (err: any) {
      toast.error(err.message || "Failed to fund user.", {
        id: "fund-agent-error",
        duration: 5000,
        position: "top-right",
      });
      setIsFunding(false);
    }
  };

  // Extract user name from description
  const getUserNameFromDescription = (description?: string): string => {
    if (!description) return "-";
    const match = description.match(/user (.*)$/);
    return match ? match[1] : "-";
  };

  if (isLoading || !dashboardData) {
    return (
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 justify-center items-center">
        <div className="text-gray-800 dark:text-gray-100">Loading...</div>
      </div>
    );
  }

  const filteredAgents = dashboardData.stats.agents.filter(
    (agent) =>
      agent.fullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredAgents.length / itemsPerPage);
  const paginatedAgents = filteredAgents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const filteredAllTx = allTransactions.filter(
    (tx) =>
      tx.Agent.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalAllTxPages = Math.ceil(filteredAllTx.length / itemsPerPage);
  const paginatedAllTx = filteredAllTx.slice(
    (allTxPage - 1) * itemsPerPage,
    allTxPage * itemsPerPage
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
        <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">
          Agent Management
        </h1>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">Agents</CardTitle>
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <RiSearchLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search agents by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                  aria-label="Search agents"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {paginatedAgents.length > 0 ? (
              <>
                {/* Desktop Table */}
                <div className="hidden sm:block overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">Avatar</TableHead>
                        <TableHead>Full Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead className="w-48">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedAgents.map((agent) => (
                        <TableRow key={agent.id}>
                          <TableCell>
                            <Avatar>
                              <AvatarFallback>
                                {agent.fullname
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                          </TableCell>
                          <TableCell>{agent.fullname}</TableCell>
                          <TableCell className="truncate">
                            {agent.email}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      fetchAgentUsers(agent.id);
                                      setFundData({
                                        ...fundData,
                                        userId: "",
                                      });
                                    }}
                                    className="text-xs"
                                    disabled={isFunding}
                                  >
                                    <RiWallet3Line className="mr-1 h-3 w-3" />
                                    Fund
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-[90vw] sm:max-w-md p-4 sm:p-6">
                                  <DialogHeader>
                                    <DialogTitle className="text-base sm:text-lg">
                                      Fund Agent: {agent.fullname}
                                    </DialogTitle>
                                  </DialogHeader>
                                  {agentUsers.length > 0 ? (
                                    <div className="grid gap-3 sm:gap-4 py-2 sm:py-4">
                                      <div className="grid gap-1 sm:gap-2">
                                        <Label
                                          htmlFor="userId"
                                          className="text-sm"
                                        >
                                          Select User
                                        </Label>
                                        <Select
                                          onValueChange={(value) =>
                                            setFundData({
                                              ...fundData,
                                              userId: value,
                                            })
                                          }
                                          value={fundData.userId}
                                        >
                                          <SelectTrigger className="text-sm">
                                            <SelectValue placeholder="Choose a user" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {agentUsers.map((user) => (
                                              <SelectItem
                                                key={user.id}
                                                value={user.id}
                                                className="text-sm"
                                              >
                                                {user.fullName} ({user.email})
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div className="grid gap-1 sm:gap-2">
                                        <Label
                                          htmlFor="amountPaid"
                                          className="text-sm"
                                        >
                                          Amount Paid (₦)
                                        </Label>
                                        <Input
                                          id="amountPaid"
                                          type="number"
                                          value={fundData.amountPaid || ""}
                                          onChange={(e) =>
                                            setFundData({
                                              ...fundData,
                                              amountPaid:
                                                parseFloat(e.target.value) || 0,
                                            })
                                          }
                                          placeholder="Enter amount"
                                          min={0}
                                          className="text-sm"
                                        />
                                      </div>
                                      <div className="grid gap-1 sm:gap-2">
                                        <Label
                                          htmlFor="commissionRate"
                                          className="text-sm"
                                        >
                                          Commission Rate
                                        </Label>
                                        <Input
                                          id="commissionRate"
                                          type="number"
                                          step="0.01"
                                          value={fundData.commissionRate || ""}
                                          onChange={(e) =>
                                            setFundData({
                                              ...fundData,
                                              commissionRate:
                                                parseFloat(e.target.value) ||
                                                0.1,
                                            })
                                          }
                                          placeholder="e.g., 0.1"
                                          min={0}
                                          max={1}
                                          className="text-sm"
                                        />
                                      </div>
                                      <DialogClose asChild>
                                        <Button
                                          onClick={() => {
                                            const close = () => {
                                              const closeButton =
                                                document.querySelector(
                                                  `[data-state="open"] [data-radix-dialog-close]`
                                                ) as HTMLElement;
                                              if (closeButton)
                                                closeButton.click();
                                            };
                                            handleFundAgent(close);
                                          }}
                                          disabled={
                                            isFunding ||
                                            !fundData.userId ||
                                            !fundData.amountPaid
                                          }
                                          className="w-full text-sm"
                                        >
                                          {isFunding
                                            ? "Funding..."
                                            : "Confirm Funding"}
                                        </Button>
                                      </DialogClose>
                                    </div>
                                  ) : (
                                    <p className="text-sm text-gray-600 dark:text-gray-400 py-4">
                                      No users found under this agent. Please
                                      register users to enable funding.
                                    </p>
                                  )}
                                </DialogContent>
                              </Dialog>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  fetchAgentWallet(agent.id);
                                  setOpenCollapsible(
                                    openCollapsible === agent.id
                                      ? null
                                      : agent.id
                                  );
                                }}
                                className="text-xs"
                              >
                                Transactions
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {/* Mobile Cards */}
                <div className="block sm:hidden space-y-4">
                  {paginatedAgents.map((agent) => (
                    <Card key={agent.id} className="p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Avatar>
                          <AvatarFallback>
                            {agent.fullname
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-sm">
                            {agent.fullname}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                            {agent.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                fetchAgentUsers(agent.id);
                                setFundData({
                                  ...fundData,
                                  userId: "",
                                });
                              }}
                              className="text-xs"
                              disabled={isFunding}
                            >
                              <RiWallet3Line className="mr-1 h-3 w-3" />
                              Fund
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-[90vw] sm:max-w-md p-4 sm:p-6">
                            <DialogHeader>
                              <DialogTitle className="text-base sm:text-lg">
                                Fund Agent: {agent.fullname}
                              </DialogTitle>
                            </DialogHeader>
                            {agentUsers.length > 0 ? (
                              <div className="grid gap-3 sm:gap-4 py-2 sm:py-4">
                                <div className="grid gap-1 sm:gap-2">
                                  <Label htmlFor="userId" className="text-sm">
                                    Select User
                                  </Label>
                                  <Select
                                    onValueChange={(value) =>
                                      setFundData({
                                        ...fundData,
                                        userId: value,
                                      })
                                    }
                                    value={fundData.userId}
                                  >
                                    <SelectTrigger className="text-sm">
                                      <SelectValue placeholder="Choose a user" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {agentUsers.map((user) => (
                                        <SelectItem
                                          key={user.id}
                                          value={user.id}
                                          className="text-sm"
                                        >
                                          {user.fullName} ({user.email})
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="grid gap-1 sm:gap-2">
                                  <Label
                                    htmlFor="amountPaid"
                                    className="text-sm"
                                  >
                                    Amount Paid (₦)
                                  </Label>
                                  <Input
                                    id="amountPaid"
                                    type="number"
                                    value={fundData.amountPaid || ""}
                                    onChange={(e) =>
                                      setFundData({
                                        ...fundData,
                                        amountPaid:
                                          parseFloat(e.target.value) || 0,
                                      })
                                    }
                                    placeholder="Enter amount"
                                    min={0}
                                    className="text-sm"
                                  />
                                </div>
                                <div className="grid gap-1 sm:gap-2">
                                  <Label
                                    htmlFor="commissionRate"
                                    className="text-sm"
                                  >
                                    Commission Rate
                                  </Label>
                                  <Input
                                    id="commissionRate"
                                    type="number"
                                    step="0.01"
                                    value={fundData.commissionRate || ""}
                                    onChange={(e) =>
                                      setFundData({
                                        ...fundData,
                                        commissionRate:
                                          parseFloat(e.target.value) || 0.1,
                                      })
                                    }
                                    placeholder="e.g., 0.1"
                                    min={0}
                                    max={1}
                                    className="text-sm"
                                  />
                                </div>
                                <DialogClose asChild>
                                  <Button
                                    onClick={() => {
                                      const close = () => {
                                        const closeButton =
                                          document.querySelector(
                                            `[data-state="open"] [data-radix-dialog-close]`
                                          ) as HTMLElement;
                                        if (closeButton) closeButton.click();
                                      };
                                      handleFundAgent(close);
                                    }}
                                    disabled={
                                      isFunding ||
                                      !fundData.userId ||
                                      !fundData.amountPaid
                                    }
                                    className="w-full text-sm"
                                  >
                                    {isFunding
                                      ? "Funding..."
                                      : "Confirm Funding"}
                                  </Button>
                                </DialogClose>
                              </div>
                            ) : (
                              <p className="text-sm text-gray-600 dark:text-gray-400 py-4">
                                No users found under this agent. Please register
                                users to enable funding.
                              </p>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            fetchAgentWallet(agent.id);
                            setOpenCollapsible(
                              openCollapsible === agent.id ? null : agent.id
                            );
                          }}
                          className="text-xs"
                        >
                          Transactions
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                No agents found.
              </p>
            )}
            {paginatedAgents.length > 0 && agentWallet && (
              <Collapsible
                open={openCollapsible === agentWallet.agent.id}
                onOpenChange={() =>
                  setOpenCollapsible(
                    openCollapsible === agentWallet.agent.id
                      ? null
                      : agentWallet.agent.id
                  )
                }
                className="mt-4"
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 text-sm"
                  >
                    {agentWallet.agent.name}’s Transactions
                    {openCollapsible === agentWallet.agent.id ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="p-2 sm:p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Wallet Balance: ₦
                    {agentWallet.wallet.balance.toLocaleString()}
                  </p>
                  {agentWallet.transactions.length > 0 ? (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Amount</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Description</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {agentWallet.transactions.map((tx) => (
                            <TableRow key={tx.id}>
                              <TableCell>
                                ₦{tx.amount.toLocaleString()}
                              </TableCell>
                              <TableCell className="capitalize">
                                {tx.type}
                              </TableCell>
                              <TableCell>
                                {new Date(tx.createdAt).toLocaleDateString()}
                              </TableCell>
                              <TableCell>{tx.description || "-"}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      No transactions found.
                    </p>
                  )}
                </CollapsibleContent>
              </Collapsible>
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
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">All Agent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            {paginatedAllTx.length > 0 ? (
              <>
                {/* Desktop Table */}
                <div className="hidden sm:block overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Agent Name</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedAllTx.map((tx) => (
                        <Dialog key={tx.id}>
                          <DialogTrigger asChild>
                            <TableRow
                              className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                              onClick={() => setSelectedTx(tx)}
                            >
                              <TableCell>{tx.Agent.fullName}</TableCell>
                              <TableCell>
                                ₦{tx.amount.toLocaleString()}
                              </TableCell>
                              <TableCell>
                                {new Date(tx.createdAt).toLocaleDateString()}
                              </TableCell>
                            </TableRow>
                          </DialogTrigger>
                          <DialogContent className="max-w-[90vw] sm:max-w-md p-4 sm:p-6">
                            <DialogHeader>
                              <DialogTitle className="text-base sm:text-lg">
                                Transaction Details
                              </DialogTitle>
                            </DialogHeader>
                            {selectedTx && (
                              <div className="grid gap-2 py-2 sm:py-4">
                                <p className="text-sm">
                                  <span className="font-medium">
                                    Agent Name:
                                  </span>{" "}
                                  {selectedTx.Agent.fullName}
                                </p>
                                <p className="text-sm">
                                  <span className="font-medium">Amount:</span> ₦
                                  {selectedTx.amount.toLocaleString()}
                                </p>
                                <p className="text-sm">
                                  <span className="font-medium">Date:</span>{" "}
                                  {new Date(
                                    selectedTx.createdAt
                                  ).toLocaleDateString()}
                                </p>
                                <p className="text-sm">
                                  <span className="font-medium">Type:</span>{" "}
                                  {selectedTx.type.charAt(0).toUpperCase() +
                                    selectedTx.type.slice(1)}
                                </p>
                                <p className="text-sm">
                                  <span className="font-medium">
                                    Description:
                                  </span>{" "}
                                  {selectedTx.description || "-"}
                                </p>
                                <p className="text-sm">
                                  <span className="font-medium">User:</span>{" "}
                                  {getUserNameFromDescription(
                                    selectedTx.description
                                  )}
                                </p>
                              </div>
                            )}
                            <DialogClose asChild>
                              <Button className="w-full text-sm">Close</Button>
                            </DialogClose>
                          </DialogContent>
                        </Dialog>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {/* Mobile Cards */}
                <div className="block sm:hidden space-y-4">
                  {paginatedAllTx.map((tx) => (
                    <Dialog key={tx.id}>
                      <DialogTrigger asChild>
                        <Card
                          className="p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                          onClick={() => setSelectedTx(tx)}
                        >
                          <p className="text-xs mb-1">
                            <span className="font-medium">Agent:</span>{" "}
                            {tx.Agent.fullName}
                          </p>
                          <p className="text-xs mb-1">
                            <span className="font-medium">Amount:</span> ₦
                            {tx.amount.toLocaleString()}
                          </p>
                          <p className="text-xs mb-1">
                            <span className="font-medium">Date:</span>{" "}
                            {new Date(tx.createdAt).toLocaleDateString()}
                          </p>
                        </Card>
                      </DialogTrigger>
                      <DialogContent className="max-w-[90vw] sm:max-w-md p-4 sm:p-6">
                        <DialogHeader>
                          <DialogTitle className="text-base sm:text-lg">
                            Transaction Details
                          </DialogTitle>
                        </DialogHeader>
                        {selectedTx && (
                          <div className="grid gap-2 py-2 sm:py-4">
                            <p className="text-sm">
                              <span className="font-medium">Agent Name:</span>{" "}
                              {selectedTx.Agent.fullName}
                            </p>
                            <p className="text-sm">
                              <span className="font-medium">Amount:</span> ₦
                              {selectedTx.amount.toLocaleString()}
                            </p>
                            <p className="text-sm">
                              <span className="font-medium">Date:</span>{" "}
                              {new Date(
                                selectedTx.createdAt
                              ).toLocaleDateString()}
                            </p>
                            <p className="text-sm">
                              <span className="font-medium">Type:</span>{" "}
                              {selectedTx.type.charAt(0).toUpperCase() +
                                selectedTx.type.slice(1)}
                            </p>
                            <p className="text-sm">
                              <span className="font-medium">Description:</span>{" "}
                              {selectedTx.description || "-"}
                            </p>
                            <p className="text-sm">
                              <span className="font-medium">User:</span>{" "}
                              {getUserNameFromDescription(
                                selectedTx.description
                              )}
                            </p>
                          </div>
                        )}
                        <DialogClose asChild>
                          <Button className="w-full text-sm">Close</Button>
                        </DialogClose>
                      </DialogContent>
                    </Dialog>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                No transactions found.
              </p>
            )}
            {totalAllTxPages > 1 && (
              <Pagination className="mt-4">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={() =>
                        setAllTxPage((prev) => Math.max(prev - 1, 1))
                      }
                      className={
                        allTxPage === 1 ? "pointer-events-none opacity-50" : ""
                      }
                    />
                  </PaginationItem>
                  {[...Array(totalAllTxPages)].map((_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink
                        href="#"
                        onClick={() => setAllTxPage(i + 1)}
                        isActive={allTxPage === i + 1}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={() =>
                        setAllTxPage((prev) =>
                          Math.min(prev + 1, totalAllTxPages)
                        )
                      }
                      className={
                        allTxPage === totalAllTxPages
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
