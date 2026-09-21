"use client";

import { useState } from "react";
import { ImagePlus } from "lucide-react";
import { Category, useCategoryStore } from "../../../../store/categoryStore";
import { toBase64 } from "../../../../lib/Tobase64";

export default function EditCategoryForm({
  category,
  onSuccess,
  onCancel,
}: {
  category: Category;
  onSuccess?: () => void;
  onCancel?: () => void;
}) {
  const updateCategory = useCategoryStore((state) => state.updateCategory);

  const [name, setName] = useState(category.name);
  const [description, setDescription] = useState(category.description);
  const [isActive, setIsActive] = useState(category.isActive);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(category.image.url);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    setIsSubmitting(true);
    try {
      const payload: {
        name?: string;
        description?: string;
        isActive?: boolean;
        image?: string;
      } = { name, description, isActive };

      if (imageFile) {
        payload.image = await toBase64(imageFile);
      }

      await updateCategory(category._id, payload);
      onSuccess?.();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update category");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-xs font-medium text-gray-500">Image</label>
        <label className="flex h-32 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border border-dashed border-gray-200 bg-gray-50 transition hover:border-gray-300">
          {imagePreview ? (
            <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
          ) : (
            <div className="flex flex-col items-center gap-1.5 text-gray-400">
              <ImagePlus size={22} />
              <span className="text-xs">Click to upload</span>
            </div>
          )}
          <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
        </label>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-gray-500">Name</label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-black outline-none transition focus:border-black focus:bg-white focus:ring-2 focus:ring-black/5"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-gray-500">Description</label>
        <textarea
          required
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-black outline-none transition focus:border-black focus:bg-white focus:ring-2 focus:ring-black/5"
        />
      </div>

      <div className="flex items-center justify-between rounded-2xl bg-gray-50 px-4 py-3">
        <span className="text-sm font-medium text-black">Active</span>
        <button
          type="button"
          onClick={() => setIsActive((prev) => !prev)}
          className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
            isActive ? "bg-black" : "bg-gray-300"
          }`}
        >
          <span
            className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
              isActive ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-2xl bg-gray-100 py-3 text-sm font-semibold text-black transition hover:bg-gray-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 rounded-2xl bg-linear-to-b from-gray-800 via-gray-700 to-black py-3 text-sm font-semibold text-white shadow-lg shadow-black/20 transition hover:opacity-90 disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}