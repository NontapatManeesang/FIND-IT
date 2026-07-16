'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, User } from 'lucide-react';
import { signup } from '@/app/login/actions';
import AppShell from '@/components/AppShell';
import Logo from '@/components/Logo';
import { Field, Input } from '@/components/Input';

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSignup = async (formData) => {
    setLoading(true);
    setError(null);
    const result = await signup(formData);
    if (result?.error) {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <AppShell showTopBar={false} showNav={false}>
      <div className="flex h-full min-h-[90vh] flex-col justify-center py-8">
        <div className="mb-8 flex flex-col items-center">
          <Logo size="md" />
          <p className="mt-2 text-xs text-muted">สมัครสมาชิกเพื่อเริ่มใช้งาน</p>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-2xl bg-rose-50 border border-rose-200 p-4 text-sm text-rose-600">
            <span className="shrink-0">⚠️</span>
            {error}
          </div>
        )}

        <form action={handleSignup} className="space-y-1">
          <Field label="ชื่อ-นามสกุล">
            <Input
              icon={User}
              type="text"
              name="display_name"
              placeholder="ชื่อ นามสกุล"
            />
          </Field>

          <Field label="อีเมล">
            <Input
              icon={Mail}
              type="email"
              name="email"
              required
              placeholder="email@example.com"
            />
          </Field>

          <Field label="รหัสผ่าน" hint="อย่างน้อย 6 ตัวอักษร">
            <Input
              icon={Lock}
              type="password"
              name="password"
              required
              placeholder="••••••••"
            />
          </Field>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-primary text-white py-4 text-[15px] font-semibold hover:bg-blue-700 active:scale-[0.98] transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  กำลังสมัครสมาชิก...
                </>
              ) : 'สมัครสมาชิก'}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-[13px] text-muted">
          มีบัญชีอยู่แล้ว?{' '}
          <Link href="/login" className="text-primary font-semibold">
            เข้าสู่ระบบ
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
