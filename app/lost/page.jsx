'use client';

import { useState, useEffect } from 'react';
import AppShell from '@/components/AppShell';
import Button from '@/components/Button';
import { Field, Input, Textarea, Select } from '@/components/Input';
import { UploadPhoto } from '@/components/ItemCard';
import { MapPin, Calendar, Tag } from 'lucide-react';
import { createItem } from '@/app/actions/itemActions';
import { createClient } from '@/utils/supabase/client';

const CATEGORIES = [
  { value: '', label: 'เลือกหมวดหมู่' },
  { value: 'กระเป๋า', label: '👜 กระเป๋า' },
  { value: 'กุญแจ', label: '🔑 กุญแจ' },
  { value: 'โทรศัพท์', label: '📱 โทรศัพท์' },
  { value: 'เครื่องเขียน', label: '✏️ เครื่องเขียน' },
  { value: 'บัตร', label: '💳 บัตร' },
  { value: 'เงิน', label: '💰 เงิน/กระเป๋าสตางค์' },
  { value: 'หูฟัง', label: '🎧 หูฟัง/อุปกรณ์อิเล็กทรอนิกส์' },
  { value: 'ผ้า', label: '👕 เสื้อผ้า/ผ้า' },
  { value: 'อื่นๆ', label: '📦 อื่นๆ' },
];

export default function LostItemPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const supabase = createClient();

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

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    const result = await createItem(formData, 'lost');
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <AppShell title="แจ้งของหาย" subtitle="กรอกข้อมูลให้ครบเพื่อเพิ่มโอกาสหาของเจอ" backHref="/home" unreadCount={unreadCount}>
      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-2xl bg-rose-50 border border-rose-200 p-4 text-sm text-rose-600">
          <span className="text-rose-500 shrink-0">⚠️</span>
          {error}
        </div>
      )}

      <form action={handleSubmit} className="space-y-5">
        <Field label="รูปภาพสิ่งของ">
          <UploadPhoto label="เพิ่มรูปสิ่งของที่หาย" />
        </Field>

        <Field label="ชื่อสิ่งของ *" hint="ระบุให้ชัดเจน เช่น กระเป๋าสตางค์สีน้ำตาลยี่ห้อ Coach">
          <Input name="title" required placeholder="เช่น กระเป๋าสตางค์สีน้ำตาล" />
        </Field>

        <Field label="หมวดหมู่">
          <Select name="category">
            {CATEGORIES.map(c => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </Select>
        </Field>

        <Field label="สถานที่คาดว่าทำหาย *">
          <Input name="place" required icon={MapPin} placeholder="เช่น คณะวิทยาการสารสนเทศ ชั้น 2" />
        </Field>

        <Field label="วันที่หาย *">
          <Input name="date" required icon={Calendar} type="date" />
        </Field>

        <Field label="รายละเอียดเพิ่มเติม" hint="ลักษณะเด่น สี ขนาด หรือจุดสังเกตที่ช่วยให้จำได้">
          <Textarea name="description" rows={4} placeholder="อธิบายลักษณะของสิ่งของให้ชัดเจนที่สุด เช่น สี ยี่ห้อ มีรอยขีดข่วน หรือสิ่งที่ติดมา..." />
        </Field>

        <div className="pt-1 pb-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-rose-500 text-white py-4 text-[15px] font-semibold hover:bg-rose-600 active:scale-[0.98] transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                กำลังบันทึก...
              </>
            ) : '📢 ส่งแจ้งของหาย'}
          </button>
        </div>
      </form>
    </AppShell>
  );
}
