import { create } from "zustand";
import api from "@/lib/axios";

type CartProduct = {
    _id: string;
    name: string;
    price: number;
    discountPrice: number;
    images: { url: string }[];
    stock: number;
    isActive: boolean;
};

type CartItem = {
    _id: string;
    product: CartProduct;
    size: string;
    quantity: number;
};

type CartSummary = {
    itemsPrice: number;
    discount: number;
    shippingCost: number;
    totalPrice: number;
};

type CartCoupon = {
    code: string;
    discountType: "percentage" | "fixed";
    discountValue: number;
} | null;

type CartState = {
    items: CartItem[];
    coupon: CartCoupon;
    summary: CartSummary;
    isLoading: boolean;
    isMutating: boolean;
    error: string | null;

    isDrawerOpen: boolean;
    openDrawer: () => void;
    closeDrawer: () => void;

    fetchCart: (governorate?: string) => Promise<void>;
    addItem: (productId: string, size: string, quantity?: number) => Promise<void>;
    updateItemQuantity: (itemId: string, action: "increase" | "decrease") => Promise<void>;
    removeItem: (itemId: string) => Promise<void>;
    clearCart: () => Promise<void>;
    resetCart: () => void;
    applyCoupon: (code: string) => Promise<void>;
    removeCoupon: () => Promise<void>;
};

const emptySummary: CartSummary = {
    itemsPrice: 0,
    discount: 0,
    shippingCost: 0,
    totalPrice: 0,
};

const applyCartResponse = (data: any) => ({
    items: data.cart.cart.items as CartItem[],
    coupon: data.cart.cart.coupon as CartCoupon,
    summary: data.cart.summary as CartSummary,
});

export const useCartStore = create<CartState>((set, get) => ({
    items: [],
    coupon: null,
    summary: emptySummary,
    isLoading: false,
    isMutating: false,
    error: null,

    isDrawerOpen: false,
    openDrawer: () => set({ isDrawerOpen: true }),
    closeDrawer: () => set({ isDrawerOpen: false }),

    fetchCart: async (governorate) => {
        const isInitialLoad = get().items.length === 0 && !get().summary.itemsPrice;
        set(isInitialLoad ? { isLoading: true, error: null } : { isMutating: true, error: null });
        try {
            const { data } = await api.get("/cart", {
                params: governorate ? { governorate } : undefined,
            });
            set({ ...applyCartResponse(data), isLoading: false, isMutating: false });
        } catch (err: any) {
            set({
                isLoading: false,
                isMutating: false,
                error: err?.response?.data?.message || "Failed to load cart",
            });
        }
    },

    addItem: async (productId, size, quantity = 1) => {
        set({ isMutating: true, error: null });
        try {
            let data;
            for (let i = 0; i < quantity; i++) {
                const res = await api.post("/cart/items", { productId, size });
                data = res.data;
            }
            set({ ...applyCartResponse(data), isMutating: false, isDrawerOpen: true });
        } catch (err: any) {
            set({
                isMutating: false,
                error: err?.response?.data?.message || "Failed to add item",
            });
            throw err;
        }
    },

    updateItemQuantity: async (itemId, action) => {
        set({ isMutating: true, error: null });
        try {
            const { data } = await api.patch(`/cart/items/${itemId}`, { action });
            set({ ...applyCartResponse(data), isMutating: false });
        } catch (err: any) {
            set({
                isMutating: false,
                error: err?.response?.data?.message || "Failed to update quantity",
            });
        }
    },

    removeItem: async (itemId) => {
        set({ isMutating: true, error: null });
        try {
            const { data } = await api.delete(`/cart/items/${itemId}`);
            set({ ...applyCartResponse(data), isMutating: false });
        } catch (err: any) {
            set({
                isMutating: false,
                error: err?.response?.data?.message || "Failed to remove item",
            });
        }
    },

    clearCart: async () => {
        set({ isMutating: true, error: null });
        try {
            const { data } = await api.delete("/cart");
            set({ ...applyCartResponse(data), isMutating: false });
        } catch (err: any) {
            set({
                isMutating: false,
                error: err?.response?.data?.message || "Failed to clear cart",
            });
        }
    },

    resetCart: () => {
        set({
            items: [],
            coupon: null,
            summary: emptySummary,
            isMutating: false,
            error: null,
        });
    },

    applyCoupon: async (code) => {
        set({ isMutating: true, error: null });
        try {
            const { data } = await api.post("/cart/apply-coupon", { code });
            set({ ...applyCartResponse(data), isMutating: false });
        } catch (err: any) {
            set({
                isMutating: false,
                error: err?.response?.data?.message || "Failed to apply coupon",
            });
            throw err;
        }
    },

    removeCoupon: async () => {
        set({ isMutating: true, error: null });
        try {
            const { data } = await api.delete("/cart/coupon");
            set({ ...applyCartResponse(data), isMutating: false });
        } catch (err: any) {
            set({
                isMutating: false,
                error: err?.response?.data?.message || "Failed to remove coupon",
            });
        }
    },
}));

export const useCartCount = () =>
    useCartStore((state) => state.items.reduce((sum, item) => sum + item.quantity, 0));