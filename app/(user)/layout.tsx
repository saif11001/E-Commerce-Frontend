"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ChatWidget from "@/components/chat/ChatWidget";
import CartDrawer from "@/features/cart/components/CartDrawer";
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

            } finally {
                setIsChecking(false);
            }
        };
        checkAuth();

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
            <Footer />
            <CartDrawer />
            <ChatWidget />
        </>
    )
}