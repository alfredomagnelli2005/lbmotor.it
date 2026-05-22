import { notFound } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import NuovaAutoForm from '../../nuova/NuovaAutoForm'

// 1. FORZIAMO LA PAGINA AD ESSERE DINAMICA (Essenziale su Vercel per le rotte con [id])
export const dynamic = 'force-dynamic'

interface ModificaAutoPageProps {
  params: {
    id: string
  }
}

export default async function ModificaAutoPage({ params }: ModificaAutoPageProps) {
  // 2. RECUPERO SICURO DELLE VARIABILI (Evita il crash se mancano momentaneamente durante la build)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

  // 3. SE LE VARIABILI SONO VUOTE (A tempo di build), BLOCCHIAMO IL CRASH PRIMA DI CHIAMARE SUPABASE
  if (!supabaseUrl || !supabaseAnonKey) {
    return <div className="p-4 text-white text-center">Configurazione in corso...</div>
  }

  // 4. INIZIALIZZIAMO IL CLIENT DENTRO IL COMPONENTE (Solo quando la pagina viene effettivamente eseguita)
  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  // 5. Interroghiamo la tabella 'cars' usando l'ID passato nell'URL
  const { data: auto, error } = await supabase
    .from('cars')
    .select('*')
    .eq('id', params.id)
    .single()

  // Se c'è un errore o l'auto non esiste, manda in 404
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
