import Image from "next/image";
import Link from "next/link";
import { storiesImage } from "@/lib/heroImages";

export default function HeroStories() {
  return (
    <section className="flex w-full items-center bg-[#ebebeb]">
      <div className="mx-auto flex w-full max-w-6xl flex-col-reverse items-center px-6 py-10 sm:px-10 lg:flex-row lg:justify-between lg:py-14">
        <div className="mt-6 max-w-lg text-black lg:mt-0 lg:w-1/2">
          <p className="text-[10px] font-medium uppercase tracking-[0.3em] sm:text-xs">
            VENERDI / New Collection
          </p>

          <h1 className="mt-3 text-3xl font-light uppercase leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            New Season
            <br />
            Collection
          </h1>

          <p className="mt-4 max-w-md text-xs leading-5 text-gray-600 sm:mt-5 sm:text-sm sm:leading-6">
            Fresh silhouettes, effortless fits, and pieces made for your
            everyday vibe.
          </p>

          <Link
            href="/products"
            className="mt-6 inline-flex rounded-full bg-linear-to-b from-gray-800 via-gray-700 to-black px-7 py-3 text-xs font-medium text-white transition hover:opacity-90 sm:mt-8 sm:px-8 sm:py-3.5 sm:text-sm"
          >
            Shop Collection
          </Link>
        </div>

        <div className="relative h-64 w-full sm:h-96 lg:h-120 lg:w-1/2">
          <Image
            src={storiesImage}
            alt="VENERDI new collection"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-contain object-center"
          />
        </div>
      </div>
    </section>
  );
}