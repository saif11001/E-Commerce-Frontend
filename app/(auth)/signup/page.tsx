"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const setUser = useAuthStore((state) => state.setUser);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    if(password !== confirmPassword) {
        setError("The password and confirmation password do not match");
        return;
    }

    setIsLoading(true);
    try {

        const { data } = await api.post("/auth/signup", {
            name,
            email,
            password
        });

        setUser(data.user);

        router.push("/verify-email");
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

        <div className="flex h-full min-h-0 w-full flex-1 flex-col justify-center overflow-hidden px-6 py-3 md:w-1/2 md:px-12 md:py-8">
          <div className="text-center">
            <h1 className="text-xl font-extrabold text-black md:text-2xl">Create an account</h1>
            <p className="mt-1 text-xs text-gray-500 md:mt-1.5 md:text-sm">
              Join Venerdi and start shopping bold, everyday fashion.
            </p>
          </div>

          <form onSubmit={handleSignUp} className="mt-3 space-y-2 md:mt-7 md:space-y-3.5">
            <div className="relative">
              <User size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-2.5 pl-11 pr-4 text-sm text-black outline-none transition placeholder:text-gray-400 focus:border-black focus:bg-white focus:ring-2 focus:ring-black/5 md:py-3"
              />
            </div>

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
                minLength={6}
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

            <div className="relative">
              <Lock size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-2.5 pl-11 pr-11 text-sm text-black outline-none transition placeholder:text-gray-400 focus:border-black focus:bg-white focus:ring-2 focus:ring-black/5 md:py-3"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-black"
              >
                {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-2xl bg-linear-to-b from-gray-800 via-gray-700 to-black py-3 text-sm font-semibold text-white shadow-lg shadow-black/20 transition hover:scale-[1.02] hover:opacity-90 active:scale-[0.98] disabled:opacity-50 md:py-3.5"
            >
                {isLoading ? "Creating account..." : "Create Account"}
            </button>
          </form>


          <p className="mt-2 text-center text-[10px] text-gray-400 md:mt-5 md:text-xs">We value your privacy</p>

          <p className="mt-1.5 text-center text-xs text-gray-500 md:mt-3 md:text-sm">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-black hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}