'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, PlusCircle, MessageCircle, User, PackageX, PackageCheck, LogOut } from 'lucide-react';

const TABS = [
  { href: '/home', label: 'หน้าหลัก', icon: Home },
  { href: '/search', label: 'ค้นหา', icon: Search },
  // { href: '/lost', label: 'แจ้งของ', icon: PlusCircle },
  { href: '/chat', label: 'แชต', icon: MessageCircle },
  { href: '/profile', label: 'โปรไฟล์', icon: User },
];

/** Desktop Sidebar Navigation */
export function SideNav({ userName, unreadCount = 0 }) {
  const pathname = usePathname();

  return (
    <div className="app-sidebar">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-line">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-sm">Fi</span>
          </div>
          <div>
            <p className="font-bold text-ink text-base leading-none">FindIt</p>
            <p className="text-[10px] text-muted mt-0.5">มมส. Lost &amp; Found</p>
          </div>
        </div>
        {userName && (
          <p className="mt-3 text-xs text-muted truncate">
            สวัสดี, <span className="text-ink font-medium">{userName}</span>
          </p>
        )}
      </div>

      {/* Quick actions */}
      <div className="px-4 py-4 border-b border-line">
        <p className="text-[10px] font-semibold text-muted uppercase tracking-wider mb-2 px-2">แจ้งรายการ</p>
        <Link
          href="/lost"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-lost/5 border border-lost/20 mb-2 hover:bg-lost/10 transition-colors group"
        >
          <PackageX size={18} className="text-lost" />
          <span className="text-sm font-medium text-ink">แจ้งของหาย</span>
        </Link>
        <Link
          href="/found"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-found/5 border border-found/20 hover:bg-found/10 transition-colors group"
        >
          <PackageCheck size={18} className="text-found" />
          <span className="text-sm font-medium text-ink">แจ้งของที่พบ</span>
        </Link>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-4 py-4">
        <p className="text-[10px] font-semibold text-muted uppercase tracking-wider mb-2 px-2">เมนู</p>
        {TABS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          const isChatWithUnread = href === '/chat' && unreadCount > 0;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 transition-all ${
                active
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-muted hover:bg-gray-50 hover:text-ink'
              }`}
            >
              <div className="relative">
                <Icon size={18} strokeWidth={active ? 2.4 : 1.8} />
                {isChatWithUnread && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-lost rounded-full pulse-dot" />
                )}
              </div>
              <span className="text-sm">{label}</span>
              {isChatWithUnread && (
                <span className="ml-auto text-xs bg-lost text-white rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                  {unreadCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

/** Mobile Bottom Navigation */
export default function BottomNav({ unreadCount = 0 }) {
  const pathname = usePathname();

  return (
    <nav className="bottom-nav-mobile sticky bottom-0 z-10 border-t border-line bg-white/95 backdrop-blur-sm safe-bottom">
      <div className="grid grid-cols-5">
        {TABS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (pathname.startsWith(href + '/') && href !== '/');
          const isChatWithUnread = href === '/chat' && unreadCount > 0;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-1 py-3 text-[10px] relative transition-colors ${
                active ? 'text-primary' : 'text-muted'
              }`}
            >
              <div className="relative">
                <Icon
                  size={22}
                  strokeWidth={active ? 2.4 : 1.8}
                  className={active ? 'text-primary' : 'text-muted'}
                />
                {isChatWithUnread && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-lost text-white rounded-full text-[10px] flex items-center justify-center font-bold">
                    {unreadCount}
                  </span>
                )}
              </div>
              <span className={`font-medium ${active ? 'text-primary' : 'text-muted'}`}>{label}</span>
              {active && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-primary rounded-t-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
