import { ShoppingBag, Tag, Truck, Sparkles, Star } from "lucide-react";
import Image from "next/image";
import { photosImages as images } from "@/lib/heroImages";

export default function HeroPhotos() {
  return (
    <section className="relative mx-auto flex w-full max-w-5xl flex-col justify-center px-4 py-8 text-center sm:px-6 sm:py-12">
      <div className="hidden md:block">
        <div className="absolute top-20 right-2 flex items-center gap-2 rounded-full border border-gray-700 bg-white py-1.5 pl-2 pr-4 shadow-sm lg:-right-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-linear-to-b from-gray-800 via-gray-700 to-black text-white">
            <Sparkles size={14} />
          </span>
          <span className="text-left text-xs font-semibold leading-tight text-black">
            Loved by 13k+
            <br />
            shoppers
          </span>
        </div>

        <div className="absolute top-32 left-20 flex flex-row-reverse items-center gap-2 lg:-left-17.5">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-gray-100 shadow-md lg:h-16 lg:w-16">
            <ShoppingBag size={24} className="text-black" />
          </div>
          <div className="whitespace-nowrap rounded-full rounded-br-none border border-gray-700 bg-white px-3 py-3 text-xs font-medium text-black shadow-sm">
            What&apos;s trending today?
          </div>
        </div>

        <div className="absolute top-64 right-6 flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-gray-100 shadow-md lg:-right-12.5 lg:h-20 lg:w-20">
          <Star size={26} className="text-black" />
        </div>

        <div className="absolute bottom-36 left-8 flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-gray-100 shadow-md lg:-left-2.5 lg:h-20 lg:w-20">
          <Tag size={26} className="text-black" />
        </div>

        <div className="absolute bottom-24 right-8 flex h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-gray-100 shadow-md lg:right-30 lg:h-16 lg:w-16">
          <Truck size={22} className="text-black" />
        </div>

        <div className="absolute top-60 right-2 h-2.5 w-2.5 rounded-full bg-gray-800 lg:right-10" />
        <div className="absolute top-88 right-2 h-2.5 w-2.5 rounded-full bg-gray-800 lg:-right-15.5" />
        <div className="absolute bottom-40 left-2 h-2.5 w-2.5 rounded-full bg-gray-400 lg:-left-15" />
        <div className="absolute bottom-64 left-2 h-2.5 w-2.5 rounded-full bg-gray-600 lg:left-16" />
        <div className="absolute bottom-28 left-2 h-2.5 w-2.5 rounded-full bg-gray-800 lg:left-18" />
      </div>

      <h1 className="relative z-10 mx-auto max-w-2xl text-3xl font-extrabold leading-tight text-black sm:text-5xl lg:text-6xl">
        <span className="bg-linear-to-r from-gray-800 via-gray-700 to-black bg-clip-text text-transparent">
          Find Your New Look
        </span>
        <br />
        <span className="bg-linear-to-r from-black via-gray-700 to-gray-800 bg-clip-text text-transparent">
          Made for Your Vibe
        </span>
      </h1>

      <div className="relative z-10 mx-auto mt-6 flex h-72 w-full max-w-sm items-center justify-center sm:mt-10 sm:h-96">
        <div className="absolute left-1/2 top-1/2 h-48 w-36 -translate-x-[calc(50%+55px)] -translate-y-1/2 overflow-hidden rounded-3xl opacity-45 blur-[3px] sm:h-72 sm:w-52 sm:-translate-x-[calc(50%+115px)]">
          <Image src={images.right} alt="" fill sizes="208px" className="object-cover" />
        </div>

        <div className="absolute left-1/2 top-1/2 h-48 w-36 -translate-x-[calc(-50%+95px)] -translate-y-1/2 overflow-hidden rounded-3xl opacity-45 blur-[3px] sm:h-72 sm:w-52 sm:-translate-x-[calc(-50%+85px)]">
          <Image src={images.left} alt="" fill sizes="208px" className="scale-x-[-1] object-cover" />
        </div>

        <div className="relative z-10 h-64 w-46 overflow-hidden rounded-[28px] bg-[#f2ede4] shadow-[0_20px_45px_-15px_rgba(0,0,0,0.25)] sm:h-88 sm:w-60 sm:rounded-4xl">
          <Image src={images.center} alt="Fashion look" fill sizes="240px" className="object-cover" priority />
        </div>
      </div>
    </section>
  );
}