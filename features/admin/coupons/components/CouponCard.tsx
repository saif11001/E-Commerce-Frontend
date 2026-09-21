import { Pencil, Trash2, Tag, Users, Calendar } from "lucide-react";
import { Coupon } from "@/store/couponStore";

export default function CouponCard({
    coupon,
    isDeleting,
    onToggleActive,
    onEdit,
    onDelete,
}: {
    coupon: Coupon;
    isDeleting: boolean;
    onToggleActive: (coupon: Coupon) => void;
    onEdit: (coupon: Coupon) => void;
    onDelete: (couponId: string) => void;
}) {
    const isExpired = coupon.expiresAt && new Date(coupon.expiresAt) < new Date();

    return (
        <div className="rounded-2xl border border-gray-100 bg-white px-5 py-10 shadow-sm">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Tag size={17} className="text-gray-400" />
                    <span className="text-base font-extrabold text-black">{coupon.code}</span>
                </div>

                <button
                    onClick={() => onToggleActive(coupon)}
                    className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                        coupon.isActive ? "bg-black" : "bg-gray-200"
                    }`}
                >
                    <span
                        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
                            coupon.isActive ? "left-5.5" : "left-0.5"
                        }`}
                    />
                </button>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-y-5 text-sm">
                <div className="text-left">
                    <p className="text-xs text-gray-400">Discount</p>
                    <p className="mt-1 font-semibold text-black">
                        {coupon.discountType === "percentage"
                            ? `${coupon.discountValue}%`
                            : `E£ ${coupon.discountValue}`}
                    </p>
                </div>

                <div className="text-left">
                    <p className="text-xs text-gray-400">Min Order</p>
                    <p className="mt-1 font-semibold text-black">
                        {coupon.minOrderAmount ? `E£ ${coupon.minOrderAmount}` : "—"}
                    </p>
                </div>

                <div className="flex items-start gap-2 text-left">
                    <Users size={14} className="mt-0.5 shrink-0 text-gray-400" />
                    <div>
                        <p className="text-xs text-gray-400">Usage</p>
                        <p className="mt-1 font-semibold text-black">
                            {coupon.usedCount ?? 0} / {coupon.usageLimit ?? "∞"}
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-2 text-left">
                    <Calendar size={14} className="mt-0.5 shrink-0 text-gray-400" />
                    <div>
                        <p className="text-xs text-gray-400">Expires</p>
                        <p className={`mt-1 font-semibold ${isExpired ? "text-red-500" : "text-black"}`}>
                            {coupon.expiresAt
                                ? new Date(coupon.expiresAt).toLocaleDateString()
                                : "Never"}
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-7 flex items-center gap-2 border-t border-gray-100 pt-4">
                <button
                    onClick={() => onEdit(coupon)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gray-50 py-2.5 text-sm font-semibold text-black transition hover:bg-gray-100"
                >
                    <Pencil size={14} />
                    Edit
                </button>
                <button
                    onClick={() => onDelete(coupon._id)}
                    disabled={isDeleting}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-red-50 py-2.5 text-sm font-semibold text-red-500 transition hover:bg-red-100 disabled:opacity-50"
                >
                    <Trash2 size={14} />
                    {isDeleting ? "Deleting..." : "Delete"}
                </button>
            </div>
        </div>
    );
}