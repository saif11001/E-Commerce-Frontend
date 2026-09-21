"use client";

import { useEffect } from "react";
import { useShopProductStore } from "@/store/shopProductStore";
import ProductGrid from "@/features/shop/components/ProductGrid";
import Loading from "@/components/ui/Loading";

export default function FeaturedProductsPage() {
    const { featuredProducts, isLoading, fetchFeaturedProducts } = useShopProductStore();

    useEffect(() => {
        fetchFeaturedProducts();
    }, [fetchFeaturedProducts]);

    return (
        <div className="mx-auto max-w-7xl px-6 py-10">
            <div className="mb-10 text-center">
                <h1 className="text-3xl font-extrabold text-black sm:text-4xl">Featured Products</h1>
            </div>

            {isLoading ? (
                <div className="flex min-h-100 items-center justify-center">
                    <Loading />
                </div>
            ) : (
                <ProductGrid products={featuredProducts} />
            )}
        </div>
    );
}