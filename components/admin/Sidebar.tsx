"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  FolderTree,
  Package,
  PackageCheck,
  ShoppingBag,
  Ticket,
  Users,
  ChevronDown,
  Plus,
  List,
  TrendingUp,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  BarChart3,
  X,
  MessageCircle,
} from "lucide-react";
import { useUIStore } from "../../store/uiStore";
import { usePermissions } from "@/hooks/usePermissions";
import { Action, Section, getHomePath } from "@/lib/permissions";

interface SubItem {
  label: string;
  href: string;
  icon: React.ElementType;
  action?: Action; // defaults to "view"
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  section: Section;
  subItems?: SubItem[];
}

const navItems: NavItem[] = [
  {
    label: "Analytics",
    href: "/admin/analytics",
    icon: LayoutDashboard,
    section: "analytics",
    subItems: [
      { label: "Overview", href: "/admin/analytics?tab=overview", icon: BarChart3 },
      { label: "Sales", href: "/admin/analytics?tab=sales", icon: TrendingUp },
      { label: "Orders by Status", href: "/admin/analytics?tab=orders", icon: ShoppingBag },
      { label: "Top Products", href: "/admin/analytics?tab=products", icon: Package },
    ],
  },
  {
    label: "Categories",
    href: "/admin/categories",
    icon: FolderTree,
    section: "categories",
    subItems: [
      { label: "All Categories", href: "/admin/categories", icon: List },
      { label: "Add Category", href: "/admin/categories?action=add", icon: Plus, action: "create" },
    ],
  },
  {
    label: "Products",
    href: "/admin/products",
    icon: Package,
    section: "products",
    subItems: [
      { label: "All Products", href: "/admin/products", icon: List },
      { label: "Add Product", href: "/admin/products/new", icon: Plus, action: "create" },
    ],
  },
  {
    label: "Orders",
    href: "/admin/orders",
    icon: ShoppingBag,
    section: "orders",
    subItems: [
      { label: "All Orders", href: "/admin/orders", icon: List },
      { label: "Pending", href: "/admin/orders?status=pending", icon: Clock },
      { label: "Confirmed", href: "/admin/orders?status=confirmed", icon: CheckCircle2 },
      { label: "Shipped", href: "/admin/orders?status=shipped", icon: Truck },
      { label: "Delivered", href: "/admin/orders?status=delivered", icon: PackageCheck },
      { label: "Cancelled", href: "/admin/orders?status=cancelled", icon: XCircle },
    ],
  },
  {
    label: "Coupons",
    href: "/admin/coupons",
    icon: Ticket,
    section: "coupons",
    subItems: [
      { label: "All Coupons", href: "/admin/coupons", icon: List },
      { label: "Add Coupon", href: "/admin/coupons?action=add", icon: Plus, action: "create" },
    ],
  },
  {
    label: "Shipping",
    href: "/admin/shipping",
    icon: Truck,
    section: "shipping",
    subItems: [
      { label: "All Zones", href: "/admin/shipping", icon: List },
      { label: "Add Zone", href: "/admin/shipping?action=add", icon: Plus, action: "create" },
    ],
  },
  { label: "Users", href: "/admin/users", icon: Users, section: "users" },
  { label: "Support Chat", href: "/admin/support-chat", icon: MessageCircle, section: "support-chat" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { role, can } = usePermissions();

  const isSidebarOpen = useUIStore((state) => state.isSidebarOpen);
  const closeSidebar = useUIStore((state) => state.closeSidebar);

  // Only show the sections (and sub-links) the current role is allowed to use
  const visibleItems: NavItem[] = navItems
    .filter((item) => can(item.section))
    .map((item) => {
      const subItems = item.subItems?.filter((sub) => can(item.section, sub.action ?? "view"));
      return { ...item, subItems: subItems && subItems.length > 0 ? subItems : undefined };
    });

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    navItems.forEach((item) => {
      if (item.subItems && pathname?.startsWith(item.href)) {
        initial[item.label] = true;
      }
    });
    return initial;
  });

  const toggleGroup = (label: string) => {
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const currentQuery = searchParams.toString();
  const currentUrl = currentQuery ? `${pathname}?${currentQuery}` : pathname;

  const isSubItemActive = (href: string) => currentUrl === href;

  const getProgressPercent = (item: NavItem) => {
    if (!item.subItems) return 0;
    const index = item.subItems.findIndex((sub) => isSubItemActive(sub.href));
    if (index === -1) return 0;
    return ((index + 1) / item.subItems.length) * 100;
  };

  return (
    <>
      {isSidebarOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-64 shrink-0 flex-col border-r border-gray-100 bg-white p-5 transition-transform duration-300 lg:static lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-b from-gray-800 via-gray-700 to-black text-sm font-bold text-white">
              V
            </div>
            <Link href={getHomePath(role)}>
              <span className="text-lg font-extrabold text-black">Venerdi</span>
            </Link>
          </div>

          <button
            type="button"
            onClick={closeSidebar}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-black lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        <p className="mt-8 px-2 text-xs font-medium uppercase tracking-wide text-gray-400">
          dashboard {role}
        </p>

        <nav className="mt-3 flex flex-1 flex-col gap-1 overflow-y-auto">
          {visibleItems.map((item) => {
            const isActive =
              pathname === item.href || pathname?.startsWith(item.href + "/");
            const Icon = item.icon;
            const hasSubItems = !!item.subItems;
            const isOpen = openGroups[item.label];
            const progressPercent = getProgressPercent(item);

            if (!hasSubItems) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeSidebar}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-medium transition ${isActive
                      ? "bg-linear-to-b from-gray-800 via-gray-700 to-black text-white shadow-md shadow-black/10"
                      : "text-gray-500 hover:bg-gray-50 hover:text-black"
                    }`}
                >
                  <Icon size={18} />
                  {item.label}
                </Link>
              );
            }

            return (
              <div key={item.label}>
                <div
                  className={`flex items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-medium transition ${isActive
                      ? "bg-linear-to-b from-gray-800 via-gray-700 to-black text-white shadow-md shadow-black/10"
                      : "text-gray-500 hover:bg-gray-50 hover:text-black"
                    }`}
                >
                  <Link
                    href={item.href}
                    onClick={closeSidebar}
                    className="flex flex-1 items-center gap-3"
                  >
                    <Icon size={18} />
                    {item.label}
                  </Link>
                  <button
                    type="button"
                    onClick={() => toggleGroup(item.label)}
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md transition hover:bg-black/10"
                  >
                    <ChevronDown
                      size={15}
                      className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""
                        }`}
                    />
                  </button>
                </div>

                <div
                  className={`overflow-hidden transition-all duration-300 ${isOpen ? "mt-1 max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}
                >
                  <div className="relative ml-4 flex flex-col gap-1 pl-3">
                    <div
                      className="absolute left-0 top-0 w-px bg-gray-800 transition-all duration-300"
                      style={{ height: `${progressPercent}%` }}
                    />
                    <div
                      className="absolute left-0 w-px bg-gray-200 transition-all duration-300"
                      style={{
                        top: `${progressPercent}%`,
                        height: `${100 - progressPercent}%`,
                      }}
                    />

                    {item.subItems!.map((sub) => {
                      const SubIcon = sub.icon;
                      const isSubActive = isSubItemActive(sub.href);
                      return (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          onClick={closeSidebar}
                          className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] font-medium transition hover:bg-gray-50 ${isSubActive
                              ? "font-semibold text-black"
                              : "text-gray-500 hover:text-black"
                            }`}
                        >
                          <SubIcon size={15} />
                          {sub.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
}