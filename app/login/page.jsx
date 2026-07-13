import AppShell from '@/components/AppShell';
import Logo from '@/components/Logo';
import Button from '@/components/Button';
import { Field, Input } from '@/components/Input';
import { Mail, Lock } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <AppShell showTopBar={false} showNav={false}>
      <div className="flex h-full min-h-[85vh] flex-col justify-center">
        <div className="mb-10 flex flex-col items-center">
          <Logo size="md" />
          <p className="mt-2 text-xs text-muted">เข้าสู่ระบบเพื่อแจ้งหรือค้นหาสิ่งของ</p>
        </div>

        <form className="space-y-1">
          <Field label="อีเมล">
            <Input icon={Mail} type="email" placeholder="name@msu.ac.th" />
          </Field>
          <Field label="รหัสผ่าน">
            <Input icon={Lock} type="password" placeholder="••••••••" />
          </Field>

          <div className="pt-3">
            <Link href="/home">
              <Button variant="primary" type="submit">
                เข้าสู่ระบบ
              </Button>
            </Link>
          </div>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-line" />
          <span className="text-[11px] text-muted">หรือเข้าสู่ระบบด้วย</span>
          <div className="h-px flex-1 bg-line" />
        </div>

        <div className="space-y-2.5">
          <Link href="/home">
            <Button variant="secondary">
              <GoogleIcon />
              เข้าสู่ระบบด้วย Google
            </Button>
          </Link>
          <Link href="/home">
            <Button variant="secondary">
              <Mail size={16} />
              เข้าสู่ระบบด้วยอีเมล MSU
            </Button>
          </Link>
        </div>

        <p className="mt-8 text-center text-[11px] text-muted">
          การเข้าสู่ระบบถือว่ายอมรับ ข้อกำหนดการใช้งาน ของมหาวิทยาลัย
        </p>
      </div>
    </AppShell>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.85A11 11 0 0012 23z" />
      <path fill="#FBBC05" d="M5.84 14.1A6.6 6.6 0 015.5 12c0-.73.13-1.44.34-2.1V7.05H2.18A11 11 0 001 12c0 1.77.42 3.45 1.18 4.95l3.66-2.85z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1a11 11 0 00-9.82 6.05l3.66 2.85C6.71 7.31 9.14 5.38 12 5.38z" />
    </svg>
  );
}
