"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Ticket, Plus, X } from "lucide-react";
import CouponsTable from "@/features/admin/coupons/components/CouponsTable";
import CouponForm from "@/features/admin/coupons/components/CouponForm";
import { useCouponStore, Coupon } from "@/store/couponStore";
import { usePermissions } from "@/hooks/usePermissions";

export default function CouponsPage() {
  const searchParams = useSearchParams();
  const { can } = usePermissions();
  const canCreate = can("coupons", "create");
  const canEdit = can("coupons", "update");
  const canDelete = can("coupons", "delete");

  const coupons = useCouponStore((state) => state.coupons);
  const isLoading = useCouponStore((state) => state.isLoading);
  const error = useCouponStore((state) => state.error);
  const fetchCoupons = useCouponStore((state) => state.fetchCoupons);
  const deleteCoupon = useCouponStore((state) => state.deleteCoupon);
  const updateCoupon = useCouponStore((state) => state.updateCoupon);

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Click-and-drag scrolling for the coupons list (mouse only —
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
    fetchCoupons();
  }, []);

  useEffect(() => {
    if (searchParams.get("action") === "add" && canCreate) {
      setEditingId(null);
      setShowAddForm(true);
    }
  }, [searchParams, canCreate]);

  const handleDelete = async (couponId: string) => {
    if (!canDelete) return;
    const confirmed = window.confirm("Are you sure you want to delete this coupon?");
    if (!confirmed) return;

    setDeletingId(couponId);
    try {
      await deleteCoupon(couponId);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete coupon");
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleActive = async (coupon: Coupon) => {
    if (!canEdit) return;
    try {
      await updateCoupon(coupon._id, { isActive: !coupon.isActive });
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to update coupon");
    }
  };

  const handleEdit = (coupon: Coupon) => {
    if (!canEdit) return;
    setEditingId(coupon._id);
  };

  const handleEditSuccess = () => {
    setEditingId(null);
  };

  const handleCreateSuccess = () => {
    setShowAddForm(false);
  };

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-80px)] items-center justify-center">
        <p className="text-sm text-gray-400">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[calc(100vh-80px)] items-center justify-center">
        <p className="text-sm text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-extrabold text-black">
            Coupons
            <Ticket size={22} />
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {coupons.length} {coupons.length === 1 ? "coupon" : "coupons"} total
          </p>
        </div>

        {canCreate && (
          <button
            type="button"
            onClick={() => setShowAddForm((prev) => !prev)}
            className="flex items-center gap-2 rounded-2xl bg-linear-to-b from-gray-800 via-gray-700 to-black px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-black/20 transition hover:opacity-90"
          >
            {showAddForm ? <X size={16} /> : <Plus size={16} />}
            {showAddForm ? "Cancel" : "Add Coupon"}
          </button>
        )}
      </div>

      {showAddForm && canCreate && (
        <div className="mb-6">
          <CouponForm onSuccess={handleCreateSuccess} onCancel={() => setShowAddForm(false)} />
        </div>
      )}

      <div
        ref={listRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={stopDragging}
        onMouseLeave={stopDragging}
        className="max-h-125 cursor-grab select-none overflow-y-auto rounded-[28px] active:cursor-grabbing [-ms-overflow-style:none] scrollbar-none sm:max-h-[70vh] [&::-webkit-scrollbar]:hidden"
      >
        <CouponsTable
          coupons={coupons}
          deletingId={deletingId}
          editingId={editingId}
          onToggleActive={canEdit ? handleToggleActive : undefined}
          onEdit={canEdit ? handleEdit : undefined}
          onDelete={canDelete ? handleDelete : undefined}
          onCancelEdit={() => setEditingId(null)}
          onEditSuccess={handleEditSuccess}
        />
      </div>
    </div>
  );
}