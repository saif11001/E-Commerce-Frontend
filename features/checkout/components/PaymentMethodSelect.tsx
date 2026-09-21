"use client";

import { CreditCard, Truck as TruckIcon } from "lucide-react";

type PaymentMethodSelectProps = {
    value: "cod" | "stripe";
    onChange: (method: "cod" | "stripe") => void;
};

export default function PaymentMethodSelect({ value, onChange }: PaymentMethodSelectProps) {
    return (
        <div className="mt-6">
            <label className="mb-2 block text-sm font-medium text-black">Payment Method</label>
            <div className="grid grid-cols-2 gap-3">
                <button
                    type="button"
                    onClick={() => onChange("cod")}
                    className={`flex items-center gap-2 rounded-2xl border-2 px-4 py-3 text-sm font-semibold transition ${
                        value === "cod"
                            ? "border-transparent bg-linear-to-b from-gray-800 via-gray-700 to-black text-white"
                            : "border-gray-200 text-black hover:border-black"
                    }`}
                >
                    <TruckIcon size={16} />
                    Cash on Delivery
                </button>
                <button
                    type="button"
                    onClick={() => onChange("stripe")}
                    className={`flex items-center gap-2 rounded-2xl border-2 px-4 py-3 text-sm font-semibold transition ${
                        value === "stripe"
                            ? "border-transparent bg-linear-to-b from-gray-800 via-gray-700 to-black text-white"
                            : "border-gray-200 text-black hover:border-black"
                    }`}
                >
                    <CreditCard size={16} />
                    Pay by Card
                </button>
            </div>
        </div>
    );
}