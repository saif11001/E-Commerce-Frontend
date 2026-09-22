import { Pencil, Trash2 } from "lucide-react";
import { Category } from "../../../../store/categoryStore";

export default function CategoryListItem({
  category,
  isSelected,
  isDeleting,
  onSelect,
  onEdit,
  onDelete,
}: {
  category: Category;
  isSelected: boolean;
  isDeleting: boolean;
  onSelect: () => void;
  onEdit?: (e: React.MouseEvent) => void;
  onDelete?: (e: React.MouseEvent) => void;
}) {
  const showActions = onEdit || onDelete;

  return (
    <div
      onClick={onSelect}
      className={`flex w-full cursor-pointer items-center gap-4 rounded-3xl border bg-white p-3 text-left transition ${
        isSelected
          ? "border-black shadow-md"
          : "border-gray-100 hover:border-gray-300 hover:shadow-sm"
      }`}
    >
      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-gray-100">
        <img
          src={category.image.url}
          alt={category.name}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate font-semibold text-black">{category.name}</h3>
          <span
            className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
              category.isActive
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            {category.isActive ? "Active" : "Inactive"}
          </span>
        </div>
        <p className="mt-0.5 truncate text-sm text-gray-500">{category.description}</p>
      </div>

      {showActions && (
        <div className="flex shrink-0 items-center gap-1.5">
          {onEdit && (
            <button
              onClick={onEdit}
              className="flex h-9 w-9 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-black"
              title="Edit"
            >
              <Pencil size={15} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              disabled={isDeleting}
              className="flex h-9 w-9 items-center justify-center rounded-full text-gray-400 transition hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
              title="Delete"
            >
              <Trash2 size={15} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}