type OrderItem = { quantity: number };
type Order = {
    _id: string;
    createdAt: string;
    totalPrice: number;
    orderStatus: string;
    items: OrderItem[];
};

const statusStyles: Record<string, string> = {
    pending: "bg-gray-100 text-gray-600",
    confirmed: "bg-blue-50 text-blue-600",
    shipped: "bg-amber-50 text-amber-600",
    delivered: "bg-green-50 text-green-600",
    cancelled: "bg-red-50 text-red-600",
};

export default function UserOrdersList({ orders }: { orders: Order[] }) {
    if (orders.length === 0) {
        return (
            <p className="mt-3 text-xs text-gray-500">This user hasn't placed any orders yet.</p>
        );
    }

    return (
        <div className="mt-2 max-h-72 overflow-y-auto [-ms-overflow-style:none] scrollbar-none [&::-webkit-scrollbar]:hidden">
            <div className="flex flex-col divide-y divide-gray-100">
                {orders.map((order) => {
                    const itemsCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
                    return (
                        <div key={order._id} className="flex items-center gap-3 py-3">
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-semibold text-black">
                                    #{order._id.slice(-8).toUpperCase()}
                                </p>
                                <p className="mt-0.5 text-xs text-gray-500">
                                    {new Date(order.createdAt).toLocaleDateString()} ·{" "}
                                    {itemsCount} {itemsCount === 1 ? "item" : "items"}
                                </p>
                            </div>
                            <div className="shrink-0 text-right">
                                <p className="text-sm font-bold text-black">E£: {order.totalPrice}</p>
                                <span
                                    className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
                                        statusStyles[order.orderStatus] || "bg-gray-100 text-gray-600"
                                    }`}
                                >
                                    {order.orderStatus}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}