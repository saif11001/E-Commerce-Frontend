import { create } from "zustand";
import api from "@/lib/axios";

export type AdminUser = {
    _id: string;
    name: string;
    email: string;
    image?: { url?: string };
    role: "user" | "manager" | "support" | "admin";
    isVerified: boolean;
    lastLogin?: string;
    createdAt: string;
};

export type UsersPagination = {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
};

export type UserOrder = {
    _id: string;
    items: { name: string; quantity: number }[];
    totalPrice: number;
    orderStatus: string;
    paymentMethod: string;
    isPaid: boolean;
    createdAt: string;
};

export type UserStats = {
    totalOrders: number;
    totalSpent: number;
    lastOrderAt: string | null;
};

export type UserDetails = {
    orders: UserOrder[];
    stats: UserStats;
};

type AdminUserState = {
    users: AdminUser[];
    pagination: UsersPagination;
    isLoading: boolean;
    isMutating: boolean;
    error: string | null;

    userDetails: UserDetails | null;
    isDetailsLoading: boolean;
    detailsError: string | null;

    fetchUsers: (page?: number) => Promise<void>;
    fetchUserDetails: (userId: string) => Promise<void>;
    clearUserDetails: () => void;
    deleteUser: (userId: string) => Promise<void>;
    deleteAllUsers: () => Promise<string>;
};

const LIMIT = 10;

// Ignores stale responses when the admin clicks through users quickly
let detailsRequestId = 0;

export const useAdminUserStore = create<AdminUserState>((set, get) => ({
    users: [],
    pagination: { total: 0, page: 1, limit: LIMIT, totalPages: 1 },
    isLoading: false,
    isMutating: false,
    error: null,

    userDetails: null,
    isDetailsLoading: false,
    detailsError: null,

    fetchUsers: async (page = 1) => {
        set({ isLoading: true, error: null });
        try {
            const { data } = await api.get("/admin/users", { params: { page, limit: LIMIT } });
            set({ users: data.users, pagination: data.pagination });
        } catch (err: any) {
            set({ error: err.response?.data?.message || "Failed to load users" });
        } finally {
            set({ isLoading: false });
        }
    },

    fetchUserDetails: async (userId) => {
        const requestId = ++detailsRequestId;
        set({ isDetailsLoading: true, detailsError: null, userDetails: null });
        try {
            const { data } = await api.get(`/admin/user/${userId}/details`);
            if (requestId !== detailsRequestId) return;
            set({ userDetails: { orders: data.orders, stats: data.stats } });
        } catch (err: any) {
            if (requestId !== detailsRequestId) return;
            set({ detailsError: err.response?.data?.message || "Failed to load user details" });
        } finally {
            if (requestId === detailsRequestId) set({ isDetailsLoading: false });
        }
    },

    clearUserDetails: () => {
        detailsRequestId++;
        set({ userDetails: null, isDetailsLoading: false, detailsError: null });
    },

    deleteUser: async (userId) => {
        set({ isMutating: true });
        try {
            await api.delete(`/admin/user/${userId}`);

            // If that was the last user on this page, go back one page
            const { users, pagination, fetchUsers } = get();
            const nextPage =
                users.length === 1 && pagination.page > 1 ? pagination.page - 1 : pagination.page;
            await fetchUsers(nextPage);
        } finally {
            set({ isMutating: false });
        }
    },

    deleteAllUsers: async () => {
        set({ isMutating: true });
        try {
            const { data } = await api.delete("/admin/users");
            await get().fetchUsers(1);
            return data.message as string;
        } finally {
            set({ isMutating: false });
        }
    },
}));