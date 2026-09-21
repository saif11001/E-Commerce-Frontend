"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { User, Settings, LogOut, Package, Menu, X, ShoppingCart, MapPin } from "lucide-react";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";
import { useHasMounted } from "@/hooks/useHasMounted";
import { useCartStore, useCartCount } from "@/store/cartStore";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const hasMounted = useHasMounted();

  const { user, isAuthenticated, clearUser } = useAuthStore();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const cartCount = useCartCount();
  const fetchCart = useCartStore((state) => state.fetchCart);

  useEffect(() => {
    fetchCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
    } finally {
      clearUser();
      setIsProfileOpen(false);
      setIsMenuOpen(false);
      router.push("/");
    }
  };

  const showLoggedInUI = hasMounted && isAuthenticated;

  const isLoginPage = pathname === "/login";

  const filledBtnClass =
    "rounded-full bg-linear-to-b from-gray-800 via-gray-700 to-black px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-black/20 transition hover:scale-[1.02] hover:opacity-90 active:scale-[0.98]";
  const outlineBtnClass =
    "rounded-full border border-black px-6 py-2.5 text-sm font-medium text-black transition hover:scale-[1.02] hover:bg-linear-to-b hover:from-gray-800 hover:via-gray-700 hover:to-black hover:text-white hover:border-transparent active:scale-[0.98]";

  const navLinkClass =
    "relative text-sm font-medium text-black after:absolute after:-bottom-2 after:left-0 after:h-px after:w-0 after:bg-black after:transition-all after:duration-300 hover:after:w-full";

  const CartIcon = ({ size = 20 }: { size?: number }) => (
    <Link
      href="/cart"
      aria-label="Cart"
      className="relative flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 transition hover:bg-gray-100 lg:h-11 lg:w-11"
    >
      <ShoppingCart size={size} className="text-black" />
      {cartCount > 0 && (
        <span className="absolute -right-1 -top-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-black px-1 text-[10px] font-semibold text-white">
          {cartCount}
        </span>
      )}
    </Link>
  );

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-350 items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-10">
        <Link href="/" className="text-2xl font-bold tracking-tight sm:text-3xl">
          Venerdi
        </Link>

        <div className="hidden items-center gap-8 text-sm font-medium lg:flex xl:gap-10">
          <Link href="/" className={navLinkClass}>Home</Link>
          <Link href="/products" className={navLinkClass}>Products</Link>
          <Link href="/products/featured" className={navLinkClass}>Featured Products</Link>
          <Link href="/contact" className={navLinkClass}>Contact</Link>
          <Link href="/about" className={navLinkClass}>About Us</Link>
          {!showLoggedInUI && (
            <Link href="/track-orders" className={navLinkClass}>Track Order</Link>
          )}
        </div>

        <div className="hidden items-center gap-4 lg:flex">
          <CartIcon />

          {showLoggedInUI ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen((prev) => !prev)}
                className="h-11 w-11 overflow-hidden rounded-full border border-gray-200"
              >
                <img
                  src={user?.profileImage?.url || "https://i.pravatar.cc/150"}
                  alt="avatar"
                  className="h-full w-full object-cover"
                />
              </button>

              {isProfileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                  <div className="absolute right-0 top-14 z-50 w-52 rounded-xl bg-white p-2 shadow-lg">
                    <Link
                      href="/profile"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm hover:bg-gray-100"
                    >
                      <User size={17} />
                      Profile
                    </Link>

                    <Link
                      href="/orders"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm hover:bg-gray-100"
                    >
                      <Package size={17} />
                      My Orders
                    </Link>

                    <Link
                      href="/settings"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm hover:bg-gray-100"
                    >
                      <Settings size={17} />
                      Settings
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm text-red-500 hover:bg-gray-100"
                    >
                      <LogOut size={17} />
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className={isLoginPage ? filledBtnClass : outlineBtnClass}
            >
              Log-In
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <CartIcon size={18} />

          {!showLoggedInUI && (
            <Link
              href="/login"
              className={
                isLoginPage
                  ? "rounded-full bg-linear-to-b from-gray-800 via-gray-700 to-black px-4 py-2 text-xs font-semibold text-white shadow-md shadow-black/20"
                  : "rounded-full border border-black px-4 py-2 text-xs font-medium text-black"
              }
            >
              Log-In
            </Link>
          )}

          {showLoggedInUI && (
            <button
              onClick={() => {
                setIsProfileOpen((prev) => !prev);
                setIsMenuOpen(false);
              }}
              className="relative h-9 w-9 overflow-hidden rounded-full border border-gray-200"
            >
              <img
                src={user?.profileImage?.url || "https://i.pravatar.cc/150"}
                alt="avatar"
                className="h-full w-full object-cover"
              />
            </button>
          )}

          <button
            type="button"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            onClick={() => {
              setIsMenuOpen((prev) => !prev);
              setIsProfileOpen(false);
            }}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200"
          >
            {isMenuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </div>

      {showLoggedInUI && isProfileOpen && (
        <div className="lg:hidden">
          <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
          <div className="absolute right-4 top-16 z-50 w-52 rounded-xl bg-white p-2 shadow-lg">
            <Link
              href="/profile"
              onClick={() => setIsProfileOpen(false)}
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm hover:bg-gray-100"
            >
              <User size={17} />
              Profile
            </Link>
            <Link
              href="/orders"
              onClick={() => setIsProfileOpen(false)}
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm hover:bg-gray-100"
            >
              <Package size={17} />
              My Orders
            </Link>
            <Link
              href="/settings"
              onClick={() => setIsProfileOpen(false)}
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm hover:bg-gray-100"
            >
              <Settings size={17} />
              Settings
            </Link>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm text-red-500 hover:bg-gray-100"
            >
              <LogOut size={17} />
              Logout
            </button>
          </div>
        </div>
      )}

      {isMenuOpen && (
        <div
          className="fixed inset-0 top-16 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      <div
        className={`absolute left-0 right-0 top-full z-50 border-t border-gray-100 bg-white px-4 py-4 shadow-lg transition-all duration-200 lg:hidden ${
          isMenuOpen ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"
        }`}
      >
        <div className="flex flex-col gap-4 text-sm font-medium">
          <Link href="/" onClick={() => setIsMenuOpen(false)} className={navLinkClass}>Home</Link>
          <Link href="/products" onClick={() => setIsMenuOpen(false)} className={navLinkClass}>Products</Link>
          <Link href="/products/featured" onClick={() => setIsMenuOpen(false)} className={navLinkClass}>Featured Products</Link>
          <Link href="/contact" onClick={() => setIsMenuOpen(false)} className={navLinkClass}>Contact</Link>
          <Link href="/about" onClick={() => setIsMenuOpen(false)} className={navLinkClass}>About Us</Link>
          {!showLoggedInUI && (
            <Link
              href="/track-orders"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-2 text-sm font-medium text-black"
            >
              <MapPin size={15} />
              Track Order
            </Link>
          )}

          {!showLoggedInUI && (
            <Link
              href="/login"
              onClick={() => setIsMenuOpen(false)}
              className={
                isLoginPage
                  ? "mt-1 rounded-full bg-linear-to-b from-gray-800 via-gray-700 to-black py-2.5 text-center text-sm font-semibold text-white shadow-lg shadow-black/20"
                  : "mt-1 rounded-full border border-black py-2.5 text-center text-sm font-medium"
              }
            >
              Log-In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}