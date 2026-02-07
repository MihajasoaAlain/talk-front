import Link from "next/link";
import AuthHeader from "@/components/auth/AuthHeader";
import FormField from "@/components/auth/FormField";
import HelperCard from "@/components/auth/HelperCard";
import Button from "@/components/ui/Button";

export default function LoginPage() {
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

      <form className="space-y-5">
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

        <Button type="submit" className="w-full">
          Sign in
        </Button>
      </form>

      <HelperCard>
      Email mihajasoaalain85@gmail.com
      </HelperCard>
    </div>
  );
}
