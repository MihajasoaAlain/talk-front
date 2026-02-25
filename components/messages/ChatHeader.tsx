import type { Conversation } from "./types";
import { conversationLabel, getInitials } from "./utils";

type ChatHeaderProps = {
  conversation: Conversation | null;
};

export default function ChatHeader({ conversation }: ChatHeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-black/10 bg-[#f0f2f5] px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#00a884]/10 text-sm font-semibold text-[#00a884]">
          {conversation ? getInitials(conversation.title || "Room") : "--"}
        </div>
        <div>
          <p className="text-sm font-semibold text-[#111b21]">
            {conversationLabel(conversation)}
          </p>
          <p className="text-xs text-[#667781]">
            {conversation
              ? conversation.isGroup
                ? "Group chat"
                : "Direct chat"
              : ""}
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <button className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-[#111b21]">
          Call
        </button>
        <button className="rounded-full bg-[#00a884] px-4 py-2 text-xs font-semibold text-white">
          Go live
        </button>
      </div>
    </header>
  );
}
