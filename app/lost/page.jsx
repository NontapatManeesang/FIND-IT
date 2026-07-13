import AppShell from '@/components/AppShell';
import Button from '@/components/Button';
import { Field, Input, Textarea } from '@/components/Input';
import { UploadPhoto } from '@/components/ItemCard';
import { MapPin, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function LostItemPage() {
  return (
    <AppShell title="แจ้งของหาย" subtitle="กรอกรายละเอียดสิ่งของที่หาย" backHref="/home">
      <form className="space-y-4">
        <Field label="รูปภาพสิ่งของ">
          <UploadPhoto label="เพิ่มรูปสิ่งของที่หาย" />
        </Field>

        <Field label="ชื่อสิ่งของ">
          <Input placeholder="เช่น กระเป๋าสตางค์สีน้ำตาล" />
        </Field>

        <Field label="สถานที่คาดว่าทำหาย">
          <Input icon={MapPin} placeholder="เช่น คณะวิทยาการสารสนเทศ" />
        </Field>

        <Field label="วันที่หาย">
          <Input icon={Calendar} type="date" />
        </Field>

        <Field label="รายละเอียดเพิ่มเติม" hint="ลักษณะเด่น สี ขนาด หรือจุดสังเกต">
          <Textarea rows={4} placeholder="อธิบายลักษณะของสิ่งของ..." />
        </Field>

        <div className="pt-2">
          <Link href="/chat">
            <Button variant="lost" type="submit">
              ส่งแจ้งของหาย
            </Button>
          </Link>
        </div>
      </form>
    </AppShell>
  );
}
