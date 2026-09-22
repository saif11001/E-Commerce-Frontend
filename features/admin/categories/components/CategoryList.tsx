import { Category } from "../../../../store/categoryStore";
import CategoryListItem from "./CategoryListItem";

export default function CategoryList({
  categories,
  selectedCategoryId,
  deletingId,
  onSelect,
  onEdit,
  onDelete,
}: {
  categories: Category[];
  selectedCategoryId: string | null;
  deletingId: string | null;
  onSelect: (category: Category) => void;
  onEdit?: (category: Category) => void;
  onDelete?: (categoryId: string) => void;
}) {
  if (categories.length === 0) {
    return (
      <div className="flex h-[40vh] items-center justify-center rounded-[28px] border border-dashed border-gray-200">
        <p className="text-sm text-gray-400">No categories found</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 pb-6">
      {categories.map((category) => (
        <CategoryListItem
          key={category._id}
          category={category}
          isSelected={selectedCategoryId === category._id}
          isDeleting={deletingId === category._id}
          onSelect={() => onSelect(category)}
          onEdit={
            onEdit
              ? (e) => {
                  e.stopPropagation();
                  onEdit(category);
                }
              : undefined
          }
          onDelete={
            onDelete
              ? (e) => {
                  e.stopPropagation();
                  onDelete(category._id);
                }
              : undefined
          }
        />
      ))}
    </div>
  );
}