import { Ticket } from "lucide-react";
import { Coupon } from "@/store/couponStore";
import CouponRow from "./CouponRow";
import CouponCard from "./CouponCard";
import CouponForm from "./CouponForm";

export default function CouponsTable({
    coupons,
    deletingId,
    editingId,
    onToggleActive,
    onEdit,
    onDelete,
    onCancelEdit,
    onEditSuccess,
}: {
    coupons: Coupon[];
    deletingId: string | null;
    editingId: string | null;
    onToggleActive: (coupon: Coupon) => void;
    onEdit: (coupon: Coupon) => void;
    onDelete: (couponId: string) => void;
    onCancelEdit: () => void;
    onEditSuccess: (coupon: Coupon) => void;
}) {
    if (coupons.length === 0) {
        return (
            <div className="flex h-[40vh] flex-col items-center justify-center gap-2 rounded-[28px] border border-dashed border-gray-200">
                <Ticket size={28} className="text-gray-300" />
                <p className="text-sm text-gray-400">No coupons found</p>
            </div>
        );
    }

    return (
        <>
            {/* Mobile — cards with all details, no hidden columns */}
            <div className="flex flex-col gap-3 sm:hidden">
                {coupons.map((coupon) =>
                    editingId === coupon._id ? (
                        <div key={coupon._id} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                            <CouponForm coupon={coupon} onCancel={onCancelEdit} onSuccess={onEditSuccess} />
                        </div>
                    ) : (
                        <CouponCard
                            key={coupon._id}
                            coupon={coupon}
                            isDeleting={deletingId === coupon._id}
                            onToggleActive={onToggleActive}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    )
                )}
            </div>

            {/* Desktop — table */}
            <div className="hidden overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm sm:block">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-gray-100 bg-gray-50/60">
                            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-400">Code</th>
                            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-400">Discount</th>
                            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-400">Min Order</th>
                            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-400">Usage</th>
                            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-400">Expires</th>
                            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-400">Status</th>
                            <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-400">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {coupons.map((coupon) =>
                            editingId === coupon._id ? (
                                <tr key={coupon._id}>
                                    <td colSpan={7} className="px-6 py-4">
                                        <CouponForm coupon={coupon} onCancel={onCancelEdit} onSuccess={onEditSuccess} />
                                    </td>
                                </tr>
                            ) : (
                                <CouponRow
                                    key={coupon._id}
                                    coupon={coupon}
                                    isDeleting={deletingId === coupon._id}
                                    onToggleActive={onToggleActive}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                />
                            )
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
}