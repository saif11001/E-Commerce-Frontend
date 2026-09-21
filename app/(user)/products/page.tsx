"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useShopProductStore } from "@/store/shopProductStore";
import { useCategoryStore } from "@/store/categoryStore";
import ProductGrid from "@/features/shop/components/ProductGrid";
import CategoryFilterSlider from "@/features/shop/components/CategoryFilterSlider";
import Pagination from "@/components/ui/Pagination";
import Loading from "@/components/ui/Loading";

export default function ProductsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentPage = Number(searchParams.get("page")) || 1;
    const currentCategory = searchParams.get("category") || "";

    const { products, pagination, isLoading, fetchProducts } = useShopProductStore();
    const { categories, fetchCategories } = useCategoryStore();

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    useEffect(() => {
        fetchProducts({ page: currentPage, category: currentCategory || undefined });
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [currentPage, currentCategory, fetchProducts]);

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", String(page));
        router.push(`/products?${params.toString()}`);
    };

    const handleCategoryChange = (slug: string) => {
        const params = new URLSearchParams();
        if (slug) params.set("category", slug);
        router.push(`/products?${params.toString()}`);
    };

    const activeCategories = categories.filter((c) => c.isActive);

    return (
        <div className="mx-auto max-w-7xl px-6 py-10">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-extrabold text-black sm:text-4xl">All Products</h1>
            </div>

            <CategoryFilterSlider
                categories={activeCategories}
                currentCategory={currentCategory}
                onSelect={handleCategoryChange}
            />

            {isLoading ? (
                <div className="flex min-h-100 items-center justify-center sm:min-h-100">
                    <Loading />
                </div>
            ) : (
                <>
                    <ProductGrid products={products} />
                    <div className="mt-10">
                        <Pagination
                            currentPage={pagination.page}
                            totalPages={pagination.totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                </>
            )}
        </div>
    );
}