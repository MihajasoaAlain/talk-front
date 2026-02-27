"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import type { MeResponse } from "@/types/auth";

const PROFILE_STORAGE_KEY = "user_profile";
const EMAIL_STORAGE_KEY = "last_login_email";

type StoredProfile = {
  username: string;
  avatarUrl: string;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const mapMeToProfile = (me: MeResponse) => {
  const username = (me.user?.username || "").trim() || "User";
  const email = (me.user?.email || "").trim();
  const avatarUrl = (me.user?.avatarUrl || "").trim();
  return { username, email, avatarUrl };
};

export default function ProfilePage() {
  const router = useRouter();
  const initialState = useMemo(() => {
    if (typeof window === "undefined") {
      return { username: "", email: "", avatarUrl: "" };
    }

    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    const savedEmail = localStorage.getItem(EMAIL_STORAGE_KEY) || "";

    if (!raw) {
      const fallbackName = savedEmail.includes("@") ? savedEmail.split("@")[0] : "";
      return { username: fallbackName, email: savedEmail, avatarUrl: "" };
    }

    try {
      const parsed = JSON.parse(raw) as Partial<StoredProfile>;
      const username = parsed.username?.trim() || "";
      const avatarUrl = parsed.avatarUrl?.trim() || "";
      const email = savedEmail || (username ? `${username}@example.com` : "");
      return { username, email, avatarUrl };
    } catch {
      return { username: "", email: savedEmail, avatarUrl: "" };
    }
  }, []);

  const [username, setUsername] = useState(initialState.username);
  const [email, setEmail] = useState(initialState.email);
  const [avatarUrl, setAvatarUrl] = useState(initialState.avatarUrl);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const previewAvatar = avatarUrl.trim();

  useEffect(() => {
    let isMounted = true;

    void apiClient
      .get<MeResponse>("/me")
      .then((me) => {
        if (!isMounted) return;
        const mapped = mapMeToProfile(me);
        setUsername(mapped.username);
        if (mapped.email) setEmail(mapped.email);
        setAvatarUrl(mapped.avatarUrl);
        localStorage.setItem(
          PROFILE_STORAGE_KEY,
          JSON.stringify({ username: mapped.username, avatarUrl: mapped.avatarUrl })
        );
        if (mapped.email) localStorage.setItem(EMAIL_STORAGE_KEY, mapped.email);
      })
      .catch(() => {
        // Keep local fallback values when API is unavailable.
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleUploadAvatar = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      setAvatarUrl(result);
      setError(null);
      setStatus("Avatar selected. Save profile to apply.");
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setStatus(null);
    setIsSubmitting(true);

    const cleanUsername = username.trim();
    const cleanEmail = email.trim();
    const cleanAvatar = avatarUrl.trim();

    if (cleanUsername.length < 2 || cleanUsername.length > 50) {
      setError("Username must be between 2 and 50 characters.");
      return;
    }

    if (!EMAIL_REGEX.test(cleanEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    localStorage.setItem(
      PROFILE_STORAGE_KEY,
      JSON.stringify({ username: cleanUsername, avatarUrl: cleanAvatar })
    );
    localStorage.setItem(EMAIL_STORAGE_KEY, cleanEmail);
    try {
      await apiClient.patch<
        { username: string; email: string; avatarUrl: string },
        MeResponse
      >("/me", {
        username: cleanUsername,
        email: cleanEmail,
        avatarUrl: cleanAvatar,
      });
      setStatus("Profile updated successfully.");
    } catch {
      setStatus("Profile saved locally. API update failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mx-auto min-h-dvh w-full max-w-3xl p-6 sm:p-8">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-slate-900">Profile</h1>
          <button
            type="button"
            onClick={() => router.push("/messages")}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Back to messages
          </button>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="flex items-center gap-4 rounded-xl bg-slate-50 p-4">
            {previewAvatar ? (
              <img
                src={previewAvatar}
                alt={username || "User avatar"}
                className="h-16 w-16 rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-lg font-semibold text-indigo-700">
                {(username.trim().charAt(0) || "U").toUpperCase()}
              </div>
            )}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Upload avatar
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleUploadAvatar}
                className="block text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-indigo-100 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-indigo-700 hover:file:bg-indigo-200"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Username
            </label>
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Your username"
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@company.com"
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Avatar URL
            </label>
            <input
              value={avatarUrl}
              onChange={(event) => setAvatarUrl(event.target.value)}
              placeholder="https://..."
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
            <button
              type="button"
              onClick={() => setAvatarUrl("")}
              className="mt-2 text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              Remove avatar
            </button>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {status && <p className="text-sm text-emerald-600">{status}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500"
          >
            {isSubmitting ? "Saving..." : "Save profile"}
          </button>
        </form>
      </div>
    </main>
  );
}
