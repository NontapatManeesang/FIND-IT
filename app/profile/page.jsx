import AppShell from '@/components/AppShell';
import { ItemCard } from '@/components/ItemCard';
import { logout } from '@/app/login/actions';
import { createClient } from '@/utils/supabase/server';
import { LogOut, PackageX, PackageCheck, CheckCircle2, ChevronRight, User, Mail, Sparkles } from 'lucide-react';
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
      <div className="relative max-w-2xl mx-auto space-y-6 px-4 sm:px-2 pb-10 overflow-hidden">
        
        {/* ── Ambient Background Glow ── */}
        <div className="pointer-events-none absolute top-0 left-0 w-64 h-64 bg-sky-400/10 rounded-full blur-3xl opacity-60" />
        <div className="pointer-events-none absolute bottom-10 right-0 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl opacity-50" />

        {/* ── Profile Card (Premium Gradient Theme) ── */}
        <div className="relative overflow-hidden bg-gradient-to-br from-sky-500 to-blue-600 rounded-3xl p-5 sm:p-6 text-white shadow-md shadow-blue-100/50">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />

          <div className="relative z-10 flex items-center gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-black text-xl sm:text-2xl font-display flex-shrink-0 border border-white/30 shadow-inner">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-white/70 text-[10px] font-extrabold uppercase tracking-widest mb-0.5">สมาชิกในระบบ</p>
              <h2 className="font-extrabold text-lg sm:text-xl font-display text-white truncate leading-tight">{displayName}</h2>
              <p className="text-white/80 text-xs mt-1.5 truncate flex items-center gap-1.5 font-medium">
                <Mail size={13} strokeWidth={2.5} className="opacity-80" />
                {user?.email || ''}
              </p>
            </div>
          </div>
        </div>

        {/* ── Stats (Center Aligned & Styled) ── */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5">
          {[
            { label: 'แจ้งของหาย',  value: lostItems.length,     color: 'text-rose-700',    bg: 'bg-gradient-to-br from-rose-100/80 to-rose-50 border-rose-200/60' },
            { label: 'แจ้งพบของ',   value: foundItems.length,    color: 'text-emerald-700', bg: 'bg-gradient-to-br from-emerald-100/80 to-emerald-50 border-emerald-200/60' },
            { label: 'สำเร็จแล้ว',  value: resolvedItems.length, color: 'text-sky-700',    bg: 'bg-gradient-to-br from-sky-100/80 to-sky-50 border-sky-200/60' },
          ].map(s => (
            <div key={s.label} className={`border rounded-xl sm:rounded-2xl p-3 sm:p-4 flex flex-col items-center justify-center text-center gap-1 shadow-sm ${s.bg}`}>
              <span className={`text-xl sm:text-2xl font-black ${s.color} font-display leading-none`}>{s.value}</span>
              <span className={`text-[10px] sm:text-xs font-bold mt-1 truncate ${s.color} opacity-70`}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* ── Quick Actions ── */}
        {/* <div className="grid grid-cols-2 gap-3">
          <Link
            href="/lost"
            className="flex items-center gap-2.5 sm:gap-3 bg-white border border-slate-200/80 rounded-2xl p-3.5 sm:p-4 hover:border-rose-200 hover:bg-rose-50/40 hover:shadow-sm transition-all duration-200 group active:scale-[0.98]"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-rose-50 flex items-center justify-center flex-shrink-0 group-hover:bg-rose-100 transition-colors shadow-sm">
              <PackageX size={16} className="text-rose-500" strokeWidth={2.5} />
            </div>
            <span className="text-xs sm:text-sm font-extrabold text-slate-700 group-hover:text-rose-600 transition-colors">แจ้งของหาย</span>
          </Link>
          <Link
            href="/found"
            className="flex items-center gap-2.5 sm:gap-3 bg-white border border-slate-200/80 rounded-2xl p-3.5 sm:p-4 hover:border-emerald-200 hover:bg-emerald-50/40 hover:shadow-sm transition-all duration-200 group active:scale-[0.98]"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-100 transition-colors shadow-sm">
              <PackageCheck size={16} className="text-emerald-500" strokeWidth={2.5} />
            </div>
            <span className="text-xs sm:text-sm font-extrabold text-slate-700 group-hover:text-emerald-600 transition-colors">แจ้งของที่พบ</span>
          </Link>
        </div> */}

        {/* ── Active Items (2 คอลัมน์บนมือถือตามบรีฟ) ── */}
        {activeItems.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-1.5">
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-1.5">
                <Sparkles size={16} className="text-sky-500 fill-sky-500" />
                รายการที่คุณกำลังดำเนินการ
              </h3>
              <span className="text-[10px] sm:text-xs font-bold text-sky-700 bg-sky-50 border border-sky-100 px-2.5 py-1 rounded-full shadow-inner">
                {activeItems.length} รายการ
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-2.5 sm:gap-4">
              {activeItems.map((item) => (
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
          </div>
        )}

        {/* ── Resolved Items Accordion (2 คอลัมน์บนมือถือตามบรีฟ) ── */}
        {resolvedItems.length > 0 && (
          <details className="group border border-slate-200/80 bg-white rounded-2xl overflow-hidden shadow-sm transition-all [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex items-center justify-between p-4 cursor-pointer list-none select-none hover:bg-slate-50/80 transition-colors">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 group-open:bg-sky-50 flex items-center justify-center transition-colors shadow-inner">
                  <CheckCircle2 size={15} className="text-emerald-500 group-open:text-sky-500 transition-colors" strokeWidth={2.5} />
                </div>
                <span className="text-xs sm:text-sm font-extrabold text-slate-800 group-open:text-sky-700 transition-colors">รายการที่สำเร็จแล้ว</span>
                <ChevronRight size={15} className="text-slate-400 group-open:rotate-90 transition-transform duration-200" strokeWidth={2.5} />
              </div>
              <span className="text-[10px] sm:text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100/60 px-2.5 py-0.5 rounded-full shadow-inner">
                {resolvedItems.length} รายการ
              </span>
            </summary>
            <div className="p-3 sm:p-4 border-t border-slate-100 bg-slate-50/40 grid grid-cols-2 sm:grid-cols-2 gap-2.5 sm:gap-4">
              {resolvedItems.map((item) => (
                <ItemCard
                  key={item.id}
                  id={item.id}
                  type={item.type}
                  status="resolved"
                  title={item.title}
                  place={item.place}
                  date={item.date ? new Date(item.date).toLocaleDateString('th-TH', { year: '2-digit', month: 'short', day: 'numeric' }) : ''}
                  imageUrl={item.image_url}
                />
              ))}
            </div>
          </details>
        )}

        {/* ── Empty State ── */}
        {myItems.length === 0 && (
          <div className="text-center py-16 bg-white border border-dashed border-slate-200 rounded-3xl shadow-inner px-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 flex items-center justify-center mx-auto mb-3">
              <User size={24} className="text-slate-300" />
            </div>
            <p className="font-extrabold text-slate-700 text-base mb-1">คุณยังไม่ได้แจ้งรายการใดๆ</p>
            <p className="text-slate-400 text-xs font-semibold max-w-xs mx-auto leading-relaxed">เริ่มต้นประกาศสิ่งของหายหรือของที่พบบนระบบเพื่ออำนวยความสะดวกให้เพื่อนๆ กันเถอะ</p>
          </div>
        )}

        {/* ── Logout Button Area ── */}
        {/* <form action={logout}>
          <button
            type="submit"
            className="flex items-center gap-3 w-full px-4 py-3.5 rounded-2xl border border-rose-100 bg-white text-rose-600 hover:bg-rose-50/50 transition-colors group active:scale-[0.99]"
          >
            <div className="w-8 h-8 rounded-lg bg-rose-50 group-hover:bg-rose-100 flex items-center justify-center flex-shrink-0 transition-colors shadow-sm">
              <LogOut size={14} className="text-rose-500" strokeWidth={2.5} />
            </div>
            <span className="flex-1 text-left text-xs sm:text-sm font-extrabold">ออกจากระบบการใช้งาน</span>
          </button>
        </form> */}

        <div className="h-2" />
      </div>
    </AppShell>
  );
}