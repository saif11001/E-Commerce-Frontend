import HeroSlider from "@/components/layout/HeroSlider";
import CategoriesShowcase from "@/features/admin/categories/components/Categoriesshowcase";
import HomeProductsSection from "@/features/shop/components/HomeProductsSection";
import Link from "next/link";

export default function Home() {
    return (
        <>
            <HeroSlider />
            <CategoriesShowcase />

            <div className="mx-auto max-w-7xl px-6 py-6">
                <div className="mb-10 text-center">
                    <h2 className="text-3xl font-extrabold text-black sm:text-4xl">
                        Our Products
                    </h2>
                    <p className="mt-2 text-sm text-gray-500">
                        Handpicked pieces to elevate your wardrobe
                    </p>
                </div>

                <HomeProductsSection />

                <div className="mt-10 flex justify-center sm:mt-12">
                    <Link
                        href="/products"
                        className="inline-block rounded-full bg-linear-to-b from-gray-800 via-gray-700 to-black px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-black/10 transition hover:opacity-90"
                    >
                        Show All Products
                    </Link>
                </div>
                <br/>
            </div>
        </>
    );
}