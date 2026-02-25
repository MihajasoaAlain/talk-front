import type { Conversation } from "./types";
import { formatTime, getInitials } from "./utils";

const quickActions = [
  { label: "New chat", color: "bg-[#00a884]" },
  { label: "New group", color: "bg-[#8696a0]" },
  { label: "Broadcast", color: "bg-[#075e54]" },
];

type SidebarProps = {
  username?: string;
  loading: boolean;
  conversations: Conversation[];
  activeId: number | null;
  onSelect: (id: number) => void;
  onCreateDirect: (userId: number) => void;
};

export default function Sidebar({
  username,
  loading,
  conversations,
  activeId,
  onSelect,
  onCreateDirect,
}: SidebarProps) {
  return (
    <aside className="flex w-full flex-col rounded-3xl bg-[#111b21] text-white shadow-[0_20px_60px_rgba(0,0,0,0.45)] lg:w-[320px]">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm font-semibold">
            {username ? getInitials(username) : "ME"}
          </div>
          <div>
            <p className="text-sm font-semibold">Connected users</p>
            <p className="text-xs text-white/60">{username ?? ""}</p>
          </div>
        </div>
        <button className="rounded-full bg-white/10 px-3 py-1 text-xs">
          Menu
        </button>
      </div>

      <div className="px-5 py-4">
        <div className="rounded-full bg-[#202c33] px-4 py-2 text-sm text-white/60">
          Search or start new chat
        </div>
      </div>

      <div className="px-5 pb-4">
        <div className="flex gap-2">
          {quickActions.map((action) => (
            <button
              key={action.label}
              className={`rounded-full px-3 py-1 text-xs font-semibold text-white ${action.color}`}
              onClick={() => {
                if (action.label === "New chat") {
                  const input = window.prompt("Enter user ID to start a chat");
                  const parsed = Number(input);
                  if (Number.isFinite(parsed)) onCreateDirect(parsed);
                }
              }}
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto px-2 pb-4">
          {loading ? (
            <div className="mx-2 rounded-2xl bg-[#202c33] px-4 py-6 text-sm text-white/60">
              Loading conversations...
            </div>
          ) : conversations.length === 0 ? (
            <div className="mx-2 rounded-2xl bg-[#202c33] px-4 py-6 text-sm text-white/60">
              No conversations yet.
            </div>
          ) : (
            conversations.map((chat) => (
              <button
                key={chat.id}
                onClick={() => onSelect(chat.id)}
                className={`mx-2 mb-2 flex w-[calc(100%-1rem)] items-center gap-3 rounded-2xl px-4 py-3 text-left transition ${
                  activeId === chat.id
                    ? "bg-[#2a3942]"
                    : "bg-[#202c33] hover:bg-[#24323b]"
                }`}
              >
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#00a884]/20 text-sm font-semibold text-[#a7f5d8]">
                  {getInitials(chat.title || "Chat")}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">
                      {chat.title || "Untitled"}
                    </p>
                    <span className="text-xs text-white/50">
                      {formatTime(chat.updatedAt)}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-white/70">
                    {chat.isGroup ? "Group" : "Direct"}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </aside>
  );
}
