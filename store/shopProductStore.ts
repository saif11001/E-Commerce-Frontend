import api from "@/lib/axios";
import { create } from "zustand";

interface ShopProductCategory {
    _id: string;
    name: string;
    slug: string;
}

type ProductImage = {
    url: string;
    public_id: string;
};

type Pagination = {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
};

export interface ShopProduct {
    _id: string;
    name: string;
    slug: string;
    shortDescription: string;
    longDescription: string;
    price: number;
    discountPrice: number;
    images: ProductImage[];
    category: ShopProductCategory;
    sizes: string[];
    colors: string[];
    isFeatured: boolean;
    isActive: boolean;
}

interface FetchProductsParams {
    page?: number;
    limit?: number;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    category?: string;
}

interface ShopProductStore {
    products: ShopProduct[];
    pagination: Pagination;
    featuredProducts: ShopProduct[];
    currentProduct: ShopProduct | null;
    isLoading: boolean;
    error: string;

    fetchProducts: (params?: FetchProductsParams) => Promise<void>;
    fetchFeaturedProducts: () => Promise<void>;
    fetchProductBySlug: (slug: string) => Promise<void>;
}

export const useShopProductStore = create<ShopProductStore>((set) => ({
    products: [],
    pagination: {
        total: 0,
        page: 1,
        limit: 12,
        totalPages: 0,
    },
    featuredProducts: [],
    currentProduct: null,
    isLoading: false,
    error: "",

    fetchProducts: async (params = {}) => {
        set({ isLoading: true, error: "" });
        try {
            const { data } = await api.get("/products", { params });
            set({ products: data.products, pagination: data.pagination });
        } catch (error: any) {
            set({ error: error.response?.data?.message || "Failed to load products" });
        } finally {
            set({ isLoading: false });
        }
    },

    fetchFeaturedProducts: async () => {
        set({ isLoading: true, error: "" });
        try {
            const { data } = await api.get("/products/featured");
            set({ featuredProducts: data.products });
        } catch (error: any) {
            set({ error: error.response?.data?.message || "Failed to load featured products" });
        } finally {
            set({ isLoading: false });
        }
    },

    fetchProductBySlug: async (slug) => {
        set({ isLoading: true, error: "", currentProduct: null });
        try {
            const { data } = await api.get(`/products/${slug}`);
            set({ currentProduct: data.product });
        } catch (error: any) {
            set({ error: error.response?.data?.message || "Failed to load product" });
        } finally {
            set({ isLoading: false });
        }
    },
}));