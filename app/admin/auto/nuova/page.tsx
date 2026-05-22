import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'
import { Edit2, Trash2, Plus } from 'lucide-react'
import { revalidatePath } from 'next/cache'

// Inizializzazione client lato server per il recupero dati immediato
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const revalidate = 0 // Forza Next.js a rinfrescare i dati a ogni caricamento pagina

export default async function ElencoAutoAdminPage() {
  // Scarica le vetture ordinate dalle più recenti
  const { data: cars, error } = await supabase
    .from('cars')
    .select('*')
    .order('created_at', { ascending: false })

  // SERVER ACTION NATIVA PER L'ELIMINAZIONE (Eseguita sul server in sicurezza)
  async function handleServerDelete(formData: FormData) {
    'use server'
    const id = formData.get('carId') as string
    if (!id) return

    const { error } = await supabase
      .from('cars')
      .delete()
      .eq('id', id)

    if (error) {
      console.error("Errore eliminazione auto:", error.message)
    } else {
      // Forza il refresh istantaneo della pagina server-side per aggiornare la tabella
      revalidatePath('/admin/auto')
    }
  }

  return (
    <div className="p-6 bg-gray-950 min-h-screen text-white">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Gestione Flotta</h1>
          <p className="text-gray-400 text-sm">Visualizza, modifica o elimina i veicoli presenti sul sito</p>
        </div>
        <Link href="/admin/auto/nuova" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors">
          <Plus size={18} /> Aggiungi Auto
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-red-900/50 border border-red-500 text-red-200 rounded-lg mb-6">
          Errore nel caricamento dei dati: {error.message}
        </div>
      )}

      {!cars || cars.length === 0 ? (
        <div className="text-center py-12 bg-gray-900 rounded-xl border border-gray-800">
          <p className="text-gray-400">Nessuna vettura inserita nel database.</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-gray-900 rounded-xl border border-gray-800">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-800/50 text-gray-300 text-sm font-semibold">
                <th className="p-4">Foto</th>
                <th className="p-4">Veicolo</th>
                <th className="p-4">Tipologia</th>
                <th className="p-4">Anno / KM</th>
                <th className="p-4">Prezzo</th>
                <th className="p-4 text-center">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-sm">
              {cars.map((car) => (
                <tr key={car.id} className="hover:bg-gray-800/30 transition-colors">
                  <td className="p-4">
                    {car.image ? (
                      <img src={car.image} alt={car.model} className="w-16 h-10 object-cover rounded bg-gray-950" />
                    ) : (
                      <div className="w-16 h-10 bg-gray-800 rounded flex items-center justify-center text-xs text-gray-500">No Foto</div>
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
                  <td className="p-4 font-semibold text-blue-400">
                    {car.type === 'noleggio' ? `${car.price}€ / giorno` : `${car.price?.toLocaleString()}€`}
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center items-center gap-3">
                      {/* Pulsante Modifica dinamico */}
                      <Link href={`/admin/auto/modifica/${car.id}`} className="p-2 hover:bg-gray-800 rounded-lg text-gray-300 hover:text-blue-400 transition-colors" title="Modifica">
                        <Edit2 size={16} />
                      </Link>

                      {/* Form con Server Action nativa sicura senza crash di confirm esterni */}
                      <form action={handleServerDelete}>
                        <input type="hidden" name="carId" value={car.id} />
                        <button
                          type="submit"
                          className="p-2 hover:bg-red-950/40 rounded-lg text-gray-500 hover:text-red-400 transition-colors"
                          title="Elimina"
                        >
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
