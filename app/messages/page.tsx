'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { MOCK_CONTACTS, MOCK_MESSAGES } from '@/mockData';
import { ChatWindow } from '@/components/ChatWidow';
import { Sidebar } from '@/components/Sidebar';
import { cn } from '@/lib/utils';
import { Contact, Message } from '@/types/types';

const createMessageId = () =>
  typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2, 11);

export default function MessagesPage() {
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[]>(MOCK_CONTACTS);
  const [activeContactId, setActiveContactId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, Message[]>>(MOCK_MESSAGES);
  const [isAuthenticated] = useState(() => {
    if (typeof window === 'undefined') return false;
    return Boolean(localStorage.getItem('access_token'));
  });

  useEffect(() => {
    if (!isAuthenticated) router.replace('/auth/login');
  }, [isAuthenticated, router]);

  const activeContact = contacts.find(c => c.id === activeContactId) || null;
  const activeMessages = activeContactId ? (messages[activeContactId] || []) : [];

  const handleSendMessage = (text: string) => {
    if (!activeContactId) return;
    const recipientId = activeContactId;

    const newMessage: Message = {
      id: createMessageId(),
      text,
      senderId: 'me',
      timestamp: new Date(),
      status: 'sent',
    };

    setMessages(prev => ({
      ...prev,
      [recipientId]: [...(prev[recipientId] || []), newMessage]
    }));

    // Update last message in contact list
    setContacts(prev => prev.map(c => 
      c.id === recipientId 
        ? { ...c, lastMessage: text, lastMessageTime: new Date() }
        : c
    ));

    // Simulate auto-reply
    window.setTimeout(() => {
      const reply: Message = {
        id: createMessageId(),
        text: `I received your message: "${text}". This is a simulated response.`,
        senderId: recipientId,
        timestamp: new Date(),
        status: 'delivered',
      };

      setMessages(prev => ({
        ...prev,
        [recipientId]: [...(prev[recipientId] || []), reply]
      }));

      setContacts(prev => prev.map(c => 
        c.id === recipientId
          ? { ...c, lastMessage: reply.text, lastMessageTime: new Date() }
          : c
      ));
    }, 1500);
  };

  if (!isAuthenticated) {
    return (
      <div className="h-dvh w-full flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
          <p className="text-sm text-slate-500 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-dvh w-full flex bg-slate-100 overflow-hidden font-sans antialiased p-0 sm:p-2 lg:p-4">
      <div className="w-full h-full flex bg-white shadow-none sm:shadow-xl sm:rounded-xl lg:rounded-2xl overflow-hidden relative sm:border border-slate-200">
        {/* Sidebar - Contact List */}
        <div className={cn(
          "h-full w-full sm:w-72 md:w-80 lg:w-96 border-r border-slate-100 flex flex-col bg-white transition-all duration-300 shrink-0",
          activeContactId ? "hidden sm:flex" : "flex"
        )}>
          <Sidebar 
            contacts={contacts} 
            activeContactId={activeContactId} 
            onSelectContact={setActiveContactId} 
          />
        </div>
        
        {/* Chat Window */}
        <div className={cn(
          "h-full flex-1 flex flex-col bg-white transition-all duration-300 min-w-0",
          !activeContactId ? "hidden sm:flex" : "flex"
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
