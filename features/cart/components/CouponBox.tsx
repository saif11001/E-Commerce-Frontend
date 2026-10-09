"use client";

import { useState } from "react";
import { Tag, X } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

export default function CouponBox() {
    const { coupon, isMutating, applyCoupon, removeCoupon } = useCartStore();

    const [couponCode, setCouponCode] = useState("");
    const [couponError, setCouponError] = useState<string | null>(null);

    const handleApplyCoupon = async () => {
        if (!couponCode.trim() || isMutating) return;
        setCouponError(null);
        try {
            await applyCoupon(couponCode.trim());
            setCouponCode("");
        } catch (err: any) {
            setCouponError(err?.response?.data?.message || "Failed to apply coupon");
        }
    };

    if (coupon) {
        return (
            <div className="flex min-h-11 items-center justify-between rounded-full bg-gray-50 px-4 py-2">
                <div className="flex min-w-0 items-center gap-2">
                    <Tag size={14} className="shrink-0 text-black" />
                    <span className="truncate text-sm font-semibold text-black">{coupon.code}</span>
                </div>
                <button
                    type="button"
                    onClick={() => removeCoupon()}
                    disabled={isMutating}
                    aria-label="Remove coupon"
                    className="flex h-8 w-8 shrink-0 touch-manipulation items-center justify-center rounded-full text-gray-400 transition hover:text-red-500 disabled:opacity-40"
                >
                    <X size={16} />
                </button>
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white p-1.5">
                <input
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            handleApplyCoupon();
                        }
                    }}
                    placeholder="Coupon code"
                    autoCapitalize="characters"
                    autoCorrect="off"
                    autoComplete="off"
                    spellCheck={false}
                    enterKeyHint="done"
                    className="h-11 min-w-0 flex-1 appearance-none rounded-full bg-white px-4 text-base text-black outline-none placeholder:text-gray-400 sm:h-10 sm:text-sm"
                />
                <button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={isMutating}
                    className="h-11 shrink-0 touch-manipulation whitespace-nowrap rounded-full bg-linear-to-b from-gray-800 via-gray-700 to-black px-6 text-sm font-semibold text-white transition hover:opacity-90 active:opacity-80 disabled:opacity-50 sm:h-10"
                >
                    Apply
                </button>
            </div>
            {couponError && (
                <p className="mt-1.5 px-2 text-xs font-medium text-red-500">{couponError}</p>
            )}
        </div>
    );
}