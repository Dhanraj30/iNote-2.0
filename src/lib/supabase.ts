// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

/**
 * Uploads an image to Supabase Storage and returns the public URL
 * @param imageBlob - The image Blob to upload
 * @param name - The name of the file (used to generate a unique file name)
 * @returns The Supabase public URL or null if upload fails
 */
export async function uploadFileToSupabase(
  imageBlob: Blob,
  name: string
): Promise<string | null> {
  try {
    // Generate a unique file name
    const fileName = `${name.replace(" ", "")}${Date.now()}.jpeg`

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('note') // Your bucket name
      .upload(fileName, imageBlob, {
        contentType: 'image/jpeg',
        upsert: true
      })

    if (error) {
      throw error
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('note')
      .getPublicUrl(fileName)

    if (!urlData?.publicUrl) {
      throw new Error('Failed to get public URL')
    }

    console.log("Supabase URL:", urlData.publicUrl)
    return urlData.publicUrl
  } catch (error) {
    console.error("Error uploading to Supabase:", error)
    return null
  }
}