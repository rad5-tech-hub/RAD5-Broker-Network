"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  X,
  Menu,
  LogOut,
  Users,
  DollarSign,
  CreditCard,
  User,
} from "lucide-react";
import Link from "next/link";

export default function Sidebar({
  isOpen,
  toggleSidebar,
}: {
  isOpen: boolean;
  toggleSidebar: () => void;
}) {
  const router = useRouter();
  const profileImage =
    typeof window !== "undefined"
      ? localStorage.getItem("userProfileImage") || "/default-avatar.png"
      : "/default-avatar.png";

  const navItems = [
    {
      name: "Dashboard",
      href: "/user-dashboard",
      icon: <Menu className="h-5 w-5" />,
    },
    {
      name: "Referrals",
      href: "/user-dashboard/referrals",
      icon: <Users className="h-5 w-5" />,
    },
    {
      name: "Earnings",
      href: "/user-dashboard/earnings",
      icon: <DollarSign className="h-5 w-5" />,
    },
    {
      name: "Withdrawals",
      href: "/user-dashboard/withdrawals",
      icon: <CreditCard className="h-5 w-5" />,
    },
    {
      name: "Profile",
      href: "/user-dashboard/profile",
      icon: <User className="h-5 w-5" />,
    },
  ];

  const handleLogout = () => {
    localStorage.clear();
    router.push("/signin");
  };

  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <div className="flex flex-col items-center p-4 border-b dark:border-gray-700">
          <img src="/rad5hub.png" alt="RAD5_Logo" className="w-30" />
          <Link href="/dashboard/profile" className="mt-2">
            <Avatar className="h-12 w-12">
              <AvatarImage src={profileImage} alt="Profile" />
              <AvatarFallback>UN</AvatarFallback>
            </Avatar>
          </Link>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="flex items-center p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                >
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="absolute bottom-4 p-4 w-full">
          <Button
            variant="outline"
            className="w-full flex items-center justify-center cursor-pointer"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 mr-2" />
            Logout
          </Button>
        </div>
      </aside>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
}
