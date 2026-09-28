"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ArrowLeft } from "lucide-react";

export default function NotFound() {
    const router = useRouter();
    const [query, setQuery] = useState("");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = query.trim();
        if (!trimmed) return;
        router.push(`/products?search=${encodeURIComponent(trimmed)}`);
    };

    return (
        <div className="relative flex min-h-[70vh] items-center justify-center overflow-hidden px-6 py-16">
            {/* Big 404 in the background */}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 362 145"
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-1/2 w-full max-w-3xl -translate-x-1/2 -translate-y-1/2 text-gray-100"
            >
                <path
                    fill="currentColor"
                    d="M62.6 142c-2.133 0-3.2-1.067-3.2-3.2V118h-56c-2 0-3-1-3-3V92.8c0-1.333.4-2.733 1.2-4.2L58.2 4c.8-1.333 2.067-2 3.8-2h28c2 0 3 1 3 3v85.4h11.2c.933 0 1.733.333 2.4 1 .667.533 1 1.267 1 2.2v21.2c0 .933-.333 1.733-1 2.4-.667.533-1.467.8-2.4.8H93v20.8c0 2.133-1.067 3.2-3.2 3.2H62.6zM33 90.4h26.4V51.2L33 90.4zM181.67 144.6c-7.333 0-14.333-1.333-21-4-6.666-2.667-12.866-6.733-18.6-12.2-5.733-5.467-10.266-13-13.6-22.6-3.333-9.6-5-20.667-5-33.2 0-12.533 1.667-23.6 5-33.2 3.334-9.6 7.867-17.133 13.6-22.6 5.734-5.467 11.934-9.533 18.6-12.2 6.667-2.8 13.667-4.2 21-4.2 7.467 0 14.534 1.4 21.2 4.2 6.667 2.667 12.8 6.733 18.4 12.2 5.734 5.467 10.267 13 13.6 22.6 3.334 9.6 5 20.667 5 33.2 0 12.533-1.666 23.6-5 33.2-3.333 9.6-7.866 17.133-13.6 22.6-5.6 5.467-11.733 9.533-18.4 12.2-6.666 2.667-13.733 4-21.2 4zm0-31c9.067 0 15.6-3.733 19.6-11.2 4.134-7.6 6.2-17.533 6.2-29.8s-2.066-22.2-6.2-29.8c-4.133-7.6-10.666-11.4-19.6-11.4-8.933 0-15.466 3.8-19.6 11.4-4 7.6-6 17.533-6 29.8s2 22.2 6 29.8c4.134 7.467 10.667 11.2 19.6 11.2zM316.116 142c-2.134 0-3.2-1.067-3.2-3.2V118h-56c-2 0-3-1-3-3V92.8c0-1.333.4-2.733 1.2-4.2l56.6-84.6c.8-1.333 2.066-2 3.8-2h28c2 0 3 1 3 3v85.4h11.2c.933 0 1.733.333 2.4 1 .666.533 1 1.267 1 2.2v21.2c0 .933-.334 1.733-1 2.4-.667.533-1.467.8-2.4.8h-11.2v20.8c0 2.133-1.067 3.2-3.2 3.2h-27.2zm-29.6-51.6h26.4V51.2l-26.4 39.2z"
                />
            </svg>

            {/* Content */}
            <div className="relative z-10 text-center">
                <h1 className="text-balance text-5xl font-semibold tracking-tight text-black sm:text-7xl">
                    Page not found
                </h1>
                <p className="mt-6 text-pretty text-lg font-medium text-gray-500 sm:text-xl">
                    Lost, this page is. In another system, it may be.
                </p>

                <form
                    onSubmit={handleSearch}
                    className="mx-auto mt-10 flex max-w-sm flex-col gap-3 sm:flex-row"
                >
                    <div className="relative w-full">
                        <Search
                            size={16}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search"
                            className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-sm text-black outline-none placeholder:text-gray-400 focus:border-black"
                        />
                    </div>
                    <button
                        type="submit"
                        className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-gray-50"
                    >
                        Search
                    </button>
                </form>

                <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center sm:gap-6">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="group flex items-center justify-center rounded-lg bg-gray-100 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-gray-200"
                    >
                        <ArrowLeft
                            size={16}
                            className="mr-2 opacity-60 transition-transform group-hover:-translate-x-0.5"
                        />
                        Go back
                    </button>

                    <Link
                        href="/"
                        className="-order-1 flex items-center justify-center rounded-lg bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 sm:order-0"
                    >
                        Take me home
                    </Link>
                </div>
            </div>
        </div>
    );
}