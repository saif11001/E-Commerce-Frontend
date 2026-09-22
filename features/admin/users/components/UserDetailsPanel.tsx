import { Trash2 } from "lucide-react";
import { AdminUser } from "@/store/Adminuserstore";
import Loading from "@/components/ui/Loading";
import UserAvatar from "./UserAvatar";
import UserOrdersList from "./UserOrdersList";

const roleStyles: Record<string, string> = {
    user: "bg-gray-100 text-gray-600",
    manager: "bg-blue-50 text-blue-600",
    support: "bg-amber-50 text-amber-600",
    admin: "bg-black text-white",
};

type UserDetails = {
    stats: { totalOrders: number; totalSpent: number };
    orders: Parameters<typeof UserOrdersList>[0]["orders"];
};

export default function UserDetailsPanel({
    user,
    details,
    isDetailsLoading,
    detailsError,
    isMutating,
    isDeleting,
    onDelete,
}: {
    user: AdminUser | null;
    details: UserDetails | null;
    isDetailsLoading: boolean;
    detailsError: string | null;
    isMutating: boolean;
    isDeleting: boolean;
    onDelete?: (user: AdminUser) => void;
}) {
    if (!user) {
        return (
            <p className="mt-4 text-xs text-gray-500">
                Select a user from the list to view their details and orders.
            </p>
        );
    }

    return (
        <div className="mt-4">
            <div className="flex items-center gap-4">
                <UserAvatar user={user} className="h-16 w-16" />
                <div className="min-w-0">
                    <p className="truncate text-base font-extrabold text-black">{user.name}</p>
                    <p className="mt-0.5 truncate text-sm text-gray-500">{user.email}</p>
                </div>
            </div>

            <div className="mt-5 flex flex-col gap-3 border-t border-gray-100 pt-4 text-sm">
                <div className="flex items-center justify-between text-gray-500">
                    <span>Role</span>
                    <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                            roleStyles[user.role] || roleStyles.user
                        }`}
                    >
                        {user.role}
                    </span>
                </div>
                <div className="flex items-center justify-between text-gray-500">
                    <span>Email verified</span>
                    {user.isVerified ? (
                        <span className="font-semibold text-green-600">Verified</span>
                    ) : (
                        <span className="font-semibold text-amber-600">Not verified</span>
                    )}
                </div>
                <div className="flex items-center justify-between text-gray-500">
                    <span>Last login</span>
                    <span className="font-semibold text-black">
                        {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : "—"}
                    </span>
                </div>
                <div className="flex items-center justify-between text-gray-500">
                    <span>Joined</span>
                    <span className="font-semibold text-black">
                        {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                </div>
            </div>

            <div className="mt-5 border-t border-gray-100 pt-4">
                {isDetailsLoading ? (
                    <div className="flex h-32 items-center justify-center">
                        <Loading />
                    </div>
                ) : detailsError ? (
                    <p className="text-xs font-medium text-red-500">{detailsError}</p>
                ) : details ? (
                    <>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="rounded-2xl bg-gray-50 p-4">
                                <p className="text-xs text-gray-500">Orders</p>
                                <p className="mt-1 text-lg font-extrabold text-black">
                                    {details.stats.totalOrders}
                                </p>
                            </div>
                            <div className="rounded-2xl bg-gray-50 p-4">
                                <p className="text-xs text-gray-500">Total spent</p>
                                <p className="mt-1 text-lg font-extrabold text-black">
                                    E£: {details.stats.totalSpent}
                                </p>
                            </div>
                        </div>

                        <h3 className="mt-5 text-sm font-semibold text-black">Orders</h3>
                        <UserOrdersList orders={details.orders} />
                    </>
                ) : null}
            </div>

            {onDelete && user.role !== "admin" && (
                <button
                    type="button"
                    onClick={() => onDelete(user)}
                    disabled={isMutating || isDeleting}
                    className="mt-6 flex w-full items-center justify-center gap-1.5 rounded-2xl bg-red-50 py-2.5 text-sm font-semibold text-red-500 transition hover:bg-red-100 disabled:opacity-50"
                >
                    <Trash2 size={14} />
                    {isDeleting ? "Deleting..." : "Delete User"}
                </button>
            )}
        </div>
    );
}