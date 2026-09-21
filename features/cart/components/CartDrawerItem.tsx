"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

type CartItem = {
    _id: string;
    product: {
        name: string;
        price: number;
        discountPrice: number;
        images: { url: string }[];
    };
    size: string;
    quantity: number;
};

export default function CartDrawerItem({ item }: { item: CartItem }) {
    const { isMutating, updateItemQuantity, removeItem } = useCartStore();

    const price =
        item.product.discountPrice > 0
            ? item.product.price - item.product.discountPrice
            : item.product.price;

    return (
        <div className="flex gap-3">
            <div className="h-20 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                <img
                    src={item.product.images?.[0]?.url}
                    alt={item.product.name}
                    className="h-full w-full object-cover"
                />
            </div>

            <div className="flex flex-1 flex-col justify-between">
                <div>
                    <p className="text-sm font-semibold text-black">{item.product.name}</p>
                    <p className="mt-0.5 text-xs text-gray-500">Size: {item.size}</p>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 rounded-full border border-gray-200 px-2 py-1">
                        <button
                            disabled={isMutating}
                            onClick={() => updateItemQuantity(item._id, "decrease")}
                            className="flex h-5 w-5 items-center justify-center disabled:opacity-40"
                        >
                            <Minus size={12} />
                        </button>
                        <span className="w-4 text-center text-xs font-semibold">{item.quantity}</span>
                        <button
                            disabled={isMutating}
                            onClick={() => updateItemQuantity(item._id, "increase")}
                            className="flex h-5 w-5 items-center justify-center disabled:opacity-40"
                        >
                            <Plus size={12} />
                        </button>
                    </div>

                    <span className="text-sm font-bold text-black">E£ {price * item.quantity}</span>
                </div>
            </div>

            <button
                disabled={isMutating}
                onClick={() => removeItem(item._id)}
                className="self-start text-gray-400 hover:text-red-500 disabled:opacity-40"
            >
                <Trash2 size={16} />
            </button>
        </div>
    );
}