"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useShopProductStore } from "@/store/shopProductStore";
import { useCartStore } from "@/store/cartStore";
import ProductImageGallery from "@/features/admin/products/components/ProductImageGallery";
import Loading from "@/components/ui/Loading";
import { Minus, Plus } from "lucide-react";

export default function ProductDetailsPage() {
    const { slug } = useParams<{ slug: string }>();
    const router = useRouter();
    const { currentProduct, isLoading, error, fetchProductBySlug } = useShopProductStore();
    const { addItem, isMutating } = useCartStore();

    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [sizeError, setSizeError] = useState(false);

    useEffect(() => {
        if (slug) fetchProductBySlug(slug);
    }, [slug, fetchProductBySlug]);

    useEffect(() => {
        setSelectedSize(null);
        setQuantity(1);
        setSizeError(false);
    }, [slug]);

    if (isLoading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loading />
            </div>
        );
    }

    if (error || !currentProduct) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <p className="text-sm text-red-500">{error || "Product not found"}</p>
            </div>
        );
    }

    const hasDiscount =
        currentProduct.discountPrice > 0 && currentProduct.discountPrice < currentProduct.price;
    const finalPrice = hasDiscount
        ? currentProduct.price - currentProduct.discountPrice
        : currentProduct.price;

    const validateSelection = () => {
        if (currentProduct.sizes?.length > 0 && !selectedSize) {
            setSizeError(true);
            return false;
        }
        setSizeError(false);
        return true;
    };

    const handleAddToCart = async () => {
        if (!validateSelection()) return;
        try {
            await addItem(currentProduct._id, selectedSize || "One Size", quantity);
        } catch {
            // error already stored in cartStore.error
        }
    };

    const handleShopNow = async () => {
        if (!validateSelection()) return;
        try {
            await addItem(currentProduct._id, selectedSize || "One Size", quantity);
        } catch {
            // error already stored in cartStore.error
            return;
        }
        // Make sure the mini-cart drawer never shows up on this path — we're skipping it entirely.
        useCartStore.getState().closeDrawer();
        router.push("/checkout");
    };

    const actionButtons = (className: string) => (
        <div className={`grid grid-cols-2 gap-3 ${className}`}>
            <button
                onClick={handleShopNow}
                disabled={isMutating}
                className="w-full rounded-2xl bg-linear-to-b from-gray-800 via-gray-700 to-black py-5 text-base font-semibold text-white shadow-lg shadow-black/20 transition hover:opacity-90 disabled:opacity-60"
            >
                Buy Now
            </button>
            <button
                onClick={handleAddToCart}
                disabled={isMutating}
                className="w-full rounded-2xl bg-linear-to-b from-gray-800 via-gray-700 to-black py-5 text-base font-semibold text-white shadow-lg shadow-black/20 transition hover:opacity-90 disabled:opacity-60"
            >
                {isMutating ? "Adding..." : "Add to Cart"}
            </button>
        </div>
    );

    return (
        <div className="mx-auto max-w-6xl px-6 py-8 sm:py-12">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
                <div>
                    <div className="h-105 sm:h-130">
                        <ProductImageGallery images={currentProduct.images} />
                    </div>

                    {actionButtons("mt-25 hidden lg:flex")}
                </div>

                <div className="flex flex-col">
                    <div>
                        <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                                <h1 className="text-2xl font-extrabold text-black sm:text-3xl">
                                    {currentProduct.name}
                                </h1>
                                {currentProduct.category?.name && (
                                    <p className="mt-1 text-sm text-gray-500">
                                        {currentProduct.category.name}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="mt-3 flex items-center gap-3">
                            <span className="text-2xl font-extrabold text-black">
                                E£: {finalPrice}
                            </span>
                            {hasDiscount && (
                                <span className="rounded-full bg-green-50 px-4 py-1.5 text-sm font-semibold text-green-600">
                                    Save E£: {currentProduct.discountPrice}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="mt-6 rounded-3xl border-2 border-gray-50 p-6">
                        <h2 className="text-sm font-semibold text-black">Options</h2>

                        <div className="mt-4 flex flex-col gap-5">
                            {currentProduct.sizes?.length > 0 && (
                                <div>
                                    <div className="mb-2 flex items-center justify-between">
                                        <p className="text-sm text-gray-500">Size</p>
                                        {sizeError && (
                                            <p className="text-xs font-medium text-red-500">
                                                Please select a size
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        {currentProduct.sizes.map((size) => (
                                            <button
                                                key={size}
                                                onClick={() => {
                                                    setSelectedSize(size);
                                                    setSizeError(false);
                                                }}
                                                className={`flex h-12 min-w-12 items-center justify-center rounded-full border-2 px-3 text-sm font-semibold transition ${selectedSize === size
                                                        ? "border-transparent bg-linear-to-b from-gray-800 via-gray-700 to-black text-white"
                                                        : "border-gray-200 bg-gray-50 text-black hover:border-black"
                                                    }`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex items-start justify-between gap-4">
                                {currentProduct.colors?.length > 0 ? (
                                    <div>
                                        <p className="mb-2 text-sm text-gray-500">Color</p>
                                        <div className="flex flex-wrap gap-2">
                                            {currentProduct.colors.map((color, index) => (
                                                <span
                                                    key={index}
                                                    className="h-7 w-7 shrink-0 rounded-full border border-gray-300"
                                                    style={{ backgroundColor: color }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div />
                                )}

                                <div>
                                    <p className="mb-2 text-sm text-gray-500">Quantity</p>
                                    <div className="flex w-fit items-center gap-4 rounded-full border-2 border-gray-50 px-4 py-2">
                                        <button
                                            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                            className="flex h-6 w-6 items-center justify-center"
                                        >
                                            <Minus size={14} />
                                        </button>
                                        <span className="w-6 text-center text-sm font-semibold">
                                            {quantity}
                                        </span>
                                        <button
                                            onClick={() => setQuantity((q) => q + 1)}
                                            className="flex h-6 w-6 items-center justify-center"
                                        >
                                            <Plus size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 rounded-3xl border-2 border-gray-50 p-6">
                        <h2 className="text-sm font-semibold text-black">Price</h2>

                        <div className="mt-4 flex flex-col gap-2 text-sm">
                            <div className="flex justify-between text-gray-500">
                                <span>Unit price</span>
                                <span className="font-semibold text-black">E£: {currentProduct.price}</span>
                            </div>
                            {hasDiscount && (
                                <div className="flex justify-between text-gray-500">
                                    <span>Discount</span>
                                    <span className="font-semibold text-green-600">
                                        - E£: {currentProduct.discountPrice}
                                    </span>
                                </div>
                            )}
                            <div className="flex justify-between text-gray-500">
                                <span>Quantity</span>
                                <span className="font-semibold text-black">× {quantity}</span>
                            </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                            <span className="text-base font-bold text-black">Total</span>
                            <span className="text-xl font-extrabold text-black">
                                E£: {finalPrice * quantity}
                            </span>
                        </div>
                    </div>

                    <div className="mt-6 rounded-3xl border-2 border-gray-50 p-6">
                        <h2 className="text-sm font-semibold text-black">Description</h2>
                        <div className="mt-3 flex flex-col gap-2 text-sm leading-6 text-gray-600">
                            {currentProduct.shortDescription && (
                                <p>{currentProduct.shortDescription}</p>
                            )}
                            {currentProduct.longDescription && (
                                <p className="text-gray-500">{currentProduct.longDescription}</p>
                            )}
                        </div>
                    </div>

                    {actionButtons("mt-6 lg:hidden")}
                </div>
            </div>
        </div>
    );
}