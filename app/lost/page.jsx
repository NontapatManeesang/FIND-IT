'use client';

import { useState, useEffect } from 'react';
import AppShell from '@/components/AppShell';
import { Field, Input, Textarea, Select } from '@/components/Input';
import { UploadPhoto } from '@/components/ItemCard';
import { MapPin, Calendar, PackageX, AlertCircle } from 'lucide-react';
import { createItem } from '@/app/actions/itemActions';
import { createClient } from '@/utils/supabase/client';

const CATEGORIES = [
  { value: '',         label: 'เลือกหมวดหมู่',                  emoji: '📦' },
  { value: 'กระเป๋า',  label: 'กระเป๋า',                        emoji: '👜' },
  { value: 'กุญแจ',    label: 'กุญแจ',                           emoji: '🔑' },
  { value: 'โทรศัพท์', label: 'โทรศัพท์/อุปกรณ์อิเล็กทรอนิกส์', emoji: '📱' },
  { value: 'เครื่องเขียน', label: 'เครื่องเขียน',                emoji: '✏️' },
  { value: 'บัตร',     label: 'บัตร/เอกสาร',                    emoji: '💳' },
  { value: 'เงิน',     label: 'เงิน/กระเป๋าสตางค์',              emoji: '💰' },
  { value: 'หูฟัง',    label: 'หูฟัง',                           emoji: '🎧' },
  { value: 'ผ้า',      label: 'เสื้อผ้า/ผ้า',                    emoji: '👕' },
  { value: 'อื่นๆ',    label: 'อื่นๆ',                           emoji: '📦' },
];

export default function LostItemPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const supabase = createClient();

  useEffect(() => {
    const fetch = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from('messages').select('id').eq('receiver_id', user.id).eq('is_read', false);
      setUnreadCount(data?.length || 0);
    };
    fetch();
    const t = setInterval(fetch, 10000);
    return () => clearInterval(t);
  }, []);

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    const result = await createItem(formData, 'lost');
    if (result?.error) { setError(result.error); setLoading(false); }
  };

  return (
    <AppShell
      title="แจ้งของหาย"
      subtitle="FINDIT — MMU"
      backHref="/home"
      unreadCount={unreadCount}
    >
      <div className="max-w-xl mx-auto">
        {/* Page hero */}
        <div className="flex items-center gap-4 mb-8 p-5 bg-rose-50 border border-rose-100 rounded-2xl">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center flex-shrink-0">
            <PackageX size={24} className="text-rose-500" strokeWidth={1.8} />
          </div>
          <div>
            <p className="font-bold text-slate-900 text-base font-display">แจ้งของหาย</p>
            <p className="text-sm text-slate-500 mt-0.5">กรอกข้อมูลให้ครบเพื่อเพิ่มโอกาสหาของเจอ</p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl bg-rose-50 border border-rose-200 p-4 text-sm text-rose-700">
            <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        <form action={handleSubmit} className="space-y-6">
          {/* Photo */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">รูปภาพสิ่งของ</label>
            <UploadPhoto label="เพิ่มรูปสิ่งของที่หาย" />
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">ชื่อสิ่งของ <span className="text-rose-500">*</span></label>
            <p className="text-xs text-slate-400 mb-2">ระบุให้ชัดเจน เช่น กระเป๋าสตางค์สีน้ำตาลยี่ห้อ Coach</p>
            <input
              name="title"
              required
              placeholder="เช่น กระเป๋าสตางค์สีน้ำตาล"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10 transition-all"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">หมวดหมู่</label>
            <select
              name="category"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10 transition-all appearance-none"
            >
              {CATEGORIES.map(c => (
                <option key={c.value} value={c.value}>{c.emoji} {c.label}</option>
              ))}
            </select>
          </div>

          {/* Place */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">สถานที่คาดว่าทำหาย <span className="text-rose-500">*</span></label>
            <div className="relative">
              <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                name="place"
                required
                placeholder="เช่น คณะวิทยาการสารสนเทศ ชั้น 2"
                className="w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10 transition-all"
              />
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">วันที่หาย <span className="text-rose-500">*</span></label>
            <div className="relative">
              <Calendar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                name="date"
                required
                type="date"
                className="w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-4 py-3 text-sm text-slate-900 focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10 transition-all"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">รายละเอียดเพิ่มเติม</label>
            <p className="text-xs text-slate-400 mb-2">ลักษณะเด่น สี ขนาด หรือจุดสังเกตที่ช่วยให้จำได้</p>
            <textarea
              name="description"
              rows={4}
              placeholder="อธิบายลักษณะของสิ่งของให้ชัดเจนที่สุด เช่น สี ยี่ห้อ มีรอยขีดข่วน หรือสิ่งที่ติดมา..."
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10 transition-all resize-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2.5 rounded-2xl bg-rose-500 text-white py-4 text-[15px] font-bold hover:bg-rose-600 active:scale-[0.98] transition-all shadow-sm shadow-rose-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                กำลังบันทึก...
              </>
            ) : (
              <>
                <PackageX size={18} />
                ส่งแจ้งของหาย
              </>
            )}
          </button>
        </form>
      </div>
    </AppShell>
  );
}
