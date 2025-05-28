"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import {
  Menu,
  LogOut,
  Users,
  CreditCard,
  BarChart2,
  Moon,
  Sun,
} from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";

interface AdminSidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export default function AdminSidebar({
  isOpen,
  toggleSidebar,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: <Menu className="h-5 w-5" /> },
    {
      name: "Users",
      href: "/admin/users",
      icon: <Users className="h-5 w-5" />,
    },
    {
      name: "Withdrawals",
      href: "/admin/withdrawals",
      icon: <CreditCard className="h-5 w-5" />,
    },
    {
      name: "Analytics",
      href: "/admin/analytics",
      icon: <BarChart2 className="h-5 w-5" />,
    },
  ];

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <div className="flex flex-col items-center p-4 border-b dark:border-gray-700">
          <Image src="/rad5hub.png" alt="RAD5_Logo" width={100} height={100} />

          <Link href="/admin/settings" className="mt-2">
            <Avatar className="h-12 w-12">
              <AvatarImage src="/default-avatar.png" alt="Admin" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
          </Link>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center p-2 rounded-md transition-colors duration-200 ${
                    pathname === item.href
                      ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200"
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

        <div className="absolute bottom-4 p-4 w-full">
          <div className="p-4">
            <div className="flex items-center justify-between">
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
          </div>
          <Link
            href="/signin"
            className="w-full flex items-center justify-center gap-2 bg-gray-200 py-2 rounded-lg hover:bg-gray-300 dark:bg-white dark:text-black"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Link>
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
