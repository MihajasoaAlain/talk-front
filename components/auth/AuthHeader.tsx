import type { ReactNode } from "react";

interface AuthHeaderProps {
  eyebrow: string;
  title: string;
  subtitle: ReactNode;
}

export default function AuthHeader({
  eyebrow,
  title,
  subtitle,
}: AuthHeaderProps) {
  return (
    <header className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50">
        {eyebrow}
      </p>
      <h1 className="text-3xl font-semibold tracking-tight text-black">
        {title}
      </h1>
      <p className="text-sm text-black/60">{subtitle}</p>
    </header>
  );
}
