import AppShell from '@/components/AppShell';
import Button from '@/components/Button';
import { ItemCard } from '@/components/ItemCard';
import { logout } from '@/app/login/actions';
import { createClient } from '@/utils/supabase/server';
import { LogOut, User, PackageX, PackageCheck, CheckCircle2, ChevronRight } from 'lucide-react';
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

    // Get unread count
    const { data: unreadMessages } = await supabase
      .from('messages')
      .select('id')
      .eq('receiver_id', user.id)
      .eq('is_read', false);
    unreadCount = unreadMessages?.length || 0;
  }

  const lostItems = myItems.filter(i => i.type === 'lost');
  const foundItems = myItems.filter(i => i.type === 'found');
  const resolvedItems = myItems.filter(i => i.status === 'resolved');
  const activeItems = myItems.filter(i => i.status !== 'resolved');

  const displayName = user?.user_metadata?.display_name
    || user?.user_metadata?.full_name
    || user?.email?.split('@')[0]
    || 'ผู้ใช้';

  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <AppShell
      title="โปรไฟล์"
      subtitle="จัดการบัญชีและรายการของคุณ"
      userName={displayName}
      unreadCount={unreadCount}
    >
      {/* Profile Header */}
      <div className="mb-6 flex flex-col items-center py-4">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-blue-700 flex items-center justify-center text-white font-bold text-2xl shadow-lg mb-3">
          {initials}
        </div>
        <h2 className="text-lg font-bold text-ink">{displayName}</h2>
        <p className="text-sm text-muted mt-0.5">{user?.email || ''}</p>
        <span className="mt-2 text-[11px] bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
          มหาวิทยาลัยมหาสารคาม
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2.5 mb-6">
        <div className="flex flex-col items-center justify-center rounded-2xl border border-line bg-white p-4 shadow-soft">
          <span className="text-2xl font-bold text-rose-500">{lostItems.length}</span>
          <span className="text-[11px] text-muted mt-1 text-center">แจ้งของหาย</span>
        </div>
        <div className="flex flex-col items-center justify-center rounded-2xl border border-line bg-white p-4 shadow-soft">
          <span className="text-2xl font-bold text-emerald-500">{foundItems.length}</span>
          <span className="text-[11px] text-muted mt-1 text-center">แจ้งพบของ</span>
        </div>
        <div className="flex flex-col items-center justify-center rounded-2xl border border-line bg-white p-4 shadow-soft">
          <span className="text-2xl font-bold text-primary">{resolvedItems.length}</span>
          <span className="text-[11px] text-muted mt-1 text-center">สำเร็จแล้ว</span>
        </div>
      </div>

      {/* Active Items */}
      {activeItems.length > 0 && (
        <div className="mb-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-ink">รายการที่กำลังดำเนินการ</h3>
            <span className="text-xs bg-amber-50 text-amber-600 border border-amber-200 px-2 py-0.5 rounded-full">
              {activeItems.length} รายการ
            </span>
          </div>
          <div className="space-y-2.5">
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

      {/* Resolved Items */}
      {resolvedItems.length > 0 && (
        <div className="mb-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-ink">รายการที่สำเร็จแล้ว</h3>
            <span className="text-xs bg-emerald-50 text-emerald-600 border border-emerald-200 px-2 py-0.5 rounded-full">
              {resolvedItems.length} รายการ
            </span>
          </div>
          <div className="space-y-2.5">
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
        </div>
      )}

      {myItems.length === 0 && (
        <div className="text-center py-12 rounded-2xl border border-dashed border-line mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
            <User size={22} className="text-muted" />
          </div>
          <p className="text-sm font-medium text-ink mb-1">ยังไม่มีรายการ</p>
          <p className="text-xs text-muted">เริ่มแจ้งของหายหรือของที่พบ</p>
        </div>
      )}

      {/* Actions */}
      <div className="space-y-2 mb-4">
        <Link href="/chat" className="flex items-center gap-3 w-full px-4 py-3.5 rounded-2xl border border-line bg-white text-ink hover:border-primary/30 transition-all">
          <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
            <span className="text-primary text-sm">💬</span>
          </div>
          <span className="flex-1 text-sm font-medium">การสนทนา</span>
          <ChevronRight size={16} className="text-muted" />
        </Link>

        <form action={logout}>
          <button
            type="submit"
            className="flex items-center gap-3 w-full px-4 py-3.5 rounded-2xl border border-rose-100 bg-rose-50 text-rose-600 hover:bg-rose-100 transition-all"
          >
            <div className="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center">
              <LogOut size={15} className="text-rose-500" />
            </div>
            <span className="flex-1 text-left text-sm font-medium">ออกจากระบบ</span>
          </button>
        </form>
      </div>

      <div className="h-4" />
    </AppShell>
  );
}
