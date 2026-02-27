"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Search, MoreVertical, Edit, ChevronDown, User, Settings, LogOut } from 'lucide-react';
import { Contact } from '../types/types';
import { format } from 'date-fns';
import { cn } from '../lib/utils';

interface SidebarProps {
  contacts: Contact[];
  activeContactId: string | null;
  onSelectContact: (id: string) => void;
  username?: string;
  avatarUrl?: string;
  onOpenProfile: () => void;
  onOpenSettings: () => void;
  onLogout: () => void;
}

const getInitial = (name?: string) => (name?.trim().charAt(0) || 'U').toUpperCase();

export const Sidebar: React.FC<SidebarProps> = ({
  contacts,
  activeContactId,
  onSelectContact,
  username,
  avatarUrl,
  onOpenProfile,
  onOpenSettings,
  onLogout,
}) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!profileMenuRef.current?.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const displayName = username?.trim() || 'User';

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-4 flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight text-slate-800">Messages</h1>

        <div className="flex gap-1">
          <button className="p-2 hover:bg-indigo-50 rounded-full transition-colors text-slate-500 hover:text-indigo-600">
            <Edit size={20} />
          </button>
          <button className="p-2 hover:bg-indigo-50 rounded-full transition-colors text-slate-500 hover:text-indigo-600">
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      <div className="px-4 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search messages..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {contacts.map((contact) => (
          <button
            key={contact.id}
            onClick={() => onSelectContact(contact.id)}
            className={cn(
              "w-full p-4 flex items-center gap-3 hover:bg-indigo-50/50 transition-all text-left border-l-2 border-transparent",
              activeContactId === contact.id && "bg-indigo-50/70 border-l-indigo-500"
            )}
          >
            <div className="relative">
              <img
                src={contact.avatar}
                alt={contact.name}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-100"
                referrerPolicy="no-referrer"
              />
              {contact.online && (
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full shadow-sm" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline">
                <h3 className="font-semibold text-slate-800 truncate">{contact.name}</h3>
                {contact.lastMessageTime && (
                  <span className="text-[10px] text-slate-400 uppercase font-medium">
                    {format(contact.lastMessageTime, 'HH:mm')}
                  </span>
                )}
              </div>
              <div className="flex justify-between items-center mt-0.5">
                <p className="text-sm text-slate-500 truncate">{contact.lastMessage}</p>
                {contact.unreadCount > 0 && (
                  <span className="bg-indigo-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                    {contact.unreadCount}
                  </span>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="border-t border-slate-100 p-4">
        <div className="relative" ref={profileMenuRef}>
          <button
            onClick={() => setIsProfileMenuOpen((prev) => !prev)}
            className="flex w-full items-center justify-between gap-2 rounded-xl p-2 transition-colors hover:bg-slate-100"
          >
            <span className="flex min-w-0 items-center gap-2">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="h-8 w-8 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700">
                  {getInitial(displayName)}
                </span>
              )}
              <span className="truncate text-sm font-semibold text-slate-700">
                {displayName}
              </span>
            </span>
            <ChevronDown size={16} className="text-slate-500" />
          </button>

          {isProfileMenuOpen && (
            <div className="absolute bottom-full left-0 z-20 mb-2 w-44 rounded-xl border border-slate-200 bg-white p-1 shadow-lg">
              <button
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-100"
                onClick={() => {
                  setIsProfileMenuOpen(false);
                  onOpenProfile();
                }}
              >
                <User size={15} />
                Profile
              </button>
              <button
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-100"
                onClick={() => {
                  setIsProfileMenuOpen(false);
                  onOpenSettings();
                }}
              >
                <Settings size={15} />
                Settings
              </button>
              <button
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
                onClick={() => {
                  setIsProfileMenuOpen(false);
                  onLogout();
                }}
              >
                <LogOut size={15} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
