"use client";

import { useState } from "react";
import { Mail, Search, CheckCircle2 } from "lucide-react";
import api from "@/lib/axios";

export default function RequestTrackingLinkForm() {
    const [email, setEmail] = useState("");
    const [isRequesting, setIsRequesting] = useState(false);
    const [requestSent, setRequestSent] = useState(false);
    const [requestError, setRequestError] = useState("");

    const handleRequestLink = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) return;

        setIsRequesting(true);
        setRequestError("");
        try {
            await api.post("/orders/track/request", { email: email.trim() });
            setRequestSent(true);
        } catch (err: any) {
            setRequestError(err.response?.data?.message || "Failed to send tracking link");
        } finally {
            setIsRequesting(false);
        }
    };

    if (requestSent) {
        return (
            <>
                <CheckCircle2 size={48} className="text-green-600" />
                <div>
                    <h1 className="text-xl font-extrabold text-black">Check your email</h1>
                    <p className="mt-2 text-sm text-gray-500">
                        We sent a tracking link to <span className="font-semibold text-black">{email}</span>.
                        It's valid for 15 minutes.
                    </p>
                </div>
            </>
        );
    }

    return (
        <>
            <Search size={32} className="text-gray-300" />
            <div>
                <h1 className="text-xl font-extrabold text-black">Track Your Order</h1>
                <p className="mt-2 text-sm text-gray-500">
                    Enter the email you used at checkout and we'll send you a link to view your orders.
                </p>
            </div>

            <form onSubmit={handleRequestLink} className="w-full">
                <div className="relative">
                    <Mail size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email Address"
                        className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-black outline-none transition focus:border-black focus:bg-white focus:ring-2 focus:ring-black/5"
                    />
                </div>

                {requestError && <p className="mt-2 text-sm text-red-500">{requestError}</p>}

                <button
                    type="submit"
                    disabled={isRequesting}
                    className="mt-4 w-full rounded-2xl bg-linear-to-b from-gray-800 via-gray-700 to-black py-3.5 text-sm font-semibold text-white shadow-lg shadow-black/20 transition hover:opacity-90 disabled:opacity-50"
                >
                    {isRequesting ? "Sending..." : "Send Tracking Link"}
                </button>
            </form>
        </>
    );
}