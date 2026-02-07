import Link from "next/link";
import AuthHeader from "@/components/auth/AuthHeader";
import FormField from "@/components/auth/FormField";
import HelperCard from "@/components/auth/HelperCard";
import Button from "@/components/ui/Button";

export default function SignupPage() {
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

      <form className="space-y-5">
        <FormField
          id="name"
          label="Full name"
          autoComplete="name"
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

        <Button type="submit" className="w-full">
          Create account
        </Button>
      </form>

      <HelperCard>
        You will receive a confirmation email to finish setting up your workspace.
      </HelperCard>
    </div>
  );
}
