"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthHeader from "@/components/auth/AuthHeader";
import FormField from "@/components/auth/FormField";
import HelperCard from "@/components/auth/HelperCard";
import Button from "@/components/ui/Button";
import { apiPost } from "@/utils/api";

interface LoginRequest {
  email: string;
  password: string;
}

interface AuthResponse {
  access_token: string;
  refresh_token: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    try {
      const response = await apiPost<LoginRequest, AuthResponse>("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("access_token", response.access_token);
      localStorage.setItem("refresh_token", response.refresh_token);

      setSuccess("Logged in successfully.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-8">
      <AuthHeader
        eyebrow="Welcome back"
        title="Log in to your workspace"
        subtitle={
          <>
            New here?{" "}
            <Link className="font-semibold text-black" href="/auth/signup">
              Create an account
            </Link>
          </>
        }
      />

      <form className="space-y-5" onSubmit={onSubmit}>
        <FormField
          id="email"
          label="Email address"
          type="email"
          autoComplete="email"
          placeholder="name@company.com"
        />

        <FormField
          id="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          placeholder="Enter your password"
        />

        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-black/60">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="remember"
              className="h-4 w-4 rounded border-black/20 text-black focus:ring-black/30"
            />
            Remember me
          </label>
          <Link className="font-semibold text-black" href="/auth/forgot-password">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      <HelperCard>
        {error ? (
          <span className="text-red-600">{error}</span>
        ) : success ? (
          <span className="text-emerald-600">{success}</span>
        ) : (
          "Email mihajasoaalain85@gmail.com"
        )}
      </HelperCard>
    </div>
  );
}
