"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Plus } from "lucide-react";
import { useState } from "react";
import { ShopProduct } from "@/store/shopProductStore";
import { useCartStore } from "@/store/cartStore";
import QuickAddSizeModal from "./QuickAddSizeModal";

export default function ShopProductCard({ product }: { product: ShopProduct }) {
  const hasDiscount = product.discountPrice > 0 && product.discountPrice < product.price;
  const { addItem } = useCartStore();
  const [showSizeModal, setShowSizeModal] = useState(false);

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.sizes.length > 1) {
      setShowSizeModal(true);
      return;
    }

    const size = product.sizes.length === 1 ? product.sizes[0] : "One Size";
    try {
      await addItem(product._id, size, 1);
    } catch {
      // error already stored in cartStore.error
    }
  };

  return (
    <div className="relative w-full">
      <div className="flex h-75 flex-col rounded-[20px] bg-white p-2 sm:h-123 sm:rounded-[28px] sm:p-3">
        <Link href={`/products/${product.slug}`} className="flex h-full flex-col">
          <div className="relative aspect-4/5 w-full shrink-0 overflow-hidden rounded-2xl bg-gray-100 sm:rounded-3xl">
            {product.images?.[0]?.url && (
              <Image
                src={product.images[0].url}
                alt={product.name}
                fill
                className="object-cover transition duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            )}
            {hasDiscount && (
              <span className="absolute left-2 top-2 z-10 rounded-full bg-linear-to-b from-gray-800 via-gray-700 to-black px-2.5 py-1 text-[10px] font-medium text-white sm:left-4 sm:top-4 sm:px-4 sm:py-1.5 sm:text-sm">
                Sale
              </span>
            )}
          </div>

          <div className="mt-2.5 flex flex-1 flex-col px-1 sm:mt-4">
            <h3 className="line-clamp-2 pr-14 text-sm font-extrabold leading-tight text-black sm:pr-16 sm:text-lg md:text-xl">
              {product.name}
            </h3>

            <div className="mt-auto flex flex-col pr-14 pt-2 sm:pr-16">
              {product.colors?.length > 0 && (
                <div className="mb-1.5 flex items-center gap-1 sm:mb-2 sm:gap-1.5">
                  {product.colors.slice(0, 5).map((color, i) => (
                    <span
                      key={i}
                      className="h-3 w-3 rounded-full border border-gray-200 sm:h-4 sm:w-4"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                {hasDiscount ? (
                  <>
                    <span className="text-sm font-extrabold text-black sm:text-xl">
                      E£: {product.discountPrice > 0 ? product.price - product.discountPrice : product.price}
                    </span>
                    <span className="text-xs text-gray-400 line-through sm:text-sm">
                      E£: {product.price}
                    </span>
                  </>
                ) : (
                  <span className="text-sm font-extrabold text-black sm:text-xl">
                    E£: {product.price}
                  </span>
                )}
              </div>
            </div>
          </div>
        </Link>
      </div>

      <div className="absolute bottom-0 right-0 flex h-13 w-14 items-center justify-center rounded-tl-[20px] sm:h-17 sm:w-18 sm:rounded-tl-[20px]" style={{ backgroundColor: "#ebebeb" }}>
        <button
          onClick={handleQuickAdd}
          className="group flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg bg-white shadow-md transition hover:bg-linear-to-b hover:from-gray-800 hover:via-gray-700 hover:to-black hover:text-white sm:h-11 sm:w-11 sm:rounded-xl"
        >
          <ShoppingCart
            size={14}
            className="absolute transition-all duration-500 group-hover:rotate-180 group-hover:opacity-0 sm:hidden"
          />
          <Plus
            size={20}
            className="absolute -rotate-180 opacity-0 transition-all duration-500 group-hover:rotate-0 group-hover:opacity-100 sm:hidden"
          />
          <ShoppingCart
            size={22}
            className="absolute hidden transition-all duration-500 group-hover:rotate-180 group-hover:opacity-0 sm:block"
          />
          <Plus
            size={20}
            className="absolute hidden -rotate-180 opacity-0 transition-all duration-500 group-hover:rotate-0 group-hover:opacity-100 sm:block"
          />
        </button>
      </div>
      <div className="absolute bottom-13 right-0 h-6 w-7 rounded-tl-[20px] sm:bottom-17 sm:h-7 sm:w-9 sm:rounded-tl-[28px]" style={{ backgroundColor: "#ebebeb" }} />
      <div className="absolute bottom-13 right-0 h-6 w-7 rounded-br-4xl bg-white sm:bottom-17 sm:h-7 sm:w-9 sm:rounded-br-[40px]" />
      <div className="absolute bottom-0 right-14 h-6 w-7 rounded-tl-[20px] sm:right-18 sm:h-7 sm:w-9 sm:rounded-tl-[28px]" style={{ backgroundColor: "#ebebeb" }} />
      <div className="absolute bottom-0 right-14 h-6 w-7 rounded-br-[20px] bg-white sm:right-18 sm:h-7 sm:w-9 sm:rounded-br-[28px]" />

      {showSizeModal && (
        <QuickAddSizeModal product={product} onClose={() => setShowSizeModal(false)} />
      )}
    </div>
  );
}