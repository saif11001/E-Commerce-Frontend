"use client";

import { useEffect, useState } from "react";
import Loading from "@/components/ui/Loading";

const READY_KEY = "venerdi_server_ready_at";
const READY_TTL_MS = 10 * 60 * 1000;
const SHOW_AFTER_MS = 1500;
const ESTIMATED_SECONDS = 50;
const SLOW_AFTER_SECONDS = 150;
const RETRY_DELAY_MS = 2000;
const REQUEST_TIMEOUT_MS = 20000;

const CHAT_SERVER_URL = process.env.NEXT_PUBLIC_CHAT_SERVER_URL;

const pingApi = async (): Promise<boolean> => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch("/api/v1/health", {
      cache: "no-store",
      signal: controller.signal,
    });
    return res.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
};

// The chat server sleeps too. Wake it up in the background without blocking the page.
const warmChatServer = () => {
  if (!CHAT_SERVER_URL) return;
  fetch(`${CHAT_SERVER_URL}/health`, { mode: "no-cors" }).catch(() => {});
};

export default function ServerGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [showSplash, setShowSplash] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    try {
      const readyAt = Number(sessionStorage.getItem(READY_KEY));
      if (readyAt && Date.now() - readyAt < READY_TTL_MS) {
        setReady(true);
        return;
      }
    } catch {
      // storage unavailable, just continue with the check
    }

    let cancelled = false;
    const startedAt = Date.now();

    warmChatServer();

    // Only show the splash if the server doesn't answer quickly
    const splashTimer = setTimeout(() => {
      if (!cancelled) setShowSplash(true);
    }, SHOW_AFTER_MS);

    const tick = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startedAt) / 1000));
    }, 1000);

    const run = async () => {
      while (!cancelled) {
        const ok = await pingApi();
        if (cancelled) return;

        if (ok) {
          try {
            sessionStorage.setItem(READY_KEY, String(Date.now()));
          } catch {
            // ignore
          }
          setReady(true);
          return;
        }

        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
      }
    };

    run();

    return () => {
      cancelled = true;
      clearTimeout(splashTimer);
      clearInterval(tick);
    };
  }, []);

  if (ready) return <>{children}</>;
  if (!showSplash) return null;

  const remaining = Math.max(ESTIMATED_SECONDS - elapsed, 0);
  const progress = Math.min(95, Math.round((1 - Math.exp(-elapsed / 25)) * 100));

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-6 bg-white px-6 text-center">
      <Loading />

      <div className="max-w-md">
        <h1 className="text-xl font-extrabold text-black">
          Please wait, the site is loading
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          This project is hosted on a free server that goes to sleep when idle.
          Waking it up usually takes 30–50 seconds, and it only happens on the first visit.
        </p>
        <p className="mt-2 text-sm text-gray-500" dir="rtl">
          برجاء الانتظار، الموقع بيحمل لأنه مرفوع على استضافة مجانية.
        </p>
      </div>

      <div className="w-full max-w-xs">
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-gray-800 transition-all duration-1000 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-2 text-xs font-medium text-gray-500">
          {remaining > 0 ? `About ${remaining}s left` : "Almost there…"}
        </p>
      </div>

      {elapsed >= SLOW_AFTER_SECONDS && (
        <div className="text-sm text-gray-500">
          <p>It is taking longer than usual.</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-2 rounded-full bg-black px-5 py-2 text-xs font-semibold text-white"
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
}