import Link from "next/link";
import type { ReactNode } from "react";

export default function Footer() {
  return (
    <footer className="mx-auto max-w-7xl px-4 pb-4 sm:px-6 sm:pb-6">
      {/* CTA */}
      <div className="rounded-2xl bg-linear-to-b from-gray-800 via-gray-700 to-black px-5 py-8 text-center sm:rounded-3xl sm:px-6 sm:py-12">
        <h2 className="text-xl font-extrabold leading-tight text-white sm:text-3xl">
          Ready to find your next fit?
        </h2>

        <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-gray-300 sm:mt-3 sm:max-w-lg sm:text-sm sm:leading-6">
          Discover fresh styles made for your vibe, your everyday, and
          everything in between.
        </p>

        <Link
          href="/products"
          className="mt-5 inline-block rounded-full bg-white px-6 py-2.5 text-xs font-semibold text-black transition hover:bg-gray-200 sm:mt-6 sm:px-7 sm:text-sm"
        >
          Shop VENERDI
        </Link>
      </div>

      {/* Footer Content */}
      <div className="relative mt-3 overflow-hidden rounded-2xl border border-gray-100 bg-white px-5 py-7 sm:mt-4 sm:rounded-3xl sm:px-8 sm:py-9">
        <div className="grid grid-cols-2 gap-x-6 gap-y-7 sm:grid-cols-2 md:grid-cols-[1.6fr_1fr_1fr_1fr] md:gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-black text-xs font-bold text-white">
                V
              </div>

              <span className="text-base font-bold tracking-wide text-black">
                VENERDI
              </span>
            </div>

            <p className="mt-2.5 max-w-xs text-xs leading-5 text-gray-500">
              VENERDI is everyday fashion made for individuality, confidence,
              and your own unique vibe.
            </p>

            <div className="mt-4 flex items-center gap-2.5">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  aria-label={social.name}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-black transition hover:bg-black hover:text-white sm:h-9 sm:w-9"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-black">
              Shop
            </h3>

            <ul className="mt-2.5 space-y-2 text-xs text-gray-500 sm:text-sm">
              <li>
                <Link href="/products" className="hover:text-black">
                  All Products
                </Link>
              </li>

              <li>
                <Link href="/products/featured" className="hover:text-black">
                  Featured Products
                </Link>
              </li>

              <li>
                <Link href="/categories" className="hover:text-black">
                  Collections
                </Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-black">
              Help
            </h3>

            <ul className="mt-2.5 space-y-2 text-xs text-gray-500 sm:text-sm">
              <li>
                <Link href="/returns" className="hover:text-black">
                  Returns
                </Link>
              </li>

              <li>
                <Link href="/contact" className="hover:text-black">
                  Support
                </Link>
              </li>

              <li>
                <Link href="/track-orders" className="hover:text-black">
                  Track Order
                </Link>
              </li>
            </ul>
          </div>

          {/* VENERDI */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-black">
              VENERDI
            </h3>

            <ul className="mt-2.5 space-y-2 text-xs text-gray-500 sm:text-sm">
              <li>
                <Link href="/about" className="hover:text-black">
                  About Us
                </Link>
              </li>

              <li>
                <Link href="/contact" className="hover:text-black">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="relative z-10 mt-7 border-t border-gray-100 pt-4 text-center text-[11px] text-gray-500 sm:mt-8 sm:pt-5 sm:text-xs">
          <p>© 2026 VENERDI. All rights reserved.</p>
        </div>

        {/* Background Text */}
        <div className="pointer-events-none absolute inset-x-0 -bottom-3 z-0 overflow-hidden text-center sm:-bottom-6">
          <span className="text-[4rem] font-extrabold leading-none tracking-tight text-black opacity-[0.04] sm:text-[7rem] lg:text-[9rem]">
            VENERDI
          </span>
        </div>
      </div>
    </footer>
  );
}

type SocialLink = {
  name: string;
  href: string;
  icon: ReactNode;
};

const socialLinks: SocialLink[] = [
  {
    name: "tiktok",
    href: "#",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16.6 5.82c-.9-.98-1.4-2.26-1.4-3.62h-3.15v13.44c0 1.63-1.32 2.95-2.95 2.95a2.95 2.95 0 0 1 0-5.9c.3 0 .59.04.86.13V9.5a6.1 6.1 0 0 0-.86-.06 6.1 6.1 0 1 0 6.1 6.1V9.4a9.2 9.2 0 0 0 5.4 1.73V7.98a5.9 5.9 0 0 1-3.99-2.16z" />
      </svg>
    ),
  },
  {
    name: "facebook",
    href: "#",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46H15.2c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z" />
      </svg>
    ),
  },
  {
    name: "instagram",
    href: "#",
    icon: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    name: "x",
    href: "#",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.9 2H22l-7.6 8.7L23 22h-6.9l-5.4-6.6L4.5 22H1.4l8.1-9.3L1 2h7l4.9 6z" />
      </svg>
    ),
  },
  {
    name: "snapchat",
    href: "#",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2c2.68 0 4.86 2.13 4.97 4.79l.06 1.87c.02.4.1.48.5.62.4.15 1.4.4 1.7.62.28.2.28.5.02.75-.3.28-1.06.6-1.7.86-.16.06-.24.16-.2.34.1.5.42 1.3.9 1.86.5.6 1.24 1 2.06 1.2.24.06.24.4-.02.5-.4.16-.86.28-1.2.4-.16.06-.2.16-.2.32 0 .18.04.4-.14.5-.2.1-.5 0-.86.04-.36.04-.6.28-1.06.62-.62.46-1.5.94-2.7.94-.16 0-.32 0-.48-.02-.26-.02-.5-.06-.72-.06-.22 0-.46.04-.72.06-.16.02-.32.02-.48.02-1.2 0-2.08-.48-2.7-.94-.46-.34-.7-.58-1.06-.62-.36-.04-.66.06-.86-.04-.18-.1-.14-.32-.14-.5 0-.16-.04-.26-.2-.32-.34-.12-.8-.24-1.2-.4-.26-.1-.26-.44-.02-.5.82-.2 1.56-.6 2.06-1.2.48-.56.8-1.36.9-1.86.04-.18-.04-.28-.2-.34-.64-.26-1.4-.58-1.7-.86-.26-.25-.26-.55.02-.75.3-.22 1.3-.47 1.7-.62.4-.14.48-.22.5-.62l.06-1.87C7.14 4.13 9.32 2 12 2z" />
      </svg>
    ),
  },
];