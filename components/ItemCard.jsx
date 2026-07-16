'use client';

import { MapPin, Calendar, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

const STATUS_MAP = {
  active: { label: 'กำลังหา', cls: 'bg-amber-50 text-amber-600 border-amber-200', icon: Clock },
  resolved: { label: 'ได้รับคืนแล้ว', cls: 'bg-emerald-50 text-emerald-600 border-emerald-200', icon: CheckCircle2 },
};

export function StatusBadge({ status = 'active', size = 'sm' }) {
  const s = STATUS_MAP[status] || STATUS_MAP.active;
  const Icon = s.icon;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${s.cls}`}>
      <Icon size={10} />
      {s.label}
    </span>
  );
}

export function Tag({ type = 'lost' }) {
  const map = {
    lost: { label: 'ของหาย', cls: 'bg-rose-50 text-rose-500 border-rose-200' },
    found: { label: 'พบของ', cls: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
  };
  const t = map[type] || map.lost;
  return (
    <span className={`inline-block rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${t.cls}`}>
      {t.label}
    </span>
  );
}

export function ItemCard({ type = 'lost', title, place, date, imageLabel = 'รูปภาพ', imageUrl, id, status = 'active' }) {
  const isResolved = status === 'resolved';

  const cardContent = (
    <div className={`flex gap-3 rounded-2xl border bg-white p-3 shadow-soft hover:shadow-md hover:border-primary/40 transition-all duration-200 cursor-pointer relative overflow-hidden ${
      isResolved ? 'border-emerald-200 opacity-80' : 'border-line'
    }`}>
      {/* Resolved overlay stripe */}
      {isResolved && (
        <div className="absolute inset-0 bg-emerald-50/30 pointer-events-none" />
      )}

      {imageUrl ? (
        <div className="h-[72px] w-[72px] shrink-0 overflow-hidden rounded-xl bg-line/50">
          <img src={imageUrl} alt={title} className="h-full w-full object-cover" />
        </div>
      ) : (
        <div className={`flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-xl text-[10px] text-muted text-center leading-tight ${
          type === 'lost' ? 'bg-rose-50' : 'bg-emerald-50'
        }`}>
          <div className="flex flex-col items-center gap-1">
            {type === 'lost' ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-rose-300">
                <path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/>
                <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-emerald-300">
                <path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/>
                <polyline points="9,11 12,14 22,4"/>
              </svg>
            )}
          </div>
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className={`text-sm font-semibold leading-snug line-clamp-2 ${isResolved ? 'text-muted line-through' : 'text-ink'}`}>
            {title}
          </h3>
          <Tag type={type} />
        </div>

        <div className="mt-1 flex items-center gap-1 text-xs text-muted">
          <MapPin size={11} className="shrink-0" />
          <span className="truncate">{place}</span>
        </div>
        {date && (
          <div className="mt-0.5 flex items-center gap-1 text-xs text-muted">
            <Calendar size={11} className="shrink-0" />
            <span>{date}</span>
          </div>
        )}

        {isResolved && (
          <div className="mt-1.5">
            <StatusBadge status="resolved" />
          </div>
        )}
      </div>
    </div>
  );

  if (id) {
    return <Link href={`/item/${id}`}>{cardContent}</Link>;
  }

  return cardContent;
}

export function UploadPhoto({ label = 'อัปโหลดรูปภาพ', onFileSelect }) {
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      if (onFileSelect) onFileSelect(file);
    }
  };

  return (
    <div className="relative flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-line bg-gray-50/50 py-10 text-muted hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer overflow-hidden group">
      <input
        type="file"
        name="image"
        accept="image/*"
        onChange={handleFileChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
      />
      {preview ? (
        <img src={preview} alt="Preview" className="absolute inset-0 w-full h-full object-cover rounded-2xl" />
      ) : (
        <>
          <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-line flex items-center justify-center group-hover:border-primary/30 transition-colors">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="text-muted group-hover:text-primary transition-colors">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <circle cx="8.5" cy="10.5" r="1.5" />
              <path d="M21 15l-5-5-9 9" />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-ink">{label}</p>
            <p className="text-xs text-muted mt-0.5">PNG, JPG หรือ WEBP</p>
          </div>
        </>
      )}
    </div>
  );
}
