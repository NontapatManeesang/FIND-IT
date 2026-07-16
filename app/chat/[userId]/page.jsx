'use client';

import { useState, useEffect, useRef } from 'react';
import AppShell from '@/components/AppShell';
import { Send, Package, User, CheckCheck, ImageOff } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { markMessagesRead } from '@/app/actions/chatActions';
import Link from 'next/link';

// ---- helpers -------------------------------------------------------------

function formatDayLabel(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  const startOfDay = (x) => new Date(x.getFullYear(), x.getMonth(), x.getDate());
  const diffDays = Math.round((startOfDay(now) - startOfDay(d)) / 86400000);

  if (diffDays === 0) return 'วันนี้';
  if (diffDays === 1) return 'เมื่อวาน';
  return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: diffDays > 300 ? 'numeric' : undefined });
}

function groupMessages(messages) {
  const groups = [];
  let currentDay = null;
  let currentGroup = null;

  messages.forEach((msg, idx) => {
    const day = new Date(msg.created_at).toDateString();
    if (day !== currentDay) {
      currentDay = day;
      groups.push({ type: 'divider', label: formatDayLabel(msg.created_at), key: `divider-${day}` });
    }

    const prev = messages[idx - 1];
    const next = messages[idx + 1];
    const sameSenderAsPrev = prev && prev.sender_id === msg.sender_id && new Date(msg.created_at).toDateString() === new Date(prev.created_at).toDateString();
    const sameSenderAsNext = next && next.sender_id === msg.sender_id && new Date(msg.created_at).toDateString() === new Date(next.created_at).toDateString();

    groups.push({
      type: 'message',
      msg,
      isFirstInGroup: !sameSenderAsPrev,
      isLastInGroup: !sameSenderAsNext,
    });
  });

  return groups;
}

function initialsFromId(id) {
  if (!id) return '?';
  return id.slice(0, 2).toUpperCase();
}

// ---- component ------------------------------------------------------------

