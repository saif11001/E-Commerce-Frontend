"use client";

import { useState } from "react";
import { ImagePlus } from "lucide-react";
import { useCategoryStore } from "../../../../store/categoryStore";
import { toBase64 } from "../../../../lib/Tobase64";

export default function AddCategoryForm({ onSuccess }: { onSuccess?: () => void }) {
  const createCategory = useCategoryStore((state) => state.createCategory);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
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

    if (!imageFile) {
      setError("Please select an image");
      return;
    }

    setIsSubmitting(true);
    try {
      const base64Image = await toBase64(imageFile);
      await createCategory({ name, description, image: base64Image });

      setName("");
      setDescription("");
      setImageFile(null);
      setImagePreview(null);

      onSuccess?.();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create category");
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
          placeholder="e.g. Men's Jackets"
          className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-black outline-none transition placeholder:text-gray-400 focus:border-black focus:bg-white focus:ring-2 focus:ring-black/5"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-gray-500">Description</label>
        <textarea
          required
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Short description of this category"
          className="w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-black outline-none transition placeholder:text-gray-400 focus:border-black focus:bg-white focus:ring-2 focus:ring-black/5"
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-2xl bg-linear-to-b from-gray-800 via-gray-700 to-black py-3 text-sm font-semibold text-white shadow-lg shadow-black/20 transition hover:opacity-90 disabled:opacity-50"
      >
        {isSubmitting ? "Creating..." : "Create Category"}
      </button>
    </form>
  );
}