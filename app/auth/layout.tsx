import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f6f2ea] text-[#151515]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-12 h-64 w-64 rounded-full bg-[#ffb347]/40 blur-3xl" />
        <div className="absolute right-[-6rem] top-1/3 h-72 w-72 rounded-full bg-[#7bdff2]/40 blur-3xl" />
        <div className="absolute bottom-[-8rem] left-1/3 h-80 w-80 rounded-full bg-[#b28dff]/25 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(60deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[length:28px_28px] opacity-40" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-xl flex-col gap-10 px-6 py-10 lg:flex-row lg:items-center">

        <section className="flex-1">
          <div className="rounded-3xl border border-black/10 bg-white p-8 shadow-[0_18px_60px_rgba(15,15,15,0.12)]">
            {children}
          </div>
          <div className="mt-6 text-xs text-black/50">
            Having trouble? Reach us at support@talkfront.io
          </div>
        </section>
      </div>
    </div>
  );
}
