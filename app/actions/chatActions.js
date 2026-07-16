'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function sendMessage(formData) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'กรุณาเข้าสู่ระบบ' }

  const text = formData.get('text')?.trim()
  const receiverId = formData.get('receiver_id')
  const itemId = formData.get('item_id')

  if (!text) return { error: 'กรุณาพิมพ์ข้อความ' }
  if (!receiverId) return { error: 'ไม่พบผู้รับ' }
  if (receiverId === user.id) return { error: 'ไม่สามารถส่งข้อความหาตัวเองได้' }

  const { error } = await supabase.from('messages').insert({
    sender_id: user.id,
    receiver_id: receiverId,
    item_id: itemId || null,
    text: text,
    is_read: false,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/chat')
  revalidatePath(`/chat/${receiverId}`)
  return { success: true }
}

export async function markMessagesRead(otherUserId) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'ไม่ได้เข้าสู่ระบบ' }

  console.log('Marking messages as read:', { userId: user.id, otherUserId })

  const { error, count } = await supabase
    .from('messages')
    .update({ is_read: true })
    .eq('receiver_id', user.id)
    .eq('sender_id', otherUserId)
    .select()

  console.log('Mark as read result:', { error, count })

  revalidatePath('/chat')
  revalidatePath(`/chat/${otherUserId}`)
  revalidatePath('/home')
  return { success: true }
}
