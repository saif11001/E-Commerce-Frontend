type OrderItem = {
    name: string;
    price: number;
    quantity: number;
    size: string;
    image: string;
};

type Order = {
    _id: string;
    items: OrderItem[];
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

export default function OrderCard({ order }: { order: Order }) {
    return (
        <div className="rounded-3xl border border-gray-100 p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <p className="text-sm font-semibold text-black">
                        Order #{order._id.slice(-8).toUpperCase()}
                    </p>
                    <p className="mt-0.5 text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                </div>
                <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                        statusStyles[order.orderStatus] || "bg-gray-100 text-gray-600"
                    }`}
                >
                    {order.orderStatus}
                </span>
            </div>

            <div className="mt-4 flex flex-col gap-2 border-t border-gray-100 pt-4">
                {order.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                        <div className="h-14 w-12 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                            <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-black">{item.name}</p>
                            <p className="text-xs text-gray-500">
                                Size: {item.size} × {item.quantity}
                            </p>
                        </div>
                        <span className="text-sm font-semibold text-black">
                            E£: {item.price * item.quantity}
                        </span>
                    </div>
                ))}
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                <span className="text-xs uppercase text-gray-400">
                    {order.paymentMethod === "cod" ? "Cash on Delivery" : "Paid by Card"}
                </span>
                <span className="text-base font-extrabold text-black">E£: {order.totalPrice}</span>
            </div>
        </div>
    );
}