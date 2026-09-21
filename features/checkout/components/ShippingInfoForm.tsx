"use client";

import { Truck as TruckIcon } from "lucide-react";
import ShippingZoneSelect from "@/features/cart/components/ShippingZoneSelect";

export type ShippingInfo = {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    governorate: string;
    notes: string;
};

type ShippingInfoFormProps = {
    shippingInfo: ShippingInfo;
    onChange: (field: keyof ShippingInfo, value: string) => void;
};

export default function ShippingInfoForm({ shippingInfo, onChange }: ShippingInfoFormProps) {
    return (
        <>
            <h2 className="flex items-center gap-2 text-lg font-extrabold text-black">
                <TruckIcon size={18} />
                Shipping Information
            </h2>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                    <label className="mb-1.5 block text-sm font-medium text-black">Full Name</label>
                    <input
                        required
                        value={shippingInfo.fullName}
                        onChange={(e) => onChange("fullName", e.target.value)}
                        className="w-full rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-black outline-none transition focus:border-black focus:bg-white focus:ring-2 focus:ring-black/5"
                    />
                </div>

                <div>
                    <label className="mb-1.5 block text-sm font-medium text-black">Email</label>
                    <input
                        required
                        type="email"
                        value={shippingInfo.email}
                        onChange={(e) => onChange("email", e.target.value)}
                        className="w-full rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-black outline-none transition focus:border-black focus:bg-white focus:ring-2 focus:ring-black/5"
                    />
                </div>

                <div>
                    <label className="mb-1.5 block text-sm font-medium text-black">Phone</label>
                    <input
                        required
                        value={shippingInfo.phone}
                        onChange={(e) => onChange("phone", e.target.value)}
                        className="w-full rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-black outline-none transition focus:border-black focus:bg-white focus:ring-2 focus:ring-black/5"
                    />
                </div>

                <ShippingZoneSelect
                    value={shippingInfo.governorate}
                    onChange={(value) => onChange("governorate", value)}
                />

                <div>
                    <label className="mb-1.5 block text-sm font-medium text-black">City</label>
                    <input
                        required
                        value={shippingInfo.city}
                        onChange={(e) => onChange("city", e.target.value)}
                        className="w-full rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-black outline-none transition focus:border-black focus:bg-white focus:ring-2 focus:ring-black/5"
                    />
                </div>

                <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-sm font-medium text-black">Address</label>
                    <input
                        required
                        value={shippingInfo.address}
                        onChange={(e) => onChange("address", e.target.value)}
                        className="w-full rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-black outline-none transition focus:border-black focus:bg-white focus:ring-2 focus:ring-black/5"
                    />
                </div>

                <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-sm font-medium text-black">
                        Notes <span className="text-gray-400">(optional)</span>
                    </label>
                    <textarea
                        rows={2}
                        value={shippingInfo.notes}
                        onChange={(e) => onChange("notes", e.target.value)}
                        className="w-full resize-none rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-black outline-none transition focus:border-black focus:bg-white focus:ring-2 focus:ring-black/5"
                    />
                </div>
            </div>
        </>
    );
}