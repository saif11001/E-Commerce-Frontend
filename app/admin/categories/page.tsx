"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Plus } from "lucide-react";
import { Category, useCategoryStore } from "../../../store/categoryStore";
import CategoryList from "@/features/admin/categories/components/CategoryList";
import CategoryDetails from "@/features/admin/categories/components/CategoryDetails";
import AddCategoryForm from "@/features/admin/categories/components/AddCategoryForm";
import EditCategoryForm from "@/features/admin/categories/components/EditCategoryForm";
import Loading from "@/components/ui/Loading";
import { usePermissions } from "@/hooks/usePermissions";

type Mode = "details" | "add" | "edit";

export default function CategoriesPage() {
  const searchParams = useSearchParams();
  const { can } = usePermissions();
  const canCreate = can("categories", "create");
  const canEdit = can("categories", "update");
  const canDelete = can("categories", "delete");

  const categories = useCategoryStore((state) => state.categories);
  const isLoading = useCategoryStore((state) => state.isLoading);
  const error = useCategoryStore((state) => state.error);
  const fetchCategories = useCategoryStore((state) => state.fetchCategories);
  const deleteCategory = useCategoryStore((state) => state.deleteCategory);

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>(canCreate ? "add" : "details");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState("");

  // Click-and-drag scrolling for the categories list (mouse only —
  // touch already scrolls natively, this just adds the same feel for mouse users).
  const listRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startY = useRef(0);
  const startScrollTop = useRef(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!listRef.current) return;
    isDragging.current = true;
    startY.current = e.pageY - listRef.current.offsetTop;
    startScrollTop.current = listRef.current.scrollTop;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !listRef.current) return;
    e.preventDefault();
    const y = e.pageY - listRef.current.offsetTop;
    const walk = y - startY.current;
    listRef.current.scrollTop = startScrollTop.current - walk;
  };

  const stopDragging = () => {
    isDragging.current = false;
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (searchParams.get("action") === "add" && canCreate) {
      setSelectedCategoryId(null);
      setMode("add");
    }
  }, [searchParams, canCreate]);

  const selectedCategory = categories.find((c) => c._id === selectedCategoryId) || null;

  const handleSelect = (category: Category) => {
    setSelectedCategoryId(category._id);
    setMode("details");
  };

  const handleEdit = (category: Category) => {
    if (!canEdit) return;
    setSelectedCategoryId(category._id);
    setMode("edit");
  };

  const handleAddNew = () => {
    if (!canCreate) return;
    setSelectedCategoryId(null);
    setMode("add");
  };

  const handleDelete = async (categoryId: string) => {
    if (!canDelete) return;
    const confirmed = window.confirm("Are you sure you want to delete this category?");
    if (!confirmed) return;

    setDeleteError("");
    setDeletingId(categoryId);
    try {
      await deleteCategory(categoryId);
      if (selectedCategoryId === categoryId) {
        setSelectedCategoryId(null);
        setMode(canCreate ? "add" : "details");
      }
    } catch (error: any) {
      setDeleteError(error.response?.data?.message || "Failed to delete category");
      console.error("Delete failed:", error.response?.status, error.response?.data);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-4 sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-black sm:text-2xl">Categories</h1>
          <p className="mt-1 text-xs text-gray-500 sm:text-sm">
            Manage your store categories — add, edit, or browse.
          </p>
        </div>

        {canCreate && (
          <button
            type="button"
            onClick={handleAddNew}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-b from-gray-800 via-gray-700 to-black px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-black/20 transition hover:opacity-90 sm:w-auto"
          >
            <Plus size={17} />
            Add Category
          </button>
        )}
      </div>

      {deleteError && (
        <p className="mt-4 rounded-2xl bg-red-50 px-4 py-2.5 text-sm text-red-500">{deleteError}</p>
      )}

      <div className="mt-6 grid grid-cols-1 items-start gap-6 sm:mt-8 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="flex h-125 w-full min-w-0 flex-col self-start rounded-[28px] bg-white p-4 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] ring-1 ring-black/5 sm:h-[70vh] sm:p-6">
          <div className="flex shrink-0 items-center justify-between">
            <h2 className="text-sm font-semibold text-black">All Categories</h2>
            <span className="text-xs text-gray-400">{categories.length} categories</span>
          </div>

          <div
            ref={listRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={stopDragging}
            onMouseLeave={stopDragging}
            className="mt-4 min-h-0 flex-1 cursor-grab select-none overflow-y-auto [-ms-overflow-style:none] scrollbar-none active:cursor-grabbing [&::-webkit-scrollbar]:hidden"
          >
            {isLoading ? (
              <div className="flex h-full items-center justify-center">
                <Loading />
              </div>
            ) : error ? (
              <div className="flex h-full items-center justify-center">
                <p className="text-sm text-red-500">{error}</p>
              </div>
            ) : (
              <CategoryList
                categories={categories}
                selectedCategoryId={selectedCategoryId}
                deletingId={deletingId}
                onSelect={handleSelect}
                onEdit={canEdit ? handleEdit : undefined}
                onDelete={canDelete ? handleDelete : undefined}
              />
            )}
          </div>
        </div>

        <div className="flex min-w-0 flex-col rounded-[28px] bg-white p-4 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] ring-1 ring-black/5 sm:p-6">
          {mode === "add" && canCreate && (
            <>
              <h2 className="text-sm font-semibold text-black">Add New Category</h2>
              <p className="mt-1 text-xs text-gray-500">
                Fill in the details to create a new category.
              </p>
              <div className="mt-4">
                <AddCategoryForm onSuccess={() => setMode("add")} />
              </div>
            </>
          )}

          {mode === "edit" && canEdit && selectedCategory && (
            <>
              <h2 className="text-sm font-semibold text-black">Edit Category</h2>
              <div className="mt-4">
                <EditCategoryForm
                  category={selectedCategory}
                  onSuccess={() => setMode("details")}
                  onCancel={() => setMode("details")}
                />
              </div>
            </>
          )}

          {mode === "details" && (
            <>
              <h2 className="text-sm font-semibold text-black">Category Details</h2>
              <div className="mt-4">
                {selectedCategory ? (
                  <CategoryDetails
                    category={selectedCategory}
                    isDeleting={deletingId === selectedCategory._id}
                    onClose={() => setSelectedCategoryId(null)}
                    onEdit={canEdit ? () => setMode("edit") : undefined}
                    onDelete={canDelete ? () => handleDelete(selectedCategory._id) : undefined}
                  />
                ) : (
                  <p className="text-xs text-gray-500">
                    Select a category from the list to view its details.
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}