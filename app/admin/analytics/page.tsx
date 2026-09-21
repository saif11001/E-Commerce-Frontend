"use client";

import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import api from "@/lib/axios";
import {
  Users, Package, PackageCheck, FolderTree, ShoppingBag, Wallet,
  TrendingUp, BarChart3, Clock, Truck, CheckCircle2, XCircle,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, BarChart, Bar,
} from "recharts";
import Loading from "@/components/ui/Loading";

/* ------------------------------ Types ------------------------------ */

type Tab = "overview" | "sales" | "orders" | "products";

type SalesPoint = { _id: string; revenue: number; orders: number };

type ProductStat = {
  _id: string;
  name: string;
  price: number;
  sold?: number;
  stock?: number;
  images?: { url?: string }[];
};

type RecentOrder = {
  _id: string;
  user: { name: string; email: string } | null;
  shippingInfo?: { fullName?: string };
  totalPrice: number;
  orderStatus: string;
};

type Analytics = {
  overview: {
    totalUsers: number;
    totalProducts: number;
    totalCategories: number;
    totalOrders: number;
    totalRevenue: number;
  };
  ordersByStatus: { _id: string; count: number }[];
  sales: { last7Days: SalesPoint[]; last30Days: SalesPoint[] };
  topProducts: ProductStat[];
  lowStockProducts: ProductStat[];
  recentOrders: RecentOrder[];
  users: {
    newLast7Days: number;
    newLast30Days: number;
    byRole: { _id: string; count: number }[];
  };
  revenueByCategory: { _id: string; revenue: number; unitsSold: number }[];
  paymentMethodBreakdown: { _id: string; count: number; revenue: number }[];
  couponUsageStats: { _id: string; timesUsed: number; totalDiscountGiven: number }[];
};

type StatusCount = { status: string; count: number };

/* ---------------------------- Constants ---------------------------- */

const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "sales", label: "Sales", icon: TrendingUp },
  { id: "orders", label: "Orders by Status", icon: ShoppingBag },
  { id: "products", label: "Top Products", icon: Package },
];

const STATUS_ORDER = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

const statusIcons: Record<string, React.ElementType> = {
  pending: Clock,
  confirmed: CheckCircle2,
  shipped: Truck,
  delivered: PackageCheck,
  cancelled: XCircle,
};

const STATUS_COLORS: Record<string, string> = {
  pending: "#9ca3af",
  confirmed: "#3b82f6",
  shipped: "#f59e0b",
  delivered: "#22c55e",
  cancelled: "#ef4444",
};

const STATUS_BADGES: Record<string, string> = {
  pending: "bg-gray-100 text-gray-600",
  confirmed: "bg-blue-100 text-blue-700",
  shipped: "bg-amber-100 text-amber-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const PAYMENT_LABELS: Record<string, string> = {
  cod: "Cash on Delivery",
  stripe: "Stripe (Card)",
};

/* ----------------------------- Helpers ----------------------------- */

const formatMoney = (value: number) => `E£: ${value.toLocaleString("en-US")}`;

