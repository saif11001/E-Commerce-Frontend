import { Pencil, Trash2, Check, X } from "lucide-react";
import { Coupon } from "@/store/couponStore";

export default function CouponRow({
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
  const expired = new Date(coupon.expiresAt) < new Date();

  const formattedDate = new Date(coupon.expiresAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <tr className="border-b border-gray-50 last:border-0 transition hover:bg-gray-50/50">
      <td className="px-6 py-4">
        <span className="font-mono text-sm font-semibold text-black">{coupon.code}</span>
      </td>
      <td className="px-6 py-4 text-sm text-gray-700">
        {coupon.discountType === "percentage"
          ? `${coupon.discountValue}%`
          : `${coupon.discountValue} EGP`}
      </td>
      <td className="px-6 py-4 text-sm text-gray-500">
        {coupon.minOrderAmount > 0 ? `${coupon.minOrderAmount} EGP` : "—"}
      </td>
      <td className="px-6 py-4 text-sm text-gray-500">
        {coupon.usedCount} / {coupon.usageLimit}
      </td>
      <td className="px-6 py-4 text-sm text-gray-500">
        {formattedDate}
        {expired && (
          <span className="ml-1.5 rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-medium text-red-500">
            Expired
          </span>
        )}
      </td>
      <td className="px-6 py-4">
        <button
          onClick={() => onToggleActive(coupon)}
          className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium transition ${
            coupon.isActive
              ? "bg-green-100 text-green-700 hover:bg-green-200"
              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
          }`}
        >
          {coupon.isActive ? <Check size={11} /> : <X size={11} />}
          {coupon.isActive ? "Active" : "Inactive"}
        </button>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => onEdit(coupon)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-black"
            title="Edit"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={() => onDelete(coupon._id)}
            disabled={isDeleting}
            className="flex h-9 w-9 items-center justify-center rounded-full text-gray-400 transition hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
            title="Delete"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </td>
    </tr>
  );
}