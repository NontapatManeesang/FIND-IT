import AppShell from '@/components/AppShell';
import Logo from '@/components/Logo';
import Button from '@/components/Button';
import Link from 'next/link';

export default function SplashPage() {
  return (
    <AppShell showTopBar={false} showNav={false}>
      <div className="flex h-full min-h-[80vh] flex-col items-center justify-center text-center">
        <Logo size="lg" />
        <p className="mt-4 font-display italic text-base text-muted">
          &ldquo;Lost it? Find it.&rdquo;
        </p>

        <p className="mt-2 text-xs text-muted max-w-[240px]">
          ระบบแจ้งของหายและของที่พบสำหรับนิสิต มมส.
        </p>

        <div className="mt-12 w-full max-w-[240px]">
          <Link href="/login">
            <Button variant="primary">เริ่มต้นใช้งาน</Button>
          </Link>
        </div>
      </div>

      <div className="absolute bottom-6 left-0 right-0 text-center text-[11px] text-muted">
        Mahasarakham University
      </div>
    </AppShell>
  );
}
