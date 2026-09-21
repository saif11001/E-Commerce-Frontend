"use client";

import { useEffect, useState } from "react";
import { Package } from "lucide-react";
import api from "@/lib/axios";
import Loading from "@/components/ui/Loading";
import MyOrderCard from "@/features/orders/components/MyOrderCard";
import Pagination from "@/components/ui/Pagination";

type Order = {
    _id: string;
    items: { name: string; image: string }[];
    totalPrice: number;
    orderStatus: string;
    paymentMethod: string;
    createdAt: string;
};

type Pagination = {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
};

export default function MyOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [pagination, setPagination] = useState<Pagination>({
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchOrders = async (page = 1) => {
        setIsLoading(true);
        setError("");
        try {
            const { data } = await api.get("/orders", { params: { page } });
            setOrders(data.orders);
            setPagination(data.pagination);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to load orders");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handlePageChange = (page: number) => {
        fetchOrders(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    if (isLoading) {
        return (
            <div className="flex min-h-125 items-center justify-center">
                <Loading />
            </div>
        );
    }

    if (error) {
        return (
            <div className="mx-auto flex min-h-125 max-w-lg flex-col items-center justify-center gap-4 px-6 text-center">
                <p className="text-sm text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-4xl px-6 py-10 text-center">
            <h1 className="mb-8 text-3xl font-extrabold text-black sm:text-4xl">My Orders</h1>

            {orders.length === 0 ? (
                <div className="flex min-h-75 flex-col items-center justify-center gap-3 rounded-3xl border border-gray-100 text-center">
                    <Package size={32} className="text-gray-300" />
                    <p className="text-sm text-gray-500">You haven&apos;t placed any orders yet</p>
                </div>
            ) : (
                <>
                    <div className="flex flex-col gap-4">
                        {orders.map((order) => (
                            <MyOrderCard key={order._id} order={order} />
                        ))}
                    </div>

                    {pagination.totalPages > 1 && (
                        <div className="mt-8">
                            <Pagination
                                currentPage={pagination.page}
                                totalPages={pagination.totalPages}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    )}
                </>
            )}
        </div>
    );
}