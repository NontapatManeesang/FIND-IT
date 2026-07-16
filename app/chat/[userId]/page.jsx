'use client';

import { useState, useEffect, useRef } from 'react';
import AppShell from '@/components/AppShell';
import { Send, Package, User, CheckCheck, ImageOff, ArrowLeft } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { markMessagesRead } from '@/app/actions/chatActions';
import Link from 'next/link';

// ---- helpers (คงเดิม แต่ปรับปรุง UI นิดหน่อย) -------------------------------------------------------------

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

// ปรับ Palette สีให้ดูนุ่มนวลและทันสมัยขึ้น
const AVATAR_PALETTE = [
  { from: 'from-sky-400/20', to: 'to-blue-500/10', ring: 'ring-blue-100', text: 'text-blue-700' },
  { from: 'from-violet-400/20', to: 'to-purple-500/10', ring: 'ring-purple-100', text: 'text-purple-700' },
  { from: 'from-emerald-400/20', to: 'to-teal-500/10', ring: 'ring-teal-100', text: 'text-teal-700' },
  { from: 'from-amber-400/20', to: 'to-orange-500/10', ring: 'ring-orange-100', text: 'text-orange-800' },
  { from: 'from-rose-400/20', to: 'to-red-500/10', ring: 'ring-red-100', text: 'text-red-700' },
  { from: 'from-cyan-400/20', to: 'to-cyan-600/10', ring: 'ring-cyan-100', text: 'text-cyan-800' },
];

