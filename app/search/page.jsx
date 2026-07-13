import AppShell from '@/components/AppShell';
import { Input, Select } from '@/components/Input';
import { ItemCard } from '@/components/ItemCard';
import { Search } from 'lucide-react';

export default function SearchPage() {
  return (
    <AppShell title="ค้นหา" subtitle="ค้นหาสิ่งของหายหรือของที่พบ" backHref="/home">
      <div className="mb-4">
        <Input icon={Search} placeholder="พิมพ์ชื่อสิ่งของ..." />
      </div>

      <div className="grid grid-cols-2 gap-2.5 mb-5">
        <Select defaultValue="">
          <option value="">ทุกประเภท</option>
          <option value="lost">ของหาย</option>
          <option value="found">ของที่พบ</option>
        </Select>
        <Select defaultValue="">
          <option value="">ทุกสถานที่</option>
          <option value="library">หอสมุดกลาง</option>
          <option value="canteen">โรงอาหารกลาง</option>
          <option value="faculty">คณะวิชา</option>
        </Select>
      </div>

      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-medium text-ink">ผลการค้นหา</h2>
        <span className="text-xs text-muted">4 รายการ</span>
      </div>

      <div className="space-y-3">
        <ItemCard type="lost" title="กระเป๋าสตางค์สีน้ำตาล" place="คณะวิทยาการสารสนเทศ" date="12 ก.ค. 2569" />
        <ItemCard type="found" title="บัตรนิสิต ชื่อ อรทัย" place="โรงอาหารกลาง" date="11 ก.ค. 2569" />
        <ItemCard type="lost" title="ร่มสีดำ ยี่ห้อ Rain" place="หอสมุดกลาง" date="10 ก.ค. 2569" />
        <ItemCard type="found" title="กุญแจรถมอเตอร์ไซค์" place="อาคารเรียนรวม" date="9 ก.ค. 2569" />
      </div>
    </AppShell>
  );
}
