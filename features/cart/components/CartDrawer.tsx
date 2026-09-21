"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import Loading from "@/components/ui/Loading";
import CartDrawerItem from "./CartDrawerItem";

export default function CartDrawer() {
    const { isDrawerOpen, closeDrawer, items, summary, isMutating } = useCartStore();

    return (
        <>
            <div
                onClick={closeDrawer}
                className={`fixed inset-0 z-100 bg-black/40 backdrop-blur-sm transition-opacity ${
                    isDrawerOpen ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
            />

            <div
                className={`fixed right-0 top-0 z-101 flex h-full w-full max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300 ${
                    isDrawerOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                    <h2 className="text-lg font-extrabold text-black">Your Cart</h2>
                    <button
                        onClick={closeDrawer}
                        className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-5 py-4">
                    {items.length === 0 ? (
                        <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                            <p className="text-sm text-gray-500">Your cart is empty</p>
                            <button
                                onClick={closeDrawer}
                                className="rounded-full bg-linear-to-b from-gray-800 via-gray-700 to-black px-6 py-2.5 text-sm font-semibold text-white"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {items.map((item) => (
                                <CartDrawerItem key={item._id} item={item} />
                            ))}
                        </div>
                    )}
                </div>

                {items.length > 0 && (
                    <div className="border-t border-gray-100 px-5 py-4">
                        <div className="mb-4 flex items-center justify-between">
                            <span className="text-sm font-semibold text-gray-500">Subtotal</span>
                            <span className="text-lg font-extrabold text-black">
                                E£ {summary.itemsPrice - summary.discount}
                            </span>
                        </div>

                        <div className="flex flex-col gap-2">
                            <Link
                                href="/checkout"
                                onClick={closeDrawer}
                                className="flex items-center justify-center rounded-full bg-linear-to-b from-gray-800 via-gray-700 to-black py-3 text-sm font-semibold text-white transition hover:opacity-90"
                            >
                                Go to Checkout
                            </Link>
                            <button
                                onClick={closeDrawer}
                                className="flex items-center justify-center rounded-full border border-gray-200 py-3 text-sm font-semibold text-black transition hover:bg-gray-50"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    </div>
                )}

                {isMutating && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/60">
                        <Loading />
                    </div>
                )}
            </div>
        </>
    );
}