'use client';

import { useState, useEffect } from 'react';
import AppShell from '@/components/AppShell';
import { Input } from '@/components/Input';
import { ItemCard } from '@/components/ItemCard';
import { Search, PackageX, PackageCheck, TrendingUp, MessageCircle, X } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

export default function HomePage() {
  const supabase = createClient();
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get current user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // Fetch items
    fetchItems();
    fetchUnreadCount();

    // Poll for unread count every 5 seconds (faster)
    const interval = setInterval(fetchUnreadCount, 5000);

    // Refresh when page becomes visible
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchUnreadCount();
        fetchItems();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Refresh when window gets focus
    const handleFocus = () => {
      fetchUnreadCount();
      fetchItems();
    };
    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const fetchItems = async () => {
    const { data } = await supabase
      .from('items')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);
    setItems(data || []);
    setLoading(false);
  };

  const fetchUnreadCount = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: unreadMessages } = await supabase
      .from('messages')
      .select('id, is_read, receiver_id')
      .eq('receiver_id', user.id)
      .eq('is_read', false);
    
    console.log('Unread messages count:', unreadMessages?.length || 0);
    console.log('Unread messages:', unreadMessages);
    
    setUnreadCount(unreadMessages?.length || 0);
  };

  const lostItems = items?.filter(i => i.type === 'lost') || [];
  const foundItems = items?.filter(i => i.type === 'found') || [];
  const recentItems = items || [];

  // Get user display name from user metadata
  const userName = user?.user_metadata?.display_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'นิสิต';

  return (
    <AppShell
      title={`สวัสดี, ${userName} 👋`}
      subtitle="วันนี้คุณทำของหายหรือพบของหรือไม่?"
      userName={userName}
      unreadCount={unreadCount}
    >
      {/* Search bar */}
      <Link href="/search" className="block mb-5">
        <div className="relative">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted z-10" />
          <div className="w-full rounded-2xl border border-line bg-gray-50 px-4 py-3.5 text-[15px] text-muted/60 pl-11 cursor-pointer hover:border-primary/40 hover:bg-white transition-all">
            ค้นหาสิ่งของที่หายหรือพบ...
          </div>
        </div>
      </Link>

      {/* Unread message notification */}
      {unreadCount > 0 && (
        <Link href="/chat" className="block mb-5">
          <div className="relative rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 p-4 hover:shadow-md transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <MessageCircle size={20} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-ink">มีข้อความใหม่</p>
                <p className="text-xs text-muted">คุณมี {unreadCount} ข้อความที่ยังไม่ได้อ่าน</p>
              </div>
              <div className="w-6 h-6 bg-primary rounded-full text-white text-xs flex items-center justify-center font-bold">
                {unreadCount}
              </div>
            </div>
          </div>
        </Link>
      )}

      {/* Quick action cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Link
          href="/search?type=lost"
          className="group flex flex-col items-center gap-3 rounded-2xl border border-rose-100 bg-gradient-to-br from-rose-50 to-red-50 py-6 text-center hover:border-rose-200 hover:shadow-md transition-all duration-200 active:scale-[0.98]"
        >
          <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center group-hover:bg-rose-200 transition-colors">
            <PackageX size={22} className="text-rose-500" strokeWidth={1.8} />
          </div>
          <div>
            <span className="block text-sm font-semibold text-ink">ของหาย</span>
            <span className="block text-[11px] text-muted mt-0.5">{lostItems.length} รายการ</span>
          </div>
        </Link>
        <Link
          href="/search?type=found"
          className="group flex flex-col items-center gap-3 rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-green-50 py-6 text-center hover:border-emerald-200 hover:shadow-md transition-all duration-200 active:scale-[0.98]"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
            <PackageCheck size={22} className="text-emerald-600" strokeWidth={1.8} />
          </div>
          <div>
            <span className="block text-sm font-semibold text-ink">ของที่พบ</span>
            <span className="block text-[11px] text-muted mt-0.5">{foundItems.length} รายการ</span>
          </div>
        </Link>
      </div>

      {/* Stats bar */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1 flex items-center gap-2.5 rounded-2xl border border-line bg-white p-3 shadow-soft">
          <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center">
            <PackageX size={14} className="text-rose-500" />
          </div>
          <div>
            <p className="text-lg font-bold text-ink leading-none">{lostItems.length}</p>
            <p className="text-[10px] text-muted mt-0.5">ของหาย</p>
          </div>
        </div>
        <div className="flex-1 flex items-center gap-2.5 rounded-2xl border border-line bg-white p-3 shadow-soft">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center">
            <PackageCheck size={14} className="text-emerald-600" />
          </div>
          <div>
            <p className="text-lg font-bold text-ink leading-none">{foundItems.length}</p>
            <p className="text-[10px] text-muted mt-0.5">ของที่พบ</p>
          </div>
        </div>
        <div className="flex-1 flex items-center gap-2.5 rounded-2xl border border-line bg-white p-3 shadow-soft">
          <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
            <TrendingUp size={14} className="text-primary" />
          </div>
          <div>
            <p className="text-lg font-bold text-ink leading-none">{recentItems.length}</p>
            <p className="text-[10px] text-muted mt-0.5">รายการ</p>
          </div>
        </div>
      </div>

      {/* Recent items */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-ink">รายการล่าสุด</h2>
        <Link href="/search" className="text-xs text-primary font-medium hover:underline">
          ดูทั้งหมด →
        </Link>
      </div>

      <div className="space-y-3">
        {recentItems.length > 0 ? (
          recentItems.slice(0, 10).map((item) => (
            <ItemCard
              key={item.id}
              id={item.id}
              type={item.type}
              status={item.status || 'active'}
              title={item.title}
              place={item.place}
              date={item.date ? new Date(item.date).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' }) : ''}
              imageLabel={item.image_url ? undefined : 'รูปภาพ'}
              imageUrl={item.image_url}
            />
          ))
        ) : (
          <div className="text-center text-sm text-muted py-12 rounded-2xl border border-dashed border-line">
            <PackageX size={32} className="mx-auto mb-3 text-muted/40" />
            <p>ยังไม่มีรายการสิ่งของ</p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
