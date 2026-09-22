"use client";

import { useState } from "react";
import { Coupon, useCouponStore } from "@/store/couponStore";

export default function CouponForm({
  coupon,
  onCancel,
  onSuccess,
}: {
  coupon?: Coupon;
  onCancel: () => void;
  onSuccess: (coupon: Coupon) => void;
}) {
  const createCoupon = useCouponStore((state) => state.createCoupon);
  const updateCoupon = useCouponStore((state) => state.updateCoupon);

  const isEditMode = !!coupon;

  const [code, setCode] = useState(coupon?.code || "");
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">(
    coupon?.discountType || "percentage"
  );
  const [discountValue, setDiscountValue] = useState(coupon?.discountValue.toString() || "");
  const [minOrderAmount, setMinOrderAmount] = useState(
    coupon?.minOrderAmount ? coupon.minOrderAmount.toString() : ""
  );
  const [expiresAt, setExpiresAt] = useState(coupon?.expiresAt ? coupon.expiresAt.slice(0, 10) : "");
  const [usageLimit, setUsageLimit] = useState(coupon?.usageLimit.toString() || "");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setIsSubmitting(true);

    try {
      if (isEditMode) {
        const result = await updateCoupon(coupon!._id, {
          discountType,
          discountValue: Number(discountValue),
          minOrderAmount: Number(minOrderAmount) || 0,
          expiresAt,
          usageLimit: Number(usageLimit),
        });
        onSuccess(result);
      } else {
        const result = await createCoupon({
          code,
          discountType,
          discountValue: Number(discountValue),
          minOrderAmount: minOrderAmount ? Number(minOrderAmount) : 0,
          expiresAt,
          usageLimit: Number(usageLimit),
        });
        onSuccess(result);
      }
    } catch (err: any) {
      setFormError(
        err.response?.data?.message || `Failed to ${isEditMode ? "update" : "create"} coupon`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl border border-gray-100 bg-gray-50/60 p-5">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        <div className="md:col-span-1">
          <label className="mb-1 block text-xs font-medium text-black">Code</label>
          <input
            type="text"
            required
            disabled={isEditMode}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="SUMMER20"
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm uppercase text-black outline-none transition focus:border-black focus:ring-2 focus:ring-black/5 disabled:bg-gray-100 disabled:text-gray-400"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-black">Type</label>
          <select
            value={discountType}
            onChange={(e) => setDiscountType(e.target.value as "percentage" | "fixed")}
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-black outline-none transition focus:border-black focus:ring-2 focus:ring-black/5"
          >
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-black">
            Value {discountType === "percentage" ? "(%)" : "(EGP)"}
          </label>
          <input
            type="number"
            required
            min={0}
            max={discountType === "percentage" ? 100 : undefined}
            value={discountValue}
            onChange={(e) => setDiscountValue(e.target.value)}
            placeholder="0"
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-black outline-none transition focus:border-black focus:ring-2 focus:ring-black/5"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-black">Min Order</label>
          <input
            type="number"
            min={0}
            value={minOrderAmount}
            onChange={(e) => setMinOrderAmount(e.target.value)}
            placeholder="Optional"
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-black outline-none transition focus:border-black focus:ring-2 focus:ring-black/5"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-black">Expires At</label>
          <input
            type="date"
            required
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-black outline-none transition focus:border-black focus:ring-2 focus:ring-black/5"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-black">Usage Limit</label>
          <input
            type="number"
            required
            min={1}
            value={usageLimit}
            onChange={(e) => setUsageLimit(e.target.value)}
            placeholder="100"
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-black outline-none transition focus:border-black focus:ring-2 focus:ring-black/5"
          />
        </div>
      </div>

      {formError && <p className="mt-3 text-sm text-red-500">{formError}</p>}

      <div className="mt-4 flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl bg-gray-100 px-4 py-2 text-sm font-medium text-black transition hover:bg-gray-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-linear-to-b from-gray-800 via-gray-700 to-black px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
        >
          {isSubmitting ? (isEditMode ? "Saving..." : "Creating...") : isEditMode ? "Save Changes" : "Create Coupon"}
        </button>
      </div>
    </form>
  );
}