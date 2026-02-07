import type { ReactNode } from "react";

interface HelperCardProps {
  children: ReactNode;
}

export default function HelperCard({ children }: HelperCardProps) {
  return (
    <div className="rounded-2xl border border-dashed border-black/10 bg-[#f8f4ee] px-4 py-3 text-xs text-black/60">
      {children}
    </div>
  );
}
