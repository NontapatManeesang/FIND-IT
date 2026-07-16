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
    <div className="space-y-2.5">
      {error && (
        <p className="text-xs text-rose-500 text-center">{error}</p>
      )}

      {!isResolved ? (
        <button
          onClick={handleResolve}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 text-white py-3.5 text-sm font-semibold hover:bg-emerald-600 active:scale-[0.98] transition-all shadow-sm disabled:opacity-50"
        >
          <CheckCircle2 size={18} />
          {loading ? 'กำลังบันทึก...' : itemType === 'lost' ? 'ได้รับคืนแล้ว ✓' : 'มีคนมารับแล้ว ✓'}
        </button>
      ) : (
        <button
          onClick={handleReopen}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 text-amber-700 py-3.5 text-sm font-semibold hover:bg-amber-100 active:scale-[0.98] transition-all disabled:opacity-50"
        >
          <RotateCcw size={16} />
          {loading ? 'กำลังบันทึก...' : 'เปิดรายการอีกครั้ง'}
        </button>
      )}

      <button
        onClick={handleDelete}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 rounded-2xl border border-rose-200 text-rose-500 py-3 text-sm font-medium hover:bg-rose-50 active:scale-[0.98] transition-all disabled:opacity-50"
      >
        <Trash2 size={15} />
        ลบรายการนี้
      </button>
    </div>
  );
}
