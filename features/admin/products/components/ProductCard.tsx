import Link from "next/link";
import { Pencil, Trash2, Box } from "lucide-react";
import { Product } from "@/store/productStore";

export default function ProductCard({
  product,
  isDeleting,
  onSelect,
  onDelete,
}: {
  product: Product;
  isDeleting: boolean;
  onSelect: () => void;
  onDelete: (e: React.MouseEvent) => void;
}) {
  return (
    <div
      onClick={onSelect}
      className="cursor-pointer rounded-[28px] bg-white p-3 shadow-sm ring-1 ring-gray-100 transition hover:shadow-md"
    >
      <div className="aspect-4/3 overflow-hidden rounded-[20px] bg-gray-100">
        {product.images[0]?.url && (
          <img
            src={product.images[0].url}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        )}
      </div>

      <div className="mt-3 px-1">
        <h3 className="truncate text-lg font-extrabold leading-tight text-black">
          {product.name}
        </h3>
        <p className="mt-0.5 truncate text-xs text-gray-400">{product.category?.name}</p>

        <p className="mt-2 line-clamp-2 text-sm leading-5 text-gray-500">
          {product.shortDescription}
        </p>

        <div className="mt-2.5 flex items-center justify-between">
          <div className="flex items-baseline gap-2 text-sm">
            <span className="font-semibold text-black">
              E£: {product.discountPrice > 0 ? product.price - product.discountPrice : product.price}
            </span>
            {product.discountPrice > 0 && (
              <span className="text-xs text-gray-400 line-through">E£: {product.price}</span>
            )}
          </div>

          {product.colors?.length > 0 ? (
            <div className="flex items-center gap-1.5">
              {product.colors.map((color, index) => (
                <span
                  key={index}
                  className="h-4 w-6 shrink-0 rounded-full border border-gray-200"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          ) : (
            <span />
          )}
        </div>

        <div className="mt-2.5 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <Box size={13} />
            Stock: <span className="font-semibold text-black">{product.stock}</span>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`rounded-full px-3 py-1 text-[11px] font-medium ${
                product.isFeatured
                  ? "bg-linear-to-b from-gray-800 via-gray-700 to-black text-white"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              {product.isFeatured ? "Featured" : "Not Featured"}
            </span>
            <span
              className={`rounded-full px-3 py-1 text-[11px] font-medium ${
                product.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"
              }`}
            >
              {product.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
          <Link
            href={`/admin/products/${product._id}/edit`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1.5 text-sm font-medium text-gray-500 transition hover:text-black"
          >
            <Pencil size={14} />
            Edit
          </Link>
          <button
            onClick={onDelete}
            disabled={isDeleting}
            className="flex items-center gap-1.5 text-sm font-medium text-red-500 transition hover:text-red-600 disabled:opacity-50"
          >
            <Trash2 size={14} />
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}