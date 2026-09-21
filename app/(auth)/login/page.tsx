"use client";

import Link from "next/link";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const setUser = useAuthStore((state) => state.setUser);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    setIsLoading(true);
    try {
      const { data } = await api.post("/auth/login", {
        email,
        password
      })

      setUser(data.user);

      try {
        await api.post("/cart/merge");
        await useCartStore.getState().fetchCart();
      } catch {
        // merge failure shouldn't block login
      }

      if(!data.user.isVerified) {
        router.push("/verify-email");
        return;
      }

      if(data.user.role === "admin" || data.user.role === "manager" || data.user.role === "support" ) {
        router.push("/admin/analytics");
      } else {
        router.push("/");
      }

    } catch (error: any) {
      setError(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex h-[calc(100vh-80px)] items-center justify-center overflow-hidden px-6">
      <div className="flex h-132.5 w-full max-w-4xl flex-col overflow-hidden rounded-[36px] bg-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.25)] ring-1 ring-black/5 md:flex-row">
        <div className="relative h-32 w-full shrink-0 rounded-b-[36px] md:h-auto md:w-1/2 md:rounded-b-none md:rounded-r-none">
          <img
            src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&q=80"
            alt="Venerdi style"
            className="h-full w-full rounded-b-[36px] object-cover md:rounded-b-none"
          />
          <div className="absolute inset-0 rounded-b-[36px] bg-linear-to-t from-black/80 via-black/10 to-transparent md:rounded-b-none" />
          <div className="absolute left-6 top-4 md:left-8 md:top-8">
            <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm md:px-4 md:py-1.5 md:text-xs">
              Venerdi
            </span>
          </div>
          <div className="absolute bottom-3 left-6 right-6 hidden md:block md:bottom-8 md:left-8 md:right-8">
            <p className="text-2xl font-extrabold leading-tight text-white">
              Elevate Your Style With Bold Fashion
            </p>
          </div>
        </div>

        <div className="flex h-full min-h-0 w-full flex-1 flex-col justify-center overflow-hidden px-6 py-4 md:w-1/2 md:px-12 md:py-8">
          <div className="text-center">
            <h1 className="text-xl font-extrabold text-black md:text-2xl">Welcome back</h1>
            <p className="mt-1 text-xs text-gray-500 md:mt-1.5 md:text-sm">
              Sign in to Venerdi to continue shopping bold, everyday fashion.
            </p>
          </div>

          <form onSubmit={handleLogin} className="mt-4 space-y-3 md:mt-8 md:space-y-4">
            <div className="relative">
              <Mail size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-2.5 pl-11 pr-4 text-sm text-black outline-none transition placeholder:text-gray-400 focus:border-black focus:bg-white focus:ring-2 focus:ring-black/5 md:py-3"
              />
            </div>

            <div className="relative">
              <Lock size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-2.5 pl-11 pr-11 text-sm text-black outline-none transition placeholder:text-gray-400 focus:border-black focus:bg-white focus:ring-2 focus:ring-black/5 md:py-3"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-black"
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>

            <div className="flex justify-center">
              <Link href="/forget-password" className="text-xs font-medium text-gray-500 hover:text-black hover:underline md:text-sm">
                Forgot password?
              </Link>
            </div>

            {error && <p className="text-center text-sm text-red-500">{error}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-2xl bg-linear-to-b from-gray-800 via-gray-700 to-black py-3 text-sm font-semibold text-white shadow-lg shadow-black/20 transition hover:scale-[1.02] hover:opacity-90 active:scale-[0.98] disabled:opacity-50 md:py-3.5"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="mt-3 text-center text-[10px] text-gray-400 md:mt-6 md:text-xs">We value your privacy</p>

          <p className="mt-2 text-center text-xs text-gray-500 md:mt-4 md:text-sm">
            Don't have an account?{" "}
            <Link href="/signup" className="font-semibold text-black hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}