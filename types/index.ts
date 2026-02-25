// Re-export all types for easy importing
export * from './auth';
export * from './message';
export * from './conversation';

// Legacy types - keeping for backward compatibility
export interface Contact {
  id: string;
  name: string;
  avatar: string;
  lastMessage?: string;
  lastMessageTime?: Date;
  online: boolean;
  unreadCount: number;
}
