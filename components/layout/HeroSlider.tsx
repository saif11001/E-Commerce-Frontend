"use client";

import { useEffect, useRef, useState } from "react";

import HeroCollage from "../layout/hero-variants/HeroCollageVariant";
import HeroPhotos from "../layout/hero-variants/HeroPhotosVariant";
import HeroStories from "../layout/hero-variants/HeroStoriesVariant";

const heroes = [
  { id: "collage", component: <HeroCollage /> },
  { id: "photos", component: <HeroPhotos /> },
  { id: "stories", component: <HeroStories /> },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  const startX = useRef(0);
  const isDragging = useRef(false);

  const next = () => setCurrent((prev) => (prev + 1) % heroes.length);
  const previous = () =>
    setCurrent((prev) => (prev - 1 + heroes.length) % heroes.length);

  useEffect(() => {
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    startX.current = e.clientX;
    isDragging.current = true;
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging.current) return;

    const difference = startX.current - e.clientX;

    if (Math.abs(difference) > 50) {
      if (difference > 0) next();
      else previous();
    }

    isDragging.current = false;
  };

  const handleMouseLeave = () => {
    isDragging.current = false;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const difference = startX.current - e.changedTouches[0].clientX;

    if (Math.abs(difference) > 50) {
      if (difference > 0) next();
      else previous();
    }
  };

  return (
    <section
      className="relative -mt-4 w-full cursor-grab select-none overflow-hidden active:cursor-grabbing sm:-mt-6"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="grid min-h-105 sm:min-h-130 lg:min-h-155">
        {heroes.map((hero, index) => (
          <div
            key={hero.id}
            className={`col-start-1 row-start-1 flex w-full items-center transition-opacity duration-500 ${
              index === current
                ? "z-10 opacity-100"
                : "pointer-events-none z-0 opacity-0"
            }`}
          >
            <div className="w-full">{hero.component}</div>
          </div>
        ))}
      </div>

      <div className="absolute inset-x-0 bottom-2 z-20 flex justify-center gap-2">
        {heroes.map((hero, index) => (
          <button
            key={hero.id}
            onClick={() => setCurrent(index)}
            aria-label={`Slide ${index + 1}`}
            className={`h-1.5 rounded-full transition-all ${
              index === current ? "w-6 bg-black" : "w-1.5 bg-gray-400"
            }`}
          />
        ))}
      </div>
    </section>
  );
}