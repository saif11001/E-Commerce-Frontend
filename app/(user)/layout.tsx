"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";

export default function UserLayout({
    children
} : {
    children : React.ReactNode
}) {
    const setUser = useAuthStore((state) => state.setUser);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const { data } = await api.get("/profile");
                setUser(data.user);
            } catch {
                // مفيش يوزر مسجل دخول، ده طبيعي هنا لأن أي حد يقدر يتصفح كـ guest
            } finally {
                setIsChecking(false);
            }
        };
        checkAuth();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (isChecking) {
        return null;
    }

    return (
        <>
            <Navbar />
            <main>
                {children}
            </main>
        </>
    )
}