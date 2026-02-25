import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Messages | Talk",
  description: "Your messages",
};

export default function MessagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="m-0 p-0 overflow-hidden">{children}</div>;
}
