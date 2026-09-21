"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useCategoryStore } from "../../../../store/categoryStore";

const SLIDE_INTERVAL = 2500;

export default function CategoriesShowcase() {
    const categories = useCategoryStore((state) => state.categories);
    const isLoading = useCategoryStore((state) => state.isLoading);
    const fetchCategories = useCategoryStore((state) => state.fetchCategories);

    useEffect(() => {
        fetchCategories();
    }, []);

    const items = categories.filter((category) => category.isActive);

    const [itemsVisible, setItemsVisible] = useState(2);
    useEffect(() => {
        const updateItemsVisible = () => {
            setItemsVisible(window.innerWidth >= 640 ? 6 : 2);
        };
        updateItemsVisible();
        window.addEventListener("resize", updateItemsVisible);
        return () => window.removeEventListener("resize", updateItemsVisible);
    }, []);

    const shouldLoop = items.length > itemsVisible;
    const extendedItems = shouldLoop ? [...items, ...items] : items;
    const itemWidthPercent = 100 / itemsVisible;

    const [index, setIndex] = useState(0);
    const [withTransition, setWithTransition] = useState(true);
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffsetPercent, setDragOffsetPercent] = useState(0);

    const containerRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const dragStartX = useRef(0);
    const wasDragged = useRef(false);

    useEffect(() => {
        setIndex(0);
        setWithTransition(false);
    }, [itemsVisible, items.length]);

    useEffect(() => {
        if (!shouldLoop || isDragging) return;
        const interval = setInterval(() => {
            setWithTransition(true);
            setIndex((prev) => prev + 1);
        }, SLIDE_INTERVAL);
        return () => clearInterval(interval);
    }, [shouldLoop, isDragging]);

    const handleTransitionEnd = () => {
        if (!shouldLoop) return;
        if (index >= items.length) {
            setWithTransition(false);
            setIndex((prev) => prev - items.length);
        }
    };

    const handlePointerDown = (e: React.PointerEvent) => {
        if (!shouldLoop) return;
        setIsDragging(true);
        setWithTransition(false);
        wasDragged.current = false;
        dragStartX.current = e.clientX;
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isDragging || !containerRef.current) return;
        const deltaX = e.clientX - dragStartX.current;
        if (Math.abs(deltaX) > 5) wasDragged.current = true;
        const containerWidth = containerRef.current.getBoundingClientRect().width;
        setDragOffsetPercent((deltaX / containerWidth) * 100);
    };

    const handlePointerUp = () => {
        if (!isDragging) return;

        const itemsMoved = Math.round(-dragOffsetPercent / itemWidthPercent);
        let newIndex = index + itemsMoved;
        if (newIndex < 0) newIndex += items.length;
        if (newIndex >= items.length * 2) newIndex -= items.length;

        setWithTransition(true);
        setIndex(newIndex);
        setDragOffsetPercent(0);
        setIsDragging(false);
    };

    const handleLinkClick = (e: React.MouseEvent) => {
        if (wasDragged.current) {
            e.preventDefault();
            wasDragged.current = false;
        }
    };

    if (isLoading) {
        return (
            <div className="mx-auto max-w-7xl px-6 pt-16 pb-4">
                <div className="flex flex-wrap justify-center gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="flex flex-col items-center gap-3">
                            <div className="h-24 w-24 animate-pulse rounded-full bg-gray-100 sm:h-32 sm:w-32" />
                            <div className="h-3 w-14 animate-pulse rounded-full bg-gray-100" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (items.length === 0) return null;

    const currentTranslate = -(index * itemWidthPercent) + dragOffsetPercent;

    return (
        <section className="mx-auto max-w-7xl px-6 pt-16 pb-4">
            <div className="mb-8 text-center">
                <h2 className="text-2xl font-extrabold text-black sm:text-3xl">Shop by Category</h2>
                <p className="mt-1 text-sm text-gray-500">Find exactly what you're looking for</p>
            </div>

            {shouldLoop ? (
                <div
                    ref={containerRef}
                    className="touch-pan-y select-none overflow-hidden"
                    style={{ cursor: isDragging ? "grabbing" : "grab" }}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerLeave={handlePointerUp}
                >
                    <div
                        ref={trackRef}
                        onTransitionEnd={handleTransitionEnd}
                        className={withTransition ? "flex transition-transform duration-700 ease-in-out" : "flex"}
                        style={{ transform: `translateX(${currentTranslate}%)` }}
                    >
                        {extendedItems.map((category, i) => (
                            <Link
                                key={`${category._id}-${i}`}
                                href={`/products?category=${category.slug}`}
                                draggable={false}
                                onClick={handleLinkClick}
                                className="flex shrink-0 flex-col items-center gap-3 px-3"
                                style={{ width: `${itemWidthPercent}%` }}
                            >
                                <div className="rounded-full bg-linear-to-b from-gray-800 via-gray-700 to-black p-0.75">
                                    <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-white sm:h-32 sm:w-32">
                                        <img
                                            src={category.image.url}
                                            alt={category.name}
                                            draggable={false}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                </div>
                                <span className="text-sm font-semibold text-black">{category.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="flex flex-wrap justify-center gap-x-8 gap-y-6">
                    {items.map((category) => (
                        <Link
                            key={category._id}
                            href={`/products?category=${category.slug}`}
                            className="group flex flex-col items-center gap-3"
                        >
                            <div className="rounded-full bg-linear-to-b from-gray-800 via-gray-700 to-black p-0.75">
                                <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-white sm:h-32 sm:w-32">
                                    <img
                                        src={category.image.url}
                                        alt={category.name}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                            </div>
                            <span className="text-sm font-semibold text-black transition group-hover:text-gray-600">
                                {category.name}
                            </span>
                        </Link>
                    ))}
                </div>
            )}
        </section>
    );
}