export default function PrivateChatPage({ params }) {
  const { userId: otherUserId } = params;
  const supabase = createClient();

  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [item, setItem] = useState(null);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const [itemId, setItemId] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = (behavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    scrollToBottom(messages.length <= 1 ? 'auto' : 'smooth');
  }, [messages]);

  // Init: get current user
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const url = new URL(window.location.href);
    const iid = url.searchParams.get('item_id');
    setItemId(iid);

    if (iid) {
      supabase.from('items').select('*').eq('id', iid).single().then(({ data }) => {
        setItem(data);
      });
    }
  }, [otherUserId]);

  const fetchMessages = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${user.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${user.id})`)
      .order('created_at', { ascending: true });

    setMessages(data || []);

    if (!item && data && data.length > 0) {
      const latestMessageWithItem = [...data].reverse().find(m => m.item_id);
      if (latestMessageWithItem) {
        const { data: itemData } = await supabase
          .from('items')
          .select('*')
          .eq('id', latestMessageWithItem.item_id)
          .single();
        if (itemData) {
          setItem(itemData);
          setItemId(itemData.id);
        }
      }
    }

    const unreadMessages = data?.filter(m => m.receiver_id === user.id && !m.is_read) || [];

    if (unreadMessages.length > 0) {
      await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('receiver_id', user.id)
        .eq('sender_id', otherUserId);

      await markMessagesRead(otherUserId);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchMessages();

    const interval = setInterval(fetchMessages, 5000);

    const channel = supabase
      .channel(`chat-${user.id}-${otherUserId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `receiver_id=eq.${user.id}`,
      }, () => {
        fetchMessages();
      })
      .subscribe();

    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, [user, otherUserId]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !user || sending) return;

    setSending(true);
    const text = inputText.trim();
    setInputText('');

    const optimisticMsg = {
      id: `temp-${Date.now()}`,
      sender_id: user.id,
      receiver_id: otherUserId,
      text,
      created_at: new Date().toISOString(),
      is_read: false,
      item_id: itemId || null,
    };
    setMessages(prev => [...prev, optimisticMsg]);

    const { error } = await supabase.from('messages').insert({
      sender_id: user.id,
      receiver_id: otherUserId,
      item_id: itemId || null,
      text,
      is_read: false,
    });

    if (error) {
      setMessages(prev => prev.filter(m => m.id !== optimisticMsg.id));
      setInputText(text);
    } else {
      await fetchMessages();
    }

    setSending(false);
    inputRef.current?.focus();
  };

  const displayName = `ผู้ใช้ ...${otherUserId?.slice(-6) || ''}`;
  const grouped = groupMessages(messages);

  return (
    <div className="app-stage">
      <div className="relative mx-auto flex h-screen w-full max-w-5xl flex-col bg-gradient-to-b from-gray-50/60 to-white">
        {/* Chat Header */}
        <div className="sticky top-0 z-20 flex items-center gap-3 border-b border-line/70 bg-white/90 px-4 py-3 shadow-[0_1px_0_0_rgba(0,0,0,0.02),0_4px_16px_-8px_rgba(0,0,0,0.06)] backdrop-blur-md">
          <Link
            href="/chat"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink/70 transition-colors hover:bg-gray-100 hover:text-ink"
            aria-label="กลับ"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </Link>

          <div className="relative shrink-0">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 ring-1 ring-primary/10">
              <span className="text-[11px] font-semibold tracking-wide text-primary">
                {initialsFromId(otherUserId)}
              </span>
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-ink">{displayName}</p>
            {item && (
              <p className="flex items-center gap-1 truncate text-[11px] text-muted">
                <Package size={10} className="shrink-0" />
                {item.title}
              </p>
            )}
          </div>
        </div>

        {/* Item context banner */}
        {item && (
          <Link
            href={`/item/${item.id}`}
            className="group mx-4 mt-3 flex items-center gap-3 rounded-2xl border border-primary/10 bg-gradient-to-r from-blue-50 to-blue-50/40 px-3 py-2.5 transition-colors hover:border-primary/20"
          >
            {item.image_url ? (
              <img
                src={item.image_url}
                alt=""
                className="h-10 w-10 shrink-0 rounded-xl object-cover ring-1 ring-black/5"
              />
            ) : (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white ring-1 ring-black/5">
                <ImageOff size={14} className="text-muted/50" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-medium uppercase tracking-wide text-primary/70">กำลังคุยเกี่ยวกับ</p>
              <p className="truncate text-xs font-medium text-ink group-hover:underline">{item.title}</p>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-primary/40">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </Link>
        )}

        {/* Messages */}
        <div className="chat-scroll flex-1 space-y-1 overflow-y-auto px-4 py-5" style={{ paddingBottom: '96px' }}>
          {!user && (
            <div className="flex flex-col items-center gap-3 py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
              <p className="text-sm text-muted">กำลังโหลด...</p>
            </div>
          )}

          {user && messages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-primary/10 to-primary/[0.03] ring-1 ring-primary/10">
                <User size={26} className="text-primary" strokeWidth={1.5} />
              </div>
              <p className="mb-1 text-sm font-semibold text-ink">{displayName}</p>
              <p className="max-w-[220px] text-xs leading-relaxed text-muted">
                ยังไม่มีข้อความ — ส่งข้อความแรกเพื่อเริ่มการสนทนา
              </p>
            </div>
          )}

          {grouped.map((item) => {
            if (item.type === 'divider') {
              return (
                <div key={item.key} className="flex items-center justify-center py-3">
                  <span className="rounded-full bg-gray-100/80 px-3 py-1 text-[10px] font-medium text-muted">
                    {item.label}
                  </span>
                </div>
              );
            }

            const { msg, isFirstInGroup, isLastInGroup } = item;
            const isMe = msg.sender_id === user?.id;
            const time = new Date(msg.created_at).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
            const isPending = msg.id.startsWith('temp-');

            return (
              <div
                key={msg.id}
                className={`flex ${isMe ? 'justify-end' : 'justify-start'} gap-2 ${isFirstInGroup ? 'mt-3' : 'mt-0.5'} animate-fade-in`}
              >
                {!isMe && (
                  <div className={`h-7 w-7 shrink-0 self-end rounded-xl ${isLastInGroup ? 'visible bg-gray-100' : 'invisible'} flex items-center justify-center`}>
                    <User size={13} className="text-muted" />
                  </div>
                )}

                <div className={`flex max-w-[75%] flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  <div
                    className={[
                      'px-4 py-2.5 text-sm leading-relaxed shadow-sm transition-opacity',
                      isMe
                        ? 'bg-gradient-to-br from-primary to-blue-700 text-white'
                        : 'bg-gray-100 text-ink',
                      // bubble corner shaping based on grouping
                      isMe
                        ? `rounded-2xl ${isLastInGroup ? 'rounded-br-md' : 'rounded-br-2xl'}`
                        : `rounded-2xl ${isLastInGroup ? 'rounded-bl-md' : 'rounded-bl-2xl'}`,
                      isPending ? 'opacity-60' : 'opacity-100',
                    ].join(' ')}
                  >
                    {msg.text}
                  </div>

                  {isLastInGroup && (
                    <div className={`mt-1 flex items-center gap-1 px-1 ${isMe ? 'flex-row-reverse' : ''}`}>
                      <span className="text-[10px] text-muted/60">{time}</span>
                      {isMe && !isPending && msg.is_read && (
                        <CheckCheck size={11} className="text-primary/70" />
                      )}
                      {isMe && isPending && (
                        <span className="text-[10px] text-muted/40">กำลังส่ง...</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input — fixed at bottom */}
        <div className="absolute bottom-0 left-0 right-0 mx-auto w-full max-w-5xl border-t border-line/60 bg-white/90 px-4 py-3 backdrop-blur-md safe-bottom">
          <form onSubmit={handleSend} className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="พิมพ์ข้อความ..."
              autoComplete="off"
              disabled={!user}
              className="flex-1 rounded-2xl border border-line bg-gray-50 px-4 py-2.5 text-sm text-ink shadow-inner transition-all placeholder:text-muted/60 focus:border-primary focus:bg-white focus:shadow-none focus:ring-4 focus:ring-primary/10 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || sending || !user}
              aria-label="ส่งข้อความ"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary text-white shadow-sm transition-all hover:bg-blue-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100"
            >
              <Send size={16} className="ml-0.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}