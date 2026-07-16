import AppShell from '@/components/AppShell';
import { Tag, StatusBadge } from '@/components/ItemCard';
import { ItemStatusButtons } from '@/components/ItemStatusButtons';
import { MapPin, Calendar, User, MessageCircle, CheckCircle2, Package, Clock } from 'lucide-react';
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
      subtitle="FINDIT — MMU"
      backHref="/search"
      userName={user?.user_metadata?.display_name || user?.email?.split('@')[0]}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* ── Image Section ── */}
        <div className="relative">
          {item.image_url ? (
            <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] rounded-3xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-sm">
              <img
                src={item.image_url}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <Tag type={item.type} />
              </div>
              {isResolved && (
                <div className="absolute top-4 right-4">
                  <StatusBadge status="resolved" />
                </div>
              )}
            </div>
          ) : (
            <div className={`relative w-full aspect-[4/3] sm:aspect-[16/9] rounded-3xl overflow-hidden flex flex-col items-center justify-center border ${
              item.type === 'lost' ? 'bg-rose-50 border-rose-100' : 'bg-emerald-50 border-emerald-100'
            }`}>
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <Tag type={item.type} />
                {isResolved && <StatusBadge status="resolved" />}
              </div>
              <Package size={56} className={`mb-3 ${item.type === 'lost' ? 'text-rose-200' : 'text-emerald-200'}`} strokeWidth={1} />
              <p className={`text-sm font-semibold ${item.type === 'lost' ? 'text-rose-400' : 'text-emerald-400'}`}>
                ไม่มีรูปภาพประกอบ
              </p>
            </div>
          )}
        </div>

        {/* ── Title & Meta ── */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-6 shadow-sm">
          <h1 className={`text-2xl font-bold text-slate-900 mb-3 leading-tight font-display ${isResolved ? 'line-through opacity-50' : ''}`}>
            {item.title}
          </h1>
          
          {item.category && (
            <span className="inline-flex items-center text-xs font-bold bg-slate-100 text-slate-500 px-3 py-1.5 rounded-xl mb-5 uppercase tracking-wide">
              {item.category}
            </span>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 text-sm text-slate-600">
              <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <MapPin size={16} className="text-slate-400" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">สถานที่</p>
                <p className="font-semibold text-slate-700">{item.place || 'ไม่ระบุสถานที่'}</p>
              </div>
            </div>

            {item.date && (
              <div className="flex items-start gap-3 text-sm text-slate-600">
                <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Calendar size={16} className="text-slate-400" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">วันที่</p>
                  <p className="font-semibold text-slate-700">
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
          <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-5 sm:p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-3 text-amber-600">
              <div className="w-6 h-6 rounded-lg bg-amber-100 flex items-center justify-center">
                <span className="text-amber-600 text-xs font-bold">i</span>
              </div>
              <h2 className="text-sm font-bold uppercase tracking-widest font-display">รายละเอียดเพิ่มเติม</h2>
            </div>
            <p className="text-[15px] text-slate-700 leading-relaxed font-medium">
              {item.description}
            </p>
          </div>
        )}

        {/* ── Reporter Info ── */}
        <div className="flex items-center gap-4 bg-white border border-slate-200/80 rounded-3xl p-5 shadow-sm">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${
            isOwner ? 'bg-amber-50 border-amber-100' : 'bg-slate-50 border-slate-100'
          }`}>
            <User size={24} className={isOwner ? 'text-amber-500' : 'text-slate-400'} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-slate-900 font-display">
              {isOwner ? 'คุณ (ผู้แจ้ง)' : ownerName}
            </p>
            <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">
              {isOwner
                ? 'รายการของคุณ'
                : `ผู้แจ้ง${item.type === 'lost' ? 'ของหาย' : 'ของที่พบ'}`
              }
            </p>
          </div>
          {isResolved && (
            <div className="hidden sm:block">
              <StatusBadge status="resolved" />
            </div>
          )}
        </div>

        {/* ── Action Buttons ── */}
        <div className="space-y-3 pt-2">
          {!isOwner && user && !isResolved && (
            <Link href={`/chat/${item.user_id}?item_id=${item.id}`} className="block">
              <button className="w-full flex items-center justify-center gap-2 rounded-2xl bg-amber-600 text-white py-4 text-[15px] font-bold hover:bg-amber-700 active:scale-[0.98] transition-all shadow-sm shadow-amber-200">
                <MessageCircle size={18} />
                แชตกับผู้แจ้ง
              </button>
            </Link>
          )}

          {!isOwner && user && isResolved && (
            <div className="flex flex-col items-center justify-center gap-1.5 rounded-2xl border border-emerald-200 bg-emerald-50 py-4 text-emerald-600">
              <CheckCircle2 size={24} className="text-emerald-500 mb-1" />
              <span className="font-bold text-[15px]">รายการนี้ได้รับการแก้ไขแล้ว</span>
              <span className="text-xs font-semibold text-emerald-500/80">เจ้าของได้รับของคืนแล้ว</span>
            </div>
          )}

          {!user && (
            <Link href="/login" className="block">
              <button className="w-full flex items-center justify-center gap-2 rounded-2xl bg-amber-600 text-white py-4 text-[15px] font-bold hover:bg-amber-700 transition-all shadow-sm shadow-amber-200">
                <User size={18} />
                เข้าสู่ระบบเพื่อแชต
              </button>
            </Link>
          )}

          {isOwner && (
            <ItemStatusButtons
              itemId={item.id}
              itemType={item.type}
              currentStatus={item.status || 'active'}
            />
          )}
        </div>
        
        <div className="h-6" />
      </div>
    </AppShell>
  );
}
