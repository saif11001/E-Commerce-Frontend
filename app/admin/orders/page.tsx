"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/axios";
import { ShoppingBag, ChevronRight } from "lucide-react";
import Loading from "@/components/ui/Loading";
import PaginationComponent from "@/components/ui/Pagination";

type OrderListItem = {
  _id: string;
  user: { name: string; email: string } | string | null;
  shippingInfo?: { fullName?: string; email?: string };
  totalPrice: number;
  paymentMethod: "cod" | "stripe";
  isPaid: boolean;
  orderStatus: string;
  createdAt: string;
};

type Pagination = { total: number; page: number; limit: number; totalPages: number };

const STATUS_FILTERS = [
  { label: "All", value: "" },
  { label: "Pending", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Shipped", value: "shipped" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
];

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-gray-100 text-gray-600",
  confirmed: "bg-blue-100 text-blue-700",
  shipped: "bg-amber-100 text-amber-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const getCustomer = (order: OrderListItem) => {
  const account = typeof order.user === "string" || !order.user ? null : order.user;
  return {
    name: account?.name || order.shippingInfo?.fullName || "Guest",
    email: account?.email || order.shippingInfo?.email || "",
  };
};

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export default function OrdersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "");

  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const statusFromUrl = searchParams.get("status") || "";
    setStatusFilter(statusFromUrl);
    setCurrentPage(1);
  }, [searchParams]);

  const fetchOrders = async (page: number, status: string) => {
    setIsFetching(true);
    setError("");
    try {
      const { data } = await api.get("/admin/orders", {
        params: { page, limit: 10, ...(status ? { status } : {}) },
      });
      setOrders(data.orders);
      setPagination(data.pagination);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load orders");
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchOrders(currentPage, statusFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, statusFilter]);

  const handleFilterChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  // First load: full-page loader
  if (isFetching && !pagination) {
    return (
      <div className="flex h-[calc(100vh-80px)] items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[calc(100vh-80px)] items-center justify-center">
        <p className="text-sm text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="flex items-center gap-2 text-xl font-extrabold text-black sm:text-2xl">
          <ShoppingBag size={22} />
          Orders
        </h1>
        <p className="mt-1 text-xs text-gray-500 sm:text-sm">
          {pagination?.total ?? orders.length} {pagination?.total === 1 ? "order" : "orders"} total
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {STATUS_FILTERS.map((filter) => {
          const isActive = statusFilter === filter.value;
          return (
            <button
              key={filter.value}
              onClick={() => handleFilterChange(filter.value)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition sm:px-5 sm:py-2 ${
                isActive
                  ? "bg-linear-to-b from-gray-800 via-gray-700 to-black text-white"
                  : "border border-gray-200 bg-white text-black hover:border-black"
              }`}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      {isFetching ? (
        // Filter / page change: loader in place of the list
        <div className="flex h-[40vh] items-center justify-center">
          <Loading />
        </div>
      ) : orders.length === 0 ? (
        <div className="flex h-[40vh] flex-col items-center justify-center gap-2 rounded-[28px] border border-dashed border-gray-200">
          <ShoppingBag size={28} className="text-gray-300" />
          <p className="text-sm text-gray-400">No orders found</p>
        </div>
      ) : (
        <>
          {/* Mobile — cards */}
          <div className="flex flex-col gap-3 md:hidden">
            {orders.map((order) => {
              const customer = getCustomer(order);
              return (
                <div
                  key={order._id}
                  onClick={() => router.push(`/admin/orders/${order._id}`)}
                  className="cursor-pointer rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition active:bg-gray-50"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono text-xs text-gray-500">
                      #{order._id.slice(-8).toUpperCase()}
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-[11px] font-medium capitalize ${
                        STATUS_STYLES[order.orderStatus] || "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </div>

                  <div className="mt-3 min-w-0">
                    <p className="truncate font-semibold text-black">{customer.name}</p>
                    <p className="truncate text-xs text-gray-400">{customer.email}</p>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3 border-t border-gray-100 pt-3">
                    <div>
                      <p className="text-base font-extrabold text-black">E£: {order.totalPrice}</p>
                      <p className="mt-0.5 text-xs text-gray-500">{formatDate(order.createdAt)}</p>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                        order.isPaid ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {order.paymentMethod === "stripe" ? "Stripe" : "COD"}{" "}
                      {order.isPaid ? "· Paid" : "· Unpaid"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop — table */}
          <div className="hidden overflow-hidden rounded-[28px] border border-gray-100 bg-white shadow-sm md:block">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-xs uppercase tracking-wide text-gray-400">
                  <th className="px-6 py-4 font-medium">Order</th>
                  <th className="px-6 py-4 font-medium">Customer</th>
                  <th className="px-6 py-4 font-medium">Total</th>
                  <th className="px-6 py-4 font-medium">Payment</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const customer = getCustomer(order);
                  return (
                    <tr
                      key={order._id}
                      onClick={() => router.push(`/admin/orders/${order._id}`)}
                      className="cursor-pointer border-b border-gray-50 transition last:border-0 hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 font-mono text-xs text-gray-500">
                        #{order._id.slice(-8).toUpperCase()}
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-black">{customer.name}</p>
                        <p className="text-xs text-gray-400">{customer.email}</p>
                      </td>
                      <td className="px-6 py-4 font-semibold text-black">
                        E£: {order.totalPrice}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                            order.isPaid
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {order.paymentMethod === "stripe" ? "Stripe" : "COD"}{" "}
                          {order.isPaid ? "· Paid" : "· Unpaid"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-[11px] font-medium capitalize ${
                            STATUS_STYLES[order.orderStatus] || "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500">{formatDate(order.createdAt)}</td>
                      <td className="px-6 py-4 text-right text-gray-300">
                        <ChevronRight size={16} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {pagination && pagination.totalPages > 1 && (
        <div className="mt-6">
          <PaginationComponent
            currentPage={currentPage}
            totalPages={pagination.totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}