import AppShell from '@/components/AppShell';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { MessageCircle, User, ChevronRight, Clock } from 'lucide-react';

export default async function ChatListPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch all messages involving current user
  const { data: allMessages } = await supabase
    .from('messages')
    .select('*')
    .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
    .order('created_at', { ascending: false });

  // Build conversation list: unique other user IDs
  const conversationMap = new Map();
  for (const msg of (allMessages || [])) {
    const otherId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id;
    if (!conversationMap.has(otherId)) {
      conversationMap.set(otherId, {
        otherId,
        lastMessage: msg,
        unread: 0,
      });
    }
    // Count unread
    if (msg.receiver_id === user.id && !msg.is_read) {
      conversationMap.get(otherId).unread++;
    }
  }

  const conversations = Array.from(conversationMap.values());

  // Fetch user info for each conversation partner from auth.users metadata
  const conversationsWithUsers = await Promise.all(
    conversations.map(async (conv) => {
      // Try to get from items (owner info) since we don't have profiles table
      const { data: userItems } = await supabase
        .from('items')
        .select('user_id, title')
        .eq('user_id', conv.otherId)
        .limit(1);

      // Check if item referenced in last message
      let itemTitle = null;
      if (conv.lastMessage.item_id) {
        const { data: itemData } = await supabase
          .from('items')
          .select('title')
          .eq('id', conv.lastMessage.item_id)
          .single();
        itemTitle = itemData?.title;
      }

      return {
        ...conv,
        displayName: `ผู้ใช้ ...${conv.otherId.slice(-6)}`,
        itemTitle,
      };
    })
  );

  const totalUnread = conversationsWithUsers.reduce((sum, c) => sum + c.unread, 0);

  return (
    <AppShell
      title="แชต"
      subtitle="การสนทนาส่วนตัว"
      userName={user?.user_metadata?.display_name || user?.email?.split('@')[0]}
      unreadCount={totalUnread}
    >
      {conversations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-3xl bg-blue-50 flex items-center justify-center mb-4">
            <MessageCircle size={28} className="text-primary" strokeWidth={1.5} />
          </div>
          <h3 className="text-base font-semibold text-ink mb-2">ยังไม่มีการสนทนา</h3>
          <p className="text-sm text-muted max-w-[220px] leading-relaxed">
            ค้นหาสิ่งของและกด "แชตกับผู้แจ้ง" เพื่อเริ่มการสนทนา
          </p>
          <Link
            href="/search"
            className="mt-6 px-6 py-2.5 bg-primary text-white rounded-2xl text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            ไปค้นหาสิ่งของ
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {conversationsWithUsers.map((conv) => (
            <Link
              key={conv.otherId}
              href={`/chat/${conv.otherId}`}
              className="flex items-center gap-3 p-3.5 rounded-2xl border border-line bg-white hover:border-primary/30 hover:shadow-soft transition-all duration-200 active:scale-[0.99]"
            >
              {/* Avatar */}
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                conv.unread > 0 ? 'bg-primary/10' : 'bg-gray-100'
              }`}>
                <User size={20} className={conv.unread > 0 ? 'text-primary' : 'text-muted'} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className={`text-sm font-semibold truncate ${conv.unread > 0 ? 'text-ink' : 'text-ink'}`}>
                    {conv.displayName}
                  </p>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {conv.unread > 0 && (
                      <span className="w-5 h-5 bg-primary rounded-full text-white text-[10px] flex items-center justify-center font-bold">
                        {conv.unread}
                      </span>
                    )}
                    <ChevronRight size={14} className="text-muted" />
                  </div>
                </div>
                <p className={`text-xs truncate mt-0.5 ${conv.unread > 0 ? 'text-ink font-medium' : 'text-muted'}`}>
                  {conv.lastMessage.sender_id === user.id ? 'คุณ: ' : ''}
                  {conv.lastMessage.text}
                </p>
                {conv.itemTitle && (
                  <p className="text-[10px] text-primary mt-0.5 truncate">
                    📦 {conv.itemTitle}
                  </p>
                )}
                <p className="text-[10px] text-muted/70 mt-0.5 flex items-center gap-1">
                  <Clock size={9} />
                  {new Date(conv.lastMessage.created_at).toLocaleDateString('th-TH', {
                    month: 'short', day: 'numeric',
                    hour: '2-digit', minute: '2-digit'
                  })}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </AppShell>
  );
}
