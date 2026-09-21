"use client";

import { X } from "lucide-react";
import { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { ShopProduct } from "@/store/shopProductStore";

type QuickAddSizeModalProps = {
    product: ShopProduct;
    onClose: () => void;
};

export default function QuickAddSizeModal({ product, onClose }: QuickAddSizeModalProps) {
    const { addItem, isMutating } = useCartStore();
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [sizeError, setSizeError] = useState(false);

    const handleAdd = async () => {
        if (!selectedSize) {
            setSizeError(true);
            return;
        }
        try {
            await addItem(product._id, selectedSize, 1);
            onClose();
        } catch {
            // error already stored in cartStore.error
        }
    };

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 backdrop-blur-sm px-6"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl"
            >
                <div className="flex items-center justify-between">
                    <h3 className="text-base font-extrabold text-black">Select a Size</h3>
                    <button
                        onClick={onClose}
                        className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100"
                    >
                        <X size={18} />
                    </button>
                </div>

                <p className="mt-1 truncate text-sm text-gray-500">{product.name}</p>

                <div className="mt-4 flex flex-wrap gap-2.5">
                    {product.sizes.map((size) => (
                        <button
                            key={size}
                            onClick={() => {
                                setSelectedSize(size);
                                setSizeError(false);
                            }}
                            className={`flex h-11 min-w-11 items-center justify-center rounded-full border-2 px-3 text-sm font-semibold transition ${
                                selectedSize === size
                                    ? "border-black bg-black text-white"
                                    : "border-gray-200 bg-gray-50 text-black hover:border-black"
                            }`}
                        >
                            {size}
                        </button>
                    ))}
                </div>

                {sizeError && (
                    <p className="mt-3 text-xs font-medium text-red-500">Please select a size</p>
                )}

                <button
                    onClick={handleAdd}
                    disabled={isMutating}
                    className="mt-5 w-full rounded-2xl bg-linear-to-b from-gray-800 via-gray-700 to-black py-3.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
                >
                    {isMutating ? "Adding..." : "Add to Cart"}
                </button>
            </div>
        </div>
    );
}