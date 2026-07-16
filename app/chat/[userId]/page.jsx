'use client';

import { useState, useEffect, useRef } from 'react';
import AppShell from '@/components/AppShell';
import { Send, Package, User, CheckCheck } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { markMessagesRead } from '@/app/actions/chatActions';
import Link from 'next/link';

export default function PrivateChatPage({ params }) {
  const { userId: otherUserId } = params;
  const supabase = createClient();

  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [item, setItem] = useState(null);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const [itemId, setItemId] = useState(null);
  const [otherUserName, setOtherUserName] = useState('');
  const messagesEndRef = useRef(null);

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Init: get current user
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // Get item_id from URL if any
    const url = new URL(window.location.href);
    const iid = url.searchParams.get('item_id');
    setItemId(iid);

    if (iid) {
      supabase.from('items').select('*').eq('id', iid).single().then(({ data }) => {
        setItem(data);
      });
    }

    // Try to get other user's name from items they own
    supabase
      .from('items')
      .select('user_id')
      .eq('user_id', otherUserId)
      .limit(1)
      .then(({ data }) => {
        // fallback display name
      });
  }, [otherUserId]);

  // Fetch messages
  const fetchMessages = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${user.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${user.id})`)
      .order('created_at', { ascending: true });

    setMessages(data || []);

    // Mark as read directly using client
    const unreadMessages = data?.filter(m => m.receiver_id === user.id && !m.is_read);
    console.log('Unread messages in chat:', unreadMessages.length);
    
    if (unreadMessages.length > 0) {
      console.log('Marking messages as read directly');
      await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('receiver_id', user.id)
        .eq('sender_id', otherUserId);
      
      // Also call server action for revalidation
      await markMessagesRead(otherUserId);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchMessages();

    // Poll every 5 seconds for new messages
    const interval = setInterval(fetchMessages, 5000);

    // Realtime subscription
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

    // Optimistic update
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
  };

  const displayName = `ผู้ใช้ ...${otherUserId?.slice(-6) || ''}`;

  return (
    <div className="app-stage">
      <div className="app-viewport flex flex-col h-screen">
        {/* Chat Header */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-line px-4 py-3 flex items-center gap-3">
          <Link href="/chat" className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </Link>
          <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
            <User size={18} className="text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-ink truncate">{displayName}</p>
            {item && (
              <p className="text-[11px] text-muted truncate flex items-center gap-1">
                <Package size={10} />
                {item.title}
              </p>
            )}
          </div>
        </div>

        {/* Item context banner */}
        {item && (
          <div className="px-4 py-2 bg-blue-50 border-b border-blue-100">
            <div className="flex items-center gap-2">
              <Package size={14} className="text-primary shrink-0" />
              <div className="min-w-0">
                <p className="text-[11px] text-muted">เกี่ยวกับสิ่งของ:</p>
                <Link href={`/item/${item.id}`} className="text-xs font-medium text-primary hover:underline truncate block">
                  {item.title}
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 chat-scroll" style={{ paddingBottom: '80px' }}>
          {!user && (
            <div className="text-center text-sm text-muted py-8">กำลังโหลด...</div>
          )}

          {user && messages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-14 h-14 rounded-3xl bg-blue-50 flex items-center justify-center mb-3">
                <User size={24} className="text-primary" strokeWidth={1.5} />
              </div>
              <p className="text-sm font-medium text-ink mb-1">{displayName}</p>
              <p className="text-xs text-muted">เริ่มต้นส่งข้อความแรกของคุณ</p>
            </div>
          )}

          {messages.map((msg, idx) => {
            const isMe = msg.sender_id === user?.id;
            const time = new Date(msg.created_at).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
            const showAvatar = !isMe && (idx === 0 || messages[idx - 1]?.sender_id !== msg.sender_id);

            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} gap-2 animate-fade-in`}>
                {!isMe && (
                  <div className={`w-7 h-7 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 self-end ${showAvatar ? 'visible' : 'invisible'}`}>
                    <User size={13} className="text-muted" />
                  </div>
                )}
                <div className={`max-w-[75%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      isMe
                        ? 'bg-primary text-white rounded-br-md shadow-sm'
                        : 'bg-gray-100 text-ink rounded-bl-md'
                    } ${msg.id.startsWith('temp-') ? 'opacity-70' : ''}`}
                  >
                    {msg.text}
                  </div>
                  <div className={`flex items-center gap-1 mt-1 ${isMe ? 'flex-row-reverse' : ''}`}>
                    <span className="text-[10px] text-muted/70">{time}</span>
                    {isMe && msg.is_read && (
                      <CheckCheck size={11} className="text-primary/70" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input — fixed at bottom */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-line px-4 py-3 safe-bottom">
          <form onSubmit={handleSend} className="flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="พิมพ์ข้อความ..."
              autoComplete="off"
              className="flex-1 rounded-2xl border border-line bg-gray-50 px-4 py-2.5 text-sm text-ink placeholder:text-muted/60 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || sending}
              aria-label="ส่งข้อความ"
              className="w-10 h-10 shrink-0 flex items-center justify-center rounded-2xl bg-primary text-white hover:bg-blue-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
            >
              <Send size={16} className="ml-0.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
