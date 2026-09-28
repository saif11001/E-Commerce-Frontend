"use client";

import { useCartStore } from "@/store/cartStore";

export default function CheckoutTotalBanner() {
    const { summary } = useCartStore();

    return (
        <div className="mb-6 flex items-center justify-between rounded-3xl border-2 border-gray-50 bg-gray-50/50 px-6 py-4">
            <div>
                <p className="text-2xl font-extrabold text-black">Total to Pay -   <span className="text-2xl font-extrabold text-black">E£: {summary.totalPrice}</span></p>
                {/* <p className="text-2xl font-extrabold text-black">E£: {summary.totalPrice}</p> */}
            </div>

            {summary.discount > 0 && (
                <div className="text-right">
                    <p className="text-xs font-semibold text-gray-500">You Saved</p>
                    <p className="text-lg font-bold text-green-600">- E£: {summary.discount}</p>
                </div>
            )}
        </div>
    );
}