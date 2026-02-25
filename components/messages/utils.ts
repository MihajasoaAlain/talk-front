import type { Conversation } from "./types";

export function getInitials(title: string) {
  const parts = title.split(" ").filter(Boolean);
  const first = parts[0]?.[0] ?? "?";
  const second = parts[1]?.[0] ?? "";
  return `${first}${second}`.toUpperCase();
}

export function formatTime(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function conversationLabel(conversation: Conversation | null) {
  if (!conversation) return "Select a conversation";
  return conversation.title || "Untitled";
}
