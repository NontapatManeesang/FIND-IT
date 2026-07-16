'use client';

import { useState, useEffect } from 'react';
import AppShell from '@/components/AppShell';
import { ItemCard } from '@/components/ItemCard';
import { Search, PackageX, PackageCheck, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

export default function HomePage() {
  const supabase = createClient();
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
    fetchItems();
    fetchUnreadCount();

    const interval = setInterval(fetchUnreadCount, 10000);
    const onVisible = () => { if (document.visibilityState === 'visible') { fetchUnreadCount(); fetchItems(); } };
    const onFocus = () => { fetchUnreadCount(); fetchItems(); };
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('focus', onFocus);
    return () => { clearInterval(interval); document.removeEventListener('visibilitychange', onVisible); window.removeEventListener('focus', onFocus); };
  }, []);

  const fetchItems = async () => {
    const { data } = await supabase.from('items').select('*').order('created_at', { ascending: false }).limit(20);
    setItems(data || []);
    setLoading(false);
  };

  const fetchUnreadCount = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from('messages').select('id').eq('receiver_id', user.id).eq('is_read', false);
    setUnreadCount(data?.length || 0);
  };

  const lostItems   = items.filter(i => i.type === 'lost');
  const foundItems  = items.filter(i => i.type === 'found');
  const userName    = user?.user_metadata?.display_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'นิสิต';

  return (
    <AppShell
      title={`สวัสดี, ${userName} 👋`}
      subtitle="FINDIT — MMU"
      userName={userName}
      unreadCount={unreadCount}
    >
      <div className="max-w-4xl mx-auto space-y-7">

        {/* ── Search ── */}
        <Link href="/search" className="block">
          <div className="relative group cursor-pointer">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-amber-500 transition-colors z-10" />
            <div className="w-full bg-white border border-slate-200 rounded-2xl pl-11 pr-4 py-3.5 text-[14px] text-slate-400 shadow-sm group-hover:border-amber-300 group-hover:shadow-md transition-all font-medium">
              ค้นหาสิ่งของที่หายหรือพบ...
            </div>
            <kbd className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-300 bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 tracking-wide">
              ⌘K
            </kbd>
          </div>
        </Link>

        {/* ── Quick Actions ── */}
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/search?type=lost"
            className="group relative overflow-hidden rounded-3xl bg-white border border-slate-200/80 p-6 flex flex-col gap-4 hover:border-rose-200 hover:shadow-md transition-all duration-200"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-rose-50/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center z-10 group-hover:scale-110 transition-transform duration-200">
              <PackageX size={24} className="text-rose-500" strokeWidth={1.8} />
            </div>
            <div className="z-10">
              <p className="font-bold text-slate-800 text-base font-display">ของหาย</p>
              <p className="text-sm text-slate-400 font-medium mt-0.5">{lostItems.length} รายการ</p>
            </div>
          </Link>

          <Link
            href="/search?type=found"
            className="group relative overflow-hidden rounded-3xl bg-white border border-slate-200/80 p-6 flex flex-col gap-4 hover:border-emerald-200 hover:shadow-md transition-all duration-200"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center z-10 group-hover:scale-110 transition-transform duration-200">
              <PackageCheck size={24} className="text-emerald-500" strokeWidth={1.8} />
            </div>
            <div className="z-10">
              <p className="font-bold text-slate-800 text-base font-display">พบของ</p>
              <p className="text-sm text-slate-400 font-medium mt-0.5">{foundItems.length} รายการ</p>
            </div>
          </Link>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'ของหาย',     value: lostItems.length,          color: 'text-rose-500',    bg: 'bg-rose-50',    icon: <PackageX size={16} className="text-rose-400" /> },
            { label: 'พบของ',      value: foundItems.length,         color: 'text-emerald-600', bg: 'bg-emerald-50', icon: <PackageCheck size={16} className="text-emerald-400" /> },
            { label: 'รายการทั้งหมด', value: items.length, color: 'text-amber-600', bg: 'bg-amber-50',  icon: <Search size={16} className="text-amber-400" /> },
          ].map(s => (
            <div key={s.label} className="bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-col gap-2">
              <div className={`w-7 h-7 rounded-xl ${s.bg} flex items-center justify-center`}>{s.icon}</div>
              <div>
                <p className={`text-2xl font-bold ${s.color} font-display leading-none`}>{s.value}</p>
                <p className="text-[11px] font-semibold text-slate-400 mt-1 tracking-wide uppercase">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Recent Items ── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900 font-display">รายการล่าสุด</h2>
            <Link href="/search" className="flex items-center gap-1 text-sm text-amber-600 font-semibold hover:text-amber-700 transition-colors group">
              ดูทั้งหมด
              <ChevronRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="rounded-3xl border border-slate-100 bg-white h-64 skeleton" />
              ))}
            </div>
          ) : items.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.slice(0, 9).map(item => (
                <ItemCard
                  key={item.id}
                  id={item.id}
                  type={item.type}
                  status={item.status || 'active'}
                  title={item.title}
                  place={item.place}
                  date={item.date ? new Date(item.date).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' }) : ''}
                  imageUrl={item.image_url}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 rounded-3xl border-2 border-dashed border-slate-200 bg-white">
              <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <PackageX size={28} className="text-slate-300" />
              </div>
              <p className="font-bold text-slate-700 text-lg font-display mb-1">ยังไม่มีรายการ</p>
              <p className="text-slate-400 text-sm font-medium">ยังไม่มีผู้แจ้งรายการในขณะนี้</p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
