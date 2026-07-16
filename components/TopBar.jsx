'use client';

import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function TopBar({ title, backHref, subtitle, rightAction }) {
  const router = useRouter();

  return (
    <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-line">
      <div className="flex items-center gap-2 px-4 sm:px-6 py-3.5">
        {backHref && (
          <button
            aria-label="ย้อนกลับ"
            onClick={() => router.push(backHref)}
            className="-ml-1 mr-1 flex h-9 w-9 items-center justify-center rounded-full hover:bg-line/60 transition-colors shrink-0"
          >
            <ChevronLeft size={20} className="text-ink" />
          </button>
        )}
        <div className="flex-1 min-w-0">
          <h1 className="font-semibold text-base text-ink leading-tight truncate">{title}</h1>
          {subtitle && <p className="text-[11px] text-muted mt-0.5 truncate">{subtitle}</p>}
        </div>
        {rightAction && <div className="shrink-0">{rightAction}</div>}
      </div>
    </div>
  );
}
