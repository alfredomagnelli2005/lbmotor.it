import NuovaAutoForm from '../../nuova/NuovaAutoForm'
import { notFound } from 'next/navigation'

interface ModificaAutoPageProps {
  params: {
    id: string
  }
}

export default async function ModificaAutoPage({ params }: ModificaAutoPageProps) {
  const auto = await getAutoById(params.id)

  if (!auto) {
    notFound() // Genera un 404 se l'ID non esiste su Supabase
  }

  return (
    <div className="py-8 px-4">
      <h1 className="text-3xl font-bold text-white mb-2 text-center">Modifica Veicolo</h1>
      <p className="text-gray-400 text-center mb-6 text-sm">Aggiorna le informazioni o le immagini della vettura selezionata</p>

      {/* Passiamo i dati caricati dal DB al form in modo che si auto-compili */}
      <NuovaAutoForm autoIniziale={auto} />
    </div>
  )
}
