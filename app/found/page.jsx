import AppShell from '@/components/AppShell';
import Button from '@/components/Button';
import { Field, Input, Textarea } from '@/components/Input';
import { UploadPhoto } from '@/components/ItemCard';
import { MapPin, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function FoundItemPage() {
  return (
    <AppShell title="แจ้งของที่พบ" subtitle="กรอกรายละเอียดสิ่งของที่พบ" backHref="/home">
      <form className="space-y-4">
        <Field label="รูปภาพสิ่งของ">
          <UploadPhoto label="เพิ่มรูปสิ่งของที่พบ" />
        </Field>

        <Field label="รายละเอียดสิ่งของ">
          <Textarea rows={3} placeholder="เช่น บัตรนิสิต, กุญแจรถ, ร่มสีดำ..." />
        </Field>

        <Field label="สถานที่พบ">
          <Input icon={MapPin} placeholder="เช่น โรงอาหารกลาง" />
        </Field>

        <Field label="วันที่พบ">
          <Input icon={Calendar} type="date" />
        </Field>

        <div className="pt-2">
          <Link href="/chat">
            <Button variant="found" type="submit">
              ส่งแจ้งของที่พบ
            </Button>
          </Link>
        </div>
      </form>
    </AppShell>
  );
}
