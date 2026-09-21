import { create } from "zustand";
import api from "@/lib/axios";

export type AdminOrderItem = {
    product: { _id: string; name: string; slug: string } | null;
    name: string;
    price: number;
    quantity: number;
    size: string;
    image: string;
};

export type AdminOrder = {
    _id: string;
    user: string | null;
    items: AdminOrderItem[];
    shippingInfo: {
        fullName: string;
        email: string;
        phone: string;
        address: string;
        city: string;
        governorate: string;
        notes?: string;
    };
    paymentMethod: "cod" | "stripe";
    isPaid: boolean;
    itemsPrice: number;
    shippingPrice: number;
    totalPrice: number;
    orderStatus: string;
    coupon: { code: string | null; discount: number };
    createdAt: string;
};

type Pagination = { total: number; page: number; limit: number; totalPages: number };

interface AdminOrderStore {
    orders: AdminOrder[];
    pagination: Pagination;
    isLoading: boolean;
    error: string | null;

    orderDetails: AdminOrder | null;
    isDetailsLoading: boolean;
    detailsError: string | null;
    isUpdatingStatus: boolean;

    fetchOrders: (page?: number, status?: string) => Promise<void>;
    fetchOrderDetails: (id: string) => Promise<void>;
    clearOrderDetails: () => void;
    updateOrderStatus: (id: string, orderStatus: string) => Promise<void>;
}

export const useAdminOrderStore = create<AdminOrderStore>((set, get) => ({
    orders: [],
    pagination: { total: 0, page: 1, limit: 10, totalPages: 0 },
    isLoading: false,
    error: null,

    orderDetails: null,
    isDetailsLoading: false,
    detailsError: null,
    isUpdatingStatus: false,

    fetchOrders: async (page = 1, status) => {
        set({ isLoading: true, error: null });
        try {
            const { data } = await api.get("/admin/orders", {
                params: { page, ...(status ? { status } : {}) },
            });
            set({ orders: data.orders, pagination: data.pagination });
        } catch (err: any) {
            set({ error: err.response?.data?.message || "Failed to load orders" });
        } finally {
            set({ isLoading: false });
        }
    },

    fetchOrderDetails: async (id) => {
        set({ isDetailsLoading: true, detailsError: null });
        try {
            const { data } = await api.get(`/admin/orders/${id}`);
            set({ orderDetails: data.order });
        } catch (err: any) {
            set({ detailsError: err.response?.data?.message || "Failed to load order" });
        } finally {
            set({ isDetailsLoading: false });
        }
    },

    clearOrderDetails: () => set({ orderDetails: null, detailsError: null }),

    updateOrderStatus: async (id, orderStatus) => {
        set({ isUpdatingStatus: true });
        try {
            const { data } = await api.patch(`/admin/orders/${id}/status`, { orderStatus });
            set({
                orderDetails: data.order,
                orders: get().orders.map((o) => (o._id === id ? data.order : o)),
            });
        } catch (err: any) {
            throw err;
        } finally {
            set({ isUpdatingStatus: false });
        }
    },
}));