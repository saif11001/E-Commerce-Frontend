"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Package } from "lucide-react";
import api from "@/lib/axios";
import Loading from "@/components/ui/Loading";
import OrderCard from "@/features/orders/components/OrderCard";
import RequestTrackingLinkForm from "@/features/orders/components/RequestTrackingLinkForm";

type TrackedOrder = {
    _id: string;
    items: { name: string; price: number; quantity: number; size: string; image: string }[];
    totalPrice: number;
    orderStatus: string;
    paymentMethod: string;
    createdAt: string;
};

export default function TrackOrdersPage() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [orders, setOrders] = useState<TrackedOrder[] | null>(null);
    const [isLoadingOrders, setIsLoadingOrders] = useState(false);
    const [ordersError, setOrdersError] = useState("");

    // Prevents React Strict Mode's double-invoked effect (dev only) from
    // firing this single-use tracking token twice and burning it on the 2nd call.
    const hasFetchedRef = useRef(false);

    useEffect(() => {
        if (!token || hasFetchedRef.current) return;
        hasFetchedRef.current = true;

        setIsLoadingOrders(true);
        setOrdersError("");
        api
            .get(`/orders/track/${token}`)
            .then(({ data }) => setOrders(data.orders || []))
            .catch((err) => {
                setOrdersError(err.response?.data?.message || "This link is invalid or has expired");
            })
            .finally(() => setIsLoadingOrders(false));
    }, [token]);

    if (token) {
        if (isLoadingOrders) {
            return (
                <div className="flex min-h-125 items-center justify-center">
                    <Loading />
                </div>
            );
        }

        if (ordersError) {
            return (
                <div className="mx-auto flex min-h-125 max-w-lg flex-col items-center justify-center gap-4 px-6 text-center">
                    <h1 className="text-2xl font-extrabold text-black">Link Expired</h1>
                    <p className="text-sm text-gray-500">{ordersError}</p>
                    <Link
                        href="/track-orders"
                        className="mt-2 rounded-full bg-linear-to-b from-gray-800 via-gray-700 to-black px-8 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                    >
                        Request a New Link
                    </Link>
                </div>
            );
        }

        return (
            <div className="mx-auto max-w-4xl px-6 py-10">
                <h1 className="mb-8 text-center text-3xl font-extrabold text-black sm:text-4xl">
                    Your Orders
                </h1>

                {orders && orders.length === 0 ? (
                    <div className="flex min-h-75 flex-col items-center justify-center gap-3 rounded-3xl border border-gray-100 text-center">
                        <Package size={32} className="text-gray-300" />
                        <p className="text-sm text-gray-500">No orders found for this email</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {orders?.map((order) => (
                            <OrderCard key={order._id} order={order} />
                        ))}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="mx-auto flex min-h-125 max-w-md flex-col items-center justify-center gap-6 px-6 py-16 text-center">
            <RequestTrackingLinkForm />
        </div>
    );
}