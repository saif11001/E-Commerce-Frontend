import ShopProductCard from "./ShopProductCard";
import { ShopProduct } from "@/store/shopProductStore";

export default function ProductGrid({ products }: { products: ShopProduct[] }) {
    if (products.length === 0) {
        return (
            <p className="py-16 text-center text-xl font-bold text-black sm:text-2xl">
                No products found
            </p>
        );
    }

    return (
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            {products.map((product) => (
                <div
                    key={product._id}
                    className="w-[calc(50%-0.5rem)] sm:w-[calc(33.333%-1rem)] lg:w-[calc(25%-1.125rem)]"
                >
                    <ShopProductCard product={product} />
                </div>
            ))}
        </div>
    );
}