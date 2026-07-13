import AppShell from '@/components/AppShell';
import { Input } from '@/components/Input';
import { ItemCard } from '@/components/ItemCard';
import { Search, PackageX, PackageCheck } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <AppShell title="สวัสดี, นิสิต มมส." subtitle="วันนี้คุณทำของหายหรือพบของหรือไม่?">
      <Link href="/search" className="block mb-5">
        <Input icon={Search} placeholder="ค้นหาสิ่งของที่หายหรือพบ..." readOnly />
      </Link>

      <div className="grid grid-cols-2 gap-3 mb-7">
        <Link
          href="/lost"
          className="flex flex-col items-center gap-2 rounded-xl border border-lost/25 bg-lost/5 py-6 text-center hover:bg-lost/10 transition-colors"
        >
          <PackageX size={26} className="text-lost" strokeWidth={1.7} />
          <span className="text-sm font-medium text-ink">แจ้งของหาย</span>
        </Link>
        <Link
          href="/found"
          className="flex flex-col items-center gap-2 rounded-xl border border-found/25 bg-found/5 py-6 text-center hover:bg-found/10 transition-colors"
        >
          <PackageCheck size={26} className="text-found" strokeWidth={1.7} />
          <span className="text-sm font-medium text-ink">แจ้งของที่พบ</span>
        </Link>
      </div>

      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-medium text-ink">รายการล่าสุด</h2>
        <Link href="/search" className="text-xs text-muted hover:text-ink">
          ดูทั้งหมด
        </Link>
      </div>

      <div className="space-y-3">
        <ItemCard type="lost" title="กระเป๋าสตางค์สีน้ำตาล" place="คณะวิทยาการสารสนเทศ" date="12 ก.ค. 2569" />
        <ItemCard type="found" title="บัตรนิสิต ชื่อ อรทัย" place="โรงอาหารกลาง" date="11 ก.ค. 2569" />
        <ItemCard type="lost" title="ร่มสีดำ ยี่ห้อ Rain" place="หอสมุดกลาง" date="10 ก.ค. 2569" />
      </div>
    </AppShell>
  );
}
