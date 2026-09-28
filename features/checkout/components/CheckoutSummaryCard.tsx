"use client";

import { useMemo } from "react";
import { useCartStore } from "@/store/cartStore";

export default function CheckoutSummaryCard() {
    const { items, summary } = useCartStore();

    const productsDiscount = useMemo(
        () => items.reduce((sum, item) => sum + item.product.discountPrice * item.quantity, 0),
        [items]
    );

    return (
        <div className="rounded-3xl border-2 border-gray-50 p-6">
            <h2 className="text-lg font-extrabold text-black">Order Summary</h2>

            {/* Items */}
            <div className="mt-5 flex flex-col gap-4">
                {items.map((item) => {
                    const hasDiscount = item.product.discountPrice > 0;
                    const unitFinal = hasDiscount
                        ? item.product.price - item.product.discountPrice
                        : item.product.price;

                    return (
                        <div key={item._id} className="flex items-start gap-3">
                            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                                <img
                                    src={item.product.images?.[0]?.url}
                                    alt={item.product.name}
                                    className="h-full w-full object-cover"
                                />
                                <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white">
                                    {item.quantity}
                                </span>
                            </div>

                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold text-black">
                                    {item.product.name}
                                </p>
                                <p className="text-xs text-gray-400">{item.size}</p>
                            </div>

                            <div className="flex shrink-0 flex-col items-end">
                                {hasDiscount && (
                                    <span className="text-xs text-gray-400 line-through">
                                        E£{item.product.price * item.quantity}.00
                                    </span>
                                )}
                                <span className="text-sm font-semibold text-black">
                                    E£{unitFinal * item.quantity}.00
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Totals */}
            <div className="mt-5 flex flex-col gap-2 border-t-2 border-gray-50 pt-4 text-sm">
                <div className="flex justify-between text-gray-500">
                    <span>Subtotal</span>
                    <span className="font-semibold text-black">E£{summary.itemsPrice}.00</span>
                </div>

                {productsDiscount > 0 && (
                    <div className="flex justify-between text-gray-500">
                        <span>Products Discount</span>
                        <span className="font-semibold text-green-600">
                            - E£{productsDiscount}.00
                        </span>
                    </div>
                )}

                <div className="flex justify-between text-gray-500">
                    <span>Shipping</span>
                    <span className="font-semibold text-black">
                        {summary.shippingCost > 0 ? `E£${summary.shippingCost}.00` : "Free"}
                    </span>
                </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t-2 border-gray-50 pt-4">
                <span className="text-base font-bold text-black">Total</span>
                <div className="flex items-baseline gap-1.5">
                    <span className="text-xl font-extrabold text-black">E£: {summary.totalPrice}.00</span>
                </div>
            </div>
        </div>
    );
}