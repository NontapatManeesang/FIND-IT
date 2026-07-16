'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createItem(formData, type) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'กรุณาเข้าสู่ระบบก่อนทำการแจ้ง' }
  }

  const file = formData.get('image')
  let imageUrl = null

  if (file && file.size > 0) {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`
    const filePath = `${user.id}/${fileName}`
    
    const { error: uploadError } = await supabase.storage
      .from('item-images')
      .upload(filePath, file)
    
    if (uploadError) {
      return { error: `Upload error: ${uploadError.message}` }
    }
    
    const { data: publicUrlData } = supabase.storage
      .from('item-images')
      .getPublicUrl(filePath)
      
    imageUrl = publicUrlData.publicUrl
  }

  const category = formData.get('category') || null

  const itemData = {
    user_id: user.id,
    type,
    title: formData.get('title') || '',
    place: formData.get('place') || '',
    date: formData.get('date') || null,
    description: formData.get('description') || '',
    image_url: imageUrl,
    status: 'active',
    category,
  }

  const { error: dbError } = await supabase
    .from('items')
    .insert(itemData)

  if (dbError) {
    return { error: `DB error: ${dbError.message}` }
  }

  revalidatePath('/home')
  revalidatePath('/search')
  redirect('/home')
}

export async function updateItemStatus(itemId, status) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'ไม่ได้เข้าสู่ระบบ' }

  // Only owner can update
  const { data: item } = await supabase
    .from('items')
    .select('user_id')
    .eq('id', itemId)
    .single()

  if (!item || item.user_id !== user.id) {
    return { error: 'ไม่มีสิทธิ์แก้ไขรายการนี้' }
  }

  const { error } = await supabase
    .from('items')
    .update({ status })
    .eq('id', itemId)

  if (error) return { error: error.message }

  revalidatePath(`/item/${itemId}`)
  revalidatePath('/home')
  revalidatePath('/search')
  revalidatePath('/profile')
  return { success: true }
}

export async function deleteItem(itemId) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'ไม่ได้เข้าสู่ระบบ' }

  const { data: item } = await supabase
    .from('items')
    .select('user_id')
    .eq('id', itemId)
    .single()

  if (!item || item.user_id !== user.id) {
    return { error: 'ไม่มีสิทธิ์ลบรายการนี้' }
  }

  // Delete the item (messages will be deleted automatically via ON DELETE CASCADE)
  const { error } = await supabase
    .from('items')
    .delete()
    .eq('id', itemId)

  if (error) {
    console.error('Error deleting item:', error)
    return { error: `ลบรายการไม่สำเร็จ: ${error.message}` }
  }

  revalidatePath('/home')
  revalidatePath('/search')
  revalidatePath('/profile')
  revalidatePath('/chat')
  revalidatePath(`/item/${itemId}`)
  return { success: true }
}
