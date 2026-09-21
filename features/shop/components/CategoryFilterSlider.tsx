"use client";

import { useEffect, useRef, useState } from "react";

const SLIDE_INTERVAL = 2500;

type Category = {
    _id: string;
    slug: string;
    name: string;
    image?: { url: string };
};

type CategoryFilterSliderProps = {
    categories: Category[];
    currentCategory: string;
    onSelect: (slug: string) => void;
};

export default function CategoryFilterSlider({
    categories,
    currentCategory,
    onSelect,
}: CategoryFilterSliderProps) {
    const items: Category[] = [
        { _id: "all", slug: "", name: "All" },
        ...categories,
    ];

    const [itemsVisible, setItemsVisible] = useState(3);
    useEffect(() => {
        const updateItemsVisible = () => {
            setItemsVisible(window.innerWidth >= 640 ? 7 : 3);
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

    const handleItemClick = (slug: string) => {
        if (wasDragged.current) {
            wasDragged.current = false;
            return;
        }
        onSelect(slug);
    };

    if (items.length === 0) return null;

    const currentTranslate = -(index * itemWidthPercent) + dragOffsetPercent;

    const renderCircle = (category: Category, isActive: boolean) => (
        <div
            className={`rounded-full p-0.75 transition ${isActive
                    ? "bg-linear-to-b from-gray-800 via-gray-700 to-black"
                    : "bg-gray-200"
                }`}
        >
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-gray-50 sm:h-24 sm:w-24">
                {category.image ? (
                    <img
                        src={category.image.url}
                        alt={category.name}
                        draggable={false}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <span className="text-xs font-bold text-black sm:text-sm">All</span>
                )}
            </div>
        </div>
    );

    return (
        <div className="mb-8">
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
                        {extendedItems.map((category, i) => {
                            const isActive = category.slug === currentCategory;
                            return (
                                <button
                                    key={`${category._id}-${i}`}
                                    onClick={() => handleItemClick(category.slug)}
                                    className="flex shrink-0 flex-col items-center gap-2 px-2"
                                    style={{ width: `${itemWidthPercent}%` }}
                                >
                                    {renderCircle(category, isActive)}
                                    <span
                                        className={`text-xs font-semibold sm:text-sm ${isActive ? "text-black" : "text-gray-500"
                                            }`}
                                    >
                                        {category.name}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <div className="flex flex-wrap justify-center gap-x-6 gap-y-4">
                    {items.map((category) => {
                        const isActive = category.slug === currentCategory;
                        return (
                            <button
                                key={category._id}
                                onClick={() => onSelect(category.slug)}
                                className="group flex flex-col items-center gap-2"
                            >
                                {renderCircle(category, isActive)}
                                <span
                                    className={`text-xs font-semibold transition sm:text-sm ${isActive ? "text-black" : "text-gray-500 group-hover:text-black"
                                        }`}
                                >
                                    {category.name}
                                </span>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}