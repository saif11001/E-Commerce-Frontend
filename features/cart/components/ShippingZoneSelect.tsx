"use client";

import { useEffect, useRef, useState } from "react";
import { Truck, ChevronDown, Check } from "lucide-react";
import api from "@/lib/axios";

type ShippingZone = {
    _id: string;
    governorate: string;
    shippingCost: number;
};

type ShippingZoneSelectProps = {
    value: string;
    onChange: (governorate: string) => void;
};

export default function ShippingZoneSelect({ value, onChange }: ShippingZoneSelectProps) {
    const [zones, setZones] = useState<ShippingZone[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        api
            .get("/shippingZone")
            .then(({ data }) => setZones(data.zones || []))
            .catch(() => setZones([]));
    }, []);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (governorate: string) => {
        onChange(governorate);
        setIsOpen(false);
    };

    const selectedZone = zones.find((z) => z.governorate === value);

    return (
        <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-gray-500">
                <Truck size={13} />
                Shipping to
            </label>

            <div ref={dropdownRef} className="relative">
                <button
                    type="button"
                    onClick={() => setIsOpen((prev) => !prev)}
                    className="flex w-full items-center justify-between rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-black focus:bg-white focus:ring-2 focus:ring-black/5"
                >
                    <span className={selectedZone ? "text-black" : "text-gray-400"}>
                        {selectedZone
                            ? `${selectedZone.governorate} — E£: ${selectedZone.shippingCost}`
                            : "Select governorate"}
                    </span>
                    <ChevronDown
                        size={16}
                        className={`shrink-0 text-gray-400 transition-transform duration-200 ${
                            isOpen ? "rotate-180" : ""
                        }`}
                    />
                </button>

                {isOpen && (
                    <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-20 max-h-43 overflow-y-auto rounded-2xl border border-gray-100 bg-white p-1.5 shadow-lg">
                        {zones.map((zone) => {
                            const isSelected = zone.governorate === value;
                            return (
                                <button
                                    key={zone._id}
                                    type="button"
                                    onClick={() => handleSelect(zone.governorate)}
                                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition ${
                                        isSelected
                                            ? "bg-gray-100 font-semibold text-black"
                                            : "text-gray-600 hover:bg-gray-50"
                                    }`}
                                >
                                    {zone.governorate} — E£: {zone.shippingCost}
                                    {isSelected && <Check size={15} className="text-black" />}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {!value && (
                <p className="mt-1.5 text-xs text-gray-400">
                    Select your governorate to see shipping cost
                </p>
            )}
        </div>
    );
}