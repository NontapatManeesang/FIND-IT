import AppShell from '@/components/AppShell';
import Logo from '@/components/Logo';
import Button from '@/components/Button';
import Link from 'next/link';
import { PackageCheck, PackageX, Sparkles } from 'lucide-react';

export default function SplashPage() {
  return (
    <AppShell showTopBar={false} showNav={false}>
      <div className="flex h-[100dvh] -mx-5 sm:-mx-8 -my-6 px-5 sm:px-8 py-6 flex-col items-center justify-center text-center relative overflow-hidden bg-gradient-to-b from-primary-subtle/30 to-paper">
        {/* Background Decorations */}
        <div className="absolute top-1/4 -left-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 -right-10 w-40 h-40 bg-found/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />

        <div className="relative z-10 flex flex-col items-center w-full max-w-sm mx-auto">
          <div className="mb-8 relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-found/20 blur-xl rounded-full opacity-50 animate-pulse" />
            <div className="w-24 h-24 rounded-[32px] bg-gradient-to-br from-primary to-primary-light flex items-center justify-center shadow-float relative z-10 transform -rotate-6 hover:rotate-0 transition-transform duration-500">
              <span className="text-white font-bold text-5xl font-display">Fi</span>
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-ink font-display tracking-tight mb-2">
            FindIt
          </h1>
          <p className="font-display italic text-lg text-primary flex items-center gap-2 mb-4">
            <Sparkles size={18} />
            Lost it? Find it.
          </p>

          <p className="text-sm text-ink2 max-w-[260px] leading-relaxed mb-10">
            ระบบศูนย์กลางติดตามของหาย และประกาศแจ้งของที่พบ สำหรับนิสิตมหาวิทยาลัยมหาสารคาม
          </p>

          <div className="w-full space-y-3">
            <Link href="/login" className="block w-full">
              <button className="w-full py-4 rounded-2xl bg-primary text-white font-bold text-[15px] shadow-float hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                เข้าสู่ระบบ / สมัครสมาชิก
              </button>
            </Link>
            <Link href="/home" className="block w-full">
              <button className="w-full py-4 rounded-2xl bg-white border border-line/80 text-ink font-bold text-[15px] shadow-sm hover:border-primary/40 hover:bg-paper transition-all duration-300">
                เข้าใช้งานแบบผู้เยี่ยมชม
              </button>
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-0 right-0 text-center text-xs text-muted font-medium">
          Mahasarakham University
        </div>
      </div>
    </AppShell>
  );
}
