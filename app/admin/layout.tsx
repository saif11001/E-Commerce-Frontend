"use client";

import Navbar from "@/components/admin/Navbar";
import Sidebar from "@/components/admin/Sidebar";
import Loading from "@/components/ui/Loading";
import api from "@/lib/axios";
import { can, getHomePath, getSectionFromPath, isSection, isStaffRole } from "@/lib/permissions";
import { useAuthStore } from "@/store/authStore";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminLayout ({
    children
}: {
    children: React.ReactNode
}) {
    const router = useRouter();
    const pathname = usePathname();
    const setUser = useAuthStore((state) => state.setUser);
    const clearUser = useAuthStore((state) => state.clearUser);
    const role = useAuthStore((state) => state.user?.role as string | undefined);

    const [isChecking, setIsChecking] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const checkStaff = async () => {
            try {
                const { data } = await api.get('/profile');

                // admin, manager and support can enter the panel — regular users can't
                if (!isStaffRole(data.user.role)) {
                    router.replace("/");
                    return;
                }

                setUser(data.user);
                setIsAuthorized(true);
            } catch (err) {
                clearUser();
                router.replace("/login");
            } finally {
                setIsChecking(false);
            }
        };

        checkStaff();
    }, []);

    // Route guard: each role only reaches the sections it is allowed to view
    const section = getSectionFromPath(pathname);
    const isRoot = section === "";
    const hasAccess = isSection(section) ? can(role, section) : true;

    useEffect(() => {
        if (!isAuthorized) return;
        if (isRoot || !hasAccess) {
            router.replace(getHomePath(role));
        }
    }, [isAuthorized, isRoot, hasAccess, role, router]);

    if (isChecking) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loading />
            </div>
        );
    }

    if (!isAuthorized) {
        return null;
    }

    // Redirecting — don't mount the page (it would fire requests that return 403)
    if (isRoot || !hasAccess) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loading />
            </div>
        );
    }

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50/50">
            <Sidebar />
            <div className="flex flex-1 flex-col overflow-hidden">
                <Navbar />
                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}