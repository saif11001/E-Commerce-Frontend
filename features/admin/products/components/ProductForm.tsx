"use client";

import { useEffect, useRef, useState } from "react";
import { ImagePlus, Star, X, RotateCcw, ChevronDown, Check } from "lucide-react";
import { Product, useProductStore } from "@/store/productStore";
import { useCategoryStore } from "@/store/categoryStore";
import { toBase64Multiple } from "@/lib/Tobase64";

const ALL_SIZES = [
  "One Size", "XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL",
  "30", "32", "34", "36", "38", "40", "42", "44", "46", "48", "50",
];
const MAX_IMAGE_SIZE_MB = 5;

export default function ProductForm({
  product,
  onSuccess,
  onCancel,
}: {
  product?: Product;
  onSuccess: (product: Product) => void;
  onCancel?: () => void;
}) {
  const isEditMode = !!product;

  const createProduct = useProductStore((state) => state.createProduct);
  const updateProduct = useProductStore((state) => state.updateProduct);

  const categories = useCategoryStore((state) => state.categories);
  const fetchCategories = useCategoryStore((state) => state.fetchCategories);

  const [name, setName] = useState(product?.name || "");
  const [shortDescription, setShortDescription] = useState(product?.shortDescription || "");
  const [longDescription, setLongDescription] = useState(product?.longDescription || "");
  const [price, setPrice] = useState(product ? String(product.price) : "");
  const [discountPrice, setDiscountPrice] = useState(
    product?.discountPrice ? String(product.discountPrice) : ""
  );
  const [stock, setStock] = useState(product ? String(product.stock) : "");
  const [selectedSizes, setSelectedSizes] = useState<string[]>(
    [...(product?.sizes || [])].sort((a, b) => ALL_SIZES.indexOf(a) - ALL_SIZES.indexOf(b))
  );
  const [colors, setColors] = useState<string[]>(product?.colors || []);
  const [colorInput, setColorInput] = useState("#000000");
  const [categoryId, setCategoryId] = useState(product?.category._id || "");
  const [isFeatured, setIsFeatured] = useState(product?.isFeatured || false);
  const [isActive, setIsActive] = useState(product?.isActive ?? true);

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [willReplaceImages, setWillReplaceImages] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Custom category dropdown state
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);

  // Custom sizes dropdown state (multi-select)
  const [isSizesOpen, setIsSizesOpen] = useState(false);
  const sizesDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (!categoryId && categories.length > 0) {
      setCategoryId(categories[0]._id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(e.target as Node)) {
        setIsCategoryOpen(false);
      }
      if (sizesDropdownRef.current && !sizesDropdownRef.current.contains(e.target as Node)) {
        setIsSizesOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedCategory = categories.find((cat) => cat._id === categoryId);
  const activeCategories = categories.filter((cat) => cat.isActive);

  const showingExistingImages = isEditMode && !willReplaceImages;
  const displayImages = showingExistingImages
    ? product!.images.map((img) => img.url)
    : imagePreviews;

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) => {
      const next = prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size];
      return next.sort((a, b) => ALL_SIZES.indexOf(a) - ALL_SIZES.indexOf(b));
    });
  };

  const addColor = () => {
    if (colors.includes(colorInput)) return;
    setColors((prev) => [...prev, colorInput]);
  };

  const removeColor = (color: string) => {
    setColors((prev) => prev.filter((c) => c !== color));
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    for (const file of files) {
      if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
        setError(`Each image must be smaller than ${MAX_IMAGE_SIZE_MB}MB`);
        return;
      }
    }

    setError("");
    if (isEditMode && !willReplaceImages) {
      setWillReplaceImages(true);
      setActiveImageIndex(0);
    }
    setImageFiles((prev) => [...prev, ...files]);
    setImagePreviews((prev) => [...prev, ...files.map((file) => URL.createObjectURL(file))]);
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    const updated = imageFiles.filter((_, i) => i !== index);
    setImageFiles(updated);
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    if (isEditMode && updated.length === 0) setWillReplaceImages(false);
    setActiveImageIndex((prev) => (prev >= index && prev > 0 ? prev - 1 : prev));
  };

  const cancelReplaceImages = () => {
    setImageFiles([]);
    setImagePreviews([]);
    setWillReplaceImages(false);
    setActiveImageIndex(0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (selectedSizes.length === 0) {
      setError("Please select at least one size");
      return;
    }
    if (!categoryId) {
      setError("Please select a category");
      return;
    }

    if (isEditMode) {
      if (willReplaceImages && imageFiles.length === 0) {
        setError("Add at least one image or cancel the replacement");
        return;
      }

      const payload: Record<string, any> = {};
      if (name !== product!.name) payload.name = name;
      if (shortDescription !== product!.shortDescription) payload.shortDescription = shortDescription;
      if (longDescription !== product!.longDescription) payload.longDescription = longDescription;
      if (Number(price) !== product!.price) payload.price = Number(price);

      const newDiscount = discountPrice ? Number(discountPrice) : 0;
      if (newDiscount !== product!.discountPrice) payload.discountPrice = newDiscount;

      if (Number(stock) !== product!.stock) payload.stock = Number(stock);
      if (JSON.stringify(selectedSizes) !== JSON.stringify(product!.sizes)) {
        payload.sizes = selectedSizes;
      }
      if (JSON.stringify(colors) !== JSON.stringify(product!.colors)) {
        payload.colors = colors;
      }
      if (isActive !== product!.isActive) payload.isActive = isActive;
      if (isFeatured !== product!.isFeatured) payload.isFeatured = isFeatured;
      if (categoryId !== product!.category._id) payload.category = categoryId;
      if (willReplaceImages && imageFiles.length > 0) {
        payload.images = await toBase64Multiple(imageFiles);
      }

      if (Object.keys(payload).length === 0) {
        setError("No changes to save");
        return;
      }

      setIsSubmitting(true);
      try {
        const updated = await updateProduct(product!._id, payload);
        onSuccess(updated);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to update product");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      if (imageFiles.length === 0) {
        setError("At least one product image is required");
        return;
      }

      setIsSubmitting(true);
      try {
        const base64Images = await toBase64Multiple(imageFiles);
        const created = await createProduct({
          name,
          shortDescription,
          longDescription,
          price: Number(price),
          discountPrice: discountPrice ? Number(discountPrice) : undefined,
          stock: Number(stock),
          sizes: selectedSizes as any,
          colors,
          category: categoryId,
          isFeatured,
          images: base64Images,
        });
        onSuccess(created);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to create product");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const submitLabel = isSubmitting
    ? isEditMode
      ? "Saving..."
      : "Creating product..."
    : isEditMode
    ? "Save Changes"
    : "Create Product";

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 pb-24 sm:pb-0 lg:grid-cols-[1.4fr_1fr]">
      <div className="rounded-[28px] border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-black">General Information</h2>

        <div className="mt-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-black">Product Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Premium Cotton T-Shirt"
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-black outline-none transition focus:border-black focus:bg-white focus:ring-2 focus:ring-black/5"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-black">
              Short Description <span className="text-gray-400">(max 300 chars)</span>
            </label>
            <textarea
              required
              maxLength={300}
              rows={2}
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="One or two lines shown in listings"
              className="w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-black outline-none transition focus:border-black focus:bg-white focus:ring-2 focus:ring-black/5"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-black">Long Description</label>
            <textarea
              required
              rows={5}
              value={longDescription}
              onChange={(e) => setLongDescription(e.target.value)}
              placeholder="Full product details..."
              className="w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-black outline-none transition focus:border-black focus:bg-white focus:ring-2 focus:ring-black/5"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-black">Price</label>
              <input
                type="number"
                required
                min={0}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0"
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-black outline-none transition focus:border-black focus:bg-white focus:ring-2 focus:ring-black/5"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-black">
                Discount
              </label>
              <input
                type="number"
                min={0}
                value={discountPrice}
                onChange={(e) => setDiscountPrice(e.target.value)}
                placeholder="Optional"
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-black outline-none transition focus:border-black focus:bg-white focus:ring-2 focus:ring-black/5"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-black">Stock</label>
              <input
                type="number"
                required
                min={0}
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="0"
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-black outline-none transition focus:border-black focus:bg-white focus:ring-2 focus:ring-black/5"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-black">Available Sizes</label>
            <div ref={sizesDropdownRef} className="relative">
              <button
                type="button"
                onClick={() => setIsSizesOpen((prev) => !prev)}
                className="flex w-full items-center justify-between rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-black focus:bg-white focus:ring-2 focus:ring-black/5"
              >
                <span className={selectedSizes.length > 0 ? "text-black" : "text-gray-400"}>
                  {selectedSizes.length > 0 ? selectedSizes.join(", ") : "Select sizes"}
                </span>
                <ChevronDown
                  size={16}
                  className={`shrink-0 text-gray-400 transition-transform duration-200 ${
                    isSizesOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isSizesOpen && (
                <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-20 max-h-43 overflow-y-auto rounded-2xl border border-gray-100 bg-white p-1.5 shadow-lg">
                  {ALL_SIZES.map((size) => {
                    const isSelected = selectedSizes.includes(size);
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => toggleSize(size)}
                        className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition ${
                          isSelected
                            ? "bg-linear-to-b from-gray-800 via-gray-700 to-black font-semibold text-white"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {size}
                        {isSelected && <Check size={15} className="text-white" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-black">
              Colors <span className="text-gray-400">(optional)</span>
            </label>
            <div className="flex flex-wrap items-center gap-2">
              {colors.map((color) => (
                <span
                  key={color}
                  className="flex items-center gap-2 rounded-full bg-gray-100 py-1.5 pl-1.5 pr-3 text-sm text-black"
                >
                  <span
                    className="h-5 w-5 shrink-0 rounded-full border border-gray-300"
                    style={{ backgroundColor: color }}
                  />
                  {color}
                  <button type="button" onClick={() => removeColor(color)}>
                    <X size={12} />
                  </button>
                </span>
              ))}

              <div className="flex items-center gap-1.5 rounded-full border border-dashed border-gray-300 bg-gray-50 py-1 pl-1 pr-3">
                <input
                  type="color"
                  value={colorInput}
                  onChange={(e) => setColorInput(e.target.value)}
                  className="h-8 w-8 cursor-pointer rounded-full border-none bg-transparent p-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-full [&::-webkit-color-swatch]:border-none"
                />
                <button
                  type="button"
                  onClick={addColor}
                  className="text-sm font-medium text-black hover:underline"
                >
                  Add another color
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 hidden gap-3 border-t border-gray-200 pt-6 sm:flex">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 rounded-2xl bg-gray-100 py-3.5 text-sm font-semibold text-black transition hover:bg-gray-200"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-2xl bg-linear-to-b from-gray-800 via-gray-700 to-black py-3.5 text-sm font-semibold text-white shadow-lg shadow-black/20 transition hover:opacity-90 disabled:opacity-50"
            >
              {submitLabel}
            </button>
          </div>
        </div>
      </div>

      <div className="flex h-full flex-col gap-6">
        <div className="flex flex-1 flex-col rounded-[28px] border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-black">Product Images</h2>
            {isEditMode && willReplaceImages && (
              <button
                type="button"
                onClick={cancelReplaceImages}
                className="flex items-center gap-1 text-xs font-medium text-gray-400 hover:text-black"
              >
                <RotateCcw size={12} />
                Keep original
              </button>
            )}
          </div>

          {isEditMode && willReplaceImages && (
            <p className="mt-2 text-xs text-amber-600">
              These will replace all existing images when saved.
            </p>
          )}

          <div className="mt-4 h-64 w-full overflow-hidden rounded-2xl bg-gray-100">
            {displayImages.length > 0 ? (
              <img
                src={displayImages[activeImageIndex]}
                alt="Main preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center text-gray-300">
                <ImagePlus size={32} />
                <span className="mt-2 text-xs">No image selected</span>
              </div>
            )}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {displayImages.map((src, index) => (
              <div
                key={index}
                onClick={() => setActiveImageIndex(index)}
                className={`group relative h-16 w-16 shrink-0 cursor-pointer overflow-hidden rounded-xl border-2 transition ${
                  index === activeImageIndex ? "border-black" : "border-transparent"
                }`}
              >
                <img src={src} alt={`Preview ${index + 1}`} className="h-full w-full object-cover" />
                {!showingExistingImages && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(index);
                    }}
                    className="absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/70 text-white opacity-0 transition group-hover:opacity-100"
                  >
                    <X size={11} />
                  </button>
                )}
              </div>
            ))}

            <label className="flex h-16 w-16 shrink-0 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 text-gray-400 transition hover:border-black hover:text-black">
              <ImagePlus size={18} />
              <input type="file" accept="image/*" multiple onChange={handleImagesChange} className="hidden" />
            </label>
          </div>

          {!showingExistingImages && (
            <p className="mt-2 text-xs text-gray-400">{imageFiles.length} images added</p>
          )}
        </div>

        {/* Custom styled category dropdown, replacing the native <select> */}
        <div className="rounded-[28px] border border-gray-100 bg-white p-6 shadow-sm">
          <label className="mb-1.5 block text-sm font-medium text-black">Category</label>
          <div ref={categoryDropdownRef} className="relative">
            <button
              type="button"
              onClick={() => setIsCategoryOpen((prev) => !prev)}
              className="flex w-full items-center justify-between rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-black outline-none transition focus:border-black focus:bg-white focus:ring-2 focus:ring-black/5"
            >
              <span className={selectedCategory ? "text-black" : "text-gray-400"}>
                {selectedCategory ? selectedCategory.name : "Select a category"}
              </span>
              <ChevronDown
                size={16}
                className={`shrink-0 text-gray-400 transition-transform duration-200 ${
                  isCategoryOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isCategoryOpen && (
              <div className="absolute bottom-[calc(100%+6px)] left-0 right-0 z-20 max-h-43 overflow-y-auto rounded-2xl border border-gray-100 bg-white p-1.5 shadow-lg">
                {activeCategories.map((cat) => {
                  const isSelected = cat._id === categoryId;
                  return (
                    <button
                      key={cat._id}
                      type="button"
                      onClick={() => {
                        setCategoryId(cat._id);
                        setIsCategoryOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition ${
                        isSelected ? "bg-gray-100 font-semibold text-black" : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {cat.name}
                      {isSelected && <Check size={15} className="text-black" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3 rounded-[28px] border border-gray-100 bg-white p-6 shadow-sm">
          <label className="flex cursor-pointer items-center justify-between">
            <div className="flex items-center gap-2">
              <Star size={17} className="text-gray-400" />
              <span className="text-sm font-medium text-black">Featured Product</span>
            </div>
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="h-5 w-5 accent-black"
            />
          </label>

          {isEditMode && (
            <label className="flex cursor-pointer items-center justify-between border-t border-gray-100 pt-3">
              <span className="text-sm font-medium text-black">Active</span>
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="h-5 w-5 accent-black"
              />
            </label>
          )}
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 flex gap-3 border-t border-gray-200 bg-white p-4 shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.15)] sm:hidden">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-2xl bg-gray-100 py-3.5 text-sm font-semibold text-black transition hover:bg-gray-200"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 rounded-2xl bg-linear-to-b from-gray-800 via-gray-700 to-black py-3.5 text-sm font-semibold text-white shadow-lg shadow-black/20 transition hover:opacity-90 disabled:opacity-50"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}