import { AdminOrder } from "@/store/adminOrderStore";

const statusStyles: Record<string, string> = {
    pending: "bg-gray-100 text-gray-600",
    confirmed: "bg-blue-50 text-blue-600",
    shipped: "bg-amber-50 text-amber-600",
    delivered: "bg-green-50 text-green-600",
    cancelled: "bg-red-50 text-red-600",
};

export default function AdminOrderListRow({
    order,
    isSelected,
    onSelect,
}: {
    order: AdminOrder;
    isSelected: boolean;
    onSelect: (id: string) => void;
}) {
    return (
        <div
            onClick={() => onSelect(order._id)}
            className={`flex cursor-pointer items-center gap-4 px-2 py-4 transition hover:bg-gray-50 sm:px-3 ${
                isSelected ? "bg-gray-50" : ""
            }`}
        >
            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-black">
                    #{order._id.slice(-8).toUpperCase()}
                </p>
                <p className="mt-0.5 truncate text-xs text-gray-500">
                    {order.shippingInfo.fullName} · {new Date(order.createdAt).toLocaleDateString()}
                </p>
            </div>

            <span className="shrink-0 text-sm font-bold text-black">E£: {order.totalPrice}</span>

            <span
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                    statusStyles[order.orderStatus] || "bg-gray-100 text-gray-600"
                }`}
            >
                {order.orderStatus}
            </span>
        </div>
    );
}