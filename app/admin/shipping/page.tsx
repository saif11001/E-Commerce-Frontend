"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Plus, Pencil, Trash2, Truck } from "lucide-react";
import { useShippingZoneStore, ShippingZone } from "@/store/shippingZoneStore";
import ShippingZoneModal from "@/features/admin/shipping/components/ShippingZoneModal";
import Loading from "@/components/ui/Loading";

export default function ShippingZonesPage() {
    const searchParams = useSearchParams();
    const { zones, isLoading, isMutating, fetchZones, updateZone, deleteZone } =
        useShippingZoneStore();

    const [modalZone, setModalZone] = useState<ShippingZone | null | undefined>(undefined);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // Click-and-drag scrolling for the zones list (mouse only —
    // touch already scrolls natively, this just adds the same feel for mouse users).
    const listRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);
    const startY = useRef(0);
    const startScrollTop = useRef(0);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!listRef.current) return;
        isDragging.current = true;
        startY.current = e.pageY - listRef.current.offsetTop;
        startScrollTop.current = listRef.current.scrollTop;
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging.current || !listRef.current) return;
        e.preventDefault();
        const y = e.pageY - listRef.current.offsetTop;
        const walk = y - startY.current;
        listRef.current.scrollTop = startScrollTop.current - walk;
    };

    const stopDragging = () => {
        isDragging.current = false;
    };

    useEffect(() => {
        fetchZones();
    }, [fetchZones]);

    useEffect(() => {
        if (searchParams.get("action") === "add") {
            setModalZone(null);
        }
    }, [searchParams]);

    const handleToggleActive = (zone: ShippingZone) => {
        updateZone(zone._id, { isActive: !zone.isActive });
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this shipping zone?")) return;
        setDeletingId(id);
        try {
            await deleteZone(id);
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="p-4 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-xl font-extrabold text-black sm:text-2xl">Shipping Zones</h1>
                    <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                        Manage governorates and their shipping costs
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => setModalZone(null)}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-b from-gray-800 via-gray-700 to-black px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-black/20 transition hover:opacity-90 sm:w-auto"
                >
                    <Plus size={17} />
                    Add Zone
                </button>
            </div>

            <div className="mt-6 sm:mt-8">
                <div className="flex h-125 w-full min-w-0 flex-col rounded-[28px] bg-white p-4 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] ring-1 ring-black/5 sm:h-[70vh] sm:p-6">
                    <div className="flex shrink-0 items-center justify-between">
                        <h2 className="text-sm font-semibold text-black">All Zones</h2>
                        <span className="text-xs text-gray-400">{zones.length} zones</span>
                    </div>

                    <div
                        ref={listRef}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={stopDragging}
                        onMouseLeave={stopDragging}
                        className="mt-4 min-h-0 flex-1 cursor-grab select-none overflow-y-auto [-ms-overflow-style:none] scrollbar-none active:cursor-grabbing [&::-webkit-scrollbar]:hidden"
                    >
                        {isLoading ? (
                            <div className="flex h-full items-center justify-center">
                                <Loading />
                            </div>
                        ) : zones.length === 0 ? (
                            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                                <Truck size={32} className="text-gray-300" />
                                <p className="text-sm text-gray-500">No shipping zones added yet</p>
                            </div>
                        ) : (
                            <div className="flex flex-col divide-y divide-gray-100">
                                {zones.map((zone) => (
                                    <div
                                        key={zone._id}
                                        className="flex items-center gap-8 px-2 py-4 transition hover:bg-gray-50 sm:px-3"
                                    >
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-semibold text-black">
                                                {zone.governorate}
                                            </p>
                                            <p className="mt-0.5 text-xs text-gray-500">
                                                E£ {zone.shippingCost}
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => handleToggleActive(zone)}
                                            disabled={isMutating}
                                            className={`relative h-6 w-11 shrink-0 rounded-full transition disabled:opacity-50 ${
                                                zone.isActive
                                                    ? "bg-linear-to-b from-gray-800 via-gray-700 to-black"
                                                    : "bg-gray-200"
                                            }`}
                                        >
                                            <span
                                                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
                                                    zone.isActive ? "left-5.5" : "left-0.5"
                                                }`}
                                            />
                                        </button>

                                        <div className="flex shrink-0 items-center gap-7">
                                            <button
                                                type="button"
                                                onClick={() => setModalZone(zone)}
                                                className="flex items-center gap-1.5 text-sm font-medium text-gray-500 transition hover:text-black"
                                            >
                                                <Pencil size={14} />
                                                <span className="hidden sm:inline">Edit</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(zone._id)}
                                                disabled={deletingId === zone._id}
                                                className="flex items-center gap-1.5 text-sm font-medium text-red-500 transition hover:text-red-600 disabled:opacity-50"
                                            >
                                                <Trash2 size={14} />
                                                <span className="hidden sm:inline">
                                                    {deletingId === zone._id ? "Deleting..." : "Delete"}
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {modalZone !== undefined && (
                <ShippingZoneModal zone={modalZone} onClose={() => setModalZone(undefined)} />
            )}
        </div>
    );
}