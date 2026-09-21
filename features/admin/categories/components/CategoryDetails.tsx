import { Pencil, Trash2, X } from "lucide-react";
import { Category } from "../../../../store/categoryStore";

export default function CategoryDetails({
  category,
  onClose,
  onEdit,
  onDelete,
  isDeleting,
}: {
  category: Category;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}) {
  return (
    <div className="flex h-full flex-col justify-center overflow-hidden rounded-[28px] border border-gray-100 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <h2 className="text-lg font-bold text-black">{category.name} Details</h2>
        <button
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-black"
        >
          <X size={16} />
        </button>
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl bg-gray-100">
        <img src={category.image.url} alt={category.name} className="h-48 w-full object-cover" />
      </div>

      <div className="mt-5 flex items-center gap-2">
        <h3 className="text-xl font-extrabold text-black">{category.name}</h3>
        <span
          className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
            category.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
          }`}
        >
          {category.isActive ? "Active" : "Inactive"}
        </span>
      </div>

      <p className="mt-2 text-sm leading-6 text-gray-500">{category.description}</p>

      <div className="mt-4 rounded-2xl bg-gray-50 p-4">
        <p className="text-xs text-gray-400">Slug</p>
        <p className="mt-0.5 text-sm font-medium text-black">{category.slug}</p>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          onClick={onEdit}
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-linear-to-b from-gray-800 via-gray-700 to-black py-3 text-sm font-semibold text-white transition hover:opacity-90"
        >
          <Pencil size={15} />
          Edit
        </button>
        <button
          onClick={onDelete}
          disabled={isDeleting}
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gray-100 py-3 text-sm font-semibold text-red-500 transition hover:bg-red-50 disabled:opacity-50"
        >
          <Trash2 size={15} />
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
}