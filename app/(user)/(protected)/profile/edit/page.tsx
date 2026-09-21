"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";
import Loading from "@/components/ui/Loading";

export default function EditProfilePage() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();

  const [name, setName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await api.get("/profile");
        setUser(data.user);
        setName(data.user.name);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load profile");
      } finally {
        setIsFetching(false);
      }
    };
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!user) return;

    const payload: Record<string, string> = {};
    if (name !== user.name) payload.name = name;
    if (newPassword) {
      payload.newPassword = newPassword;
      payload.currentPassword = currentPassword;
    }

    if (Object.keys(payload).length === 0) {
      setError("No changes to save");
      return;
    }

    setIsSubmitting(true);
    try {
      const { data } = await api.patch("/profile", payload);
      setUser(data.user);
      router.push("/profile");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex h-[calc(100vh-80px)] items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-[calc(100vh-80px)] items-center justify-center">
        <p className="text-sm text-red-500">{error || "Could not load your profile"}</p>
      </div>
    );
  }

  const initial = user.name?.charAt(0).toUpperCase() || "?";

  return (
    <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-2xl items-center px-4 py-10 sm:px-6 sm:py-16">
      <div className="w-full rounded-[28px] bg-white p-6 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] ring-1 ring-black/5 sm:rounded-[36px] sm:p-8">
        <Link
          href="/profile"
          className="mb-6 flex w-fit items-center gap-1.5 text-sm font-medium text-gray-500 transition hover:text-black"
        >
          <ArrowLeft size={16} />
          Back to profile
        </Link>

        <h1 className="text-xl font-extrabold text-black sm:text-2xl">Edit Profile</h1>
        <p className="mt-1.5 text-sm text-gray-500">
          Update your name and password.
        </p>

        <div className="mt-8 flex justify-center">
          {user.profileImage?.url ? (
            <img
              src={user.profileImage.url}
              alt="Profile"
              className="h-24 w-24 rounded-full border border-gray-200 object-cover"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-b from-gray-800 via-gray-700 to-black text-3xl font-bold text-white">
              {initial}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-black">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-black outline-none transition focus:border-black focus:bg-white focus:ring-2 focus:ring-black/5"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-black">Email Address</label>
            <input
              type="email"
              value={user.email}
              disabled
              className="w-full cursor-not-allowed rounded-2xl border border-gray-200 bg-gray-100 px-4 py-3 text-sm text-gray-400 outline-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-black">New Password</label>
            <div className="relative">
              <Lock size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Leave blank to keep current password"
                minLength={8}
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-11 text-sm text-black outline-none transition placeholder:text-gray-400 focus:border-black focus:bg-white focus:ring-2 focus:ring-black/5"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-black"
              >
                {showNewPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          {newPassword && (
            <div>
              <label className="mb-1.5 block text-sm font-medium text-black">Current Password</label>
              <div className="relative">
                <Lock size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Required to set a new password"
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-11 text-sm text-black outline-none transition placeholder:text-gray-400 focus:border-black focus:bg-white focus:ring-2 focus:ring-black/5"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-black"
                >
                  {showCurrentPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>
          )}

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <Link
              href="/profile"
              className="flex-1 rounded-2xl bg-gray-100 py-3.5 text-center text-sm font-semibold text-black transition hover:bg-gray-200"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-2xl bg-linear-to-b from-gray-800 via-gray-700 to-black py-3.5 text-sm font-semibold text-white shadow-lg shadow-black/20 transition hover:opacity-90 disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}