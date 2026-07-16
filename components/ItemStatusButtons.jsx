'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateItemStatus, deleteItem } from '@/app/actions/itemActions';
import { CheckCircle2, Trash2, RotateCcw } from 'lucide-react';

export function ItemStatusButtons({ itemId, itemType, currentStatus }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleResolve = async () => {
    setLoading(true);
    setError(null);
    const result = await updateItemStatus(itemId, 'resolved');
    if (result?.error) {
      setError(result.error);
    } else {
      router.refresh();
    }
    setLoading(false);
  };

  const handleReopen = async () => {
    setLoading(true);
    setError(null);
    const result = await updateItemStatus(itemId, 'active');
    if (result?.error) {
      setError(result.error);
    } else {
      router.refresh();
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!confirm('ยืนยันการลบรายการนี้? ข้อความที่เกี่ยวข้องจะถูกลบด้วย')) return;
    setLoading(true);
    setError(null);
    const result = await deleteItem(itemId);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push('/home');
    }
  };

  const isResolved = currentStatus === 'resolved';

  return (
    <div className="space-y-3">
      {error && (
        <p className="text-xs font-bold text-rose-500 text-center bg-rose-50 py-2 rounded-xl">{error}</p>
      )}

      {!isResolved ? (
        <button
          onClick={handleResolve}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 text-white py-4 text-[15px] font-bold hover:bg-emerald-600 active:scale-[0.98] transition-all shadow-sm shadow-emerald-200 disabled:opacity-50"
        >
          <CheckCircle2 size={20} />
          {loading ? 'กำลังบันทึก...' : itemType === 'lost' ? 'ได้รับคืนแล้ว ✓' : 'มีคนมารับแล้ว ✓'}
        </button>
      ) : (
        <button
          onClick={handleReopen}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 rounded-2xl border-2 border-amber-200 bg-amber-50 text-amber-700 py-4 text-[15px] font-bold hover:bg-amber-100 active:scale-[0.98] transition-all disabled:opacity-50"
        >
          <RotateCcw size={18} />
          {loading ? 'กำลังบันทึก...' : 'เปิดรายการอีกครั้ง'}
        </button>
      )}

      <button
        onClick={handleDelete}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 rounded-2xl border-2 border-rose-100 bg-white text-rose-500 py-3.5 text-sm font-bold hover:bg-rose-50 hover:border-rose-200 active:scale-[0.98] transition-all disabled:opacity-50"
      >
        <Trash2 size={16} />
        ลบรายการนี้
      </button>
    </div>
  );
}
