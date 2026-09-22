"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { useAdminUserStore, AdminUser } from "@/store/Adminuserstore";
import UsersListPanel from "@/features/admin/users/components/UsersListPanel";
import UserDetailsPanel from "@/features/admin/users/components/UserDetailsPanel";
import { usePermissions } from "@/hooks/usePermissions";

export default function AdminUsersPage() {
    const { can } = usePermissions();
    const canDelete = can("users", "delete");

    const {
        users,
        pagination,
        isLoading,
        isMutating,
        error,
        userDetails,
        isDetailsLoading,
        detailsError,
        fetchUsers,
        fetchUserDetails,
        clearUserDetails,
        deleteUser,
        deleteAllUsers,
    } = useAdminUserStore();

    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [actionError, setActionError] = useState("");
    const [actionSuccess, setActionSuccess] = useState("");

    useEffect(() => {
        fetchUsers(1);
    }, [fetchUsers]);

    useEffect(() => {
        if (selectedId) fetchUserDetails(selectedId);
        else clearUserDetails();
    }, [selectedId, fetchUserDetails, clearUserDetails]);

    const selectedUser = users.find((u) => u._id === selectedId) || null;

    const handleDelete = async (user: AdminUser) => {
        if (!canDelete) return;
        if (!window.confirm(`Are you sure you want to delete ${user.name}?`)) return;
        setActionError("");
        setActionSuccess("");
        setDeletingId(user._id);
        try {
            await deleteUser(user._id);
            if (selectedId === user._id) setSelectedId(null);
            setActionSuccess("User deleted successfully");
        } catch (err: any) {
            setActionError(err.response?.data?.message || "Failed to delete user");
        } finally {
            setDeletingId(null);
        }
    };

    const handleDeleteAll = async () => {
        if (!canDelete) return;
        const confirmed = window.confirm(
            "This will delete ALL regular users (role: user). Admins, managers and support accounts won't be affected. This can't be undone. Continue?"
        );
        if (!confirmed) return;
        setActionError("");
        setActionSuccess("");
        try {
            const message = await deleteAllUsers();
            setSelectedId(null);
            setActionSuccess(message);
        } catch (err: any) {
            setActionError(err.response?.data?.message || "Failed to delete users");
        }
    };

    const goToPage = (page: number) => {
        setSelectedId(null);
        fetchUsers(page);
    };

    return (
        <div className="p-4 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-xl font-extrabold text-black sm:text-2xl">Users</h1>
                    <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                        View and manage the users of your store.
                    </p>
                </div>

                {canDelete && (
                    <button
                        type="button"
                        onClick={handleDeleteAll}
                        disabled={isMutating || users.length === 0}
                        className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-red-100 bg-red-50 px-5 py-2.5 text-sm font-semibold text-red-500 transition hover:bg-red-100 disabled:opacity-50 sm:w-auto"
                    >
                        <Trash2 size={16} />
                        Delete All Users
                    </button>
                )}
            </div>

            {actionError && (
                <p className="mt-4 rounded-2xl bg-red-50 px-4 py-2.5 text-sm text-red-500">{actionError}</p>
            )}
            {actionSuccess && (
                <p className="mt-4 rounded-2xl bg-green-50 px-4 py-2.5 text-sm text-green-600">
                    {actionSuccess}
                </p>
            )}

            <div className="mt-6 grid grid-cols-1 items-start gap-6 sm:mt-8 lg:grid-cols-[minmax(0,1fr)_380px]">
                <UsersListPanel
                    users={users}
                    pagination={pagination}
                    isLoading={isLoading}
                    isMutating={isMutating}
                    error={error}
                    selectedId={selectedId}
                    deletingId={deletingId}
                    onSelect={setSelectedId}
                    onDelete={canDelete ? handleDelete : undefined}
                    onPageChange={goToPage}
                />

                <div className="flex min-w-0 flex-col rounded-[28px] bg-white p-4 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] ring-1 ring-black/5 sm:p-6">
                    <h2 className="text-sm font-semibold text-black">User Details</h2>
                    <UserDetailsPanel
                        user={selectedUser}
                        details={userDetails}
                        isDetailsLoading={isDetailsLoading}
                        detailsError={detailsError}
                        isMutating={isMutating}
                        isDeleting={deletingId === selectedUser?._id}
                        onDelete={canDelete ? handleDelete : undefined}
                    />
                </div>
            </div>
        </div>
    );
}