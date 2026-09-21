"use client";

import Navbar from "@/components/admin/Navbar";
import Sidebar from "@/components/admin/Sidebar";
import Loading from "@/components/ui/Loading";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminLayout ({
    children
}: {
    children: React.ReactNode
}) {
    const router = useRouter();
    const setUser = useAuthStore((state) => state.setUser);
    const clearUser = useAuthStore((state) => state.clearUser);

    const [isChecking, setIsChecking] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const { data } = await api.get('/profile');

                if (data.user.role !== "admin") {
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

        checkAdmin();
    }, []);

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