"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight, Users } from "lucide-react";
import { AdminUser } from "@/store/Adminuserstore";
import Loading from "@/components/ui/Loading";
import UserListRow from "./UserListRow";

type Pagination = { total: number; page: number; totalPages: number };

export default function UsersListPanel({
    users,
    pagination,
    isLoading,
    isMutating,
    error,
    selectedId,
    deletingId,
    onSelect,
    onDelete,
    onPageChange,
}: {
    users: AdminUser[];
    pagination: Pagination;
    isLoading: boolean;
    isMutating: boolean;
    error: string | null;
    selectedId: string | null;
    deletingId: string | null;
    onSelect: (id: string) => void;
    onDelete?: (user: AdminUser) => void;
    onPageChange: (page: number) => void;
}) {
    // Click-and-drag scrolling for the users list (mouse only —
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

    return (
        <div className="flex h-125 w-full min-w-0 flex-col self-start rounded-[28px] bg-white p-4 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] ring-1 ring-black/5 sm:h-[70vh] sm:p-6">
            <div className="flex shrink-0 items-center justify-between">
                <h2 className="text-sm font-semibold text-black">All Users</h2>
                <span className="text-xs text-gray-400">{pagination.total} users</span>
            </div>

            <div
                ref={listRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={stopDragging}
                onMouseLeave={stopDragging}
                className="mt-4 min-h-0 flex-1 cursor-grab select-none overflow-y-auto [-ms-overflow-style:none] scrollbar-none active:cursor-grabbing [&::-webkit-scrollbar]:hidden"
            >
                {isLoading ? (
                    <div className="flex h-full items-center justify-center">
                        <Loading />
                    </div>
                ) : error ? (
                    <div className="flex h-full items-center justify-center">
                        <p className="text-sm text-red-500">{error}</p>
                    </div>
                ) : users.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                        <Users size={32} className="text-gray-300" />
                        <p className="text-sm text-gray-500">No users found</p>
                    </div>
                ) : (
                    <div className="flex flex-col divide-y divide-gray-100">
                        {users.map((user) => (
                            <UserListRow
                                key={user._id}
                                user={user}
                                isSelected={selectedId === user._id}
                                isMutating={isMutating}
                                isDeleting={deletingId === user._id}
                                onSelect={onSelect}
                                onDelete={onDelete}
                            />
                        ))}
                    </div>
                )}
            </div>

            {pagination.totalPages > 1 && (
                <div className="mt-4 flex shrink-0 items-center justify-between border-t border-gray-100 pt-4">
                    <span className="text-xs text-gray-500">
                        Page {pagination.page} of {pagination.totalPages}
                    </span>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => onPageChange(pagination.page - 1)}
                            disabled={pagination.page <= 1 || isLoading}
                            className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-gray-200 text-black transition hover:border-black disabled:opacity-40 disabled:hover:border-gray-200"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <button
                            type="button"
                            onClick={() => onPageChange(pagination.page + 1)}
                            disabled={pagination.page >= pagination.totalPages || isLoading}
                            className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-gray-200 text-black transition hover:border-black disabled:opacity-40 disabled:hover:border-gray-200"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}