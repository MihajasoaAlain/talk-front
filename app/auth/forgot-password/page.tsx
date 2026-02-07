import Link from "next/link";
import AuthHeader from "@/components/auth/AuthHeader";
import FormField from "@/components/auth/FormField";
import HelperCard from "@/components/auth/HelperCard";
import Button from "@/components/ui/Button";

export default function ForgotPasswordPage() {
  return (
    <div className="space-y-8">
      <AuthHeader
        eyebrow="Password reset"
        title="Reset your password"
        subtitle={
          <>
            Remembered it?{" "}
            <Link className="font-semibold text-black" href="/auth/login">
              Back to log in
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
          placeholder="you@company.com"
        />

        <Button type="submit" className="w-full">
          Send reset link
        </Button>
      </form>

      <HelperCard>
        We will email you a secure link that expires after 15 minutes.
      </HelperCard>
    </div>
  );
}
