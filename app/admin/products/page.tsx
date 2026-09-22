"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Package, Plus } from "lucide-react";
import { useProductStore } from "@/store/productStore";
import ProductCard from "@/features/admin/products/components/ProductCard";
import Pagination from "@/components/ui/Pagination";
import { usePermissions } from "@/hooks/usePermissions";

export default function ProductsPage() {
  const router = useRouter();
  const { can } = usePermissions();
  const canCreate = can("products", "create");
  const canEdit = can("products", "update");
  const canDelete = can("products", "delete");

  const products = useProductStore((state) => state.products);
  const pagination = useProductStore((state) => state.pagination);
  const isLoading = useProductStore((state) => state.isLoading);
  const error = useProductStore((state) => state.error);
  const fetchProducts = useProductStore((state) => state.fetchProducts);
  const deleteProduct = useProductStore((state) => state.deleteProduct);

  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts(pagination.page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page]);

  const handlePageChange = (page: number) => {
    fetchProducts(page);
  };

  const handleDelete = async (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    if (!canDelete) return;

    const confirmed = window.confirm("Are you sure you want to delete this product?");
    if (!confirmed) return;

    setDeletingId(productId);
    try {
      await deleteProduct(productId);
      if (products.length === 1 && pagination.page > 1) {
        fetchProducts(pagination.page - 1);
      } else {
        fetchProducts(pagination.page);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete product");
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading && products.length === 0) {
    return (
      <div className="flex h-[calc(100vh-80px)] items-center justify-center">
        <p className="text-sm text-gray-400">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[calc(100vh-80px)] items-center justify-center">
        <p className="text-sm text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-extrabold text-black">
            <Package size={22} />
            Products
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {pagination.total} {pagination.total === 1 ? "product" : "products"} total
          </p>
        </div>
        {canCreate && (
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 rounded-2xl bg-linear-to-b from-gray-800 via-gray-700 to-black px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-black/20 transition hover:opacity-90"
          >
            <Plus size={16} />
            Add Product
          </Link>
        )}
      </div>

      {products.length === 0 ? (
        <div className="flex h-[40vh] flex-col items-center justify-center gap-2 rounded-[28px] border border-dashed border-gray-200">
          <Package size={28} className="text-gray-300" />
          <p className="text-sm text-gray-400">No products found</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                isDeleting={deletingId === product._id}
                onSelect={() => router.push(`/admin/products/${product._id}`)}
                onEdit={canEdit}
                onDelete={canDelete ? (e) => handleDelete(e, product._id) : undefined}
              />
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}