function avatarTheme(id) {
  if (!id) return AVATAR_PALETTE[0];
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return AVATAR_PALETTE[hash % AVATAR_PALETTE.length];
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
  }, [otherUserId, supabase]); // Added supabase to dependency

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
  }, [user, otherUserId, supabase]); // Added supabase to dependency

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
    setTimeout(() => inputRef.current?.focus(), 10); // Short delay to ensure focus works on mobile
  };

  const displayName = `ผู้ใช้ ...${otherUserId?.slice(-6) || ''}`;
  const grouped = groupMessages(messages);
  const theme = avatarTheme(otherUserId);

  return (
    // เปลี่ยน App Stage background เป็น slate-50 เพื่อให้ Message Bubbles เด่นขึ้น
    <div className="app-stage bg-slate-50 min-h-screen">
      <div className="relative mx-auto flex h-screen w-full max-w-5xl flex-col bg-slate-50 shadow-xl shadow-slate-100/50 border-x border-slate-100">

        {/* Ambient background wash - ทำให้นุ่มนวลขึ้น */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 10% 10%, rgba(56,189,248,0.15), transparent 40%), radial-gradient(circle at 90% 80%, rgba(139,92,246,0.1), transparent 50%)',
          }}
        />

        {/* Chat Header - ดูสะอาดและลอยขึ้นเล็กน้อย */}
        <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-slate-100 bg-white/95 px-4 py-2.5 shadow-sm backdrop-blur-lg">
          <Link
            href="/chat"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-900 active:scale-90"
            aria-label="กลับ"
          >
            <ArrowLeft size={20} strokeWidth={2.5} />
          </Link>

          <div className="relative shrink-0">
            <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${theme.from} ${theme.to} ring-2 ${theme.ring} shadow-inner`}>
              <span className={`text-xs font-bold tracking-wide ${theme.text}`}>
                {initialsFromId(otherUserId)}
              </span>
            </div>
            {/* Online Status Dot (Example) */}
            {/* <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-white"></div> */}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-base font-bold text-slate-950">{displayName}</p>
            {item ? (
              <p className="flex items-center gap-1.5 truncate text-xs text-slate-500">
                <Package size={13} className="shrink-0 text-sky-600" />
                กำลังสอบถาม: <span className='font-medium text-slate-700'>{item.title}</span>
              </p>
            ) : (
              <p className="text-xs text-slate-400 font-medium">การสนทนาส่วนตัว</p>
            )}
          </div>
        </div>

        {/* Item context banner - ปรับให้กลืนกับ Chat มากขึ้น */}
        {item && (
          <Link
            href={`/item/${item.id}`}
            className="
      group relative z-20 mx-4 mt-4 flex items-center gap-3.5
      overflow-hidden rounded-2xl
      border border-orange-300
      bg-orange-200
      p-3
      shadow-sm shadow-orange-300/50
      transition-all duration-300
      hover:-translate-y-0.5
      hover:border-orange-400
      hover:bg-orange-300
      hover:shadow-lg hover:shadow-orange-300/40
    "
          >
            {item.image_url ? (
              <img
                src={item.image_url}
                alt=""
                className="
          h-14 w-14 shrink-0 rounded-xl
          object-cover
          ring-2 ring-white/80
          shadow-md
          transition-transform duration-300
          group-hover:scale-105
        "
              />
            ) : (
              <div
                className="
          flex h-14 w-14 shrink-0 items-center justify-center
          rounded-xl
          bg-orange-100
          ring-2 ring-white/80
          shadow-sm
        "
              >
                <ImageOff size={20} className="text-orange-400" />
              </div>
            )}

            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-orange-700">
                สินค้าที่กำลังคุยอยู่
              </p>

              <p className="
        truncate text-[15px] font-semibold
        text-slate-900
        group-hover:text-orange-900
      ">
                {item.title}
              </p>

              {item.price && (
                <p className="mt-0.5 text-sm font-extrabold text-emerald-700">
                  ฿{item.price.toLocaleString()}
                </p>
              )}
            </div>

            <div
              className="
        flex h-8 w-8 items-center justify-center
        rounded-full
        bg-orange-300
        text-orange-800
        transition-all duration-300
        group-hover:bg-orange-500
        group-hover:text-white
      "
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.8"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </div>
          </Link>
        )}

        {/* Messages */}
        <div className="chat-scroll relative z-10 flex-1 space-y-1 overflow-y-auto px-4 py-6" style={{ paddingBottom: '100px' }}>
          {!user && (
            <div className="flex flex-col items-center gap-3 py-20">
              <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-sky-100 border-t-sky-600" />
              <p className="text-sm font-medium text-slate-500">กำลังโหลดข้อความ...</p>
            </div>
          )}

          {user && messages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className={`mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br ${theme.from} ${theme.to} ring-4 ${theme.ring} shadow-lg shadow-sky-100/50`}>
                <User size={36} className={theme.text} strokeWidth={1.5} />
              </div>
              <p className="mb-1.5 text-base font-bold text-slate-950">{displayName}</p>
              <p className="max-w-[260px] text-sm leading-relaxed text-slate-500">
                เริ่มการสนทนาโดยการส่งข้อความแรก<br />ข้อความของคุณจะปลอดภัยที่นี่
              </p>
            </div>
          )}

          {grouped.map((group, idx) => {
            if (group.type === 'divider') {
              return (
                <div key={group.key} className="flex items-center justify-center py-4">
                  <div className='absolute h-[1px] w-1/2 bg-slate-100' />
                  <span className="relative z-10 rounded-full border border-slate-100 bg-slate-50 px-4 py-1 text-xs font-semibold text-slate-500 shadow-sm backdrop-blur-sm">
                    {group.label}
                  </span>
                </div>
              );
            }

            const { msg, isFirstInGroup, isLastInGroup } = group;
            const isMe = msg.sender_id === user?.id;
            const time = new Date(msg.created_at).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
            const isPending = msg.id.startsWith('temp-');

            // Logic สำหรับ Corner Radius ของ Message Bubbles เพื่อให้ดูนุ่มนวลและ Group กันได้ดีขึ้น
            const roundedClasses = isMe
              ? `rounded-[18px] ${isFirstInGroup ? 'rounded-br-[6px]' : ''} ${isLastInGroup ? 'rounded-br-[18px]' : 'rounded-br-[6px]'} ${!isFirstInGroup && !isLastInGroup ? 'rounded-br-[6px]' : ''}`
              : `rounded-[18px] ${isFirstInGroup ? 'rounded-bl-[6px]' : ''} ${isLastInGroup ? 'rounded-bl-[18px]' : 'rounded-bl-[6px]'} ${!isFirstInGroup && !isLastInGroup ? 'rounded-bl-[6px]' : ''}`;


            return (
              <div
                key={msg.id}
                className={`flex ${isMe ? 'justify-end' : 'justify-start'} gap-2.5 ${isFirstInGroup ? 'mt-4' : 'mt-0.5'} animate-fade-in`}
              >
                {!isMe && (
                  <div className="w-8 shrink-0 flex items-end justify-center">
                    {isLastInGroup ? (
                      <div className={`h-8 w-8 rounded-full bg-gradient-to-br ${theme.from} ${theme.to} ring-1 ${theme.ring} flex items-center justify-center shadow-sm`}>
                        <span className={`text-[10px] font-bold ${theme.text}`}> {initialsFromId(otherUserId)}</span>
                      </div>
                    ) : <div className='w-8' />}
                  </div>
                )}

                <div className={`flex max-w-[72%] flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  <div
                    className={[
                      'px-4 py-2.5 text-[15px] leading-relaxed shadow-sm transition-all whitespace-pre-wrap break-words',
                      roundedClasses,
                      isMe
                        ? 'bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-blue-100'
                        : 'bg-white text-slate-900 border border-slate-100 shadow-slate-100/50',
                      isPending ? 'opacity-70 animate-pulse' : 'opacity-100',
                    ].join(' ')}
                  >
                    {msg.text}
                  </div>

                  {isLastInGroup && (
                    <div className={`mt-1.5 flex items-center gap-1.5 px-1 ${isMe ? 'flex-row-reverse' : ''}`}>
                      <span className="text-[11px] font-medium text-slate-400">{time}</span>
                      {isMe && !isPending && (
                        <CheckCheck size={14} className={msg.is_read ? "text-sky-500" : "text-slate-300"} />
                      )}
                      {isMe && isPending && (
                        <div className="h-3 w-3 animate-spin rounded-full border-2 border-slate-200 border-t-slate-400"></div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input — fixed at bottom, เติม Gap และ Padding */}
        <div className="absolute bottom-0 left-0 right-0 z-30 mx-auto w-full max-w-5xl border-t border-slate-100 bg-white/95 px-4 py-3 shadow-[0_-4px_12px_-2px_rgba(0,0,0,0.03)] backdrop-blur-lg safe-bottom">
          <form onSubmit={handleSend} className="flex items-center gap-2.5">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="พิมพ์ข้อความของคุณที่นี่..."
              autoComplete="off"
              disabled={!user}
              className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-5 py-3 text-sm text-slate-950 shadow-inner transition-all placeholder:text-slate-400 focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || sending || !user}
              aria-label="ส่งข้อความ"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-md shadow-blue-200 transition-all hover:from-sky-600 hover:to-blue-700 active:scale-95 disabled:cursor-not-allowed disabled:from-slate-300 disabled:to-slate-400 disabled:shadow-none disabled:opacity-70"
            >
              <Send size={18} className="ml-0.5" strokeWidth={2.5} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}