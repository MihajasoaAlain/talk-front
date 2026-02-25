import { useState } from "react";

type ComposerProps = {
  disabled: boolean;
  onSend: (content: string) => Promise<void>;
};

export default function Composer({ disabled, onSend }: ComposerProps) {
  const [value, setValue] = useState("");

  async function handleSend() {
    if (!value.trim()) return;
    const content = value.trim();
    setValue("");
    await onSend(content);
  }

  return (
    <footer className="border-t border-black/10 bg-[#f0f2f5] px-6 py-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-[#111b21]">
          Attach
        </button>
        <input
          className="flex-1 rounded-full bg-white px-4 py-3 text-sm text-[#111b21] placeholder:text-[#667781]"
          placeholder="Type a message for connected users..."
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") handleSend();
          }}
          disabled={disabled}
        />
        <button
          className="rounded-full bg-[#00a884] px-6 py-2 text-xs font-semibold text-white disabled:opacity-60"
          onClick={handleSend}
          disabled={disabled || !value.trim()}
        >
          Send
        </button>
      </div>
    </footer>
  );
}
