import { Contact, Message } from './types/types';

export const MOCK_CONTACTS: Contact[] = [
  {
    id: '1',
    name: 'Alex Rivera',
    avatar: 'https://picsum.photos/seed/alex/100/100',
    lastMessage: 'Did you see the new designs?',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 5),
    online: true,
    unreadCount: 2,
  },
  {
    id: '2',
    name: 'Sarah Chen',
    avatar: 'https://picsum.photos/seed/sarah/100/100',
    lastMessage: 'The meeting is at 2 PM.',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2),
    online: false,
    unreadCount: 0,
  },
  {
    id: '3',
    name: 'Jordan Smith',
    avatar: 'https://picsum.photos/seed/jordan/100/100',
    lastMessage: 'Thanks for the help!',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24),
    online: true,
    unreadCount: 0,
  },
];

export const MOCK_MESSAGES: Record<string, Message[]> = {
  '1': [
    {
      id: 'm1',
      text: 'Hey! How is it going?',
      senderId: '1',
      timestamp: new Date(Date.now() - 1000 * 60 * 10),
      status: 'read',
    },
    {
      id: 'm2',
      text: 'Pretty good, just working on the messenger app.',
      senderId: 'me',
      timestamp: new Date(Date.now() - 1000 * 60 * 8),
      status: 'read',
    },
    {
      id: 'm3',
      text: 'Nice! Did you see the new designs?',
      senderId: '1',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      status: 'delivered',
    },
  ],
};
