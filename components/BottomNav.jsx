'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, PlusCircle, MessageCircle } from 'lucide-react';

const TABS = [
  { href: '/home', label: 'หน้าหลัก', icon: Home },
  { href: '/search', label: 'ค้นหา', icon: Search },
  { href: '/lost', label: 'แจ้งของ', icon: PlusCircle },
  { href: '/chat', label: 'แชต', icon: MessageCircle },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="sticky bottom-0 z-10 border-t border-line bg-card">
      <div className="grid grid-cols-4">
        {TABS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href === '/lost' && pathname === '/found');
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-1 py-3 text-[11px]"
            >
              <Icon size={20} className={active ? 'text-ink' : 'text-muted'} strokeWidth={active ? 2.4 : 1.8} />
              <span className={active ? 'text-ink font-medium' : 'text-muted'}>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
