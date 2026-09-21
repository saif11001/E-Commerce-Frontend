"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import Loading from "@/components/ui/Loading";
import CartItemsList from "@/features/cart/components/CartItemsList";
import CartSummaryCard from "@/features/cart/components/CartSummaryCard";

export default function CartPage() {
    const { items, isLoading, fetchCart } = useCartStore();

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    if (isLoading) {
        return (
            <div className="flex min-h-125 items-center justify-center">
                <Loading />
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="mx-auto flex min-h-125 max-w-2xl flex-col items-center justify-center gap-4 px-6 text-center">
                <h1 className="text-2xl font-extrabold text-black">Your Cart is Empty</h1>
                <p className="text-sm text-gray-500">Looks like you haven&apos;t added anything yet.</p>
                <Link
                    href="/products"
                    className="mt-2 rounded-full bg-linear-to-b from-gray-800 via-gray-700 to-black px-8 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                >
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-6xl px-6 py-10">
            <h1 className="mb-8 text-3xl font-extrabold text-black sm:text-4xl">Your Cart</h1>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <CartItemsList />
                </div>

                <div className="lg:col-span-1">
                    <CartSummaryCard />
                </div>
            </div>
        </div>
    );
}