import api from "@/lib/axios";
import { create } from "zustand";

interface ProductCategory {
    _id: string,
    name: string,
    slug: string,
};

type ProductSize = 'One Size' | 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | '3XL' | '4XL' | '30' | '32' | '34' | '36' | '38' | '40' | '42' | '44' | '46' | '48' | '50';

type ProductImage = {
    url: string,
    public_id: string,
};

type Pagination = {
    total: number,
    page: number,
    limit: number,
    totalPages: number,
};

export interface Product {
    _id: string,
    name: string,
    shortDescription: string,
    longDescription: string,
    price: number,
    discountPrice: number,
    images: ProductImage[],
    category: ProductCategory,
    stock: number,
    sizes: ProductSize[],
    colors: string[],
    isFeatured: boolean,
    isActive: boolean,
    sold: number,
};

interface CreateProductPayload {
    name: string,
    shortDescription: string,
    longDescription: string,
    price: number,
    discountPrice?: number,
    images: string[],
    category: string,
    stock: number,
    sizes: ProductSize[],
    colors: string[],
    isFeatured: boolean,
};

type UpdateProductPayload = Partial<{
    name: string,
    shortDescription: string,
    longDescription: string,
    price: number,
    discountPrice: number,
    images: string[],
    category: string,
    stock: number,
    sizes: ProductSize[],
    colors: string[],
    isFeatured: boolean,
    isActive: boolean,
    sold: number,
}>;

export interface ProductStore {
    products: Product[],
    pagination: Pagination,
    currentProduct: Product | null,
    isLoading: boolean,
    error: string,

    fetchProducts: (page?: number) => Promise<void>;
    fetchProductById: (_id: string) => Promise<void>;
    createProduct: (payload: CreateProductPayload) => Promise<Product>;
    updateProduct: (_id: string, payload: UpdateProductPayload) => Promise<Product>;
    deleteProduct: (_id: string) => Promise<void>
};

export const useProductStore = create<ProductStore>((set) => ({
    products: [],
    pagination: {
        total: 0,
        page: 1,
        limit: 8,
        totalPages: 0,
    },
    currentProduct: null,
    isLoading: false,
    error: "",

    fetchProducts: async (page) => {
        set({ isLoading: true, error: "" });
        try {
            const { data } = await api.get("/admin/products/", { params: { page } });
            set({ products: data.products, pagination: data.pagination });
        } catch (error: any) {
            set({ error: error.response?.data?.message || "Failed to load products" });
        } finally {
            set({ isLoading: false });
        }
    },
    fetchProductById: async (productId) => {
        set({ isLoading: true, error: "" });
        try {
            const { data } = await api.get(`/admin/products/${productId}`);
            set({ currentProduct: data.product });
        } catch (error: any) {
            set({ error: error.response?.data?.message || "Failed to load product" });
        } finally {
            set({ isLoading: false });
        }
    },
    createProduct: async (payload) => {
        const { data } = await api.post("/admin/products/", payload);
        set((state) => ({ products: [data.product, ...state.products] }));
        return data.product;
    },
    updateProduct: async (productId, payload) => {
        const { data } = await api.patch(`/admin/products/${productId}`, payload);
        set((state) => ({
            products: state.products.map((product) => (product._id === productId ? data.product : product))
        }))
        return data.product;
    },
    deleteProduct: async (productId) => {
        await api.delete(`/admin/products/${productId}`);
        set((state) => ({
            products: state.products.filter((product) => product._id !== productId),
        }));
    }
}))

