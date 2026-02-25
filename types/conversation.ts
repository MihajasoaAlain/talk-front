import { Message } from './message';

export interface Participant {
  id: string;
  name: string;
  avatar?: string;
  online: boolean;
  lastSeen?: Date;
}

export interface Conversation {
  id: string;
  type: 'direct' | 'group';
  name?: string; // For group conversations
  avatar?: string; // For group conversations
  participants: Participant[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface GetConversationsResponse {
  conversations: Conversation[];
  nextCursor?: string;
  hasMore: boolean;
}

export interface CreateConversationRequest {
  participantIds: string[];
  name?: string; // For group conversations
}

export interface CreateConversationResponse {
  conversation: Conversation;
}
