import { Trash2 } from "lucide-react";
import { AdminUser } from "@/store/Adminuserstore";
import UserAvatar from "./UserAvatar";

const roleStyles: Record<string, string> = {
    user: "bg-gray-100 text-gray-600",
    manager: "bg-blue-50 text-blue-600",
    support: "bg-amber-50 text-amber-600",
    admin: "bg-black text-white",
};

export default function UserListRow({
    user,
    isSelected,
    isMutating,
    isDeleting,
    onSelect,
    onDelete,
}: {
    user: AdminUser;
    isSelected: boolean;
    isMutating: boolean;
    isDeleting: boolean;
    onSelect: (id: string) => void;
    onDelete: (user: AdminUser) => void;
}) {
    return (
        <div
            onClick={() => onSelect(user._id)}
            className={`flex cursor-pointer items-center gap-4 px-2 py-4 transition hover:bg-gray-50 sm:px-3 ${
                isSelected ? "bg-gray-50" : ""
            }`}
        >
            <UserAvatar user={user} />

            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-black">{user.name}</p>
                <p className="mt-0.5 truncate text-xs text-gray-500">{user.email}</p>
            </div>

            <span
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                    roleStyles[user.role] || roleStyles.user
                }`}
            >
                {user.role}
            </span>

            {user.role !== "admin" && (
                <button
                    type="button"
                    disabled={isMutating || isDeleting}
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(user);
                    }}
                    className="shrink-0 text-gray-400 transition hover:text-red-500 disabled:opacity-40"
                >
                    <Trash2 size={18} />
                </button>
            )}
        </div>
    );
}