"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";
import { ArrowLeft, MapPin, CreditCard, Tag } from "lucide-react";
import Loading from "@/components/ui/Loading";

type OrderItem = {
  name: string;
  price: number;
  quantity: number;
  size: string;
  image: string;
};

type OrderDetails = {
  _id: string;
  user: { name: string; email: string; profileImage?: { url: string } } | string | null;
  items: OrderItem[];
  itemsPrice: number;
  shippingPrice: number;
  totalPrice: number;
  coupon: { code: string | null; discount: number } | null;
  shippingInfo: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    governorate: string;
    notes?: string;
  };
  paymentMethod: "cod" | "stripe";
  isPaid: boolean;
  paidAt?: string;
  orderStatus: string;
  createdAt: string;
};

const STATUS_OPTIONS = ["pending", "confirmed", "shipped", "delivered", "cancelled"] as const;

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-gray-100 text-gray-600",
  confirmed: "bg-blue-100 text-blue-700",
  shipped: "bg-amber-100 text-amber-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function SingleOrderPage() {
  const { id } = useParams<{ id: string }>();

  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [statusError, setStatusError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/admin/orders/${id}`);
        setOrder(data.order);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load order");
      } finally {
        setIsFetching(false);
      }
    };
    fetchOrder();
  }, [id]);

  const handleStatusChange = async (newStatus: string) => {
    if (!order || newStatus === order.orderStatus) return;

    if (
      newStatus === "cancelled" &&
      !window.confirm("Are you sure you want to cancel this order? This can't be undone.")
    ) {
      return;
    }

    setStatusError("");
    setIsUpdating(true);
    try {
      const { data } = await api.patch(`/admin/orders/${order._id}/status`, {
        orderStatus: newStatus,
      });
      setOrder(data.order);
    } catch (err: any) {
      setStatusError(err.response?.data?.message || "Failed to update order status");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex h-[calc(100vh-80px)] items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex h-[calc(100vh-80px)] items-center justify-center">
        <p className="text-sm text-red-500">{error || "Order not found"}</p>
      </div>
    );
  }

  const customer = typeof order.user === "string" || !order.user ? null : order.user;
  const isLocked = order.orderStatus === "cancelled" || order.orderStatus === "delivered";

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/admin/orders"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:border-black hover:text-black"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-black">
            Order #{order._id.slice(-8).toUpperCase()}
          </h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Placed on{" "}
            {new Date(order.createdAt).toLocaleDateString("en-US", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <div className="rounded-[28px] border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-black">Order Status</h2>
              <span
                className={`rounded-full px-3 py-1 text-[11px] font-medium capitalize ${
                  STATUS_STYLES[order.orderStatus] || "bg-gray-100 text-gray-600"
                }`}
              >
                {order.orderStatus}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {STATUS_OPTIONS.map((status) => {
                const isCurrent = order.orderStatus === status;
                return (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    disabled={isUpdating || isCurrent || isLocked}
                    className={`rounded-full px-5 py-2 text-sm font-semibold capitalize transition disabled:cursor-default ${
                      isCurrent
                        ? "bg-linear-to-b from-gray-800 via-gray-700 to-black text-white"
                        : "border border-gray-200 bg-white text-black hover:border-black disabled:opacity-50"
                    }`}
                  >
                    {status}
                  </button>
                );
              })}
            </div>
            {isLocked && (
              <p className="mt-3 text-xs text-gray-400">
                This order's status is final and can't be changed.
              </p>
            )}
            {isUpdating && <p className="mt-3 text-xs text-gray-400">Updating status...</p>}
            {statusError && <p className="mt-3 text-xs font-medium text-red-500">{statusError}</p>}
          </div>

          <div className="rounded-[28px] border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-black">Items</h2>
            <div className="mt-4 space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-gray-100">
                    {item.image && (
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-black">{item.name}</p>
                    <p className="text-xs text-gray-400">
                      Size: {item.size} · Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold text-black">
                    E£: {item.price * item.quantity}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-5 space-y-2 border-t border-gray-100 pt-4 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Items Price</span>
                <span>E£: {order.itemsPrice}</span>
              </div>
              {order.coupon && order.coupon.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span className="flex items-center gap-1">
                    <Tag size={13} />
                    Coupon {order.coupon.code && `(${order.coupon.code})`}
                  </span>
                  <span>- E£: {order.coupon.discount}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-500">
                <span>Shipping</span>
                <span>{order.shippingPrice > 0 ? `E£: ${order.shippingPrice}` : "Free"}</span>
              </div>
              <div className="flex justify-between border-t border-gray-100 pt-2 text-base font-bold text-black">
                <span>Total</span>
                <span>E£: {order.totalPrice}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[28px] border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-black">Customer</h2>
            <div className="mt-4 flex items-center gap-3">
              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-gray-100">
                <img
                  src={customer?.profileImage?.url || "https://i.pravatar.cc/150"}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <p className="font-semibold text-black">{customer?.name || "Guest checkout"}</p>
                <p className="text-xs text-gray-400">{customer?.email || ""}</p>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-gray-400" />
              <h2 className="text-lg font-bold text-black">Shipping Info</h2>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <p className="text-black">
                <span className="text-gray-400">Name: </span>
                {order.shippingInfo.fullName}
              </p>
              <p className="text-black">
                <span className="text-gray-400">Phone: </span>
                {order.shippingInfo.phone}
              </p>
              <p className="text-black">
                <span className="text-gray-400">Address: </span>
                {order.shippingInfo.address}, {order.shippingInfo.city},{" "}
                {order.shippingInfo.governorate}
              </p>
              {order.shippingInfo.notes && (
                <p className="text-black">
                  <span className="text-gray-400">Notes: </span>
                  {order.shippingInfo.notes}
                </p>
              )}
            </div>
          </div>

          <div className="rounded-[28px] border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <CreditCard size={16} className="text-gray-400" />
              <h2 className="text-lg font-bold text-black">Payment</h2>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <p className="text-black">
                <span className="text-gray-400">Method: </span>
                {order.paymentMethod === "stripe" ? "Stripe (Card)" : "Cash on Delivery"}
              </p>
              <p className="text-black">
                <span className="text-gray-400">Status: </span>
                <span className={order.isPaid ? "text-green-600" : "text-amber-600"}>
                  {order.isPaid ? "Paid" : "Unpaid"}
                </span>
              </p>
              {order.paidAt && (
                <p className="text-black">
                  <span className="text-gray-400">Paid At: </span>
                  {new Date(order.paidAt).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}