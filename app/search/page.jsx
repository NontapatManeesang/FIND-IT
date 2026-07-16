'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import AppShell from '@/components/AppShell';
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

  useEffect(() => {
    const fetchUnreadCount = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: unreadMessages } = await supabase.from('messages').select('id').eq('receiver_id', user.id).eq('is_read', false);
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
      subtitle=""
      unreadCount={unreadCount}
      rightAction={
        <Link href={filterType === 'lost' ? '/lost' : filterType === 'found' ? '/found' : '/lost'}>
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-600 text-white text-xs font-bold hover:bg-amber-700 transition-colors shadow-sm">
            <Plus size={14} />
            แจ้งรายการ
          </button>
        </Link>
      }
    >
      <div className="max-w-4xl mx-auto">
        {/* Search bar */}
        <div className="mb-4">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10" />
            <input
              type="text"
              placeholder="พิมพ์ชื่อสิ่งของ..."
              value={searchString}
              onChange={(e) => setSearchString(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-[15px] text-slate-900 placeholder:text-slate-400 focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10 transition-all pl-11 pr-12 shadow-sm font-medium"
            />
            {searchString && (
              <button
                onClick={() => setSearchString('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                <X size={14} className="text-slate-500" />
              </button>
            )}
          </div>
        </div>

        {/* Type tabs & filter toggle */}
        <div className="flex gap-2 mb-4">
          <div className="flex-1 flex bg-white rounded-xl border border-slate-200/80 p-1 shadow-sm">
            {TYPE_TABS.map(tab => (
              <button
                key={tab.value}
                onClick={() => setFilterType(tab.value)}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  filterType === tab.value
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowFilter(!showFilter)}
            className={`px-3 py-2 rounded-xl border flex items-center gap-1.5 transition-all text-xs font-bold shadow-sm shrink-0 ${
              hasActiveFilter
                ? 'bg-amber-50 text-amber-600 border-amber-200'
                : 'bg-white text-slate-500 border-slate-200/80 hover:bg-slate-50 hover:text-slate-800'
            }`}
          >
            <Filter size={14} />
            {hasActiveFilter ? 'มีตัวกรอง' : 'กรอง'}
          </button>
        </div>

        {/* Expandable filter */}
        {showFilter && (
          <div className="mb-5 p-5 rounded-2xl border border-slate-200/80 bg-white shadow-sm space-y-4 animate-fade-in">
            <div>
              <p className="text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">สถานะ</p>
              <div className="flex gap-2 bg-slate-50 p-1 rounded-xl border border-slate-100">
                {STATUS_TABS.map(tab => (
                  <button
                    key={tab.value}
                    onClick={() => setFilterStatus(tab.value)}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                      filterStatus === tab.value
                        ? 'bg-slate-800 text-white shadow-sm'
                        : 'bg-transparent text-slate-500 hover:text-slate-800 hover:bg-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">สถานที่</p>
              <select
                value={filterPlace}
                onChange={(e) => setFilterPlace(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 font-medium focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10 transition-all appearance-none"
              >
                {PLACES.map(p => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>
            {hasActiveFilter && (
              <button
                onClick={() => { setFilterType(''); setFilterStatus('active'); setFilterPlace(''); }}
                className="text-xs text-rose-500 font-bold flex items-center gap-1 hover:text-rose-600 transition-colors pt-2"
              >
                <X size={14} /> ล้างตัวกรองทั้งหมด
              </button>
            )}
          </div>
        )}

        {/* Results Info */}
        <div className="flex items-center justify-between mb-4 mt-2">
          <h2 className="text-lg font-bold text-slate-900 font-display">ผลการค้นหา</h2>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full">
            {loading ? '...' : `${items.length} รายการ`}
          </span>
        </div>

        {/* Results List */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-40 rounded-3xl skeleton bg-white border border-slate-100" />
            ))}
          </div>
        ) : (
          <div className="pb-4">
            {items.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((item) => (
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
                ))}
              </div>
            ) : (
              <div className="text-center py-20 rounded-3xl border border-slate-200/80 bg-white shadow-sm">
                <div className="w-16 h-16 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto mb-4">
                  <Search size={28} className="text-slate-300" />
                </div>
                <p className="text-base font-bold text-slate-800 font-display mb-1">ไม่พบรายการสิ่งของ</p>
                <p className="text-sm text-slate-400 font-medium max-w-xs mx-auto">ลองเปลี่ยนคำค้นหาหรือล้างตัวกรองดูสิ อาจจะมีของที่คุณตามหาอยู่</p>
              </div>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-4 text-center text-slate-400 font-medium">กำลังโหลด...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}
