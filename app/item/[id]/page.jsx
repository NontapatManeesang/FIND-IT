import AppShell from '@/components/AppShell';
import { Tag, StatusBadge } from '@/components/ItemCard';
import { ItemStatusButtons } from '@/components/ItemStatusButtons';
import { MapPin, Calendar, User, MessageCircle, CheckCircle2, Package, Info } from 'lucide-react';
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function ItemDetailPage({ params }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: item } = await supabase
    .from('items')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!item) {
    notFound();
  }

  const isOwner = user && user.id === item.user_id;
  const isResolved = item.status === 'resolved';

  const ownerName = isOwner ? 'คุณ' : 'ผู้แจ้ง';

  return (
    <AppShell
      title="รายละเอียด"
      subtitle=""
      backHref="/search"
      userName={user?.user_metadata?.display_name || user?.email?.split('@')[0]}
    >
      <div className="relative max-w-2xl mx-auto space-y-6 px-4 sm:px-2 pb-10 overflow-hidden">

        {/* ── Ambient Background Glow ── */}
        <div className="pointer-events-none absolute top-0 right-0 w-64 h-64 bg-sky-400/10 rounded-full blur-3xl opacity-60" />
        <div className="pointer-events-none absolute bottom-20 left-0 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl opacity-50" />

        {/* ── Image Section ── */}
        <div className="relative z-10">
          {item.image_url ? (
            <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] rounded-3xl overflow-hidden bg-slate-150 border border-slate-200/80 shadow-md">
              <img
                src={item.image_url}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent" />
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <Tag type={item.type} />
              </div>
              {isResolved && (
                <div className="absolute top-4 right-4 shadow-md rounded-xl">
                  <StatusBadge status="resolved" />
                </div>
              )}
            </div>
          ) : (
            <div className={`relative w-full aspect-[4/3] sm:aspect-[16/9] rounded-3xl overflow-hidden flex flex-col items-center justify-center border shadow-sm ${item.type === 'lost' ? 'bg-rose-50/60 border-rose-100' : 'bg-emerald-50/60 border-emerald-100'
              }`}>
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <Tag type={item.type} />
                {isResolved && <StatusBadge status="resolved" />}
              </div>
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-3 ${item.type === 'lost' ? 'bg-rose-100/50 text-rose-400' : 'bg-emerald-100/50 text-emerald-400'
                }`}>
                <Package size={32} strokeWidth={1.8} />
              </div>
              <p className={`text-xs font-bold ${item.type === 'lost' ? 'text-rose-400/90' : 'text-emerald-400/90'}`}>
                ไม่มีรูปภาพประกอบสิ่งของ
              </p>
            </div>
          )}
        </div>

        {/* ── Title & Meta Info ── */}
        <div className="relative z-10 bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-6 shadow-sm">
          <h1 className={`text-xl sm:text-2xl font-black text-slate-900 mb-3.5 leading-tight font-display ${isResolved ? 'line-through opacity-40' : ''}`}>
            {item.title}
          </h1>

          {item.category && (
            <span className="inline-flex items-center text-[10px] font-extrabold bg-slate-50 text-slate-500 border border-slate-200/60 px-3 py-1.5 rounded-xl mb-5 uppercase tracking-wider">
              📦 {item.category}
            </span>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-100 pt-4">
            <div className="flex items-start gap-3 text-sm text-slate-600">
              <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-150 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                <MapPin size={16} className="text-sky-500" />
              </div>
              <div>
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-0.5">สถานที่ที่พบ/หาย</p>
                <p className="font-bold text-slate-700">{item.place || 'ไม่ระบุสถานที่ชัดเจน'}</p>
              </div>
            </div>

            {item.date && (
              <div className="flex items-start gap-3 text-sm text-slate-600">
                <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-150 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                  <Calendar size={16} className="text-blue-500" />
                </div>
                <div>
                  <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-0.5">วันที่แจ้งระบบ</p>
                  <p className="font-bold text-slate-700">
                    {new Date(item.date).toLocaleDateString('th-TH', {
                      year: 'numeric', month: 'long', day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Description ── */}
        {item.description && (
          <div className="relative z-10 bg-slate-50 border border-slate-200/60 rounded-3xl p-5 sm:p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-3 text-sky-600">
              <div className="w-6 h-6 rounded-lg bg-sky-50 border border-sky-100 flex items-center justify-center">
                <Info size={13} className="text-sky-500" strokeWidth={2.5} />
              </div>
              <h2 className="text-xs font-extrabold uppercase tracking-wider font-display">รายละเอียดเพิ่มเติม</h2>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed font-semibold pl-1">
              {item.description}
            </p>
          </div>
        )}

        {/* ── Reporter Info ── */}
        <div className="relative z-10 flex items-center gap-4 bg-white border border-slate-200/80 rounded-3xl p-4 sm:p-5 shadow-sm">
          <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center border ${isOwner ? 'bg-sky-50 border-sky-100 shadow-sm shadow-sky-50' : 'bg-slate-50 border-slate-100'
            }`}>
            <User size={22} className={isOwner ? 'text-sky-500' : 'text-slate-400'} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-extrabold text-slate-900 font-display">
              {isOwner ? 'คุณ (ผู้แจ้งรายการ)' : ownerName}
            </p>
            <p className="text-[11px] font-bold text-slate-400 mt-0.5 uppercase tracking-wider">
              {isOwner
                ? 'นี่คือโพสต์ประกาศของคุณเอง'
                : `ผู้ประกาศ${item.type === 'lost' ? 'ของหาย' : 'พบสิ่งของ'}`
              }
            </p>
          </div>
          {isResolved && (
            <div className="hidden sm:block shadow-sm rounded-xl">
              <StatusBadge status="resolved" />
            </div>
          )}
        </div>

        {/* ── Action Buttons ── */}
        <div className="relative z-10 space-y-3 pt-2">
          {!isOwner && user && !isResolved && (
            <Link href={`/chat/${item.user_id}?item_id=${item.id}`} className="block">
              <button className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 text-white py-4 text-sm font-extrabold hover:from-sky-600 hover:to-blue-700 active:scale-[0.99] transition-all shadow-md shadow-blue-100">
                <MessageCircle size={18} strokeWidth={2.5} />
                เริ่มต้นแชตคุยกับผู้แจ้ง
              </button>
            </Link>
          )}

          {!isOwner && user && isResolved && (
            <div className="flex flex-col items-center justify-center gap-1.5 rounded-2xl border border-emerald-200 bg-emerald-50/70 py-4 text-emerald-600 shadow-sm shadow-emerald-50 text-center px-4">
              <CheckCircle2 size={24} className="text-emerald-500 mb-0.5" />
              <span className="font-extrabold text-sm">รายการนี้ได้รับการดำเนินการสิ้นสุดแล้ว</span>
              <span className="text-[11px] font-bold text-emerald-500/80">ของชิ้นนี้ส่งมอบกลับคืนถึงมือเจ้าของเรียบร้อยแล้ว</span>
            </div>
          )}

          {!user && (
            <Link href="/login" className="block">
              <button className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 text-white py-4 text-sm font-extrabold hover:from-sky-600 hover:to-blue-700 active:scale-[0.99] transition-all shadow-md shadow-blue-100">
                <User size={18} strokeWidth={2.5} />
                เข้าสู่ระบบเพื่อติดต่อแชต
              </button>
            </Link>
          )}

          {isOwner && (
            <div className="rounded-2xl overflow-hidden shadow-sm">
              <ItemStatusButtons
                itemId={item.id}
                itemType={item.type}
                currentStatus={item.status || 'active'}
              />
            </div>
          )}
        </div>

      </div>
    </AppShell>
  );
}