"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useShippingZoneStore, ShippingZone } from "@/store/shippingZoneStore";

type ShippingZoneModalProps = {
    zone: ShippingZone | null;
    onClose: () => void;
};

export default function ShippingZoneModal({ zone, onClose }: ShippingZoneModalProps) {
    const { createZone, updateZone, isMutating } = useShippingZoneStore();

    const [governorate, setGovernorate] = useState("");
    const [shippingCost, setShippingCost] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (zone) {
            setGovernorate(zone.governorate);
            setShippingCost(String(zone.shippingCost));
        }
    }, [zone]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!governorate.trim() || shippingCost === "") {
            setError("Please fill in all fields");
            return;
        }

        try {
            if (zone) {
                await updateZone(zone._id, {
                    governorate: governorate.trim(),
                    shippingCost: Number(shippingCost),
                });
            } else {
                await createZone({
                    governorate: governorate.trim(),
                    shippingCost: Number(shippingCost),
                });
            }
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.message || "Something went wrong");
        }
    };

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 px-6"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl"
            >
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-extrabold text-black">
                        {zone ? "Edit Shipping Zone" : "Add Shipping Zone"}
                    </h3>
                    <button
                        onClick={onClose}
                        className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100"
                    >
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
                    <div>
                        <label className="mb-1.5 block text-xs font-semibold text-gray-500">
                            Governorate
                        </label>
                        <input
                            value={governorate}
                            onChange={(e) => setGovernorate(e.target.value)}
                            placeholder="e.g. Cairo"
                            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-black outline-none focus:border-black"
                        />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-xs font-semibold text-gray-500">
                            Shipping Cost (E£)
                        </label>
                        <input
                            type="number"
                            min="0"
                            value={shippingCost}
                            onChange={(e) => setShippingCost(e.target.value)}
                            placeholder="e.g. 50"
                            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-black outline-none focus:border-black"
                        />
                    </div>

                    {error && <p className="text-xs font-medium text-red-500">{error}</p>}

                    <button
                        type="submit"
                        disabled={isMutating}
                        className="mt-1 w-full rounded-2xl bg-linear-to-b from-gray-800 via-gray-700 to-black py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
                    >
                        {isMutating ? "Saving..." : zone ? "Save Changes" : "Add Zone"}
                    </button>
                </form>
            </div>
        </div>
    );
}