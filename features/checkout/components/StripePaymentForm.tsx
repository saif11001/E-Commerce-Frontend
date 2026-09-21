"use client";

import { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";

type StripePaymentFormProps = {
    onSuccess: () => void;
};

const cardElementOptions = {
    style: {
        base: {
            fontSize: "14px",
            color: "#000",
            fontFamily: "inherit",
            "::placeholder": { color: "#9ca3af" },
        },
        invalid: { color: "#ef4444" },
    },
};

export default function StripePaymentForm({ onSuccess }: StripePaymentFormProps) {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState("");

    const handlePay = async () => {
        if (!stripe || !elements) return;

        const cardElement = elements.getElement(CardElement);
        if (!cardElement) return;

        setIsProcessing(true);
        setError("");

        const { error: stripeError } = await stripe.confirmCardPayment(
            (window as any).__checkoutClientSecret,
            { payment_method: { card: cardElement } }
        );

        if (stripeError) {
            setError(stripeError.message || "Payment failed");
            setIsProcessing(false);
            return;
        }

        onSuccess();
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5">
                <CardElement options={cardElementOptions} />
            </div>

            {error && <p className="text-xs font-medium text-red-500">{error}</p>}

            <button
                type="button"
                onClick={handlePay}
                disabled={!stripe || isProcessing}
                className="flex items-center justify-center rounded-full bg-linear-to-b from-gray-800 via-gray-700 to-black py-3.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
            >
                {isProcessing ? "Processing payment..." : "Pay Now"}
            </button>
        </div>
    );
}