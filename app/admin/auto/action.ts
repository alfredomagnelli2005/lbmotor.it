'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

async function getSupabase() {
  const cookieStore = cookies()
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: cookiesToSet => cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)),
    },
  })
  const { data: { user } } = await supabase.auth.getUser()
  if (!['admin', 'owner'].includes(user?.app_metadata?.role)) throw new Error('Non autorizzato.')
  return supabase
}

// Funzione Helper per caricare immagini nello Storage di Supabase
async function uploadImage(file: File): Promise<string | null> {
  if (!file || file.size === 0) return null
  try {
    const supabase = await getSupabase()
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random()}-${Date.now()}.${fileExt}`
    const filePath = `vetture/${fileName}`

    const { error } = await supabase.storage
      .from('cars')
      .upload(filePath, file)

    if (error) throw error

    const { data } = supabase.storage.from('cars').getPublicUrl(filePath)
    return data.publicUrl
  } catch (err) {
    console.error("Errore di caricamento immagine:", err)
    return null
  }
}

// 1. AGGIUNGI O MODIFICA AUTO
export async function salvaAuto(data: any, mainFile?: File, galleryFiles?: File[]) {
  try {
    const supabase = await getSupabase()
    let mainImageUrl = data.image || ''
    let galleryUrls: string[] = data.images || []

    // Se viene caricata una nuova immagine principale
    if (mainFile && mainFile.size > 0) {
      const url = await uploadImage(mainFile)
      if (url) mainImageUrl = url
    }

    // Se vengono caricate nuove immagini nella galleria
    if (galleryFiles && galleryFiles.length > 0) {
      for (const file of galleryFiles) {
        if (file.size > 0) {
          const url = await uploadImage(file)
          if (url) galleryUrls.push(url)
        }
      }
    }

    // Mappatura esatta sulle colonne del tuo database SQL
    const autoPayload = {
      brand: data.marca,
      model: data.modello,
      year: parseInt(data.anno),
      price: parseFloat(data.prezzo),
      fuel: data.alimentazione,
      transmission: data.cambio,
      seats: parseInt(data.posti),
      color: data.colore,
      description: data.descrizione,
      km: parseInt(data.chilometri) || 0,
      type: data.contratto, // 'noleggio' o 'vendita'
      available: data.disponibile ?? true,
      image: mainImageUrl,
      images: galleryUrls,
      features: data.accessori ? data.accessori.split(',').map((f: string) => f.trim()) : []
    }

    if (data.id) {
      // MODIFICA (Se l'ID esiste già)
      const { error } = await supabase
        .from('cars')
        .update(autoPayload)
        .eq('id', data.id)
      if (error) throw error
    } else {
      // INSERIMENTO (Nuova Auto)
      const { error } = await supabase
        .from('cars')
        .insert([autoPayload])
      if (error) throw error
    }

    revalidatePath('/admin/auto')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// 2. ELIMINA AUTO
export async function eliminaAuto(id: string) {
  try {
    const supabase = await getSupabase()
    const { error } = await supabase
      .from('cars')
      .delete()
      .eq('id', id)

    if (error) throw error

    revalidatePath('/admin/auto')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// 3. RECUPERA AUTO PER ID (Per popolare il form in modifica)
export async function getAutoById(id: string) {
  const supabase = await getSupabase()
  const { data, error } = await supabase
    .from('cars')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return null
  return data
}
