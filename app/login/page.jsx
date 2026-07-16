'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock } from 'lucide-react';
import { login } from '@/app/login/actions';

import AppShell from '@/components/AppShell';
import Logo from '@/components/Logo';
import { Field, Input } from '@/components/Input';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (formData) => {
    setLoading(true);
    setError(null);
    const result = await login(formData);
    if (result?.error) {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <AppShell showTopBar={false} showNav={false}>
     <div className="mx-auto flex h-full min-h-[70vh] w-full max-w-4xl flex-col justify-center py-8">
        <div className="mb-8 flex flex-col items-center">
          <Logo โsize="md" />
          {/* <p className="mt-2 text-xs text-muted">
            เข้าสู่ระบบเพื่อแจ้งหรือค้นหาสิ่งของ
          </p> */}
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-2xl bg-rose-50 border border-rose-200 p-4 text-sm text-rose-600">
            <span className="shrink-0">⚠️</span>
            {error}
          </div>
        )}

        <form action={handleLogin} className="space-y-1">
          <Field label="อีเมล">
            <Input
              icon={Mail}
              type="email"
              name="email"
              required
              placeholder="email@example.com"
            />
          </Field>

          <Field label="รหัสผ่าน">
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
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-green-700 text-white py-4 text-[15px] font-semibold hover:bg-green-600 active:scale-[0.98] transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  กำลังเข้าสู่ระบบ...
                </>
              ) : 'เข้าสู่ระบบ'}
            </button>
          </div>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-line" />
          <span className="text-[11px] text-muted">หรือ</span>
          <div className="h-px flex-1 bg-line" />
        </div>

        <Link href="/register">
          <button className="w-full flex items-center justify-center gap-2 rounded-2xl border border-line bg-blue-700 text-ink py-3.5 text-[15px] font-medium hover:bg-blue-600 transition-all">
            <Mail size={16} />
            สมัครสมาชิกใหม่
          </button>
        </Link>

        <p className="mt-8 text-center text-[11px] text-muted">
          การเข้าสู่ระบบถือว่ายอมรับข้อกำหนดการใช้งานของมหาวิทยาลัย
        </p>
      </div>
    </AppShell>
  );
}