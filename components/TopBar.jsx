'use client';

import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function TopBar({ title, backHref, subtitle }) {
  const router = useRouter();

  return (
    <div className="sticky top-0 z-10 bg-paper/95 backdrop-blur border-b border-line">
      <div className="flex items-center gap-2 px-5 py-4">
        {backHref && (
          <button
            aria-label="ย้อนกลับ"
            onClick={() => router.push(backHref)}
            className="-ml-1 mr-1 flex h-8 w-8 items-center justify-center rounded-full hover:bg-line/60 transition-colors"
          >
            <ChevronLeft size={20} className="text-ink" />
          </button>
        )}
        <div>
          <h1 className="font-display text-lg text-ink leading-tight">{title}</h1>
          {subtitle && <p className="text-xs text-muted mt-0.5">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}
