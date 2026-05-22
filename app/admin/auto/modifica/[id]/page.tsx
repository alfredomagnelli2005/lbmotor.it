import { notFound } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import NuovaAutoForm from '../../nuova/NuovaAutoForm'

// 1. Inizializziamo il client di Supabase (Lato Server per Next.js App Router)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

interface ModificaAutoPageProps {
  params: {
    id: string
  }
}

export default async function ModificaAutoPage({ params }: ModificaAutoPageProps) {
  // 2. Interroghiamo direttamente la tabella 'cars' usando l'ID passato nell'URL
  const { data: auto, error } = await supabase
    .from('cars')
    .select('*')
    .eq('id', params.id)
    .single() // Forza Supabase a restituire un oggetto singolo anziché un array

  // 3. Se c'è un errore, se l'auto non esiste o se l'ID è vuoto, manda in 404
  if (error || !auto) {
    notFound()
  }

  return (
    <div className="py-8 px-4">
      <h1 className="text-3xl font-bold text-white mb-2 text-center">Modifica Veicolo</h1>
      <p className="text-gray-400 text-center mb-6 text-sm">
        Aggiorna le informazioni o le immagini di: <span className="text-blue-400 font-semibold">{auto.brand} {auto.model}</span>
      </p>

      {/* Passiamo l'oggetto auto recuperato da Supabase al tuo form */}
      <NuovaAutoForm autoIniziale={auto} />
    </div>
  )
}
