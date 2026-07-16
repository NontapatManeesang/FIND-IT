'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  Home, Search, MessageCircle, User,
  PackageX, PackageCheck, LogOut, Zap
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { logout } from '@/app/login/actions';

const TABS = [
  { href: '/home',    label: 'หน้าหลัก',    icon: Home },
  { href: '/search',  label: 'ค้นหา',        icon: Search },
  { href: '/chat',    label: 'ข้อความ',      icon: MessageCircle },
  { href: '/profile', label: 'โปรไฟล์',     icon: User },
];

/* ─── Desktop Sidebar ─────────────────────────────────────────── */
export function SideNav({ userName: initialUserName, unreadCount = 0 }) {
  const pathname = usePathname();
  const [fetchedName, setFetchedName] = useState(null);

  useEffect(() => {
    if (!initialUserName) {
      const sb = createClient();
      sb.auth.getUser().then(({ data: { user } }) => {
        if (user) {
          const n = user.user_metadata?.display_name
            || user.user_metadata?.full_name
            || user.email?.split('@')[0];
          setFetchedName(n);
        }
      });
    }
  }, [initialUserName]);

  const userName = initialUserName || fetchedName;

  return (
    <aside className="app-sidebar flex flex-col">
      {/* ── Brand ── */}
      <div className="px-6 pt-8 pb-6 border-b border-slate-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200 flex-shrink-0">
            <Zap size={18} className="text-white" strokeWidth={2.5} />
          </div>
          <div>
            <p className="font-bold text-slate-900 text-base leading-none font-display">FindIt</p>
            <p className="text-[11px] text-slate-400 mt-0.5 font-medium tracking-wide">มมส. Lost & Found</p>
          </div>
        </div>

        {/* User card */}
        {userName ? (
          <div className="flex items-center gap-3 bg-slate-50 rounded-2xl p-3 border border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm flex-shrink-0">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">ยินดีต้อนรับ</p>
              <p className="text-sm font-bold text-slate-800 truncate">{userName}</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 bg-slate-50 rounded-2xl p-3 border border-slate-100">
            <div className="w-9 h-9 rounded-xl skeleton" />
            <div className="flex-1 space-y-2">
              <div className="h-2.5 w-14 rounded skeleton" />
              <div className="h-3.5 w-24 rounded skeleton" />
            </div>
          </div>
        )}
      </div>

      {/* ── Quick Actions ── */}
      <div className="px-4 pt-5 pb-4 border-b border-slate-100">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-2">แจ้งรายการ</p>
        <div className="space-y-1.5">
          <Link
            href="/lost"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl group hover:bg-rose-50 transition-colors"
          >
            <div className="w-7 h-7 rounded-lg bg-rose-100 flex items-center justify-center flex-shrink-0 group-hover:bg-rose-200 transition-colors">
              <PackageX size={14} className="text-rose-500" />
            </div>
            <span className="text-sm font-semibold text-slate-700 group-hover:text-rose-600 transition-colors">แจ้งของหาย</span>
          </Link>
          <Link
            href="/found"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl group hover:bg-emerald-50 transition-colors"
          >
            <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-200 transition-colors">
              <PackageCheck size={14} className="text-emerald-500" />
            </div>
            <span className="text-sm font-semibold text-slate-700 group-hover:text-emerald-600 transition-colors">แจ้งของที่พบ</span>
          </Link>
        </div>
      </div>

      {/* ── Nav Links ── */}
      <nav className="flex-1 px-4 pt-5 pb-4 overflow-y-auto">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-2">เมนูหลัก</p>
        <div className="space-y-0.5">
          {TABS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (pathname.startsWith(href + '/') && href !== '/home');
            const hasBadge = href === '/chat' && unreadCount > 0;
            return (
              <Link
                key={href}
                href={href}
                prefetch={true}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors duration-150 ${
                  active
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="relative flex-shrink-0">
                  <Icon size={18} strokeWidth={active ? 2.5 : 2} />
                  {hasBadge && !active && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full" />
                  )}
                </div>
                <span className={`text-sm ${active ? 'font-semibold' : 'font-medium'} flex-1`}>{label}</span>
                {hasBadge && (
                  <span className={`text-[11px] font-bold rounded-full px-1.5 py-0.5 min-w-[18px] text-center ${
                    active ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-600'
                  }`}>
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* ── Logout ── */}
      <div className="px-4 pb-6 border-t border-slate-100 pt-4 flex-shrink-0">
        <form action={logout}>
          <button
            type="submit"
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-colors group"
          >
            <div className="w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-rose-100 flex items-center justify-center flex-shrink-0 transition-colors">
              <LogOut size={14} className="text-slate-400 group-hover:text-rose-500 transition-colors" />
            </div>
            <span className="text-sm font-semibold">ออกจากระบบ</span>
          </button>
        </form>
      </div>
    </aside>
  );
}

/* ─── Mobile Bottom Navigation ────────────────────────────────── */
export default function BottomNav({ unreadCount = 0 }) {
  const pathname = usePathname();

  return (
    <nav className="bottom-nav-mobile flex-shrink-0 glass border-t border-slate-200/60 pb-safe">
      <div className="grid grid-cols-4">
        {TABS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (pathname.startsWith(href + '/') && href !== '/home');
          const hasBadge = href === '/chat' && unreadCount > 0;
          return (
            <Link
              key={href}
              href={href}
              prefetch={true}
              className={`flex flex-col items-center gap-1 py-3 px-2 relative transition-colors duration-150 ${
                active ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              {active && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-indigo-600 rounded-b-full" />
              )}
              <div className="relative">
                <div className={`flex items-center justify-center w-9 h-9 rounded-xl transition-colors duration-150 ${
                  active ? 'bg-indigo-50' : ''
                }`}>
                  <Icon
                    size={20}
                    strokeWidth={active ? 2.5 : 1.8}
                    className={active ? 'text-indigo-600' : 'text-slate-400'}
                  />
                </div>
                {hasBadge && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] flex items-center justify-center font-bold border-2 border-white">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-semibold tracking-wide ${active ? 'text-indigo-600' : 'text-slate-400'}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
