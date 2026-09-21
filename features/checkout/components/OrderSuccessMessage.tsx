"use client";

import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

type OrderSuccessMessageProps = {
    paymentMethod: "cod" | "stripe";
};

export default function OrderSuccessMessage({ paymentMethod }: OrderSuccessMessageProps) {
    const router = useRouter();

    return (
        <div className="mx-auto flex min-h-125 max-w-lg flex-col items-center justify-center gap-4 px-6 text-center">
            <CheckCircle2 size={48} className="text-green-600" />
            <h1 className="text-2xl font-extrabold text-black">Order placed successfully!</h1>
            <p className="text-sm text-gray-500">
                {paymentMethod === "cod"
                    ? "You'll pay on delivery. A confirmation email is on its way."
                    : "Your payment is being confirmed — a confirmation email will follow shortly."}
            </p>
            <button
                onClick={() => router.push("/products")}
                className="mt-2 rounded-full bg-linear-to-b from-gray-800 via-gray-700 to-black px-8 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
                Continue Shopping
            </button>
        </div>
    );
}