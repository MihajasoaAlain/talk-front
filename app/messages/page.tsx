'use client'
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import { MOCK_CONTACTS, MOCK_MESSAGES } from '@/mockData';
import { ChatWindow } from '@/components/ChatWidow';
import { Sidebar } from '@/components/Sidebar';
import { AuthLoadingScreen } from '@/components/messages/AuthLoadingScreen';
import { cn } from '@/lib/utils';
import { apiClient } from '@/lib/api-client';
import type { MeResponse } from '@/types/auth';
import { Contact, Message } from '@/types/types';

const ME_ID = 'me';
const AUTO_REPLY_DELAY_MS = 1500;
const PROFILE_STORAGE_KEY = 'user_profile';

type UserProfile = {
  username: string;
  avatarUrl: string;
};

const mapMeToUserProfile = (me: MeResponse): UserProfile => {
  const username = (me.user?.username || '').trim() || 'User';
  const avatarUrl = (me.user?.avatarUrl || '').trim();
  return { username, avatarUrl };
};

const LAYOUT_CLASSES = {
  root: 'h-dvh w-full flex bg-slate-100 overflow-hidden font-sans antialiased p-0 sm:p-2 lg:p-4',
  shell: 'w-full h-full flex bg-white shadow-none sm:shadow-xl sm:rounded-xl lg:rounded-2xl overflow-hidden relative sm:border border-slate-200',
  sidebarBase: 'h-full w-full sm:w-72 md:w-80 lg:w-96 border-r border-slate-100 flex flex-col bg-white transition-all duration-300 shrink-0',
  chatBase: 'h-full flex-1 flex flex-col bg-white transition-all duration-300 min-w-0',
} as const;

const createMessageId = () =>
  typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2, 11);

const appendMessageToThread = (
  prevMessages: Record<string, Message[]>,
  contactId: string,
  message: Message
) => ({
  ...prevMessages,
  [contactId]: [...(prevMessages[contactId] || []), message],
});

const updateContactPreview = (
  prevContacts: Contact[],
  contactId: string,
  text: string,
  at: Date
) =>
  prevContacts.map((contact) =>
    contact.id === contactId
      ? { ...contact, lastMessage: text, lastMessageTime: at }
      : contact
  );

const createOutgoingMessage = (text: string, at: Date): Message => ({
  id: createMessageId(),
  text,
  senderId: ME_ID,
  timestamp: at,
  status: 'sent',
});

const createAutoReply = (recipientId: string, originalText: string, at: Date): Message => ({
  id: createMessageId(),
  text: `I received your message: "${originalText}". This is a simulated response.`,
  senderId: recipientId,
  timestamp: at,
  status: 'delivered',
});

export default function MessagesPage() {
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[]>(MOCK_CONTACTS);
  const [activeContactId, setActiveContactId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, Message[]>>(MOCK_MESSAGES);
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    if (typeof window === 'undefined') {
      return { username: 'User', avatarUrl: '' };
    }

    const storedProfile = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (storedProfile) {
      try {
        const parsed = JSON.parse(storedProfile) as Partial<UserProfile>;
        return {
          username: parsed.username?.trim() || 'User',
          avatarUrl: parsed.avatarUrl?.trim() || '',
        };
      } catch {
        localStorage.removeItem(PROFILE_STORAGE_KEY);
      }
    }

    const email = localStorage.getItem('last_login_email') || '';
    const fallbackUsername = email.includes('@') ? email.split('@')[0] : 'User';
    return { username: fallbackUsername, avatarUrl: '' };
  });
  const [isAuthenticated] = useState(() => {
    if (typeof window === 'undefined') return false;
    return Boolean(localStorage.getItem('access_token'));
  });

  useEffect(() => {
    if (!isAuthenticated) router.replace('/auth/login');
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated) return;

    let isMounted = true;
    void apiClient
      .get<MeResponse>('/me')
      .then((me) => {
        if (!isMounted) return;
        const profile = mapMeToUserProfile(me);
        setUserProfile(profile);
        localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
        if (me.user?.email) localStorage.setItem('last_login_email', me.user.email);
      })
      .catch(() => {
        // Keep local fallback profile when API is unavailable.
      });

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  const activeContact = useMemo(
    () => contacts.find((contact) => contact.id === activeContactId) || null,
    [contacts, activeContactId]
  );
  const activeMessages = useMemo(
    () => (activeContactId ? messages[activeContactId] || [] : []),
    [messages, activeContactId]
  );

  const handleSendMessage = useCallback((text: string) => {
    if (!activeContactId) return;
    const timestamp = new Date();
    const outgoingMessage = createOutgoingMessage(text, timestamp);

    setMessages((prev) => appendMessageToThread(prev, activeContactId, outgoingMessage));
    setContacts((prev) => updateContactPreview(prev, activeContactId, text, timestamp));

    window.setTimeout(() => {
      const replyTimestamp = new Date();
      const reply = createAutoReply(activeContactId, text, replyTimestamp);

      setMessages((prev) => appendMessageToThread(prev, activeContactId, reply));
      setContacts((prev) =>
        updateContactPreview(prev, activeContactId, reply.text, replyTimestamp)
      );
    }, AUTO_REPLY_DELAY_MS);
  }, [activeContactId]);

  const handleOpenProfile = useCallback(() => {
    router.push('/profile');
  }, [router]);

  const handleOpenSettings = useCallback(() => {
    router.push('/settings');
  }, [router]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    router.replace('/auth/login');
  }, [router]);

  if (!isAuthenticated) {
    return <AuthLoadingScreen />;
  }

  return (
    <div className={LAYOUT_CLASSES.root}>
      <div className={LAYOUT_CLASSES.shell}>
        <div className={cn(
          LAYOUT_CLASSES.sidebarBase,
          activeContactId ? 'hidden sm:flex' : 'flex'
        )}>
          <Sidebar
            contacts={contacts}
            activeContactId={activeContactId}
            onSelectContact={setActiveContactId}
            username={userProfile.username}
            avatarUrl={userProfile.avatarUrl}
            onOpenProfile={handleOpenProfile}
            onOpenSettings={handleOpenSettings}
            onLogout={handleLogout}
          />
        </div>

        <div className={cn(
          LAYOUT_CLASSES.chatBase,
          !activeContactId ? 'hidden sm:flex' : 'flex'
        )}>
          <ChatWindow
            contact={activeContact}
            messages={activeMessages}
            onSendMessage={handleSendMessage}
            onBack={() => setActiveContactId(null)}
          />
        </div>
      </div>
    </div>
  );
}
