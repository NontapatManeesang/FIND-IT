-- ============================================
-- FindIt App - Database Setup SQL
-- รัน script นี้ใน Supabase SQL Editor
-- ============================================

-- 1. สร้างตาราง items (ถ้ายังไม่มี)
CREATE TABLE IF NOT EXISTS public.items (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL CHECK (type IN ('lost', 'found')),
  title text NOT NULL DEFAULT '',
  place text NOT NULL DEFAULT '',
  date date,
  description text DEFAULT '',
  image_url text,
  status text DEFAULT 'active' CHECK (status IN ('active', 'resolved')),
  category text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. เพิ่ม columns ที่ขาดหายใน items (ถ้ามีตารางอยู่แล้ว)
ALTER TABLE public.items ADD COLUMN IF NOT EXISTS status text DEFAULT 'active';
ALTER TABLE public.items ADD COLUMN IF NOT EXISTS category text;

-- อัปเดต status เก่าๆ ให้เป็น 'active'
UPDATE public.items SET status = 'active' WHERE status IS NULL;

-- 3. สร้างตาราง messages (ถ้ายังไม่มี)
CREATE TABLE IF NOT EXISTS public.messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  receiver_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  item_id uuid REFERENCES public.items(id) ON DELETE SET NULL,
  text text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- 4. เพิ่ม is_read column ถ้ายังไม่มี
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS is_read boolean DEFAULT false;

-- 5. RLS Policies สำหรับ items
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;

-- ทุกคนอ่านได้
CREATE POLICY IF NOT EXISTS "Anyone can read items"
  ON public.items FOR SELECT
  USING (true);

-- เฉพาะ owner เท่านั้นที่ insert/update/delete
CREATE POLICY IF NOT EXISTS "Users can insert their own items"
  ON public.items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can update their own items"
  ON public.items FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can delete their own items"
  ON public.items FOR DELETE
  USING (auth.uid() = user_id);

-- 6. RLS Policies สำหรับ messages
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- ดูเฉพาะข้อความของตัวเอง (ส่งหรือรับ)
CREATE POLICY IF NOT EXISTS "Users can see their own messages"
  ON public.messages FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- ส่งข้อความได้เฉพาะในนามตัวเอง
CREATE POLICY IF NOT EXISTS "Users can send messages"
  ON public.messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

-- อัปเดตสถานะ is_read ได้เฉพาะผู้รับ
CREATE POLICY IF NOT EXISTS "Receiver can mark as read"
  ON public.messages FOR UPDATE
  USING (auth.uid() = receiver_id);

-- 7. Indexes
CREATE INDEX IF NOT EXISTS idx_items_user_id ON public.items(user_id);
CREATE INDEX IF NOT EXISTS idx_items_type ON public.items(type);
CREATE INDEX IF NOT EXISTS idx_items_status ON public.items(status);
CREATE INDEX IF NOT EXISTS idx_items_created_at ON public.items(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON public.messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at);

-- 8. Storage bucket สำหรับ item-images (รัน manual ถ้ายังไม่มี)
-- ไปที่ Supabase Dashboard > Storage > New bucket
-- Name: item-images, Public: true

-- Done! ✅
SELECT 'Database setup complete!' as message;
