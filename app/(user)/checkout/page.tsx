"use client";

import { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { CreditCard } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import api from "@/lib/axios";
import { stripePromise } from "@/lib/stripe";
import Loading from "@/components/ui/Loading";
import ShippingInfoForm, { ShippingInfo } from "@/features/checkout/components/ShippingInfoForm";
import PaymentMethodSelect from "@/features/checkout/components/PaymentMethodSelect";
import CheckoutCouponBox from "@/features/checkout/components/CheckoutCouponBox";
import CheckoutSummaryCard from "@/features/checkout/components/CheckoutSummaryCard";
import StripePaymentForm from "@/features/checkout/components/StripePaymentForm";
import OrderSuccessMessage from "@/features/checkout/components/OrderSuccessMessage";
import CheckoutTotalBanner from "@/features/checkout/components/CheckoutTotalBanner";

export default function CheckoutPage() {
    const { items, coupon, summary, isLoading, fetchCart, resetCart } = useCartStore();

    const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        governorate: "",
        notes: "",
    });

    const [paymentMethod, setPaymentMethod] = useState<"cod" | "stripe">("cod");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [orderPlaced, setOrderPlaced] = useState(false);

    // ⬅️ جديد: يتحقق إن الكوبون مش مستخدم قبل كده بنفس الإيميل، وقت الكتابة
    const [couponWarning, setCouponWarning] = useState("");
    const [isCheckingCoupon, setIsCheckingCoupon] = useState(false);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    useEffect(() => {
        if (!coupon || !shippingInfo.email.trim()) {
            setCouponWarning("");
            return;
        }

        const timeoutId = setTimeout(async () => {
            setIsCheckingCoupon(true);
            try {
                await api.post("/checkout/preview", {
                    shippingInfo: { email: shippingInfo.email, governorate: shippingInfo.governorate },
                });
                setCouponWarning("");
            } catch (err: any) {
                const message = err?.response?.data?.message || "";
                if (message.toLowerCase().includes("coupon")) {
                    setCouponWarning(message);
                }
            } finally {
                setIsCheckingCoupon(false);
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [coupon, shippingInfo.email, shippingInfo.governorate]);

    const handleChange = (field: keyof ShippingInfo, value: string) => {
        setShippingInfo((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);

        try {
            const { data } = await api.post("/checkout", { paymentMethod, shippingInfo });

            if (paymentMethod === "cod") {
                resetCart();
                setOrderPlaced(true);
            } else {
                (window as any).__checkoutClientSecret = data.clientSecret;
                setClientSecret(data.clientSecret);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "Checkout failed");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex min-h-125 items-center justify-center">
                <Loading />
            </div>
        );
    }

    if (orderPlaced) {
        return <OrderSuccessMessage paymentMethod={paymentMethod} />;
    }

    if (items.length === 0) {
        return (
            <div className="mx-auto flex min-h-125 max-w-lg flex-col items-center justify-center gap-4 px-6 text-center">
                <h1 className="text-2xl font-extrabold text-black">Your cart is empty</h1>
                <p className="text-sm text-gray-500">Add something to your cart before checking out.</p>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-6xl px-6 py-10">
            <h1 className="mb-8 text-3xl font-extrabold text-black sm:text-4xl">Checkout</h1>
            
            <CheckoutTotalBanner />

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    {!clientSecret ? (
                        <form onSubmit={handleSubmit} className="rounded-3xl border-2 border-gray-50 p-6">
                            <ShippingInfoForm shippingInfo={shippingInfo} onChange={handleChange} />
                            <CheckoutCouponBox />

                            {couponWarning && (
                                <p className="mt-3 text-sm font-medium text-red-500">{couponWarning}</p>
                            )}

                            <PaymentMethodSelect value={paymentMethod} onChange={setPaymentMethod} />

                            {error && (
                                <p className="mt-4 text-sm font-medium text-red-500">{error}</p>
                            )}

                            <button
                                type="submit"
                                disabled={isSubmitting || isCheckingCoupon || !!couponWarning}
                                className="mt-6 w-full rounded-full bg-linear-to-b from-gray-800 via-gray-700 to-black py-3.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
                            >
                                {isSubmitting
                                    ? "Processing..."
                                    : paymentMethod === "cod"
                                    ? "Complete order"
                                    : "Continue to Payment"}
                            </button>
                        </form>
                    ) : (
                        <div className="rounded-3xl border border-gray-100 p-6">
                            <h2 className="flex items-center gap-2 text-lg font-extrabold text-black">
                                <CreditCard size={18} />
                                Card Payment
                            </h2>
                            <p className="mt-1 text-xs text-gray-500">
                                Total to pay: E£: {summary.totalPrice}
                            </p>

                            <div className="mt-5">
                                <Elements stripe={stripePromise} options={{ clientSecret }}>
                                    <StripePaymentForm onSuccess={() => { resetCart(); setOrderPlaced(true); }} />
                                </Elements>
                            </div>
                        </div>
                    )}
                </div>

                <div className="lg:col-span-1">
                    <CheckoutSummaryCard />
                </div>
            </div>
        </div>
    );
}