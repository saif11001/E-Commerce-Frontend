"use client";

import { useRef, useMemo } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import Loading from "@/components/ui/Loading";

export default function CartItemsList() {
    const { items, isMutating, updateItemQuantity, removeItem } = useCartStore();

    const listRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);
    const startY = useRef(0);
    const startScrollTop = useRef(0);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!listRef.current) return;
        isDragging.current = true;
        startY.current = e.pageY - listRef.current.offsetTop;
        startScrollTop.current = listRef.current.scrollTop;
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging.current || !listRef.current) return;
        e.preventDefault();
        const y = e.pageY - listRef.current.offsetTop;
        const walk = y - startY.current;
        listRef.current.scrollTop = startScrollTop.current - walk;
    };

    const stopDragging = () => {
        isDragging.current = false;
    };

    const uniqueProductsCount = useMemo(() => {
        const ids = new Set(items.map((item) => item.product._id));
        return ids.size;
    }, [items]);

    return (
        <div className="relative">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-600">
                    {uniqueProductsCount} {uniqueProductsCount === 1 ? "Product" : "Products"}
                </h2>
            </div>

            <div
                ref={listRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={stopDragging}
                onMouseLeave={stopDragging}
                className="max-h-115 cursor-grab select-none overflow-y-auto pr-1 active:cursor-grabbing [-ms-overflow-style:none] scrollbar-none [&::-webkit-scrollbar]:hidden"
            >
                <div className="flex flex-col divide-y-2 divide-gray-50">
                    {items.map((item) => {
                        const hasDiscount = item.product.discountPrice > 0;
                        const unitPrice = hasDiscount
                            ? item.product.price - item.product.discountPrice
                            : item.product.price;

                        const totalOriginal = item.product.price * item.quantity;
                        const totalDiscount = item.product.discountPrice * item.quantity;
                        const totalFinal = unitPrice * item.quantity;

                        const outOfStock = !item.product.isActive || item.product.stock <= 0;

                        return (
                            <div key={item._id} className="flex gap-4 py-5">
                                <div className="h-28 w-24 shrink-0 overflow-hidden rounded-2xl bg-gray-100">
                                    <img
                                        src={item.product.images?.[0]?.url}
                                        alt={item.product.name}
                                        className="h-full w-full object-cover"
                                        draggable={false}
                                    />
                                </div>

                                <div className="flex flex-1 flex-col justify-between">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <p className="font-semibold text-black">{item.product.name}</p>
                                            <p className="mt-2 text-xs text-gray-500">Size: {item.size}</p>
                                            {outOfStock && (
                                                <p className="mt-1 text-xs font-semibold text-red-500">
                                                    Out of stock
                                                </p>
                                            )}
                                        </div>

                                        <button
                                            disabled={isMutating}
                                            onClick={() => removeItem(item._id)}
                                            className="text-gray-400 hover:text-red-500 disabled:opacity-40"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>

                                    <div className="mt-3 flex items-center justify-between">
                                        <div className="flex items-center gap-3 rounded-full border-2 border-gray-50 px-3 py-1.5">
                                            <button
                                                disabled={isMutating}
                                                onClick={() => updateItemQuantity(item._id, "decrease")}
                                                className="flex h-6 w-6 items-center justify-center disabled:opacity-40"
                                            >
                                                <Minus size={13} />
                                            </button>
                                            <span className="w-5 text-center text-sm font-semibold">
                                                {item.quantity}
                                            </span>
                                            <button
                                                disabled={isMutating}
                                                onClick={() => updateItemQuantity(item._id, "increase")}
                                                className="flex h-6 w-6 items-center justify-center disabled:opacity-40"
                                            >
                                                <Plus size={13} />
                                            </button>
                                        </div>

                                        <div className="flex flex-col items-end">
                                            {hasDiscount && (
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-semibold text-green-600">
                                                        - E£: {totalDiscount}
                                                    </span>
                                                </div>
                                            )}
                                            <span className="text-base font-bold text-black">
                                                E£: {totalFinal}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {isMutating && (
                <div className="absolute inset-0 flex items-center justify-center rounded-3xl bg-white/70">
                    <Loading />
                </div>
            )}
        </div>
    );
}