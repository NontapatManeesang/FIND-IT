import { MapPin, Calendar } from 'lucide-react';

export function Tag({ type = 'lost' }) {
  const map = {
    lost: { label: 'ของหาย', cls: 'bg-lost/10 text-lost' },
    found: { label: 'พบของ', cls: 'bg-found/10 text-found' },
  };
  const t = map[type];
  return (
    <span className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-medium ${t.cls}`}>
      {t.label}
    </span>
  );
}

export function ItemCard({ type = 'lost', title, place, date, imageLabel = 'รูปภาพ' }) {
  return (
    <div className="flex gap-3 rounded-xl border border-line bg-card p-3 shadow-soft">
      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-line/50 text-[10px] text-muted text-center leading-tight">
        {imageLabel}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h3 className="truncate text-sm font-medium text-ink">{title}</h3>
          <Tag type={type} />
        </div>
        <div className="mt-1.5 flex items-center gap-1 text-xs text-muted">
          <MapPin size={12} />
          <span className="truncate">{place}</span>
        </div>
        <div className="mt-0.5 flex items-center gap-1 text-xs text-muted">
          <Calendar size={12} />
          <span>{date}</span>
        </div>
      </div>
    </div>
  );
}

export function UploadPhoto({ label = 'อัปโหลดรูปภาพ' }) {
  return (
    <button
      type="button"
      className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-line bg-card py-8 text-muted hover:border-ink/40 hover:text-ink transition-colors"
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <circle cx="8.5" cy="10.5" r="1.5" />
        <path d="M21 15l-5-5-9 9" />
      </svg>
      <span className="text-xs">{label}</span>
    </button>
  );
}
