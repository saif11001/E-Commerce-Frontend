"use client";

import { useEffect } from "react";
import { useShopProductStore } from "@/store/shopProductStore";
import ProductGrid from "./ProductGrid";
import Loading from "@/components/ui/Loading";

export default function HomeProductsSection() {
    const { products, isLoading, fetchProducts } = useShopProductStore();

    useEffect(() => {
        fetchProducts({ page: 1, limit: 8 });
    }, [fetchProducts]);

    if (isLoading) {
        return (
            <div className="flex min-h-100 items-center justify-center">
                <Loading />
            </div>
        );
    }

    return <ProductGrid products={products} />;
}