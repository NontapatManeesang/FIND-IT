'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import AppShell from '@/components/AppShell';
import { ItemCard } from '@/components/ItemCard';
import { Search, Filter, X, Plus, Sparkles, MapPin, CheckCircle2 } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';

const TYPE_TABS = [
  { value: '', label: 'ทั้งหมด' },
  { value: 'lost', label: '🔴 ของหาย' },
  { value: 'found', label: '🟢 ของที่พบ' },
];

const STATUS_TABS = [
  { value: '', label: 'ทุกสถานะ' },
  { value: 'active', label: 'กำลังหา / ตามหาเจ้าของ' },
  { value: 'resolved', label: 'ได้รับคืนแล้ว' },
];

const PLACES = [
  { value: '', label: 'ทุกสถานที่' },
  { value: 'หอสมุด', label: '🏫 หอสมุดกลาง' },
  { value: 'โรงอาหาร', label: '🍔 โรงอาหาร / ศูนย์อาหาร' },
  { value: 'คณะ', label: '🏢 คณะ / อาคารเรียน' },
  { value: 'หอพัก', label: '🛏️ หอพักนักศึกษา' },
  { value: 'ลาน', label: '🚗 ลานจอดรถ / สนามกีฬา' },
  { value: 'อื่นๆ', label: '📍 สถานที่อื่นๆ' },
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
  }, [supabase]);

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
          <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 text-white text-xs font-extrabold hover:from-sky-600 hover:to-blue-700 transition-all shadow-md shadow-blue-100 active:scale-95">
            <Plus size={14} strokeWidth={3} />
            แจ้งรายการ
          </button>
        </Link>
      }
    >
      <div className="relative max-w-4xl mx-auto px-4 sm:px-2 pb-10 overflow-hidden">

        {/* ── Ambient Background Glow ── */}
        <div className="pointer-events-none absolute top-0 right-0 w-72 h-72 bg-sky-400/10 rounded-full blur-3xl opacity-60" />
        <div className="pointer-events-none absolute bottom-10 left-0 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl opacity-50" />

        {/* ── Search Input Bar ── */}
        <div className="relative z-10 mb-4">
          <div className="relative group">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-500 transition-colors z-10" />
            <input
              type="text"
              placeholder="พิมพ์ชื่อสิ่งของ หรือคำค้นหา..."
              value={searchString}
              onChange={(e) => setSearchString(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white/90 backdrop-blur-sm px-4 py-3 sm:py-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100 transition-all pl-11 pr-12 shadow-sm font-medium"
            />
            {searchString && (
              <button
                onClick={() => setSearchString('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                <X size={13} className="text-slate-500" />
              </button>
            )}
          </div>
        </div>

        {/* ── Type Tabs & Filter Toggle ── */}
        <div className="relative z-10 flex gap-2.5 mb-4">
          <div className="flex-1 flex bg-white/80 border border-slate-200/80 p-1 rounded-xl shadow-sm backdrop-blur-sm">
            {TYPE_TABS.map(tab => (
              <button
                key={tab.value}
                onClick={() => setFilterType(tab.value)}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all active:scale-[0.98] ${filterType === tab.value
                    ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-sm'
                    : 'bg-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowFilter(!showFilter)}
            className={`px-4 py-2 rounded-xl border flex items-center gap-1.5 transition-all text-xs font-extrabold shadow-sm shrink-0 active:scale-95 ${hasActiveFilter
                ? 'bg-sky-50 text-sky-600 border-sky-200 ring-2 ring-sky-50'
                : 'bg-white text-slate-600 border-slate-200/80 hover:bg-slate-50 hover:text-slate-900'
              }`}
          >
            <Filter size={14} className={hasActiveFilter ? 'text-sky-600' : 'text-slate-500'} />
            {hasActiveFilter ? 'กรองข้อมูล' : 'ตัวกรอง'}
          </button>
        </div>

        {/* ── Expandable Modern Filter Panel ── */}
        {showFilter && (
          <div className="relative z-10 mb-5 p-4 sm:p-5 rounded-2xl border border-slate-200/80 bg-white shadow-md space-y-4 animate-in fade-in duration-200">
            <div>
              <p className="text-[11px] font-bold text-slate-400 mb-2 uppercase tracking-wider flex items-center gap-1">
                <CheckCircle2 size={13} className="text-slate-400" /> สถานะของสิ่งของ
              </p>
              <div className="flex flex-wrap sm:flex-nowrap gap-2 bg-slate-50 p-1 rounded-xl border border-slate-100">
                {STATUS_TABS.map(tab => (
                  <button
                    key={tab.value}
                    onClick={() => setFilterStatus(tab.value)}
                    className={`flex-1 min-w-[100px] sm:min-w-0 py-2 text-xs font-bold rounded-lg transition-all ${filterStatus === tab.value
                        ? 'bg-slate-850 text-white bg-slate-800 shadow-sm'
                        : 'bg-transparent text-slate-500 hover:text-slate-850 hover:bg-white/60'
                      }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[11px] font-bold text-slate-400 mb-2 uppercase tracking-wider flex items-center gap-1">
                <MapPin size={13} className="text-slate-400" /> สถานที่ที่เกี่ยวข้อง
              </p>
              <div className="relative">
                <select
                  value={filterPlace}
                  onChange={(e) => setFilterPlace(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 font-bold focus:border-sky-400 focus:ring-4 focus:ring-sky-100 transition-all appearance-none cursor-pointer shadow-inner"
                >
                  {PLACES.map(p => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 border-r-2 border-b-2 border-slate-400 rotate-45" />
              </div>
            </div>

            {hasActiveFilter && (
              <button
                onClick={() => { setFilterType(''); setFilterStatus('active'); setFilterPlace(''); }}
                className="text-xs text-rose-500 font-extrabold flex items-center gap-1 hover:text-rose-600 transition-colors pt-1.5"
              >
                <X size={14} strokeWidth={2.5} /> ล้างการตั้งค่าตัวกรองทั้งหมด
              </button>
            )}
          </div>
        )}

        {/* ── Results Subheader ── */}
        <div className="relative z-10 flex items-center justify-between mb-4 mt-2">
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-1.5">
            <Sparkles size={16} className="text-sky-500 fill-sky-500" />
            ผลการค้นหา
          </h2>
          <span className="text-xs font-bold text-sky-700 bg-sky-50 border border-sky-100 px-3 py-1 rounded-full shadow-inner">
            {loading ? 'กำลังโหลด...' : `${items.length} รายการ`}
          </span>
        </div>

        {/* ── Results Grid List ── */}
        {loading ? (
          /* Loading Skeletons - 2 คอลัมน์บนมือถือ */
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-44 sm:h-64 rounded-2xl animate-pulse bg-white border border-slate-100" />
            ))}
          </div>
        ) : (
          <div className="relative z-10 pb-4">
            {items.length > 0 ? (
              /* ปรับ Grid เป็นกล่องขนาดเล็ก แถวละ 2 กล่องบนมือถือ (grid-cols-2) ตามบรีฟ */
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-4">
                {items.map((item) => (
                  <ItemCard
                    key={item.id}
                    id={item.id}
                    type={item.type}
                    status={item.status || 'active'}
                    title={item.title}
                    place={item.place}
                    date={item.date ? new Date(item.date).toLocaleDateString('th-TH', { year: '2-digit', month: 'short', day: 'numeric' }) : ''}
                    imageLabel={item.image_url ? undefined : 'รูปภาพ'}
                    imageUrl={item.image_url}
                  />
                ))}
              </div>
            ) : (
              /* Empty Search State */
              <div className="text-center py-20 rounded-2xl border border-dashed border-slate-200 bg-white/90 backdrop-blur-sm px-4 shadow-inner">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 flex items-center justify-center mx-auto mb-4">
                  <Search size={26} className="text-slate-300" />
                </div>
                <p className="text-base font-extrabold text-slate-800 mb-1">ไม่พบรายการสิ่งของที่คุณค้นหา</p>
                <p className="text-xs text-slate-400 font-semibold max-w-xs mx-auto leading-relaxed">
                  ลองเปลี่ยนคำค้นหาหลัก ขยายขอบเขต หรือล้างตัวกรองดูสิ อาจจะมีสิ่งของที่คุณกำลังตามหาอยู่
                </p>
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
    <Suspense fallback={<div className="p-8 text-center text-xs font-bold text-slate-400 bg-white rounded-2xl max-w-4xl mx-auto border border-slate-100 animate-pulse">กำลังเรียกดูข้อมูล...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}