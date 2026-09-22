"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Package } from "lucide-react";
import ProductForm from "@/features/admin/products/components/ProductForm";
import { usePermissions } from "@/hooks/usePermissions";

export default function NewProductPage() {
  const router = useRouter();
  const { can } = usePermissions();
  const canCreate = can("products", "create");

  useEffect(() => {
    if (!canCreate) {
      router.replace("/admin/products");
    }
  }, [canCreate, router]);

  if (!canCreate) {
    return null;
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/admin/products"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:border-black hover:text-black"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-extrabold text-black">
            <Package size={22} />
            Add New Product
          </h1>
          <p className="mt-0.5 text-sm text-gray-500">Create a new product for your store</p>
        </div>
      </div>

      <ProductForm onSuccess={(product) => router.push(`/admin/products/${product._id}`)} />
    </div>
  );
}