import React, { useState, useRef, useEffect } from 'react';
import { Send, Phone, Video, Info, Paperclip, Smile, ChevronLeft } from 'lucide-react';
import { Contact, Message } from '..//types/types';
import { format } from 'date-fns';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface ChatWindowProps {
  contact: Contact | null;
  messages: Message[];
  onSendMessage: (text: string) => void;
  onBack?: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ contact, messages, onSendMessage, onBack }) => {
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onSendMessage(inputText);
      setInputText('');
    }
  };

  if (!contact) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 text-slate-400">
        <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
          <Send size={32} className="text-indigo-500" />
        </div>
        <p className="text-sm font-medium text-slate-500">Select a conversation to start messaging</p>
        <p className="text-xs text-slate-400 mt-1">Your messages will appear here</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white h-full">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white/90 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-2 md:gap-3">
          {onBack && (
            <button 
              onClick={onBack}
              className="sm:hidden p-2 -ml-2 hover:bg-indigo-50 rounded-full transition-colors text-slate-600"
            >
              <ChevronLeft size={24} />
            </button>
          )}
          <img
            src={contact.avatar}
            alt={contact.name}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-100"
            referrerPolicy="no-referrer"
          />
          <div>
            <h2 className="font-semibold leading-none text-sm md:text-base text-slate-800">{contact.name}</h2>
            <span className={cn(
              "text-[10px] font-bold uppercase tracking-wider",
              contact.online ? "text-emerald-500" : "text-slate-400"
            )}>
              {contact.online ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>
        <div className="flex gap-1">
          <button className="p-2 hover:bg-indigo-50 rounded-full transition-colors text-slate-500 hover:text-indigo-600">
            <Phone size={18} className="md:w-5 md:h-5" />
          </button>
          <button className="p-2 hover:bg-indigo-50 rounded-full transition-colors text-slate-500 hover:text-indigo-600">
            <Video size={18} className="md:w-5 md:h-5" />
          </button>
          <button className="hidden sm:block p-2 hover:bg-indigo-50 rounded-full transition-colors text-slate-500 hover:text-indigo-600">
            <Info size={18} className="md:w-5 md:h-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg) => {
            const isMe = msg.senderId === 'me';
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={cn(
                  "flex w-full",
                  isMe ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[75%] px-4 py-2.5 rounded-2xl text-sm",
                    isMe 
                      ? "bg-indigo-500 text-white rounded-br-md" 
                      : "bg-white text-slate-700 rounded-bl-md border border-slate-200 shadow-sm"
                  )}
                >
                  <p className="leading-relaxed">{msg.text}</p>
                  <div className={cn(
                    "text-[9px] mt-1.5 flex items-center gap-1",
                    isMe ? "text-white/70 justify-end" : "text-slate-400"
                  )}>
                    {format(msg.timestamp, 'HH:mm')}
                    {isMe && (
                      <span className="capitalize">{msg.status}</span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-slate-100">
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <button type="button" className="p-2 hover:bg-indigo-50 rounded-full transition-colors text-slate-400 hover:text-indigo-500">
            <Paperclip size={20} />
          </button>
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type a message..."
              className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all placeholder:text-slate-400"
            />
            <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-500 transition-colors">
              <Smile size={20} />
            </button>
          </div>
          <button 
            type="submit"
            disabled={!inputText.trim()}
            className={cn(
              "p-2.5 rounded-full transition-all flex items-center justify-center",
              inputText.trim() ? "bg-indigo-500 text-white hover:bg-indigo-600" : "bg-slate-100 text-slate-300"
            )}
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};
