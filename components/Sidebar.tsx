"use client";

import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Menu, LogOut, Users, CreditCard, User, Sun, Moon } from "lucide-react";
import { TbCurrencyNaira } from "react-icons/tb";
import Link from "next/link";
import { useTheme } from "next-themes";
import Image from "next/image";
interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
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
      icon: <TbCurrencyNaira className="h-5 w-5" />,
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
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform flex flex-col justify-between ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <div className="flex flex-col items-center p-4 ">
          <Image src="/rad5hub.png" alt="RAD5_Logo" className="w-30" />
          <Link
            href="/user-dashboard/profile"
            className="mt-3 border-b dark:border-gray-700 w-full flex justify-center pb-4"
          >
            <Avatar className="h-12 w-12">
              <AvatarImage src={profileImage} alt="Profile" />
              <AvatarFallback>UN</AvatarFallback>
            </Avatar>
          </Link>
          <nav className="w-full mt-5">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center p-2 rounded-md transition-colors duration-200 ${
                      pathname === item.href
                        ? "bg-blue-500 text-white dark:bg-blue-600"
                        : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    {item.icon}
                    <span className="ml-3">{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="">
          <div className="p-4 mt-auto">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-700 dark:text-gray-200">Theme</span>
              <div className="flex items-center space-x-2">
                <Sun className="h-4 w-4 text-gray-700 dark:text-gray-200" />
                <Switch
                  checked={theme === "dark"}
                  onCheckedChange={() =>
                    setTheme(theme === "dark" ? "light" : "dark")
                  }
                />
                <Moon className="h-4 w-4 text-gray-700 dark:text-gray-200" />
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
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