const shortDate = (key: string) =>
  new Date(`${key}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });

// The API only returns days that had orders — fill the gaps so the chart shows every day.
const fillDays = (points: SalesPoint[], days: number): SalesPoint[] => {
  const byDate = new Map(points.map((p) => [p._id, p]));
  const result: SalesPoint[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setUTCDate(date.getUTCDate() - i);
    const key = date.toISOString().slice(0, 10);
    result.push(byDate.get(key) ?? { _id: key, revenue: 0, orders: 0 });
  }
  return result;
};

// Always returns all 5 statuses (zero-filled) in a fixed order.
const buildStatuses = (data: Analytics["ordersByStatus"]): StatusCount[] => {
  const counts = new Map(data.map((d) => [d._id, d.count]));
  return STATUS_ORDER.map((status) => ({ status, count: counts.get(status) ?? 0 }));
};

/* ------------------------------- Page ------------------------------- */

export default function AnalyticsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const getTabFromUrl = (): Tab => {
    const tab = searchParams.get("tab");
    return tabs.some((t) => t.id === tab) ? (tab as Tab) : "overview";
  };

  const [activeTab, setActiveTab] = useState<Tab>(getTabFromUrl());

  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setActiveTab(getTabFromUrl());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data } = await api.get("/admin/analytics");
        setAnalytics(data.analytics);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load analytics");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    router.replace(`/admin/analytics?tab=${tab}`, { scroll: false });
  };

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-80px)] items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="flex h-[calc(100vh-80px)] items-center justify-center">
        <p className="text-sm text-red-500">{error || "No data available"}</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-xl font-extrabold text-black sm:text-2xl">Analytics</h1>
      <p className="mt-1 text-xs text-gray-500 sm:text-sm">
        Overview of your store's performance
      </p>

      <div className="mt-6 flex gap-2 overflow-x-auto border-b border-gray-100 [-ms-overflow-style:none] scrollbar-none [&::-webkit-scrollbar]:hidden">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex shrink-0 items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? "border-black text-black"
                  : "border-transparent text-gray-400 hover:text-black"
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="mt-6">
        {activeTab === "overview" && <OverviewTab analytics={analytics} />}
        {activeTab === "sales" && (
          <SalesTab sales={analytics.sales} revenueByCategory={analytics.revenueByCategory} />
        )}
        {activeTab === "orders" && (
          <OrdersStatusTab
            data={analytics.ordersByStatus}
            payments={analytics.paymentMethodBreakdown}
            coupons={analytics.couponUsageStats}
          />
        )}
        {activeTab === "products" && (
          <TopProductsTab data={analytics.topProducts} lowStock={analytics.lowStockProducts} />
        )}
      </div>
    </div>
  );
}

/* ------------------------- Shared components ------------------------- */

function Card({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-black">{title}</h2>
          {subtitle && <p className="mt-0.5 text-xs text-gray-400">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

function EmptyCard({ message }: { message: string }) {
  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-10 text-center shadow-sm">
      <p className="text-sm text-gray-400">{message}</p>
    </div>
  );
}

function ViewDetailsLink({ tab }: { tab: Tab }) {
  return (
    <Link
      href={`/admin/analytics?tab=${tab}`}
      className="text-xs font-semibold text-gray-500 transition hover:text-black"
    >
      View details →
    </Link>
  );
}

function StatCard({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon: React.ElementType;
}) {
  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50">
        <Icon size={18} className="text-black" />
      </div>
      <p className="mt-4 truncate text-xl font-extrabold text-black sm:text-2xl">{value}</p>
      <p className="mt-1 text-xs text-gray-400">{label}</p>
      {hint && <p className="mt-0.5 text-[11px] text-gray-400">{hint}</p>}
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl bg-gray-50 p-4">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="mt-1 truncate text-base font-extrabold text-black sm:text-lg">{value}</p>
    </div>
  );
}

function HorizontalBars({
  items,
}: {
  items: { label: string; value: number; display: string }[];
}) {
  const max = Math.max(...items.map((i) => i.value), 0);

  return (
    <div className="flex flex-col gap-4">
      {items.map((item) => (
        <div key={item.label}>
          <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
            <span className="truncate font-medium capitalize text-black">{item.label}</span>
            <span className="shrink-0 text-gray-500">{item.display}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-linear-to-r from-gray-700 to-black"
              style={{ width: `${max > 0 ? (item.value / max) * 100 : 0}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function ProductRow({
  product,
  leading,
  badge,
}: {
  product: ProductStat;
  leading?: ReactNode;
  badge: ReactNode;
}) {
  return (
    <div className="flex items-center gap-4 border-b border-gray-50 p-4 last:border-0">
      {leading}
      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-gray-100">
        {product.images?.[0]?.url && (
          <img
            src={product.images[0].url}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-black">{product.name}</p>
        <p className="text-xs text-gray-400">{formatMoney(product.price)}</p>
      </div>
      {badge}
    </div>
  );
}

/* --------------------------- Shared charts --------------------------- */

function SalesTooltip({ active, payload }: { active?: boolean; payload?: any[] }) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  return (
    <div className="rounded-xl border border-gray-100 bg-white px-3 py-2 shadow-lg">
      <p className="text-xs text-gray-400">{point.date}</p>
      <p className="mt-0.5 text-sm font-bold text-black">{formatMoney(point.revenue)}</p>
      <p className="text-xs text-gray-500">
        {point.orders} {point.orders === 1 ? "order" : "orders"}
      </p>
    </div>
  );
}

function RevenueAreaChart({ points, height = 300 }: { points: SalesPoint[]; height?: number }) {
  const chartData = points.map((p) => ({
    date: shortDate(p._id),
    revenue: p.revenue,
    orders: p.orders,
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#000000" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#000000" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 12, fill: "#9ca3af" }}
          axisLine={false}
          tickLine={false}
          minTickGap={16}
        />
        <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
        <Tooltip content={<SalesTooltip />} />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="#000000"
          strokeWidth={2.5}
          fill="url(#revenueGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function StatusDonut({
  statuses,
  height = 260,
  showLegend = false,
}: {
  statuses: StatusCount[];
  height?: number;
  showLegend?: boolean;
}) {
  const total = statuses.reduce((sum, s) => sum + s.count, 0);
  const visible = statuses.filter((s) => s.count > 0);

  return (
    <div>
      <div className="relative flex items-center justify-center">
        <ResponsiveContainer width="100%" height={height}>
          <PieChart>
            <Pie
              data={visible}
              dataKey="count"
              nameKey="status"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={3}
            >
              {visible.map((entry) => (
                <Cell
                  key={entry.status}
                  fill={STATUS_COLORS[entry.status] || "#9ca3af"}
                  stroke="none"
                />
              ))}
            </Pie>
            <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #f1f1f1" }} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute flex flex-col items-center">
          <span className="text-2xl font-extrabold text-black">{total}</span>
          <span className="text-xs text-gray-400">Total Orders</span>
        </div>
      </div>

      {showLegend && (
        <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2">
          {statuses.map(({ status, count }) => (
            <div key={status} className="flex items-center justify-between gap-2 text-xs">
              <span className="flex items-center gap-2 capitalize text-gray-500">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: STATUS_COLORS[status] || "#9ca3af" }}
                />
                {status}
              </span>
              <span className="font-semibold text-black">{count}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------ Overview ------------------------------ */

function OverviewTab({ analytics }: { analytics: Analytics }) {
  const { overview, users, recentOrders } = analytics;

  const points = fillDays(analytics.sales.last7Days, 7);
  const weekOrders = points.reduce((sum, p) => sum + p.orders, 0);
  const statuses = buildStatuses(analytics.ordersByStatus);
  const totalOrders = statuses.reduce((sum, s) => sum + s.count, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        <StatCard label="Total Users" value={overview.totalUsers} hint={`+${users.newLast7Days} this week`} icon={Users} />
        <StatCard label="Total Products" value={overview.totalProducts} icon={Package} />
        <StatCard label="Total Categories" value={overview.totalCategories} icon={FolderTree} />
        <StatCard label="Total Orders" value={overview.totalOrders} icon={ShoppingBag} />
        <StatCard
          label="Total Revenue"
          value={formatMoney(overview.totalRevenue)}
          hint="Excluding cancelled orders"
          icon={Wallet}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.6fr_1fr]">
        <Card
          title="Revenue — Last 7 Days"
          subtitle="Cancelled orders are not counted"
          action={<ViewDetailsLink tab="sales" />}
        >
          {weekOrders === 0 ? (
            <p className="py-10 text-center text-sm text-gray-400">
              No sales in the last 7 days.
            </p>
          ) : (
            <RevenueAreaChart points={points} height={260} />
          )}
        </Card>

        <Card title="Orders by Status" action={<ViewDetailsLink tab="orders" />}>
          {totalOrders === 0 ? (
            <p className="py-10 text-center text-sm text-gray-400">No orders yet.</p>
          ) : (
            <StatusDonut statuses={statuses} height={200} showLegend />
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card title="Recent Orders" subtitle="Latest 5 orders">
          {recentOrders.length === 0 ? (
            <p className="text-sm text-gray-400">No orders yet</p>
          ) : (
            <div className="flex flex-col divide-y divide-gray-100">
              {recentOrders.map((order) => (
                <Link
                  key={order._id}
                  href={`/admin/orders/${order._id}`}
                  className="flex items-center gap-3 py-3 transition hover:opacity-70"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-black">
                      {order.user?.name || order.shippingInfo?.fullName || "Guest"}
                    </p>
                    <p className="mt-0.5 font-mono text-xs text-gray-400">
                      #{order._id.slice(-8).toUpperCase()}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-bold text-black">{formatMoney(order.totalPrice)}</p>
                    <span
                      className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium capitalize ${
                        STATUS_BADGES[order.orderStatus] || "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Card>

        <Card title="Users" subtitle="New sign-ups and roles">
          <div className="grid grid-cols-2 gap-3">
            <MiniStat label="Last 7 days" value={`+${users.newLast7Days}`} />
            <MiniStat label="Last 30 days" value={`+${users.newLast30Days}`} />
          </div>

          <h3 className="mb-3 mt-5 text-sm font-semibold text-black">By role</h3>
          <HorizontalBars
            items={users.byRole.map((r) => ({
              label: r._id,
              value: r.count,
              display: String(r.count),
            }))}
          />
        </Card>
      </div>
    </div>
  );
}

/* ------------------------------- Sales ------------------------------- */

function SalesTab({
  sales,
  revenueByCategory,
}: {
  sales: Analytics["sales"];
  revenueByCategory: Analytics["revenueByCategory"];
}) {
  const [range, setRange] = useState<7 | 30>(7);

  const points = fillDays(range === 7 ? sales.last7Days : sales.last30Days, range);
  const revenue = points.reduce((sum, p) => sum + p.revenue, 0);
  const orders = points.reduce((sum, p) => sum + p.orders, 0);
  const average = orders > 0 ? Math.round(revenue / orders) : 0;

  return (
    <div className="space-y-6">
      <Card
        title={`Revenue — Last ${range} Days`}
        subtitle="Cancelled orders are not counted"
        action={
          <div className="flex gap-2">
            {([7, 30] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                  range === r
                    ? "bg-linear-to-b from-gray-800 via-gray-700 to-black text-white"
                    : "border border-gray-200 bg-white text-black hover:border-black"
                }`}
              >
                {r} days
              </button>
            ))}
          </div>
        }
      >
        <div className="mb-6 grid grid-cols-3 gap-3">
          <MiniStat label="Revenue" value={formatMoney(revenue)} />
          <MiniStat label="Orders" value={orders} />
          <MiniStat label="Avg. order" value={formatMoney(average)} />
        </div>

        {orders === 0 ? (
          <p className="py-10 text-center text-sm text-gray-400">
            No sales in the last {range} days.
          </p>
        ) : (
          <RevenueAreaChart points={points} />
        )}
      </Card>

      <Card title="Revenue by Category" subtitle="Based on items sold in non-cancelled orders">
        {revenueByCategory.length === 0 ? (
          <p className="text-sm text-gray-400">No sales yet</p>
        ) : (
          <HorizontalBars
            items={revenueByCategory.map((c) => ({
              label: c._id,
              value: c.revenue,
              display: `${formatMoney(c.revenue)} · ${c.unitsSold} sold`,
            }))}
          />
        )}
      </Card>
    </div>
  );
}

/* --------------------------- Orders by status --------------------------- */

function OrdersStatusTab({
  data,
  payments,
  coupons,
}: {
  data: Analytics["ordersByStatus"];
  payments: Analytics["paymentMethodBreakdown"];
  coupons: Analytics["couponUsageStats"];
}) {
  const statuses = buildStatuses(data);
  const total = statuses.reduce((sum, s) => sum + s.count, 0);

  if (total === 0) {
    return <EmptyCard message="No orders yet." />;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-black">Orders Breakdown</h2>
          <StatusDonut statuses={statuses} />
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {statuses.map(({ status, count }) => {
            const Icon = statusIcons[status] || ShoppingBag;
            const percentage = ((count / total) * 100).toFixed(0);

            return (
              <div
                key={status}
                className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <Icon size={18} className="text-gray-400" />
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: STATUS_COLORS[status] || "#9ca3af" }}
                  />
                </div>
                <p className="mt-3 text-2xl font-extrabold text-black">{count}</p>
                <p className="mt-1 text-xs capitalize text-gray-400">
                  {status} · {percentage}%
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card title="Payment Methods" subtitle="Non-cancelled orders">
          {payments.length === 0 ? (
            <p className="text-sm text-gray-400">No orders yet</p>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {payments.map((method) => (
                <div key={method._id} className="rounded-2xl bg-gray-50 p-4">
                  <p className="text-xs text-gray-500">
                    {PAYMENT_LABELS[method._id] || method._id}
                  </p>
                  <p className="mt-1 text-lg font-extrabold text-black">
                    {method.count} {method.count === 1 ? "order" : "orders"}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-400">{formatMoney(method.revenue)}</p>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card title="Coupon Usage" subtitle="Most used coupons">
          {coupons.length === 0 ? (
            <p className="text-sm text-gray-400">No coupons used yet</p>
          ) : (
            <div className="flex flex-col divide-y divide-gray-100">
              {coupons.map((coupon) => (
                <div key={coupon._id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate font-mono text-sm font-semibold text-black">
                      {coupon._id}
                    </p>
                    <p className="mt-0.5 text-xs text-gray-400">
                      Used {coupon.timesUsed} {coupon.timesUsed === 1 ? "time" : "times"}
                    </p>
                  </div>
                  <p className="shrink-0 text-sm font-semibold text-green-600">
                    - {formatMoney(coupon.totalDiscountGiven)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

/* ---------------------------- Top products ---------------------------- */

function TopProductsTab({
  data,
  lowStock,
}: {
  data: ProductStat[];
  lowStock: ProductStat[];
}) {
  const chartData = data.map((p) => ({ name: p.name, sold: p.sold ?? 0 }));

  return (
    <div className="space-y-6">
      {data.length === 0 ? (
        <EmptyCard message="No products sold yet." />
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_1fr]">
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-lg font-bold text-black">Top 5 — Units Sold</h2>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{ borderRadius: "12px", border: "1px solid #f1f1f1" }}
                  formatter={(value) => [Number(value) || 0, "Sold"]}
                />
                <Bar dataKey="sold" fill="#111827" radius={[8, 8, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-3xl border border-gray-100 bg-white shadow-sm">
            {data.map((product, index) => (
              <ProductRow
                key={product._id}
                product={product}
                leading={
                  <span className="w-6 text-center text-sm font-bold text-gray-300">
                    {index + 1}
                  </span>
                }
                badge={
                  <span className="shrink-0 text-sm font-bold text-black">
                    {product.sold ?? 0} sold
                  </span>
                }
              />
            ))}
          </div>
        </div>
      )}

      <Card title="Low Stock" subtitle="Active products with 5 or fewer in stock">
        {lowStock.length === 0 ? (
          <p className="text-sm text-gray-400">All products are well stocked</p>
        ) : (
          <div className="-mx-4 -mb-4 sm:-mx-2">
            {lowStock.map((product) => {
              const stock = product.stock ?? 0;
              return (
                <ProductRow
                  key={product._id}
                  product={product}
                  badge={
                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                        stock === 0 ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {stock === 0 ? "Out of stock" : `${stock} left`}
                    </span>
                  }
                />
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}