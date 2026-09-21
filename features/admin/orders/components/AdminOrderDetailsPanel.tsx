"use client";

import { useState } from "react";
import { AdminOrder } from "@/store/adminOrderStore";
import Loading from "@/components/ui/Loading";

const statusStyles: Record<string, string> = {
    pending: "bg-gray-100 text-gray-600",
    confirmed: "bg-blue-50 text-blue-600",
    shipped: "bg-amber-50 text-amber-600",
    delivered: "bg-green-50 text-green-600",
    cancelled: "bg-red-50 text-red-600",
};

const STATUS_OPTIONS = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

export default function AdminOrderDetailsPanel({
    order,
    isLoading,
    error,
    isUpdatingStatus,
    onUpdateStatus,
}: {
    order: AdminOrder | null;
    isLoading: boolean;
    error: string | null;
    isUpdatingStatus: boolean;
    onUpdateStatus: (id: string, status: string) => Promise<void>;
}) {
    const [statusError, setStatusError] = useState("");

    if (isLoading) {
        return (
            <div className="mt-4 flex h-64 items-center justify-center">
                <Loading />
            </div>
        );
    }

    if (error) {
        return <p className="mt-4 text-xs font-medium text-red-500">{error}</p>;
    }

    if (!order) {
        return (
            <p className="mt-4 text-xs text-gray-500">
                Select an order from the list to view its details.
            </p>
        );
    }

    const isLocked = order.orderStatus === "cancelled" || order.orderStatus === "delivered";

    const handleStatusChange = async (newStatus: string) => {
        if (newStatus === order.orderStatus) return;
        setStatusError("");
        try {
            await onUpdateStatus(order._id, newStatus);
        } catch (err: any) {
            setStatusError(err.response?.data?.message || "Failed to update status");
        }
    };

    return (
        <div className="mt-4">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-base font-extrabold text-black">
                        #{order._id.slice(-8).toUpperCase()}
                    </p>
                    <p className="mt-0.5 text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                </div>
                <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                        statusStyles[order.orderStatus] || "bg-gray-100 text-gray-600"
                    }`}
                >
                    {order.orderStatus}
                </span>
            </div>

            {/* Status control */}
            <div className="mt-5 border-t border-gray-100 pt-4">
                <p className="mb-2 text-xs font-semibold text-gray-500">Update Status</p>
                <div className="flex flex-wrap gap-2">
                    {STATUS_OPTIONS.map((status) => (
                        <button
                            key={status}
                            onClick={() => handleStatusChange(status)}
                            disabled={isLocked || isUpdatingStatus}
                            className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize transition disabled:cursor-not-allowed disabled:opacity-40 ${
                                order.orderStatus === status
                                    ? "bg-black text-white"
                                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                            }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
                {isLocked && (
                    <p className="mt-2 text-xs text-gray-400">
                        This order's status is final and can't be changed.
                    </p>
                )}
                {statusError && (
                    <p className="mt-2 text-xs font-medium text-red-500">{statusError}</p>
                )}
            </div>

            {/* Items */}
            <div className="mt-5 border-t border-gray-100 pt-4">
                <h3 className="text-sm font-semibold text-black">Items</h3>
                <div className="mt-3 flex flex-col gap-3">
                    {order.items.map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <div className="h-14 w-12 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                                <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-black">{item.name}</p>
                                <p className="text-xs text-gray-500">
                                    Size: {item.size} × {item.quantity}
                                </p>
                            </div>
                            <span className="text-sm font-semibold text-black">
                                E£: {item.price * item.quantity}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="mt-4 flex flex-col gap-2 border-t border-gray-100 pt-3 text-sm">
                    <div className="flex justify-between text-gray-500">
                        <span>Subtotal</span>
                        <span className="font-semibold text-black">E£: {order.itemsPrice}</span>
                    </div>
                    {order.coupon?.discount > 0 && (
                        <div className="flex justify-between text-gray-500">
                            <span>Discount {order.coupon.code && `(${order.coupon.code})`}</span>
                            <span className="font-semibold text-green-600">
                                - E£: {order.coupon.discount}
                            </span>
                        </div>
                    )}
                    <div className="flex justify-between text-gray-500">
                        <span>Shipping</span>
                        <span className="font-semibold text-black">
                            {order.shippingPrice > 0 ? `E£: ${order.shippingPrice}` : "Free"}
                        </span>
                    </div>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
                    <span className="text-sm font-bold text-black">Total</span>
                    <span className="text-lg font-extrabold text-black">E£: {order.totalPrice}</span>
                </div>
            </div>

            {/* Shipping info */}
            <div className="mt-5 border-t border-gray-100 pt-4">
                <h3 className="text-sm font-semibold text-black">Shipping Info</h3>
                <div className="mt-2 flex flex-col gap-1 text-sm text-gray-600">
                    <p>{order.shippingInfo.fullName}</p>
                    <p>
                        {order.shippingInfo.phone} · {order.shippingInfo.email}
                    </p>
                    <p>
                        {order.shippingInfo.address}, {order.shippingInfo.city},{" "}
                        {order.shippingInfo.governorate}
                    </p>
                    {order.shippingInfo.notes && (
                        <p className="mt-1 text-gray-400">Note: {order.shippingInfo.notes}</p>
                    )}
                </div>
            </div>

            {/* Payment */}
            <div className="mt-5 border-t border-gray-100 pt-4">
                <h3 className="text-sm font-semibold text-black">Payment</h3>
                <p className="mt-2 text-sm text-gray-600">
                    {order.paymentMethod === "cod" ? "Cash on Delivery" : "Paid by Card"} —{" "}
                    {order.isPaid ? (
                        <span className="font-semibold text-green-600">Paid</span>
                    ) : (
                        <span className="font-semibold text-amber-600">Not Paid Yet</span>
                    )}
                </p>
            </div>
        </div>
    );
}