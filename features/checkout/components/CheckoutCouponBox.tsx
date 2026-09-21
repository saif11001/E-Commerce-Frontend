"use client";

import { useState } from "react";
import { Tag, X } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

export default function CheckoutCouponBox() {
    const { coupon, isMutating, applyCoupon, removeCoupon } = useCartStore();

    const [couponCode, setCouponCode] = useState("");
    const [couponError, setCouponError] = useState<string | null>(null);

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) return;
        setCouponError(null);
        try {
            await applyCoupon(couponCode.trim());
            setCouponCode("");
        } catch (err: any) {
            setCouponError(err?.response?.data?.message || "Failed to apply coupon");
        }
    };

    return (
        <div className="mt-6">
            <label className="mb-2 flex items-center gap-1.5 text-sm font-medium text-black">
                <Tag size={15} />
                Coupon
            </label>

            {coupon ? (
                <div className="flex items-center justify-between rounded-2xl bg-gray-50 px-4 py-3">
                    <div className="flex items-center gap-2">
                        <Tag size={14} className="text-black" />
                        <span className="text-sm font-semibold text-black">{coupon.code}</span>
                    </div>
                    <button
                        type="button"
                        onClick={() => removeCoupon()}
                        disabled={isMutating}
                        className="text-gray-400 hover:text-red-500 disabled:opacity-40"
                    >
                        <X size={16} />
                    </button>
                </div>
            ) : (
                <div>
                    <div className="flex gap-2 rounded-2xl border border-gray-300 bg-white p-1.5">
                        <input
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            placeholder="Coupon code"
                            className="flex-1 rounded-xl bg-white px-3 py-2 text-sm text-black outline-none placeholder:text-gray-400"
                        />
                        <button
                            type="button"
                            onClick={handleApplyCoupon}
                            disabled={isMutating}
                            className="rounded-xl bg-linear-to-b from-gray-800 via-gray-700 to-black px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
                        >
                            Apply
                        </button>
                    </div>
                    {couponError && (
                        <p className="mt-1.5 text-xs font-medium text-red-500">{couponError}</p>
                    )}
                </div>
            )}
        </div>
    );
}