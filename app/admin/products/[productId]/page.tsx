"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Pencil, Trash2, Box, Tag } from "lucide-react";
import { useProductStore } from "@/store/productStore";
import ProductImageGallery from "@/features/admin/products/components/ProductImageGallery";

export default function SingleProductPage() {
  const { productId } = useParams<{ productId: string }>();
  const router = useRouter();

  const currentProduct = useProductStore((state) => state.currentProduct);
  const isLoading = useProductStore((state) => state.isLoading);
  const error = useProductStore((state) => state.error);
  const fetchProductById = useProductStore((state) => state.fetchProductById);
  const deleteProduct = useProductStore((state) => state.deleteProduct);

  useEffect(() => {
    fetchProductById(productId);
  }, [productId, fetchProductById]);

  const handleDelete = async () => {
    if (!currentProduct) return;
    const confirmed = window.confirm("Are you sure you want to delete this product?");
    if (!confirmed) return;

    try {
      await deleteProduct(currentProduct._id);
      router.push("/admin/products");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete product");
    }
  };

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

  const product = currentProduct;

  return (
    <div className="min-h-[calc(100vh-80px)] overflow-y-auto p-6 pb-24 sm:pb-6">
      <div className="mb-5 flex items-center gap-3">
        <Link
          href="/admin/products"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:border-black hover:text-black"
        >
          <ArrowLeft size={18} />
        </Link>
        <p className="text-sm text-gray-400">
          Products / <span className="text-black">{product.name}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-[28px] border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-black">Product Details</h2>
          <p className="mt-0.5 text-sm text-gray-400">Full information about this product.</p>

          <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-gray-400">
            {product.category?.name}
          </p>
          <h1 className="mt-1 text-2xl font-extrabold text-black">{product.name}</h1>

          <div className="mt-3 flex items-center gap-2">
            <span
              className={`rounded-full px-3 py-1 text-[11px] font-medium ${
                product.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"
              }`}
            >
              {product.isActive ? "Active" : "Inactive"}
            </span>
            <span
              className={`rounded-full px-3 py-1 text-[11px] font-medium ${
                product.isFeatured
                  ? "bg-linear-to-b from-gray-800 via-gray-700 to-black text-white"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              {product.isFeatured ? "Featured" : "Not Featured"}
            </span>
          </div>

          <div className="mt-5 flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-black">
              E£: {product.discountPrice > 0 ? product.price - product.discountPrice : product.price}
            </span>
            {product.discountPrice > 0 && (
              <span className="text-base text-gray-400 line-through">E£: {product.price}</span>
            )}
          </div>

          <p className="mt-4 text-sm leading-6 text-gray-500">{product.shortDescription}</p>
          <p className="mt-2 line-clamp-3 text-sm leading-6 text-gray-500">
            {product.longDescription}
          </p>

          <div className="mt-5">
            <p className="mb-2 text-sm font-semibold text-black">Available Sizes</p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <span
                  key={size}
                  className="flex h-9 min-w-12 items-center justify-center rounded-xl border border-gray-200 px-3 text-sm font-semibold text-black"
                >
                  {size}
                </span>
              ))}
            </div>
          </div>

          {product.colors.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 text-sm font-semibold text-black">Colors</p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <span
                    key={color}
                    className="flex items-center gap-2 rounded-full bg-gray-100 py-1.5 pl-1.5 pr-3 text-sm text-black"
                  >
                    <span
                      className="h-5 w-5 shrink-0 rounded-full border border-gray-300"
                      style={{ backgroundColor: color }}
                    />
                    {color}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-5 flex gap-3">
            <div className="flex flex-1 items-center gap-2 rounded-2xl bg-gray-50 px-4 py-3">
              <Box size={16} className="text-gray-400" />
              <div>
                <p className="text-xs text-gray-400">Stock</p>
                <p className="text-sm font-bold text-black">{product.stock}</p>
              </div>
            </div>
            <div className="flex flex-1 items-center gap-2 rounded-2xl bg-gray-50 px-4 py-3">
              <Tag size={16} className="text-gray-400" />
              <div>
                <p className="text-xs text-gray-400">Sold</p>
                <p className="text-sm font-bold text-black">{product.sold}</p>
              </div>
            </div>
          </div>

          {/* Edit/Delete row: hidden on mobile, shown inline from sm breakpoint up */}
          <div className="mt-6 hidden gap-3 sm:flex">
            <button
              onClick={handleDelete}
              className="flex-1 rounded-2xl bg-gray-100 py-3 text-sm font-semibold text-red-500 transition hover:bg-red-50"
            >
              Delete
            </button>
            <Link
              href={`/admin/products/${product._id}/edit`}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-linear-to-b from-gray-800 via-gray-700 to-black py-3 text-sm font-semibold text-white shadow-lg shadow-black/20 transition hover:opacity-90"
            >
              <Pencil size={15} />
              Edit
            </Link>
          </div>
        </div>

        <div className="rounded-[28px] border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-black">{product.name}</h2>
          <p className="mt-0.5 text-sm text-gray-400">Preview the product photos.</p>

          <div className="mt-4 h-110">
            <ProductImageGallery images={product.images} />
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 flex gap-3 border-t border-gray-200 bg-white p-4 shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.15)] sm:hidden">
        <button
          onClick={handleDelete}
          className="flex-1 rounded-2xl bg-gray-100 py-3.5 text-sm font-semibold text-red-500 transition hover:bg-red-50"
        >
          Delete
        </button>
        <Link
          href={`/admin/products/${product._id}/edit`}
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-linear-to-b from-gray-800 via-gray-700 to-black py-3.5 text-sm font-semibold text-white shadow-lg shadow-black/20 transition hover:opacity-90"
        >
          <Pencil size={15} />
          Edit
        </Link>
      </div>
    </div>
  );
}