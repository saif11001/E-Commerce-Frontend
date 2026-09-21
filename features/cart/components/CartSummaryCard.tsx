"use client";

import { useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import ShippingZoneSelect from "./ShippingZoneSelect";
import CouponBox from "./CouponBox";

export default function CartSummaryCard() {
    const { summary, fetchCart } = useCartStore();
    const [governorate, setGovernorate] = useState("");

    const handleGovernorateChange = (value: string) => {
        setGovernorate(value);
        fetchCart(value || undefined);
    };

    return (
        <div className="sticky top-24 rounded-3xl border-2 border-gray-50 p-6">
            <h2 className="text-lg font-extrabold text-black">Order Summary</h2>

            <div className="mt-4">
                <ShippingZoneSelect value={governorate} onChange={handleGovernorateChange} />
            </div>

            <div className="mt-4 flex flex-col gap-2 text-sm">
                <div className="flex justify-between text-gray-500">
                    <span>Subtotal</span>
                    <span className="font-semibold text-black">E£: {summary.itemsPrice}</span>
                </div>

                {summary.discount > 0 && (
                    <div className="flex justify-between text-gray-500">
                        <span>Discount</span>
                        <span className="font-semibold text-green-600">- E£: {summary.discount}</span>
                    </div>
                )}

                <div className="flex justify-between text-gray-500">
                    <span>Shipping</span>
                    <span className="font-semibold text-black">
                        {governorate
                            ? summary.shippingCost > 0
                                ? `E£: ${summary.shippingCost}`
                                : "Free"
                            : "—"}
                    </span>
                </div>
            </div>

            <div className="mt-5">
                <CouponBox />
            </div>

            <div className="mt-5 flex items-center justify-between border-t-2 border-gray-50 pt-4">
                <span className="text-base font-bold text-black">Total</span>
                <span className="text-xl font-extrabold text-black">E£: {summary.totalPrice}</span>
            </div>

            <Link
                href="/checkout"
                className="mt-6 flex items-center justify-center rounded-full bg-linear-to-b from-gray-800 via-gray-700 to-black py-3.5 text-sm font-semibold text-white transition hover:opacity-90"
            >
                Proceed to Checkout
            </Link>
        </div>
    );
}