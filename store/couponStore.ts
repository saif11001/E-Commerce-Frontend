import api from "@/lib/axios";
import { create } from "zustand";

export interface Coupon {
    _id: string,
    code: string,
    discountType: "percentage" | "fixed",
    discountValue: number,
    minOrderAmount: number,
    expiresAt: string,
    usageLimit: number,
    usedCount: number,
    isActive: boolean,
};

interface CreateCouponPayload {
    code: string,
    discountType: "percentage" | "fixed",
    discountValue: number,
    minOrderAmount: number,
    expiresAt: string,
    usageLimit: number,
};

type UpdateCouponPayload = Partial<{
    code: string,
    discountType: "percentage" | "fixed",
    discountValue: number,
    minOrderAmount: number,
    expiresAt: string,
    usageLimit: number,
    usedCount: number,
    isActive: boolean,
}>;

export interface CouponStore {
    coupons: Coupon[],
    isLoading: boolean,
    error: string,

    fetchCoupons: () => Promise<void>,
    createCoupon: (payload: CreateCouponPayload) => Promise<Coupon>;
    updateCoupon: (couponId: string, payload: UpdateCouponPayload) => Promise<Coupon>;
    deleteCoupon: (couponId: string,) => Promise<void>;
}

export const useCouponStore = create<CouponStore>((set) => ({
    coupons: [],
    isLoading: false,
    error: "",
    
    fetchCoupons: async () => {
        set({ isLoading: true, error: "" });
        try {
            const { data } = await api.get("/admin/coupon");
            set({ coupons: data.coupons }); 
        } catch (error: any) {
            set({ error: error.response?.data?.message || "Failed to load coupons" });
        } finally {
            set({ isLoading: false });
        }
    },

    createCoupon: async (payload) => {
        const { data } = await api.post("/admin/coupon", payload)
        set((state) => ({ coupons: [data.coupon, ...state.coupons] }));
        return data.coupon;
    },
    
    updateCoupon: async (couponId, payload) => {
        const { data } = await api.patch(`/admin/coupon/${couponId}`, payload);
        set((state) => ({
            coupons: state.coupons.map((c) => (c._id === couponId ? data.coupon : c))
        }))
        return data.coupon;
    },

    deleteCoupon: async (couponId) => {
        await api.delete(`/admin/coupon/${couponId}`);
        set((state) => ({
            coupons: state.coupons.filter((c) => c._id !== couponId),
        }));
    },

}))