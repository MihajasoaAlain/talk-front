"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthHeader from "@/components/auth/AuthHeader";
import FormField from "@/components/auth/FormField";
import HelperCard from "@/components/auth/HelperCard";
import Button from "@/components/ui/Button";
import { apiPost } from "@/utils/api";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  RegisterResponse,
} from "@/types/auth";

export default function SignupPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const formData = new FormData(event.currentTarget);
    const username = String(formData.get("username") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");
    const termsAccepted = formData.get("terms") === "on";

    if (!termsAccepted) {
      setError("Please accept the Terms of Service and Privacy Policy.");
      return;
    }
    if (username.length < 2 || username.length > 50) {
      setError("Username must be between 2 and 50 characters.");
      return;
    }
    if (password.length < 8 || password.length > 72) {
      setError("Password must be between 8 and 72 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: RegisterRequest = { username, email, password };
      await apiPost<RegisterRequest, RegisterResponse>(
        "/auth/register",
        payload
      );

      const auth = await apiPost<LoginRequest, AuthResponse>("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("access_token", auth.access_token);
      localStorage.setItem("refresh_token", auth.refresh_token);
      localStorage.setItem("last_login_email", email);
      localStorage.setItem("user_profile", JSON.stringify({ username, avatarUrl: "" }));
      document.cookie = `access_token=${auth.access_token}; path=/`;

      setSuccess("Account created. Redirecting...");
      router.push("/messages");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-8">
      <AuthHeader
        eyebrow="New workspace"
        title="Create your Talk Front account"
        subtitle={
          <>
            Already have access?{" "}
            <Link className="font-semibold text-black" href="/auth/login">
              Log in
            </Link>
          </>
        }
      />

      <form className="space-y-5" onSubmit={onSubmit}>
        <FormField
          id="username"
          label="Username"
          autoComplete="username"
          placeholder="Jordan Lee"
        />

        <FormField
          id="email"
          label="Work email"
          type="email"
          autoComplete="email"
          placeholder="jordan@company.com"
        />

        <div className="grid gap-4 lg:grid-cols-2">
          <FormField
            id="password"
            label="Password"
            type="password"
            autoComplete="new-password"
            placeholder="Create a password"
          />

          <FormField
            id="confirmPassword"
            label="Confirm password"
            type="password"
            autoComplete="new-password"
            placeholder="Repeat password"
          />
        </div>

        <label className="flex items-start gap-3 text-sm text-black/60">
          <input
            type="checkbox"
            name="terms"
            className="mt-1 h-4 w-4 rounded border-black/20 text-black focus:ring-black/30"
          />
          I agree to the Terms of Service and Privacy Policy.
        </label>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Creating account..." : "Create account"}
        </Button>
      </form>

      <HelperCard>
        {error ? (
          <span className="text-red-600">{error}</span>
        ) : success ? (
          <span className="text-emerald-600">{success}</span>
        ) : (
          "Create your account to continue to Talk."
        )}
      </HelperCard>
    </div>
  );
}
