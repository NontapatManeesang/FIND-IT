import AppShell from '@/components/AppShell';
import { Tag, StatusBadge } from '@/components/ItemCard';
import { ItemStatusButtons } from '@/components/ItemStatusButtons';
import { MapPin, Calendar, User, MessageCircle, CheckCircle2, Package } from 'lucide-react';
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
  
  // Simple fallback - show "ผู้แจ้ง" instead of UID
  const ownerName = isOwner ? 'คุณ' : 'ผู้แจ้ง';

  return (
    <AppShell
      title="รายละเอียด"
      backHref="/search"
      userName={user?.user_metadata?.display_name || user?.email?.split('@')[0]}
    >
      {/* Image */}
      <div className="mb-4">
        {item.image_url ? (
          <div className="relative w-full h-56 sm:h-72 rounded-2xl overflow-hidden bg-gray-100">
            <img
              src={item.image_url}
              alt={item.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            <div className="absolute top-3 left-3 flex items-center gap-2">
              <Tag type={item.type} />
            </div>
            {isResolved && (
              <div className="absolute top-3 right-3">
                <StatusBadge status="resolved" />
              </div>
            )}
          </div>
        ) : (
          <div className={`relative w-full h-44 rounded-2xl overflow-hidden flex items-center justify-center ${
            item.type === 'lost' ? 'bg-rose-50' : 'bg-emerald-50'
          }`}>
            <div className="flex flex-col items-center gap-2 opacity-40">
              <Package size={48} className={item.type === 'lost' ? 'text-rose-400' : 'text-emerald-400'} strokeWidth={1} />
              <p className="text-sm text-muted">ไม่มีรูปภาพ</p>
            </div>
            <div className="absolute top-3 left-3 flex items-center gap-2">
              <Tag type={item.type} />
              {isResolved && <StatusBadge status="resolved" />}
            </div>
          </div>
        )}
      </div>

      {/* Title section */}
      <div className="mb-5">
        <h1 className={`text-xl font-bold text-ink mb-2 leading-tight ${isResolved ? 'line-through opacity-60' : ''}`}>
          {item.title}
        </h1>
        {item.category && (
          <span className="inline-block text-xs bg-gray-100 text-muted px-3 py-1 rounded-full mb-3">
            {item.category}
          </span>
        )}

        <div className="space-y-2">
          <div className="flex items-center gap-2.5 text-sm text-muted">
            <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
              <MapPin size={14} className="text-muted" />
            </div>
            <span>{item.place || 'ไม่ระบุสถานที่'}</span>
          </div>
          {item.date && (
            <div className="flex items-center gap-2.5 text-sm text-muted">
              <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                <Calendar size={14} className="text-muted" />
              </div>
              <span>
                {new Date(item.date).toLocaleDateString('th-TH', {
                  year: 'numeric', month: 'long', day: 'numeric'
                })}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      {item.description && (
        <div className="mb-5 p-4 rounded-2xl bg-gray-50 border border-line">
          <h2 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">รายละเอียดเพิ่มเติม</h2>
          <p className="text-sm text-ink leading-relaxed">{item.description}</p>
        </div>
      )}

      {/* Reporter info */}
      <div className="mb-6 p-4 rounded-2xl border border-line bg-white">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
            isOwner ? 'bg-primary/10' : 'bg-gray-100'
          }`}>
            <User size={20} className={isOwner ? 'text-primary' : 'text-muted'} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-ink">
              {isOwner ? 'คุณ (ผู้แจ้ง)' : ownerName}
            </p>
            <p className="text-xs text-muted mt-0.5">
              {isOwner
                ? 'รายการของคุณ'
                : `ผู้แจ้ง${item.type === 'lost' ? 'ของหาย' : 'ของที่พบ'}`
              }
            </p>
          </div>
          {isResolved && (
            <StatusBadge status="resolved" />
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        {/* Chat Button — for non-owners who are logged in */}
        {!isOwner && user && !isResolved && (
          <Link href={`/chat/${item.user_id}?item_id=${item.id}`}>
            <button className="w-full flex items-center justify-center gap-2 rounded-2xl bg-primary text-white py-3.5 text-sm font-semibold hover:bg-blue-700 active:scale-[0.98] transition-all shadow-sm">
              <MessageCircle size={18} />
              แชตกับผู้แจ้ง
            </button>
          </Link>
        )}

        {!isOwner && user && isResolved && (
          <div className="flex items-center justify-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 py-3.5 text-sm text-emerald-600 font-medium">
            <CheckCircle2 size={18} />
            รายการนี้ได้รับการแก้ไขแล้ว
          </div>
        )}

        {!user && (
          <Link href="/login">
            <button className="w-full flex items-center justify-center gap-2 rounded-2xl bg-primary text-white py-3.5 text-sm font-semibold hover:bg-blue-700 transition-all shadow-sm">
              <MessageCircle size={18} />
              เข้าสู่ระบบเพื่อแชต
            </button>
          </Link>
        )}

        {/* Owner actions — client component */}
        {isOwner && (
          <ItemStatusButtons
            itemId={item.id}
            itemType={item.type}
            currentStatus={item.status || 'active'}
          />
        )}
      </div>

      <div className="h-6" />
    </AppShell>
  );
}
