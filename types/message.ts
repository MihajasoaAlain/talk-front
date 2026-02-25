export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  timestamp: Date;
  status: MessageStatus;
  attachments?: Attachment[];
}

export interface Attachment {
  id: string;
  type: 'image' | 'file' | 'audio' | 'video';
  url: string;
  name: string;
  size?: number;
}

export interface SendMessageRequest {
  conversationId: string;
  text: string;
  attachments?: File[];
}

export interface SendMessageResponse {
  message: Message;
}

export interface GetMessagesRequest {
  conversationId: string;
  cursor?: string;
  limit?: number;
}

export interface GetMessagesResponse {
  messages: Message[];
  nextCursor?: string;
  hasMore: boolean;
}
