"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";

const CODE_LENGTH = 6;

export default function VerifyEmail() {
  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const setUser = useAuthStore((state) => state.setUser);
  const router = useRouter();

  const handleChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < CODE_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
      return;
    }

    if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      inputsRef.current[index - 1]?.focus();
      return;
    }

    if (e.key === "ArrowRight" && index < CODE_LENGTH - 1) {
      e.preventDefault();
      inputsRef.current[index + 1]?.focus();
      return;
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, CODE_LENGTH);
    if (!pasted) return;
    e.preventDefault();

    const newCode = Array(CODE_LENGTH).fill("");
    pasted.split("").forEach((char, i) => (newCode[i] = char));
    setCode(newCode);
    inputsRef.current[Math.min(pasted.length, CODE_LENGTH - 1)]?.focus();
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const token = code.join("");
    if (token.length !== CODE_LENGTH) {
      setError("Please enter the full 6-digit code");
      return;
    }

    setIsLoading(true);
    try {
      const { data } = await api.post("/auth/verify-email", { token });

      setUser(data.user);
      router.push("/");
    } catch (error: any) {
      setError(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-80px)] items-center justify-center px-6">
      <div className="w-full max-w-md rounded-[36px] bg-white p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.25)] ring-1 ring-black/5">
        <div className="text-center">
          <h1 className="text-2xl font-extrabold text-black">Verify your email</h1>
          <p className="mt-1.5 text-sm text-gray-500">
            Enter the 6-digit code we sent to your email address.
          </p>
        </div>

        <form onSubmit={handleVerify} className="mt-8 space-y-6">
          <div className="flex justify-center gap-2" dir="ltr">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputsRef.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="h-14 w-12 rounded-2xl border border-gray-200 bg-gray-50 text-center text-lg font-semibold text-black outline-none transition focus:border-black focus:bg-white focus:ring-2 focus:ring-black/5"
              />
            ))}
          </div>

          {error && <p className="text-center text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-2xl bg-linear-to-b from-gray-800 via-gray-700 to-black py-3.5 text-sm font-semibold text-white shadow-lg shadow-black/20 transition hover:scale-[1.02] hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
          >
            {isLoading ? "Verifying..." : "Verify Email"}
          </button>
        </form>
      </div>
    </div>
  );
}