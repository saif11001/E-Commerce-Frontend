"use client";

import { useCartStore } from "@/store/cartStore";

export default function CheckoutSummaryCard() {
    const { items, summary } = useCartStore();

    return (
        <div className="sticky top-24 rounded-3xl border-2 border-gray-50 p-6">
            <h2 className="text-lg font-extrabold text-black">Order Summary</h2>

            <div className="mt-4 flex flex-col gap-2 text-sm">
                {items.map((item) => {
                    const price =
                        item.product.discountPrice > 0
                            ? item.product.price - item.product.discountPrice
                            : item.product.price;
                    return (
                        <div key={item._id} className="flex justify-between text-gray-500">
                            <span className="truncate pr-2">
                                {item.product.name} × {item.quantity}
                            </span>
                            <span className="shrink-0 font-semibold text-black">
                                E£: {price * item.quantity}
                            </span>
                        </div>
                    );
                })}
            </div>

            <div className="mt-4 flex flex-col gap-2 border-t-2 border-gray-50 pt-4 text-sm">
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
                        {summary.shippingCost > 0 ? `E£: ${summary.shippingCost}` : "Free"}
                    </span>
                </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t-2 border-gray-50 pt-4">
                <span className="text-base font-bold text-black">Total</span>
                <span className="text-xl font-extrabold text-black">E£: {summary.totalPrice}</span>
            </div>
        </div>
    );
}