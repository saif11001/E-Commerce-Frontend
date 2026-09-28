import Link from "next/link";
import { MonitorCloud } from "lucide-react";
import { collageImages as images } from "@/lib/heroImages";

function RotatingPlayBadge() {
  return (
    <Link
      href="https://youtube.com/watch?v=your-video-id"
      target="_blank"
      rel="noopener noreferrer"
      className="group relative h-16 w-16 shrink-0 cursor-pointer sm:h-20 sm:w-20 lg:h-24 lg:w-24"
    >
      <svg
        viewBox="0 0 100 100"
        className="h-full w-full animate-[spin_12s_linear_infinite]"
      >
        <defs>
          <path
            id="circlePath"
            d="M 50, 50 m -38, 0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0"
          />
        </defs>
        <text fontSize="9" letterSpacing="1.5" fill="black">
          <textPath href="#circlePath" startOffset="0%">
            learn about us through this video • learn about us through this video •
          </textPath>
        </text>
      </svg>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-black transition group-hover:scale-110 group-hover:bg-gray-800 sm:h-9 sm:w-9">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="white">
            <path d="M2 1.5 L10 6 L2 10.5 Z" />
          </svg>
        </div>
      </div>
    </Link>
  );
}

export default function HeroCollage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-8 text-center sm:px-6 sm:py-12">
      <svg width="0" height="0" className="absolute">
        <defs>
          <clipPath id="folderTabRight" clipPathUnits="objectBoundingBox">
            <path d="M0,0.08 
                     Q0,0 0.08,0
                     L0.45,0
                     Q0.5,0 0.53,0.018
                     L0.58,0.045
                     Q0.6,0.06 0.65,0.06
                     L0.92,0.06
                     Q1,0.06 1,0.13
                     L1,0.92
                     Q1,1 0.92,1
                     L0.08,1
                     Q0,1 0,0.92
                     Z" />
          </clipPath>

          <clipPath id="folderTabLeft" clipPathUnits="objectBoundingBox">
            <path d="M1,0.08 
                     Q1,0 0.92,0
                     L0.55,0
                     Q0.5,0 0.47,0.018
                     L0.42,0.045
                     Q0.4,0.06 0.35,0.06
                     L0.08,0.06
                     Q0,0.06 0,0.13
                     L0,0.92
                     Q0,1 0.08,1
                     L0.92,1
                     Q1,1 1,0.92
                     Z" />
          </clipPath>
        </defs>
      </svg>

      <div className="flex flex-col-reverse items-center justify-center gap-3 sm:flex-row sm:gap-6">
        <RotatingPlayBadge />

        <h1 className="text-2xl font-extrabold leading-tight text-black sm:text-3xl lg:text-[2.6rem]">
          <span className="bg-linear-to-r from-gray-800 via-gray-700 to-black bg-clip-text text-transparent">
            Elevate Your Style With Bold Fashion
          </span>
        </h1>
      </div>

      <div className="mx-auto grid max-w-5xl grid-cols-3 items-end gap-2 sm:mt-8 sm:grid-cols-5 sm:gap-4">
        <div className="hidden flex-col gap-4 sm:flex">
          <div
            className="h-52 overflow-hidden bg-orange-500 lg:h-70"
            style={{ clipPath: "url(#folderTabRight)" }}
          >
            <img src={images[0].src} alt={images[0].alt} className="h-full w-full object-cover" />
          </div>
          <div className="h-18 overflow-hidden rounded-3xl bg-yellow-400 lg:h-24">
            <img src={images[1].src} alt={images[1].alt} className="h-full w-full object-cover" />
          </div>
        </div>

        <div
          className="h-48 overflow-hidden bg-green-100 sm:h-62 lg:h-82"
          style={{ clipPath: "url(#folderTabRight)" }}
        >
          <img src={images[2].src} alt={images[2].alt} className="h-full w-full object-cover" />
        </div>

        <div className="flex flex-col gap-2 sm:gap-4">
          <div className="h-30 overflow-hidden rounded-2xl bg-yellow-500 sm:h-40 sm:rounded-3xl lg:h-54">
            <img src={images[3].src} alt={images[3].alt} className="h-full w-full object-cover" />
          </div>
          <Link
            href="/products/featured"
            className="flex items-center justify-center rounded-full bg-linear-to-b from-gray-800 via-gray-700 to-black px-2 py-2.5 text-center text-[11px] font-semibold leading-tight text-white transition hover:opacity-90 sm:py-4 sm:text-sm"
          >
            Featured Products
          </Link>
        </div>

        <div
          className="hidden h-48 overflow-hidden bg-blue-100 sm:block sm:h-62 lg:h-82"
          style={{ clipPath: "url(#folderTabLeft)" }}
        >
          <img src={images[4].src} alt={images[4].alt} className="h-full w-full object-cover" />
        </div>
        <div
          className="h-48 overflow-hidden bg-blue-100 sm:hidden"
          style={{ clipPath: "url(#folderTabLeft)" }}
        >
          <img src={images[5].src} alt={images[5].alt} className="h-full w-full object-cover" />
        </div>

        <div className="hidden flex-col gap-4 sm:flex">
          <div className="relative h-52 lg:h-70">
            <div
              className="h-full w-full overflow-hidden bg-green-200"
              style={{ clipPath: "url(#folderTabLeft)" }}
            >
              <img src={images[5].src} alt={images[5].alt} className="h-full w-full object-cover" />
            </div>

            <div className="absolute bottom-3 right-3 z-10 hidden lg:block">
              <Link
                href="https://www.youtube.com/watch?v=eJpTFp0dbqk"
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-40 items-center gap-3 rounded-4xl bg-white/90 p-2 shadow-xl backdrop-blur-md transition hover:bg-white"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-600 text-white">
                  <MonitorCloud size={18} />
                </div>
                <div className="leading-tight">
                  <p className="text-xs font-semibold text-black">Our Channel</p>
                  <p className="text-[11px] text-gray-400">Watch on YouTube</p>
                </div>
              </Link>
            </div>
          </div>
          <div className="h-18 overflow-hidden rounded-3xl bg-emerald-600 lg:h-24">
            <img src={images[6].src} alt={images[6].alt} className="h-full w-full object-cover" />
          </div>
        </div>
      </div>

      <div className="mt-2 h-19 overflow-hidden rounded-2xl bg-gray-100 sm:hidden">
        <img src={images[1].src} alt={images[1].alt} className="h-full w-full object-cover" />
      </div>
    </section>
  );
}