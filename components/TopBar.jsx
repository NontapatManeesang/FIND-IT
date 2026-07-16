'use client';

import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function TopBar({ title, backHref, subtitle, rightAction }) {
  const router = useRouter();

  return (
    <div className="topbar flex-shrink-0">
      <div className="flex items-center gap-3 px-4 sm:px-6 lg:px-8 py-4">
        {backHref && (
          <button
            aria-label="ย้อนกลับ"
            onClick={() => router.push(backHref)}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors shrink-0 -ml-1"
          >
            <ChevronLeft size={20} className="text-slate-600" />
          </button>
        )}
        <div className="flex-1 min-w-0">
          {subtitle && (
            <p className="text-[11px] font-semibold text-primary/70 uppercase tracking-widest mb-0.5">
              {subtitle}
            </p>
          )}
          <h1 className="font-bold text-lg text-slate-900 leading-tight truncate font-display">
            {title}
          </h1>
        </div>
        {rightAction && <div className="shrink-0">{rightAction}</div>}
      </div>
    </div>
  );
}
