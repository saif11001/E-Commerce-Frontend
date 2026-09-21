import Link from "next/link";
import {
  Sparkles,
  Lightbulb,
  TrendingUp,
  Globe,
  Eye,
} from "lucide-react";

const journey = [
  {
    icon: <Sparkles size={20} />,
    title: "From Humble Beginnings",
    text: "TrendZone started in 2023 out of a small studio, driven by a simple idea: fashion should feel bold, not boring. What began as a handful of designs has grown into a brand people actually trust with their wardrobe.",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&q=80",
  },
  {
    icon: <Lightbulb size={20} />,
    title: "Milestones and Achievements",
    text: "Within our first year, we launched our online store and reached customers far beyond where we started. By year two, we'd expanded from a handful of staple pieces into a full collection covering every category.",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&q=80",
  },
  {
    icon: <TrendingUp size={20} />,
    title: "Innovation and Growth",
    text: "Growth has always meant more than bigger numbers to us. We introduced limited drops, tightened our quality control, and doubled down on the details that make a piece feel worth wearing.",
    image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=500&q=80",
  },
  {
    icon: <Globe size={20} />,
    title: "Our Reach Today",
    text: "TrendZone now ships to customers across the region, with a growing community that shows up for every new drop. That trust is the thing we protect the most.",
    image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=500&q=80",
  },
  {
    icon: <Eye size={20} />,
    title: "Looking Ahead",
    text: "We're just getting started. Our focus stays the same: bold design, real quality, and prices that make sense. New drops, new categories, and a lot more style are on the way.",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&q=80",
  },
];

const team = [
  {
    name: "Nadia Farouk",
    role: "Founder & Creative Director",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&q=80",
  },
  {
    name: "Omar Khaled",
    role: "Head of Design",
    image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=300&q=80",
  },
  {
    name: "Sara Adel",
    role: "Operations Lead",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&q=80",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="text-center">
        <span className="inline-block rounded-full bg-gray-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-gray-600">
          Our Story
        </span>
        <h1 className="mt-6 text-3xl font-extrabold leading-tight text-black sm:text-5xl">
          Discover TrendZone
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-gray-500">
          Where bold design meets everyday wearability. This is the story of
          how we got here — and where we're headed next.
        </p>
      </div>

      <div className="mt-24 text-center">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
          TrendZone Journey
        </p>
        <h2 className="mt-2 text-2xl font-extrabold text-black sm:text-3xl">
          The TrendZone Story
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-sm text-gray-500">
          From a small studio to a brand people build their wardrobe around —
          here's how it happened, step by step.
        </p>
      </div>

      <div className="relative mt-16">
        <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gray-200 md:block" />

        <div className="space-y-16">
          {journey.map((step, i) => {
            const isEven = i % 2 === 0;
            return (
              <div
                key={step.title}
                className={`relative flex flex-col items-center gap-8 md:flex-row ${
                  isEven ? "" : "md:flex-row-reverse"
                }`}
              >
                <div className="w-full md:w-1/2">
                  <div className="overflow-hidden rounded-[40px] border-4 border-black">
                    <img
                      src={step.image}
                      alt={step.title}
                      className="h-65 w-full object-cover"
                    />
                  </div>
                </div>

                <div className="absolute left-1/2 top-6 z-10 hidden h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full bg-white text-black ring-4 ring-white md:flex">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-b from-gray-800 via-gray-700 to-black text-white">
                    {step.icon}
                  </div>
                </div>

                <div className="w-full md:w-1/2">
                  <div className="flex items-center gap-3 md:hidden">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-b from-gray-800 via-gray-700 to-black text-white">
                      {step.icon}
                    </div>
                  </div>
                  <h3 className="mt-3 text-xl font-bold text-black md:mt-0">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-gray-500">
                    {step.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-28 text-center">
        <h2 className="text-2xl font-extrabold text-black sm:text-3xl">
          Our Awesome Team
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {team.map((member) => (
            <div
              key={member.name}
              className="overflow-hidden rounded-3xl border border-gray-100 bg-white"
            >
              <img
                src={member.image}
                alt={member.name}
                className="h-64 w-full object-cover"
              />
              <div className="bg-linear-to-b from-gray-800 via-gray-700 to-black px-4 py-4 text-left">
                <p className="text-sm font-semibold text-white">
                  {member.name}
                </p>
                <p className="text-xs text-gray-300">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-24 text-center">
        <h2 className="text-2xl font-bold text-black">
          Ready to find your look?
        </h2>
        <Link
          href="/products"
          className="mt-6 inline-block rounded-full bg-linear-to-b from-gray-800 via-gray-700 to-black px-10 py-3.5 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Shop the Collection
        </Link>
      </div>

      <div className="h-16" />
    </div>
  );
}