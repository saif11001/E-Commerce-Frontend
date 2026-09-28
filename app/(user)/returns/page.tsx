import { Clock, Banknote, ShieldAlert, PackageCheck, Mail, RefreshCcw } from "lucide-react";

export default function ReturnsPage() {
    return (
        <div className="mx-auto max-w-4xl px-6 py-10">
            <h1 className="mb-2 text-3xl font-extrabold text-black sm:text-4xl">
                Returns & Refund Policy
            </h1>
            <p className="mb-10 text-sm text-gray-500">
                We always strive to provide products that you will love, but if
                something doesn&apos;t meet your expectations, here&apos;s how to
                return it.
            </p>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="rounded-2xl border-2 border-gray-50 p-6">
                    <Clock size={22} className="text-black" />
                    <h2 className="mt-3 font-bold text-black">14-Day Window</h2>
                    <p className="mt-1.5 text-sm text-gray-500">
                        You can return your order within 14 days of receiving it.
                    </p>
                </div>

                <div className="rounded-2xl border-2 border-gray-50 p-6">
                    <Banknote size={22} className="text-black" />
                    <h2 className="mt-3 font-bold text-black">Refund Method</h2>
                    <p className="mt-1.5 text-sm text-gray-500">
                        We&apos;ll refund the full amount to your original payment
                        method, with return shipping costs deducted unless the item is
                        defective — in that case, the return is free.
                    </p>
                </div>

                <div className="rounded-2xl border-2 border-gray-50 p-6">
                    <PackageCheck size={22} className="text-black" />
                    <h2 className="mt-3 font-bold text-black">Item Condition</h2>
                    <p className="mt-1.5 text-sm text-gray-500">
                        Items must be clean, unworn, and in their original condition
                        with all tags attached.
                    </p>
                </div>

                <div className="rounded-2xl border-2 border-gray-50 p-6">
                    <ShieldAlert size={22} className="text-black" />
                    <h2 className="mt-3 font-bold text-black">Exceptions</h2>
                    <p className="mt-1.5 text-sm text-gray-500">
                        Customized or special orders are not eligible for return or
                        exchange. Please double-check all details before finalizing
                        such orders.
                    </p>
                </div>

                <div className="rounded-2xl border-2 border-gray-50 p-6">
                    <RefreshCcw size={22} className="text-black" />
                    <h2 className="mt-3 font-bold text-black">Processing Time</h2>
                    <p className="mt-1.5 text-sm text-gray-500">
                        It may take up to 7 business days to receive your return, and
                        we complete the refund within 7 days after that. You&apos;ll
                        get a confirmation email once we&apos;ve received your items
                        and started the refund.
                    </p>
                </div>

                <div className="rounded-2xl border-2 border-gray-50 p-6">
                    <Mail size={22} className="text-black" />
                    <h2 className="mt-3 font-bold text-black">Your Responsibility</h2>
                    <p className="mt-1.5 text-sm text-gray-500">
                        Keep your return receipt until the items reach us — they remain
                        your responsibility until then. Make sure you&apos;re satisfied
                        before removing any tags, as items without tags or with clear
                        signs of wear can&apos;t be accepted. All returns are inspected,
                        and unsuitable items will be sent back to you.
                    </p>
                </div>
            </div>

            <div className="mt-8 rounded-2xl bg-gray-50 p-6 text-center">
                <p className="text-sm text-gray-600">
                    Need help with a return or refund?
                </p>
                <a
                    href="/contact"
                    className="mt-3 inline-block rounded-full bg-linear-to-b from-gray-800 via-gray-700 to-black px-6 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
                >
                    Contact Support
                </a>
            </div>
        </div>
    );
}