import AppShell from '@/components/AppShell';
import { ItemCard } from '@/components/ItemCard';
import { logout } from '@/app/login/actions';
import { createClient } from '@/utils/supabase/server';
import { LogOut, PackageX, PackageCheck, CheckCircle2, ChevronRight, MessageCircle, User, Link as LinkIcon, Mail } from 'lucide-react';
import Link from 'next/link';

export default async function ProfilePage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let myItems = [];
  let unreadCount = 0;

  if (user) {
    const { data } = await supabase
      .from('items')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    myItems = data || [];

    const { data: unreadMessages } = await supabase
      .from('messages')
      .select('id')
      .eq('receiver_id', user.id)
      .eq('is_read', false);
    unreadCount = unreadMessages?.length || 0;
  }

  const lostItems     = myItems.filter(i => i.type === 'lost');
  const foundItems    = myItems.filter(i => i.type === 'found');
  const resolvedItems = myItems.filter(i => i.status === 'resolved');
  const activeItems   = myItems.filter(i => i.status !== 'resolved');

  const displayName = user?.user_metadata?.display_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'ผู้ใช้';
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <AppShell
      title="โปรไฟล์"
      subtitle=""
      userName={displayName}
      unreadCount={unreadCount}
    >
      <div className="max-w-2xl mx-auto space-y-6">

        {/* ── Profile Card ── */}
        {/* <div className="relative overflow-hidden bg-gradient-to-br from-amber-600 to-amber-700 rounded-3xl p-6 text-white">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />

          <div className="relative z-10 flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-2xl font-display flex-shrink-0 border border-white/30">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-0.5">นิสิต มมส.</p>
              <h2 className="font-bold text-xl font-display text-white truncate">{displayName}</h2>
              <p className="text-white/70 text-sm mt-0.5 truncate flex items-center gap-1.5">
                <Mail size={12} />
                {user?.email || ''}
              </p>
            </div>
          </div>
        </div> */}

        {/* ── Stats ── */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'แจ้งของหาย',  value: lostItems.length,    color: 'text-rose-500',    bg: 'bg-rose-50',    border: 'border-rose-100' },
            { label: 'แจ้งพบของ',   value: foundItems.length,   color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
            { label: 'สำเร็จแล้ว',  value: resolvedItems.length, color: 'text-amber-600',  bg: 'bg-amber-50',  border: 'border-amber-100' },
          ].map(s => (
            <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl p-4 flex flex-col items-center`}>
              <span className={`text-3xl font-bold ${s.color} font-display leading-none`}>{s.value}</span>
              <span className="text-[10px] font-bold text-slate-500 mt-2 text-center uppercase tracking-wide">{s.label}</span>
            </div>
          ))}
        </div>

        {/* ── Quick Actions ── */}
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/lost"
            className="flex items-center gap-3 bg-white border border-slate-200/80 rounded-2xl p-4 hover:border-rose-200 hover:bg-rose-50/50 transition-colors group"
          >
            <div className="w-9 h-9 rounded-xl bg-rose-100 flex items-center justify-center flex-shrink-0 group-hover:bg-rose-200 transition-colors">
              <PackageX size={18} className="text-rose-500" />
            </div>
            <span className="text-sm font-bold text-slate-700 group-hover:text-rose-600 transition-colors">แจ้งของหาย</span>
          </Link>
          <Link
            href="/found"
            className="flex items-center gap-3 bg-white border border-slate-200/80 rounded-2xl p-4 hover:border-emerald-200 hover:bg-emerald-50/50 transition-colors group"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-200 transition-colors">
              <PackageCheck size={18} className="text-emerald-500" />
            </div>
            <span className="text-sm font-bold text-slate-700 group-hover:text-emerald-600 transition-colors">แจ้งของที่พบ</span>
          </Link>
        </div>

        {/* ── Active Items ── */}
        {activeItems.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-slate-900 font-display">รายหารที่คุณกำลังดำเนินการ</h3>
              <span className="text-xs font-bold text-amber-600 bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-full">
                {activeItems.length} รายการ
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {activeItems.map((item) => (
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
          </div>
        )}

        {/* ── Resolved Items (Accordion) ── */}
        {resolvedItems.length > 0 && (
          <details className="group">
            <summary className="flex items-center justify-between p-4 bg-white border border-slate-200/80 rounded-2xl cursor-pointer list-none [&::-webkit-details-marker]:hidden select-none hover:border-amber-200 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 group-open:bg-amber-50 flex items-center justify-center transition-colors">
                  <CheckCircle2 size={16} className="text-emerald-500 group-open:text-amber-500 transition-colors" />
                </div>
                <span className="text-sm font-bold text-slate-900 group-open:text-amber-600 transition-colors font-display">รายการที่สำเร็จแล้ว</span>
                <ChevronRight size={16} className="text-slate-300 group-open:rotate-90 transition-transform duration-200" />
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                {resolvedItems.length} รายการ
              </span>
            </summary>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 pl-2">
              {resolvedItems.map((item) => (
                <ItemCard
                  key={item.id}
                  id={item.id}
                  type={item.type}
                  status="resolved"
                  title={item.title}
                  place={item.place}
                  date={item.date ? new Date(item.date).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' }) : ''}
                  imageUrl={item.image_url}
                />
              ))}
            </div>
          </details>
        )}

        {/* ── Empty State ── */}
        {myItems.length === 0 && (
          <div className="text-center py-16 bg-white border border-slate-200/80 rounded-3xl">
            <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <User size={28} className="text-slate-300" />
            </div>
            <p className="font-bold text-slate-700 text-base font-display mb-1">ยังไม่มีรายการ</p>
            <p className="text-slate-400 text-sm font-medium">เริ่มแจ้งของหายหรือของที่พบเพื่อช่วยชุมชน</p>
          </div>
        )}

        {/* ── Logout ── */}
        {/* <form action={logout}>
          <button
            type="submit"
            className="flex items-center gap-3 w-full px-4 py-4 rounded-2xl border border-rose-100 bg-white text-rose-600 hover:bg-rose-50 transition-colors group"
          >
            <div className="w-9 h-9 rounded-xl bg-rose-50 group-hover:bg-rose-100 flex items-center justify-center flex-shrink-0 transition-colors">
              <LogOut size={16} className="text-rose-500" />
            </div>
            <span className="flex-1 text-left text-sm font-bold">ออกจากระบบ</span>
          </button>
        </form> */}

        <div className="h-2" />
      </div>
    </AppShell>
  );
}
