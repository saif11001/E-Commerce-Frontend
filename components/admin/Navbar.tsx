"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { LogOut, Menu } from "lucide-react";
import { useUIStore } from "../../store/uiStore";
import { useAuthStore } from "../../store/authStore";
import api from "@/lib/axios";

const pageTitles: Record<string, string> = {
  analytics: "Analytics",
  categories: "Categories",
  products: "Products",
  orders: "Orders",
  coupons: "Coupons",
  users: "Users",
};

const roleLabels: Record<string, string> = {
  admin: "Administrator",
  manager: "Manager",
  support: "Support",
};

export default function Navbar() {
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const clearUser = useAuthStore((state) => state.clearUser);
  const user = useAuthStore((state) => state.user);
  const router = useRouter();
  const pathname = usePathname();

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const section = pathname?.split("/")[2] || "";
  const currentTitle = pageTitles[section] || "Dashboard";

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await api.post("/auth/logout");
    } catch {
      // even if the request fails, still clear local state and redirect
    } finally {
      clearUser();
      setIsLoggingOut(false);
      router.replace("/login");
    }
  };

  const displayName = user?.name || "User";
  const displayRole = roleLabels[user?.role || ""] || "User";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-100 bg-white px-4 sm:h-20 sm:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={toggleSidebar}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-black lg:hidden"
        >
          <Menu size={20} />
        </button>

        <div className="min-w-0">
          <p className="truncate text-[11px] font-medium uppercase tracking-wide text-gray-400 sm:text-xs">
            Admin / {currentTitle}
          </p>
          <h1 className="mt-0.5 truncate text-base font-extrabold text-black sm:text-xl">
            {currentTitle}
          </h1>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3 sm:gap-6">
        <div className="hidden text-right md:block">
          <p className="text-sm font-semibold text-black">10:24 AM</p>
          <p className="text-xs text-gray-400">Wednesday, Sep 3</p>
        </div>

        <div className="hidden h-8 w-px bg-gray-100 md:block" />

        <div className="flex items-center gap-3">
          <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full bg-gray-100 sm:h-10 sm:w-10">
            <div className="flex h-full w-full items-center justify-center bg-linear-to-b from-gray-800 via-gray-700 to-black text-sm font-bold text-white">
              {initial}
            </div>
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-semibold text-black">{displayName}</p>
            <p className="text-xs text-gray-400">{displayRole}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-50 text-gray-500 transition hover:bg-red-50 hover:text-red-500 disabled:opacity-50 sm:h-10 sm:w-10"
          title="Logout"
        >
          <LogOut size={17} />
        </button>
      </div>
    </header>
  );
}