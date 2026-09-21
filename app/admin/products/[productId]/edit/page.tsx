"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useProductStore } from "@/store/productStore";
import ProductForm from "@/features/admin/products/components/ProductForm";

export default function EditProductPage() {
  const { productId } = useParams<{ productId: string }>();
  const router = useRouter();

  const currentProduct = useProductStore((state) => state.currentProduct);
  const isLoading = useProductStore((state) => state.isLoading);
  const error = useProductStore((state) => state.error);
  const fetchProductById = useProductStore((state) => state.fetchProductById);

  useEffect(() => {
    fetchProductById(productId);
  }, [productId, fetchProductById]);

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-80px)] items-center justify-center">
        <p className="text-sm text-gray-400">Loading...</p>
      </div>
    );
  }

  if (error || !currentProduct) {
    return (
      <div className="flex h-[calc(100vh-80px)] items-center justify-center">
        <p className="text-sm text-red-500">{error || "Product not found"}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center gap-3">
        <Link
          href={`/admin/products/${currentProduct._id}`}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:border-black hover:text-black"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-black">Edit Product</h1>
          <p className="mt-0.5 text-sm text-gray-500">{currentProduct.name}</p>
        </div>
      </div>

      <ProductForm
        product={currentProduct}
        onSuccess={(product) => router.push(`/admin/products/${product._id}`)}
        onCancel={() => router.push(`/admin/products/${currentProduct._id}`)}
      />
    </div>
  );
}