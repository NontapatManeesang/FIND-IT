'use client';

import { useState, useEffect } from 'react';
import AppShell from '@/components/AppShell';
import { ItemCard } from '@/components/ItemCard';
import { Search, PackageX, PackageCheck, ChevronRight, Sparkles } from 'lucide-react';
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
  }, [supabase]);

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

  const lostItems = items.filter(i => i.type === 'lost');
  const foundItems = items.filter(i => i.type === 'found');
  const userName = user?.user_metadata?.display_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'นิสิต';

  return (
    <AppShell className=""
      title={
        <div className="flex items-center gap-3 shadow-sm">
          <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
            👋
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black text-slate-800">
              HELLO, {userName}
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              ยินดีต้อนรับกลับมา
            </p>
          </div>
        </div>
      }
      subtitle=""
      userName={userName}
      unreadCount={unreadCount}
    >
      <div className="relative max-w-4xl mx-auto space-y-6 px-4 sm:px-2 pb-10 overflow-hidden">


        {/* ── Search Bar ── */}
        <Link href="/search" className="relative block z-10">
          <div className="relative group cursor-pointer">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-sky-500 transition-colors z-10" />
            <div className="w-full bg-white/90 border border-slate-200/80 rounded-2xl pl-11 pr-4 py-3 sm:py-3.5 text-sm text-slate-400 shadow-sm backdrop-blur-sm group-hover:border-sky-400 group-hover:ring-4 group-hover:ring-sky-100 transition-all font-medium">
              ค้นหาสิ่งของที่หายหรือพบ...
            </div>
            <kbd className="hidden sm:inline-flex absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-sky-600 bg-sky-50 border border-sky-100 rounded px-1.5 py-0.5 tracking-wide">
              ⌘K
            </kbd>
          </div>
        </Link>

        {/* ── Quick Actions ── */}
        <div className="relative z-10 grid grid-cols-2 gap-3 sm:gap-4">

          {/* Lost */}
          <Link
            href="/search?type=lost"
            className="
      group relative overflow-hidden
      rounded-3xl
      bg-gradient-to-br from-rose-600 to-red-700
      border border-rose-500
      p-3.5 sm:p-5
      flex flex-col gap-3
      shadow-lg shadow-rose-300/40
      transition-all duration-300
      hover:-translate-y-1
      hover:shadow-xl hover:shadow-rose-400/50
      active:scale-[0.97]
    "
          >
            <div
              className="
        absolute -right-10 -top-10
        h-28 w-28
        rounded-full
        bg-white/10
        blur-2xl
        group-hover:bg-white/20
        transition-all
      "
            />

            <div
              className="
        relative z-10
        flex items-center justify-center
        w-11 h-11 sm:w-12 sm:h-12
        rounded-2xl
        bg-white/20
        backdrop-blur-sm
        shadow-inner
        group-hover:scale-110
        transition-transform
      "
            >
              <PackageX
                size={22}
                className="text-white"
                strokeWidth={2.5}
              />
            </div>

            <div className="relative z-10">
              <p className="font-extrabold text-sm sm:text-base text-white">
                แจ้งของหาย
              </p>
              <p className="mt-0.5 text-[11px] sm:text-xs text-rose-100">
                ของที่คุณหาไม่เจอ
              </p>
            </div>

            <div className="
      absolute bottom-3 right-3
      text-white/60
      text-lg
      transition-transform
      group-hover:translate-x-1
    ">
              →
            </div>
          </Link>


          {/* Found */}
          <Link
            href="/search?type=found"
            className="
      group relative overflow-hidden
      rounded-3xl
      bg-gradient-to-br from-emerald-600 to-teal-700
      border border-emerald-500
      p-3.5 sm:p-5
      flex flex-col gap-3
      shadow-lg shadow-emerald-300/40
      transition-all duration-300
      hover:-translate-y-1
      hover:shadow-xl hover:shadow-emerald-400/50
      active:scale-[0.97]
    "
          >
            <div
              className="
        absolute -right-10 -top-10
        h-28 w-28
        rounded-full
        bg-white/10
        blur-2xl
        group-hover:bg-white/20
        transition-all
      "
            />

            <div
              className="
        relative z-10
        flex items-center justify-center
        w-11 h-11 sm:w-12 sm:h-12
        rounded-2xl
        bg-white/20
        backdrop-blur-sm
        shadow-inner
        group-hover:scale-110
        transition-transform
      "
            >
              <PackageCheck
                size={22}
                className="text-white"
                strokeWidth={2.5}
              />
            </div>

            <div className="relative z-10">
              <p className="font-extrabold text-sm sm:text-base text-white">
                แจ้งพบสิ่งของ
              </p>
              <p className="mt-0.5 text-[11px] sm:text-xs text-emerald-100">
                สิ่งของที่คุณเจอ
              </p>
            </div>

            <div className="
      absolute bottom-3 right-3
      text-white/60
      text-lg
      transition-transform
      group-hover:translate-x-1
    ">
              →
            </div>

          </Link>

        </div>

        {/* ── Stats — ปรับข้อมูลตัวหนังสือและไอคอนให้อยู่ตรงกลาง (Center Aligned) ── */}
        <div className="relative z-10 grid grid-cols-3 gap-2.5 sm:gap-3.5">
          {[
            { label: 'ของหาย', value: lostItems.length, color: 'text-rose-700', bg: 'bg-gradient-to-br from-rose-100/80 to-rose-50 border-rose-200/60', iconClass: 'bg-rose-500 text-white', icon: <PackageX size={13} strokeWidth={2.5} /> },
            { label: 'พบของ', value: foundItems.length, color: 'text-emerald-700', bg: 'bg-gradient-to-br from-emerald-100/80 to-emerald-50 border-emerald-200/60', iconClass: 'bg-emerald-500 text-white', icon: <PackageCheck size={13} strokeWidth={2.5} /> },
            { label: 'ทั้งหมด', value: items.length, color: 'text-sky-700', bg: 'bg-gradient-to-br from-sky-100/80 to-sky-50 border-sky-200/60', iconClass: 'bg-sky-500 text-white', icon: <Search size={13} strokeWidth={2.5} /> },
          ].map(s => (
            <div
              key={s.label}
              className={`border rounded-xl sm:rounded-2xl p-3 sm:p-4 flex flex-col items-center justify-center text-center gap-2 shadow-sm ${s.bg}`}
            >
              {/* ไอคอนอยู่ตรงกลาง */}
              {/* <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg shrink-0 flex items-center justify-center shadow-sm ${s.iconClass}`}>
                {s.icon}
              </div> */}
              {/* ตัวเลขและข้อความอยู่ตรงกลางบรรทัด */}
              <div className="flex flex-col items-center">
                <p className={`text-[40px] sm:text-2xl font-black ${s.color} leading-none`}>
                  {s.value}
                </p>
                <p className={`text-[14px] sm:text-xs font-bold mt-1.5 truncate ${s.color} opacity-70`}>
                  {s.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Recent Items ── */}
        <div className="relative z-10 pt-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-1.5">
              <Sparkles size={16} className="text-amber-500 fill-amber-500" />
              รายการล่าสุด
            </h2>
            <Link href="/search" className="flex items-center gap-0.5 text-xs sm:text-sm text-sky-600 font-extrabold hover:text-sky-700 transition-colors group">
              ดูทั้งหมด
              <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" strokeWidth={2.5} />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="rounded-2xl border border-slate-100 bg-white h-44 sm:h-64 animate-pulse" />
              ))}
            </div>
          ) : items.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-4">
              {items.slice(0, 12).map(item => (
                <ItemCard
                  key={item.id}
                  id={item.id}
                  type={item.type}
                  status={item.status || 'active'}
                  title={item.title}
                  place={item.place}
                  date={item.date ? new Date(item.date).toLocaleDateString('th-TH', { year: '2-digit', month: 'short', day: 'numeric' }) : ''}
                  imageUrl={item.image_url}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 rounded-2xl border border-dashed border-slate-200 bg-white px-4 shadow-inner">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 flex items-center justify-center mx-auto mb-3">
                <PackageX size={24} className="text-slate-400" />
              </div>
              <p className="font-bold text-slate-800 text-base mb-1">ยังไม่มีรายการ</p>
              <p className="text-slate-400 text-xs font-medium">ยังไม่มีผู้แจ้งข้อมูลเข้ามาในระบบขณะนี้</p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}