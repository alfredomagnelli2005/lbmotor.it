import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'
import { eliminaAuto } from './actions'
import { Edit2, Trash2, Plus } from 'lucide-react'

// Inizializzazione client lato server per il recupero dati immediato
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export const revalidate = 0 // Forza Next.js a rinfrescare i dati a ogni caricamento pagina

export default async function ElencoAutoAdminPage() {
  // Scarica le vetture ordinate dalle più recenti
  const { data: cars, error } = await supabase
    .from('cars')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="p-6 bg-dark-900 min-h-screen text-white">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Gestione Flotta</h1>
          <p className="text-gray-400 text-sm">Visualizza, modifica o elimina i veicoli presenti sul sito</p>
        </div>
        <Link href="/admin/auto/nuova" className="bg-gold-500 hover:bg-gold-600 text-black px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors">
          <Plus size={18} /> Aggiungi Auto
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-red-900/50 border border-red-500 text-red-200 rounded-lg mb-6">
          Errore nel caricamento dei dati: {error.message}
        </div>
      )}

      {!cars || cars.length === 0 ? (
        <div className="text-center py-12 bg-dark-800 rounded-xl border border-dark-700">
          <p className="text-gray-400">Nessuna vettura inserita nel database.</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-dark-800 rounded-xl border border-dark-700">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-dark-700 bg-dark-700/50 text-gray-300 text-sm font-semibold">
                <th className="p-4">Foto</th>
                <th className="p-4">Veicolo</th>
                <th className="p-4">Tipologia</th>
                <th className="p-4">Anno / KM</th>
                <th className="p-4">Prezzo</th>
                <th className="p-4 text-center">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-700 text-sm">
              {cars.map((car) => (
                <tr key={car.id} className="hover:bg-dark-700/30 transition-colors">
                  <td className="p-4">
                    {car.image ? (
                      <img src={car.image} alt={car.model} className="w-16 h-10 object-cover rounded bg-dark-900" />
                    ) : (
                      <div className="w-16 h-10 bg-dark-600 rounded flex items-center justify-center text-xs text-gray-400">No Foto</div>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-white">{car.brand}</div>
                    <div className="text-gray-400 text-xs">{car.model}</div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold uppercase ${car.type === 'noleggio' ? 'bg-blue-900/60 text-blue-300' : 'bg-green-900/60 text-green-300'}`}>
                      {car.type}
                    </span>
                  </td>
                  <td className="p-4">
                    <div>{car.year}</div>
                    <div className="text-gray-400 text-xs">{car.km?.toLocaleString()} km</div>
                  </td>
                  <td className="p-4 font-semibold text-gold-400">
                    {car.type === 'noleggio' ? `${car.price}€ / giorno` : `${car.price?.toLocaleString()}€`}
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center items-center gap-3">
                      {/* Pulsante Modifica dinamico */}
                      <Link href={`/admin/auto/modifica/${car.id}`} className="p-2 hover:bg-dark-600 rounded-lg text-gray-300 hover:text-gold-400 transition-colors" title="Modifica">
                        <Edit2 size={16} />
                      </Link>

                      {/* Pulsante Elimina con Server Action nativa */}
                      <form action={async () => {
                        'use server'
                        if(confirm('Sei sicuro di voler eliminare definitivamente questo veicolo?')) {
                          await eliminaAuto(car.id)
                        }
                      }}>
                        <button type="submit" className="p-2 hover:bg-red-950/40 rounded-lg text-gray-400 hover:text-red-400 transition-colors" title="Elimina">
                          <Trash2 size={16} />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
