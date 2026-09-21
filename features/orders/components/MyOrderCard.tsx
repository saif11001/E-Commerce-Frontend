import Link from "next/link";
import { ChevronRight } from "lucide-react";

type Order = {
    _id: string;
    items: { name: string; image: string }[];
    totalPrice: number;
    orderStatus: string;
    paymentMethod: string;
    createdAt: string;
};

const statusStyles: Record<string, string> = {
    pending: "bg-gray-100 text-gray-600",
    confirmed: "bg-blue-50 text-blue-600",
    shipped: "bg-amber-50 text-amber-600",
    delivered: "bg-green-50 text-green-600",
    cancelled: "bg-red-50 text-red-600",
};

export default function MyOrderCard({ order }: { order: Order }) {
    return (
        <Link
            href={`/orders/${order._id}`}
            className="flex items-center gap-4 rounded-3xl border-2 border-gray-50 p-5 transition hover:border-black"
        >
            <div className="flex -space-x-3">
                {order.items.slice(0, 3).map((item, i) => (
                    <div
                        key={i}
                        className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl border-2 border-white bg-gray-100"
                        style={{ zIndex: 3 - i }}
                    >
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    </div>
                ))}
            </div>

            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-black">
                    Order #{order._id.slice(-8).toUpperCase()}
                </p>
                <p className="mt-0.5 text-xs text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()} ·{" "}
                    {order.items.length} item{order.items.length > 1 ? "s" : ""}
                </p>
            </div>

            <div className="flex flex-col items-end gap-1.5">
                <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                        statusStyles[order.orderStatus] || "bg-gray-100 text-gray-600"
                    }`}
                >
                    {order.orderStatus}
                </span>
                <span className="text-sm font-bold text-black">E£: {order.totalPrice}</span>
            </div>

            <ChevronRight size={18} className="shrink-0 text-gray-300" />
        </Link>
    );
}