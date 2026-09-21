"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X, Expand } from "lucide-react";

const THUMBS_PER_VIEW = 5;

export default function ProductImageGallery({
  images,
}: {
  images: { url: string; public_id: string }[];
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [thumbStart, setThumbStart] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const visibleThumbs = images.slice(thumbStart, thumbStart + THUMBS_PER_VIEW);
  const canScrollBack = thumbStart > 0;
  const canScrollForward = thumbStart + THUMBS_PER_VIEW < images.length;

  const scrollThumbs = (direction: "back" | "forward") => {
    setThumbStart((prev) =>
      direction === "forward"
        ? Math.min(prev + THUMBS_PER_VIEW, images.length - THUMBS_PER_VIEW)
        : Math.max(prev - THUMBS_PER_VIEW, 0)
    );
  };

  const goNext = () => setActiveIndex((prev) => (prev + 1) % images.length);
  const goPrev = () => setActiveIndex((prev) => (prev - 1 + images.length) % images.length);

  // Keyboard navigation while the lightbox is open.
  useEffect(() => {
    if (!isLightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsLightboxOpen(false);
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, images.length]);

  return (
    <div className="flex h-full flex-col">
      {/* Main selected image — takes the remaining space, shown in full (not cropped), click to open fullscreen */}
      <button
        type="button"
        onClick={() => setIsLightboxOpen(true)}
        className="group relative min-h-0 flex-1 overflow-hidden rounded-2xl bg-gray-100"
      >
        {images[activeIndex]?.url && (
          <img
            src={images[activeIndex].url}
            alt=""
            className="h-full w-full object-contain"
          />
        )}
        <span className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition group-hover:bg-black/10 group-hover:opacity-100">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-black shadow-md sm:h-10 sm:w-10">
            <Expand size={16} className="sm:hidden" />
            <Expand size={17} className="hidden sm:block" />
          </span>
        </span>
      </button>

      {/* Thumbnail strip pinned at the very bottom — always centered, arrows float over the edges instead of pushing the row */}
      <div className="relative mt-7 flex shrink-0 items-center justify-center sm:mt-9">
        {images.length > THUMBS_PER_VIEW && (
          <button
            type="button"
            onClick={() => scrollThumbs("back")}
            disabled={!canScrollBack}
            className="absolute left-[-15] z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-linear-to-b from-gray-800 via-gray-700 to-black text-white shadow-md transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-30 sm:h-8 sm:w-8"
          >
            <ChevronLeft size={14} className="sm:hidden" />
            <ChevronLeft size={16} className="hidden sm:block" />
          </button>
        )}
        
        <div className="flex justify-center gap-1.5 sm:gap-2">
          {visibleThumbs.map((img, index) => {
            const realIndex = thumbStart + index;
            return (
              <button
                key={img.public_id}
                type="button"
                onClick={() => setActiveIndex(realIndex)}
                className={`h-11 w-11 shrink-0 overflow-hidden rounded-lg border-2 transition sm:h-14 sm:w-14 sm:rounded-xl ${
                  realIndex === activeIndex ? "border-black" : "border-transparent opacity-60"
                }`}
              >
                <img src={img.url} alt="" className="h-full w-full object-cover" />
              </button>
            );
          })}
        </div>

        {images.length > THUMBS_PER_VIEW && (
          <button
            type="button"
            onClick={() => scrollThumbs("forward")}
            disabled={!canScrollForward}
            className="absolute right-[-15] z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-linear-to-b from-gray-800 via-gray-700 to-black text-white shadow-md transition hover:bg-gray-100 hover:text-black disabled:cursor-not-allowed disabled:opacity-30 sm:h-8 sm:w-8"
          >
            <ChevronRight size={14} className="sm:hidden" />
            <ChevronRight size={16} className="hidden sm:block" />
          </button>
        )}
      </div>

      {/* Fullscreen lightbox */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-3 sm:p-4"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            type="button"
            onClick={() => setIsLightboxOpen(false)}
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:right-4 sm:top-4 sm:h-10 sm:w-10"
          >
            <X size={18} className="sm:hidden" />
            <X size={20} className="hidden sm:block" />
          </button>

          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
              className="absolute left-2 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:left-4 sm:h-11 sm:w-11"
            >
              <ChevronLeft size={18} className="sm:hidden" />
              <ChevronLeft size={22} className="hidden sm:block" />
            </button>
          )}

          <img
            src={images[activeIndex]?.url}
            alt=""
            onClick={(e) => e.stopPropagation()}
            className="max-h-[85%] max-w-[80%] object-contain sm:max-h-full sm:max-w-full"
          />

          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
              className="absolute right-2 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:right-4 sm:h-11 sm:w-11"
            >
              <ChevronRight size={18} className="sm:hidden" />
              <ChevronRight size={22} className="hidden sm:block" />
            </button>
          )}

          {images.length > 1 && (
            <span className="absolute bottom-3 rounded-full bg-white/10 px-2.5 py-1 text-[11px] text-white sm:bottom-4 sm:px-3 sm:text-xs">
              {activeIndex + 1} / {images.length}
            </span>
          )}
        </div>
      )}
    </div>
  );
}