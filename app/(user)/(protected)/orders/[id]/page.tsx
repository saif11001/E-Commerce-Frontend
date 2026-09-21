"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import api from "@/lib/axios";
import Loading from "@/components/ui/Loading";

type OrderDetails = {
    _id: string;
    items: { name: string; price: number; quantity: number; size: string; image: string }[];
    shippingInfo: {
        fullName: string;
        email: string;
        phone: string;
        address: string;
        city: string;
        governorate: string;
        notes?: string;
    };
    paymentMethod: string;
    isPaid: boolean;
    itemsPrice: number;
    shippingPrice: number;
    totalPrice: number;
    orderStatus: string;
    coupon: { code: string | null; discount: number };
    createdAt: string;
};

const statusStyles: Record<string, string> = {
    pending: "bg-gray-100 text-gray-600",
    confirmed: "bg-blue-50 text-blue-600",
    shipped: "bg-amber-50 text-amber-600",
    delivered: "bg-green-50 text-green-600",
    cancelled: "bg-red-50 text-red-600",
};

export default function OrderDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();

    const [order, setOrder] = useState<OrderDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!id) return;
        api
            .get(`/orders/${id}`)
            .then(({ data }) => setOrder(data.order))
            .catch((err) => setError(err.response?.data?.message || "Order not found"))
            .finally(() => setIsLoading(false));
    }, [id]);

    if (isLoading) {
        return (
            <div className="flex min-h-125 items-center justify-center">
                <Loading />
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="mx-auto flex min-h-125 max-w-lg flex-col items-center justify-center gap-4 px-6 text-center">
                <p className="text-sm text-red-500">{error || "Order not found"}</p>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-3xl px-6 py-10">
            <button
                onClick={() => router.push("/orders")}
                className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-black"
            >
                <ArrowLeft size={16} />
                Back to Orders
            </button>

            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-extrabold text-black">
                        Order #{order._id.slice(-8).toUpperCase()}
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                </div>
                <span
                    className={`rounded-full px-4 py-1.5 text-sm font-semibold capitalize ${
                        statusStyles[order.orderStatus] || "bg-gray-100 text-gray-600"
                    }`}
                >
                    {order.orderStatus}
                </span>
            </div>

            <div className="mt-8 rounded-3xl border-2 border-gray-50 p-6">
                <h2 className="text-sm font-semibold text-black">Items</h2>
                <div className="mt-4 flex flex-col gap-3">
                    {order.items.map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <div className="h-16 w-14 shrink-0 overflow-hidden rounded-xl bg-gray-100">
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

                <div className="mt-5 flex flex-col gap-2 border-t-2 border-gray-50 pt-4 text-sm">
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

                <div className="mt-4 flex items-center justify-between border-t-2 border-gray-50 pt-4">
                    <span className="text-base font-bold text-black">Total</span>
                    <span className="text-xl font-extrabold text-black">E£: {order.totalPrice}</span>
                </div>
            </div>

            <div className="mt-6 rounded-3xl border-2 border-gray-50 p-6">
                <h2 className="text-sm font-semibold text-black">Shipping Info</h2>
                <div className="mt-3 flex flex-col gap-1 text-sm text-gray-600">
                    <p>{order.shippingInfo.fullName}</p>
                    <p>{order.shippingInfo.phone} · {order.shippingInfo.email}</p>
                    <p>
                        {order.shippingInfo.address}, {order.shippingInfo.city},{" "}
                        {order.shippingInfo.governorate}
                    </p>
                    {order.shippingInfo.notes && (
                        <p className="mt-1 text-gray-400">Note: {order.shippingInfo.notes}</p>
                    )}
                </div>
            </div>

            <div className="mt-6 rounded-3xl border-2 border-gray-50 p-6">
                <h2 className="text-sm font-semibold text-black">Payment</h2>
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