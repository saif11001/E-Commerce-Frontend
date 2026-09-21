import { create } from "zustand";
import api from "@/lib/axios";

export interface Analytics {
    overview: {
        totalUsers: number;
        totalProducts: number;
        totalCategories: number;
        totalOrders: number;
        totalRevenue: number;
    };
    ordersByStatus: { _id: string; count: number }[];
    sales: {
        last7Days: { _id: string; revenue: number; orders: number }[];
        last30Days: { _id: string; revenue: number; orders: number }[];
    };
    topProducts: {
        _id: string;
        name: string;
        sold: number;
        price: number;
        images: { url: string }[];
    }[];
    lowStockProducts: {
        _id: string;
        name: string;
        stock: number;
        price: number;
        images: { url: string }[];
    }[];
    recentOrders: {
        _id: string;
        user: { name: string; email: string } | null;
        shippingInfo: { fullName: string; email: string };
        totalPrice: number;
        orderStatus: string;
        paymentMethod: string;
        createdAt: string;
    }[];
    users: {
        newLast7Days: number;
        newLast30Days: number;
        byRole: { _id: string; count: number }[];
    };
    revenueByCategory: { _id: string; revenue: number; unitsSold: number }[];
    paymentMethodBreakdown: { _id: string; count: number; revenue: number }[];
    couponUsageStats: { _id: string; timesUsed: number; totalDiscountGiven: number }[];
}

interface AnalyticsStore {
    analytics: Analytics | null;
    isLoading: boolean;
    error: string | null;
    fetchAnalytics: () => Promise<void>;
}

export const useAnalyticsStore = create<AnalyticsStore>((set) => ({
    analytics: null,
    isLoading: false,
    error: null,

    fetchAnalytics: async () => {
        set({ isLoading: true, error: null });
        try {
            const { data } = await api.get("/admin/analytics");
            set({ analytics: data.analytics });
        } catch (err: any) {
            set({ error: err.response?.data?.message || "Failed to load analytics" });
        } finally {
            set({ isLoading: false });
        }
    },
}));