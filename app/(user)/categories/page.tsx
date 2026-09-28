"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/axios";
import Loading from "@/components/ui/Loading";

type Category = {
    _id: string;
    name: string;
    slug?: string;
    image?: { url: string };
    isActive?: boolean;
};

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        api
            .get("/categories")
            .then(({ data }) => {
                const all: Category[] = data.categories || [];
                setCategories(all.filter((c) => c.isActive !== false));
            })
            .catch(() => setCategories([]))
            .finally(() => setIsLoading(false));
    }, []);

    if (isLoading) {
        return (
            <div className="flex min-h-125 items-center justify-center">
                <Loading />
            </div>
        );
    }

    if (categories.length === 0) {
        return (
            <div className="mx-auto flex min-h-125 max-w-2xl flex-col items-center justify-center gap-2 px-6 text-center">
                <h1 className="text-2xl font-extrabold text-black">No Categories Yet</h1>
                <p className="text-sm text-gray-500">Check back soon for new collections.</p>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-6xl px-6 py-10">
            <h1 className="mb-8 text-3xl font-extrabold text-black sm:text-4xl">Collections</h1>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {categories.map((category) => (
                    <Link
                        key={category._id}
                        href={`/products?category=${category.slug || category._id}`}
                        className="group relative aspect-square overflow-hidden rounded-2xl bg-gray-100"
                    >
                        {category.image?.url ? (
                            <img
                                src={category.image.url}
                                alt={category.name}
                                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center bg-linear-to-b from-gray-800 via-gray-700 to-black text-2xl font-bold text-white">
                                {category.name.charAt(0)}
                            </div>
                        )}

                        <div className="absolute inset-0 flex items-end bg-linear-to-t from-black/60 via-black/0 to-black/0 p-4">
                            <span className="text-sm font-semibold text-white sm:text-base">
                                {category.name}
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}