'use client';

import { MapPin, Calendar, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

const STATUS_MAP = {
  active: { label: 'กำลังหา', cls: 'bg-accent/10 text-accent border-accent/20', icon: Clock },
  resolved: { label: 'ได้รับคืนแล้ว', cls: 'bg-found-subtle text-found border-found-light/30', icon: CheckCircle2 },
};

export function StatusBadge({ status = 'active', size = 'sm' }) {
  const s = STATUS_MAP[status] || STATUS_MAP.active;
  const Icon = s.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold tracking-wide ${s.cls}`}>
      <Icon size={12} strokeWidth={2.5} />
      {s.label}
    </span>
  );
}

export function Tag({ type = 'lost' }) {
  const map = {
    lost: { label: 'ของหาย', cls: 'bg-lost text-white shadow-sm shadow-lost/30' },
    found: { label: 'พบของ', cls: 'bg-found text-white shadow-sm shadow-found/30' },
  };
  const t = map[type] || map.lost;
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-[11px] font-bold tracking-wider ${t.cls}`}>
      {t.label}
    </span>
  );
}

export function ItemCard({ type = 'lost', title, place, date, imageLabel = 'รูปภาพ', imageUrl, id, status = 'active' }) {
  const isResolved = status === 'resolved';

  const cardContent = (
    <div className={`group flex flex-col rounded-3xl border bg-white shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer relative overflow-hidden ${
      isResolved ? 'border-found-light/30 opacity-85' : 'border-line/60 hover:border-primary/40'
    }`}>
      {/* Resolved overlay stripe */}
      {isResolved && (
        <div className="absolute inset-0 bg-found-subtle/30 pointer-events-none z-10" />
      )}

      {/* Image Area */}
      <div className="aspect-[4/3] w-full shrink-0 overflow-hidden bg-paper relative">
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className={`flex h-full w-full items-center justify-center text-[10px] text-muted text-center leading-tight ${
            type === 'lost' ? 'bg-lost-subtle/50' : 'bg-found-subtle/50'
          }`}>
            <div className="flex flex-col items-center gap-2">
              {type === 'lost' ? (
                <div className="w-12 h-12 rounded-full bg-lost-subtle flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-lost-light">
                    <path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/>
                    <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
                  </svg>
                </div>
              ) : (
                <div className="w-12 h-12 rounded-full bg-found-subtle flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-found-light">
                    <path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/>
                    <polyline points="9,11 12,14 22,4"/>
                  </svg>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Floating Tag */}
        <div className="absolute top-3 left-3 z-20">
          <Tag type={type} />
        </div>
      </div>

      {/* Content Area */}
      <div className="flex flex-col flex-1 p-4">
        <h3 className={`text-base font-bold leading-snug line-clamp-2 mb-3 flex-1 ${isResolved ? 'text-muted line-through' : 'text-ink'}`}>
          {title}
        </h3>

        <div className="space-y-2 mt-auto">
          <div className="flex items-center gap-2 text-xs text-ink2 font-medium">
            <div className="w-5 h-5 rounded-md bg-paper flex items-center justify-center shrink-0">
               <MapPin size={12} className="text-primary" />
            </div>
            <span className="truncate">{place}</span>
          </div>
          {date && (
            <div className="flex items-center gap-2 text-xs text-ink2 font-medium">
              <div className="w-5 h-5 rounded-md bg-paper flex items-center justify-center shrink-0">
                 <Calendar size={12} className="text-primary" />
              </div>
              <span>{date}</span>
            </div>
          )}
        </div>

        {isResolved && (
          <div className="mt-4 pt-3 border-t border-line/50">
            <StatusBadge status="resolved" />
          </div>
        )}
      </div>
    </div>
  );

  if (id) {
    return <Link href={`/item/${id}`} className="block h-full">{cardContent}</Link>;
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
    <div className="relative flex w-full flex-col items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-line/80 bg-paper py-12 text-muted hover:border-primary/40 hover:bg-primary-subtle/30 transition-all cursor-pointer overflow-hidden group">
      <input
        type="file"
        name="image"
        accept="image/*"
        onChange={handleFileChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
      />
      {preview ? (
        <img src={preview} alt="Preview" className="absolute inset-0 w-full h-full object-cover rounded-3xl" />
      ) : (
        <>
          <div className="w-14 h-14 rounded-2xl bg-white shadow-soft border border-line/60 flex items-center justify-center group-hover:border-primary/40 group-hover:scale-110 transition-all duration-300">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted group-hover:text-primary transition-colors">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <circle cx="8.5" cy="10.5" r="1.5" />
              <path d="M21 15l-5-5-9 9" />
            </svg>
          </div>
          <div className="text-center mt-2">
            <p className="text-sm font-bold text-ink">{label}</p>
            <p className="text-xs text-muted mt-1 font-medium">PNG, JPG หรือ WEBP</p>
          </div>
        </>
      )}
    </div>
  );
}
