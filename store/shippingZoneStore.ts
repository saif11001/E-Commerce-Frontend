import { create } from "zustand";
import api from "@/lib/axios";

export interface ShippingZone {
    _id: string;
    governorate: string;
    shippingCost: number;
    isActive: boolean;
}

interface ShippingZoneStore {
    zones: ShippingZone[];
    isLoading: boolean;
    isMutating: boolean;
    error: string;

    fetchZones: () => Promise<void>;
    createZone: (data: { governorate: string; shippingCost: number }) => Promise<void>;
    updateZone: (
        id: string,
        data: Partial<{ governorate: string; shippingCost: number; isActive: boolean }>
    ) => Promise<void>;
    deleteZone: (id: string) => Promise<void>;
}

export const useShippingZoneStore = create<ShippingZoneStore>((set, get) => ({
    zones: [],
    isLoading: false,
    isMutating: false,
    error: "",

    fetchZones: async () => {
        set({ isLoading: true, error: "" });
        try {
            const { data } = await api.get("/admin/shippingZone");
            set({ zones: data.zones });
        } catch (error: any) {
            set({ error: error.response?.data?.message || "Failed to load shipping zones" });
        } finally {
            set({ isLoading: false });
        }
    },

    createZone: async ({ governorate, shippingCost }) => {
        set({ isMutating: true, error: "" });
        try {
            const { data } = await api.post("/admin/shippingZone", { governorate, shippingCost });
            set({ zones: [...get().zones, data.zone] });
        } catch (error: any) {
            set({ error: error.response?.data?.message || "Failed to create shipping zone" });
            throw error;
        } finally {
            set({ isMutating: false });
        }
    },

    updateZone: async (id, updates) => {
        set({ isMutating: true, error: "" });
        try {
            const { data } = await api.patch(`/admin/shippingZone/${id}`, updates);
            set({
                zones: get().zones.map((zone) => (zone._id === id ? data.zone : zone)),
            });
        } catch (error: any) {
            set({ error: error.response?.data?.message || "Failed to update shipping zone" });
            throw error;
        } finally {
            set({ isMutating: false });
        }
    },

    deleteZone: async (id) => {
        set({ isMutating: true, error: "" });
        try {
            await api.delete(`/admin/shippingZone/${id}`);
            set({ zones: get().zones.filter((zone) => zone._id !== id) });
        } catch (error: any) {
            set({ error: error.response?.data?.message || "Failed to delete shipping zone" });
            throw error;
        } finally {
            set({ isMutating: false });
        }
    },
}));