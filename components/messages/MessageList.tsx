import type { Message, MeResponse } from "./types";
import { formatTime } from "./utils";

type MessageListProps = {
  me: MeResponse["user"] | null;
  messages: Message[];
  error: string | null;
};

function statusLabel(message: Message) {
  if (message.readAt) return "Read";
  if (message.deliveredAt) return "Delivered";
  return "Sent";
}

export default function MessageList({ me, messages, error }: MessageListProps) {
  return (
    <div className="relative flex-1 overflow-hidden">
      <div className="absolute inset-0 opacity-60">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.6)_0%,rgba(255,255,255,0.2)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,168,132,0.15),transparent_55%)]" />
      </div>

      <div className="relative flex h-full flex-col gap-5 overflow-y-auto px-6 py-6">
        {error ? (
          <div className="rounded-2xl bg-white px-4 py-3 text-sm text-[#b42318] shadow">
            {error}
          </div>
        ) : messages.length === 0 ? (
          <div className="rounded-2xl bg-white px-4 py-3 text-sm text-[#667781] shadow">
            No messages yet.
          </div>
        ) : (
          messages.map((message) => {
            const isSelf = message.senderID === me?.id;
            return (
              <div
                key={message.id}
                className={`flex ${isSelf ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[520px] rounded-2xl px-4 py-3 text-sm shadow ${
                    isSelf
                      ? "bg-[#d9fdd3] text-[#111b21]"
                      : "bg-white text-[#111b21]"
                  }`}
                >
                  <p className="mt-1 text-sm text-[#111b21]">
                    {message.content}
                  </p>
                  <div className="mt-2 flex items-center justify-end gap-2 text-[10px] text-[#667781]">
                    <span>{formatTime(message.sentAt)}</span>
                    {isSelf ? <span>{statusLabel(message)}</span> : null}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
