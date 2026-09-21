"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BadgeCheck, ShieldCheck } from "lucide-react";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";
import Loading from "@/components/ui/Loading";

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await api.get("/profile");
        setUser(data.user);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load profile");
      } finally {
        setIsFetching(false);
      }
    };
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isFetching) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex h-[calc(100vh-80px)] items-center justify-center">
        <p className="text-sm text-red-500">{error || "Could not load your profile"}</p>
      </div>
    );
  }

  const memberSince = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const lastLogin = new Date(user.lastLogin).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const roleLabel =
    user.role === "admin"
      ? "Administrator"
      : user.role === "manager"
      ? "Manager"
      : user.role === "support"
      ? "Support"
      : "Customer";

  const initial = user.name?.charAt(0).toUpperCase() || "?";

  return (
    <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-2xl items-center px-4 py-10 sm:px-6 sm:py-16">
      <div className="w-full rounded-[28px] bg-white p-6 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] ring-1 ring-black/5 sm:rounded-[36px] sm:p-8">
        <div className="flex items-center gap-4 sm:gap-5">
          {user.profileImage?.url ? (
            <img
              src={user.profileImage.url}
              alt={user.name}
              className="h-20 w-20 shrink-0 rounded-3xl object-cover sm:h-24 sm:w-24"
            />
          ) : (
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-linear-to-b from-gray-800 via-gray-700 to-black text-2xl font-bold text-white sm:h-24 sm:w-24 sm:text-3xl">
              {initial}
            </div>
          )}

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="truncate text-xl font-extrabold text-black sm:text-2xl">
                {user.name}
              </h1>
              {user.isVerified && (
                <BadgeCheck size={18} className="shrink-0 text-black" />
              )}
            </div>
            <p className="mt-1 text-sm text-gray-500">{roleLabel}</p>
          </div>
        </div>

        <p className="mt-6 wrap-break-words leading-6 text-gray-500">
          Email: {user.email}
        </p>
        <p className="mt-3 leading-6 text-gray-500">
          Member of Venerdi since {memberSince}.
        </p>
        <p className="mt-3 leading-6 text-gray-500">
          Your account is {user.isVerified ? "verified" : "not verified yet"}.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <StatBox label="Member Since" value={memberSince} />
          <StatBox label="Last Login" value={lastLogin} />
          <StatBox
            label="Status"
            value={user.isVerified ? "Verified" : "Pending"}
            icon={
              user.isVerified ? (
                <ShieldCheck size={16} className="text-green-600" />
              ) : undefined
            }
          />
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/profile/edit"
            className="flex-1 rounded-2xl bg-linear-to-b from-gray-800 via-gray-700 to-black py-3.5 text-center text-sm font-semibold text-white shadow-lg shadow-black/20 transition hover:opacity-90"
          >
            Edit Profile
          </Link>
          <Link
            href="/"
            className="flex-1 rounded-2xl bg-gray-100 py-3.5 text-center text-sm font-semibold text-black transition hover:bg-gray-200"
          >
            Back To Home
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatBox({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-gray-50 p-4 text-center">
      <p className="text-xs text-gray-500">{label}</p>
      <div className="mt-1 flex items-center justify-center gap-1.5">
        {icon}
        <p className="text-lg font-bold text-black">{value}</p>
      </div>
    </div>
  );
}