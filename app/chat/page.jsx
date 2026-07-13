import AppShell from '@/components/AppShell';
import { Sparkles, Send } from 'lucide-react';

export default function ChatPage() {
  return (
    <AppShell title="แชตและการจับคู่" subtitle="พูดคุยกับผู้พบสิ่งของของคุณ" backHref="/home">
      {/* Match notification */}
      <div className="mb-5 flex gap-3 rounded-xl border border-gold/30 bg-gold/10 p-3.5">
        <Sparkles size={18} className="mt-0.5 shrink-0 text-gold" />
        <div>
          <p className="text-sm font-medium text-ink">พบรายการที่ใกล้เคียงกับของคุณ</p>
          <p className="mt-0.5 text-xs text-muted">
            &ldquo;บัตรนิสิต ชื่อ อรทัย&rdquo; ตรงกับที่คุณแจ้งหายไว้ 92%
          </p>
        </div>
      </div>

      {/* Conversation header */}
      <div className="mb-3 flex items-center gap-3 rounded-xl border border-line bg-card p-3">
        <div className="h-10 w-10 shrink-0 rounded-full bg-line/60 flex items-center justify-center text-xs text-muted">
          กษ
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-ink">กษิดิศ (ผู้พบของ)</p>
          <p className="text-xs text-muted">พบที่ โรงอาหารกลาง · 11 ก.ค. 2569</p>
        </div>
      </div>

      {/* Chat thread */}
      <div className="flex flex-col gap-2.5 mb-4">
        <ChatBubble from="them" text="สวัสดีครับ ผมเจอบัตรนิสิตที่โรงอาหารกลาง น่าจะใช่ของคุณไหมครับ" time="14:02" />
        <ChatBubble from="me" text="ใช่ค่ะ ขอบคุณมากค่ะ สะดวกนัดรับตอนไหนดีคะ" time="14:05" />
        <ChatBubble from="them" text="สะดวกพรุ่งนี้บ่าย 2 ที่จุดประชาสัมพันธ์ ตึกวิทยบริการได้ไหมครับ" time="14:07" />
      </div>

      {/* Composer */}
      <div className="sticky bottom-0 -mx-5 border-t border-line bg-paper/95 px-5 py-3 backdrop-blur">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="พิมพ์ข้อความ..."
            className="flex-1 rounded-xl border border-line bg-card px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/70 focus:border-ink transition-colors"
          />
          <button
            type="button"
            aria-label="ส่งข้อความ"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ink text-paper hover:bg-ink2 transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </AppShell>
  );
}

function ChatBubble({ from, text, time }) {
  const isMe = from === 'me';
  return (
    <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[78%] rounded-xl px-3.5 py-2.5 text-sm ${
          isMe ? 'bg-ink text-paper rounded-br-sm' : 'bg-card border border-line text-ink rounded-bl-sm'
        }`}
      >
        <p>{text}</p>
        <p className={`mt-1 text-[10px] ${isMe ? 'text-paper/60' : 'text-muted'}`}>{time}</p>
      </div>
    </div>
  );
}
