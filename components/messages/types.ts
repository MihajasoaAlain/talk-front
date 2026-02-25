export type Conversation = {
  id: number;
  title: string;
  isGroup: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Message = {
  id: number;
  conversationID: number;
  content: string;
  senderID: number;
  sentAt: string;
  deliveredAt?: string | null;
  readAt?: string | null;
};

export type MeResponse = {
  user: {
    id: number;
    username: string;
    email: string;
    created_at: string;
  };
};

export type ConversationsResponse = {
  conversations: Conversation[];
};

export type MessagesResponse = {
  messages: Message[];
};

export type SendMessageRequest = {
  content: string;
};

export type MessageResponseData = {
  message: Message;
};

export type DirectConversationRequest = {
  userId: number;
};

export type ConversationResponse = {
  conversation: Conversation;
};
