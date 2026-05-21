'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// Inizializziamo il client Supabase usando le tue chiavi
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export async function aggiungiAuto(formData: FormData) {
  // Estraiamo i dati dal form
  const nuovaAuto = {
    brand: formData.get('brand') as string,
    model: formData.get('model') as string,
    year: Number(formData.get('year')),
    price: Number(formData.get('price')),
    fuel: formData.get('fuel') as string,
    type: formData.get('type') as string, // 'noleggio' o 'vendita'
    available: true,
  }

  // Inseriamo i dati nella tabella "cars"
  const { error } = await supabase
    .from('cars')
    .insert([nuovaAuto])

  if (error) {
    console.error('Errore durante inserimento:', error.message)
    throw new Error('Impossibile salvare l\'auto')
  }

  // Aggiorniamo la cache della pagina e rimandiamo l'utente alla lista
  revalidatePath('/admin/auto')
  redirect('/admin/auto')
}
