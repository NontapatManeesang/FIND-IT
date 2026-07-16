'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import AppShell from '@/components/AppShell';
import { Input, Select } from '@/components/Input';
import { ItemCard } from '@/components/ItemCard';
import { Search, Filter, X, Plus } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';

const TYPE_TABS = [
  { value: '', label: 'ทั้งหมด' },
  { value: 'lost', label: '🔴 ของหาย' },
  { value: 'found', label: '🟢 ของที่พบ' },
];

const STATUS_TABS = [
  { value: '', label: 'ทุกสถานะ' },
  { value: 'active', label: 'กำลังหา' },
  { value: 'resolved', label: 'ได้รับแล้ว' },
];

const PLACES = [
  { value: '', label: 'ทุกสถานที่' },
  { value: 'หอสมุด', label: 'หอสมุด' },
  { value: 'โรงอาหาร', label: 'โรงอาหาร' },
  { value: 'คณะ', label: 'คณะ/อาคาร' },
  { value: 'หอพัก', label: 'หอพัก' },
  { value: 'ลาน', label: 'ลานจอดรถ' },
  { value: 'อื่นๆ', label: 'อื่นๆ' },
];

function SearchPageContent() {
  const searchParams = useSearchParams();
  const supabase = createClient();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchString, setSearchString] = useState('');
  const [filterType, setFilterType] = useState(searchParams.get('type') || '');
  const [filterStatus, setFilterStatus] = useState('active');
  const [filterPlace, setFilterPlace] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch unread count
  useEffect(() => {
    const fetchUnreadCount = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: unreadMessages } = await supabase
        .from('messages')
        .select('id')
        .eq('receiver_id', user.id)
        .eq('is_read', false);
      setUnreadCount(unreadMessages?.length || 0);
    };

    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    let query = supabase.from('items').select('*').order('created_at', { ascending: false });

    if (searchString) {
      query = query.or(`title.ilike.%${searchString}%,description.ilike.%${searchString}%`);
    }
    if (filterType) {
      query = query.eq('type', filterType);
    }
    if (filterStatus) {
      query = query.eq('status', filterStatus);
    }
    if (filterPlace) {
      query = query.ilike('place', `%${filterPlace}%`);
    }

    const { data } = await query;
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, [searchString, filterType, filterStatus, filterPlace]);

  const hasActiveFilter = filterType || filterStatus !== 'active' || filterPlace;

  return (
    <AppShell 
      title="ค้นหา" 
      subtitle="ค้นหาสิ่งของหายหรือของที่พบ"
      unreadCount={unreadCount}
      action={
        <Link href={filterType === 'lost' ? '/lost' : filterType === 'found' ? '/found' : '/lost'}>
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary text-white text-xs font-medium hover:bg-blue-700 transition-colors">
            <Plus size={14} />
            แจ้งรายการ
          </button>
        </Link>
      }
    >
      {/* Search bar */}
      <div className="mb-4">
        <div className="relative">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted z-10" />
          <input
            type="text"
            placeholder="พิมพ์ชื่อสิ่งของ..."
            value={searchString}
            onChange={(e) => setSearchString(e.target.value)}
            className="w-full rounded-2xl border border-line bg-gray-50 px-4 py-3.5 text-[15px] text-ink placeholder:text-muted/60 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all pl-11 pr-12"
          />
          {searchString && (
            <button
              onClick={() => setSearchString('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full bg-muted/20 hover:bg-muted/30 transition-colors"
            >
              <X size={13} className="text-muted" />
            </button>
          )}
        </div>
      </div>

      {/* Type tabs */}
      <div className="flex gap-2 mb-4">
        {TYPE_TABS.map(tab => (
          <button
            key={tab.value}
            onClick={() => setFilterType(tab.value)}
            className={`flex-1 py-2 text-xs font-medium rounded-xl border transition-all ${
              filterType === tab.value
                ? 'bg-primary text-white border-primary shadow-sm'
                : 'bg-white text-muted border-line hover:border-primary/30'
            }`}
          >
            {tab.label}
          </button>
        ))}
        <button
          onClick={() => setShowFilter(!showFilter)}
          className={`px-3 py-2 rounded-xl border text-xs font-medium flex items-center gap-1 transition-all ${
            hasActiveFilter
              ? 'bg-primary/10 text-primary border-primary/30'
              : 'bg-white text-muted border-line hover:border-primary/30'
          }`}
        >
          <Filter size={13} />
          {hasActiveFilter ? 'มีตัวกรอง' : 'กรอง'}
        </button>
      </div>

      {/* Expandable filter */}
      {showFilter && (
        <div className="mb-4 p-4 rounded-2xl border border-line bg-gray-50 space-y-3">
          <div>
            <p className="text-xs font-medium text-muted mb-2">สถานะ</p>
            <div className="flex gap-2">
              {STATUS_TABS.map(tab => (
                <button
                  key={tab.value}
                  onClick={() => setFilterStatus(tab.value)}
                  className={`flex-1 py-2 text-xs font-medium rounded-xl border transition-all ${
                    filterStatus === tab.value
                      ? 'bg-ink text-white border-ink'
                      : 'bg-white text-muted border-line'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-muted mb-2">สถานที่</p>
            <select
              value={filterPlace}
              onChange={(e) => setFilterPlace(e.target.value)}
              className="w-full rounded-xl border border-line bg-white px-3 py-2.5 text-sm text-ink focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
            >
              {PLACES.map(p => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>
          {hasActiveFilter && (
            <button
              onClick={() => { setFilterType(''); setFilterStatus('active'); setFilterPlace(''); }}
              className="text-xs text-rose-500 font-medium flex items-center gap-1"
            >
              <X size={12} /> ล้างตัวกรองทั้งหมด
            </button>
          )}
        </div>
      )}

      {/* Results */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-ink">ผลการค้นหา</h2>
        <span className="text-xs text-muted bg-gray-100 px-2.5 py-1 rounded-full">
          {loading ? '...' : `${items.length} รายการ`}
        </span>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 rounded-2xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-3 pb-4">
          {items.length > 0 ? (
            items.map((item) => (
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
            <div className="text-center py-16 text-muted">
              <Search size={36} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm font-medium">ไม่พบรายการสิ่งของ</p>
              <p className="text-xs mt-1 opacity-70">ลองเปลี่ยนคำค้นหาหรือตัวกรอง</p>
            </div>
          )}
        </div>
      )}
    </AppShell>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-4 text-center text-muted">กำลังโหลด...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}
