import { create } from "zustand";
import api from "@/lib/axios";

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
  image: {
    url: string;
    public_id: string;
  };
}

interface CreateCategoryPayload {
  name: string;
  description: string;
  image: string;
}

type UpdateCategoryPayload = Partial<{
  name: string;
  description: string;
  isActive: boolean;
  image: string;
}>;

export interface CategoryStore {
  categories: Category[];
  isLoading: boolean;
  error: string;
  hasFetched: boolean;

  fetchCategories: () => Promise<void>;
  createCategory: (payload: CreateCategoryPayload) => Promise<Category>;
  updateCategory: (categoryId: string, payload: UpdateCategoryPayload) => Promise<Category>;
  deleteCategory: (categoryId: string) => Promise<void>;
}

export const useCategoryStore = create<CategoryStore>((set, get) => ({
  categories: [],
  isLoading: false,
  error: "",
  hasFetched: false,

  fetchCategories: async () => {
    if (get().hasFetched) return;

    set({ isLoading: true, error: "" });
    try {
      const { data } = await api.get("/categories");
      set({ categories: data.categories, hasFetched: true });
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to load categories" });
    } finally {
      set({ isLoading: false });
    }
  },

  createCategory: async (payload) => {
    const { data } = await api.post("/categories", payload);
    set((state) => ({ categories: [data.category, ...state.categories] }));
    return data.category;
  },

  updateCategory: async (categoryId, payload) => {
    const { data } = await api.patch(`/categories/${categoryId}`, payload);
    set((state) => ({
      categories: state.categories.map((c) => (c._id === categoryId ? data.category : c)),
    }));
    return data.category;
  },

  deleteCategory: async (categoryId) => {
    await api.delete(`/categories/${categoryId}`);
    set((state) => ({
      categories: state.categories.filter((c) => c._id !== categoryId),
    }));
  },
}));