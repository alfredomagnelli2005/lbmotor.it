'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Edit2, Trash2, Plus, X, Upload, Car as CarIcon } from 'lucide-react'

// Inizializzazione client Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default function GestioneFlottaPage() {
  const [cars, setCars] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // Stati per la gestione del Modal (Aggiungi / Modifica)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  // Campi del Form
  const [formData, setFormData] = useState({
    marca: '',
    modello: '',
    anno: new Date().getFullYear().toString(),
    prezzo: '',
    alimentazione: 'Benzina',
    cambio: 'Manuale',
    posti: '5',
    colore: '',
    chilometri: '',
    contratto: 'vendita',
    disponibile: true,
    descrizione: '',
    accessori: '',
    image: '',       // Base64 dell'immagine principale
    images: [] as string[] // Array di Base64 per la galleria
  })

  // Funzione per caricare le auto dal database
  const fetchCars = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      setErrorMsg(error.message)
    } else {
      setCars(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchCars()
  }, [])

  // Utility per convertire un File in stringa Base64
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
    })
  }

  // Gestione caricamento immagine principale da PC
  const handleMainImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        const base64 = await convertFileToBase64(file)
        setFormData(prev => ({ ...prev, image: base64 }))
      } catch (err) {
        console.error("Errore conversione immagine principale:", err)
      }
    }
  }

  // Gestione caricamento immagini galleria da PC
  const handleGalleryImagesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      try {
        const base64Promises = Array.from(files).map(file => convertFileToBase64(file))
        const newBase64Images = await Promise.all(base64Promises)
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, ...newBase64Images]
        }))
      } catch (err) {
        console.error("Errore conversione immagini galleria:", err)
      }
    }
  }

  // Rimuovi immagine dalla galleria
  const removeGalleryImage = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove)
    }))
  }

  // Apri modale per Nuova Auto
  const handleOpenAdd = () => {
    setEditingId(null)
    setFormData({
      marca: '',
      modello: '',
      anno: new Date().getFullYear().toString(),
      prezzo: '',
      alimentazione: 'Benzina',
      cambio: 'Manuale',
      posti: '5',
      colore: '',
      chilometri: '',
      contratto: 'vendita',
      disponibile: true,
      descrizione: '',
      accessori: '',
      image: '',
      images: []
    })
    setIsModalOpen(true)
  }

  // Apri modale per Modifica Auto
  const handleOpenEdit = (car: any) => {
    setEditingId(car.id)
    setFormData({
      marca: car.brand || '',
      modello: car.model || '',
      anno: car.year?.toString() || '',
      prezzo: car.price?.toString() || '',
      alimentazione: car.fuel || 'Benzina',
      cambio: car.transmission || 'Manuale',
      posti: car.seats?.toString() || '5',
      colore: car.color || '',
      chilometri: car.km?.toString() || '',
      contratto: car.type || 'vendita',
      disponibile: car.available ?? true,
      descrizione: car.description || '',
      accessori: Array.isArray(car.features) ? car.features.join(', ') : (car.features || ''),
      image: car.image || '',
      images: Array.isArray(car.images) ? car.images : []
    })
    setIsModalOpen(true)
  }

  // Salvataggio Auto (Inserimento o Modifica con Base64)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const autoPayload = {
      brand: formData.marca,
      model: formData.modello,
      year: parseInt(formData.anno) || 2024,
      price: parseFloat(formData.prezzo) || 0,
      fuel: formData.alimentazione,
      transmission: formData.cambio,
      seats: parseInt(formData.posti) || 5,
      color: formData.colore,
      description: formData.descrizione,
      km: parseInt(formData.chilometri) || 0,
      type: formData.contratto,
      available: formData.disponibile,
      image: formData.image,
      images: formData.images,
      features: formData.accessori ? formData.accessori.split(',').map((f: string) => f.trim()) : []
    }

    try {
      if (editingId) {
        // Modifica
        const { error } = await supabase
          .from('cars')
          .update(autoPayload)
          .eq('id', editingId)
        if (error) throw error
      } else {
        // Inserimento
        const { error } = await supabase
          .from('cars')
          .insert([autoPayload])
        if (error) throw error
      }

      setIsModalOpen(false)
      fetchCars()
    } catch (err: any) {
      alert("Errore durante il salvataggio: " + err.message)
    } finally {
      setSaving(false)
    }
  }

  // Eliminazione Auto
  const handleDelete = async (id: string) => {
    if (!confirm('Sei sicuro di voler eliminare questa vettura?')) return

    const { error } = await supabase
      .from('cars')
      .delete()
      .eq('id', id)

    if (error) {
      alert("Errore durante l'eliminazione: " + error.message)
    } else {
      fetchCars()
    }
  }

  return (
    <div className="p-6 bg-gray-950 min-h-screen text-white">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Gestione Flotta</h1>
          <p className="text-gray-400 text-sm">Visualizza, aggiungi, modifica o elimina i veicoli direttamente con foto dal PC</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors cursor-pointer"
        >
          <Plus size={18} /> Aggiungi Auto
        </button>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-900/50 border border-red-500 text-red-200 rounded-lg mb-6">
          Errore nel caricamento dei dati: {errorMsg}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-gray-400">Caricamento flotta in corso...</div>
      ) : cars.length === 0 ? (
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
                      <img src={car.image} alt={car.model} className="w-16 h-10 object-cover rounded bg-gray-950 border border-gray-800" />
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
                      <button
                        onClick={() => handleOpenEdit(car)}
                        className="p-2 hover:bg-gray-800 rounded-lg text-gray-300 hover:text-blue-400 transition-colors cursor-pointer"
                        title="Modifica"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(car.id)}
                        className="p-2 hover:bg-red-950/40 rounded-lg text-gray-500 hover:text-red-400 transition-colors cursor-pointer"
                        title="Elimina"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODALE INSERIMENTO / MODIFICA AUTO CON SELEZIONE IMMAGINI DA PC */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl my-8">

            {/* Header Modale */}
            <div className="flex justify-between items-center p-6 border-b border-gray-800 bg-gray-800/50">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <CarIcon className="text-blue-500" />
                {editingId ? 'Modifica Vettura' : 'Aggiungi Nuova Vettura'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Marca</label>
                  <input
                    type="text"
                    required
                    value={formData.marca}
                    onChange={e => setFormData({...formData, marca: e.target.value})}
                    placeholder="es. BMW, Audi..."
                    className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Modello</label>
                  <input
                    type="text"
                    required
                    value={formData.modello}
                    onChange={e => setFormData({...formData, modello: e.target.value})}
                    placeholder="es. Serie 3, A4..."
                    className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Anno</label>
                  <input
                    type="number"
                    required
                    value={formData.anno}
                    onChange={e => setFormData({...formData, anno: e.target.value})}
                    className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Prezzo (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.prezzo}
                    onChange={e => setFormData({...formData, prezzo: e.target.value})}
                    placeholder="es. 25000 o 50 (se noleggio)"
                    className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Tipologia Contratto</label>
                  <select
                    value={formData.contratto}
                    onChange={e => setFormData({...formData, contratto: e.target.value})}
                    className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="vendita">Vendita</option>
                    <option value="noleggio">Noleggio</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Alimentazione</label>
                  <select
                    value={formData.alimentazione}
                    onChange={e => setFormData({...formData, alimentazione: e.target.value})}
                    className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Benzina">Benzina</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Ibrida">Ibrida</option>
                    <option value="Elettrica">Elettrica</option>
                    <option value="GPL">GPL</option>
                    <option value="Metano">Metano</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Cambio</label>
                  <select
                    value={formData.cambio}
                    onChange={e => setFormData({...formData, cambio: e.target.value})}
                    className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Manuale">Manuale</option>
                    <option value="Automatico">Automatico</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Chilometri</label>
                  <input
                    type="number"
                    value={formData.chilometri}
                    onChange={e => setFormData({...formData, chilometri: e.target.value})}
                    placeholder="es. 15000"
                    className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Colore</label>
                  <input
                    type="text"
                    value={formData.colore}
                    onChange={e => setFormData({...formData, colore: e.target.value})}
                    placeholder="es. Nero metallizzato"
                    className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* SEZIONE GESTIONE IMMAGINI DA PC */}
              <div className="space-y-4 border-t border-gray-800 pt-4">
                <h3 className="text-sm font-semibold uppercase text-blue-400">Immagini del veicolo</h3>

                {/* Immagine Principale */}
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Immagine Principale (Seleziona da PC)</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleMainImageChange}
                      className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer cursor-pointer bg-gray-950 border border-gray-800 rounded-lg"
                    />
                  </div>
                  {formData.image && (
                    <div className="mt-2">
                      <img src={formData.image} alt="Anteprima principale" className="w-32 h-20 object-cover rounded-lg border border-gray-800" />
                    </div>
                  )}
                </div>

                {/* Galleria Immagini */}
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Galleria Ulteriori Immagini (Seleziona uno o più file)</label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleGalleryImagesChange}
                    className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-800 file:text-gray-200 hover:file:bg-gray-700 file:cursor-pointer cursor-pointer bg-gray-950 border border-gray-800 rounded-lg"
                  />
                  {formData.images.length > 0 && (
                    <div className="grid grid-cols-4 gap-2 mt-3">
                      {formData.images.map((imgUrl, index) => (
                        <div key={index} className="relative group">
                          <img src={imgUrl} alt={`Galleria ${index}`} className="w-full h-20 object-cover rounded-lg border border-gray-800" />
                          <button
                            type="button"
                            onClick={() => removeGalleryImage(index)}
                            className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-80 hover:opacity-100 transition-opacity"
                            title="Rimuovi foto"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-gray-800 pt-4 space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Accessori / Optional (separati da virgola)</label>
                  <input
                    type="text"
                    value={formData.accessori}
                    onChange={e => setFormData({...formData, accessori: e.target.value})}
                    placeholder="es. Navigatore, Sensori di parcheggio, Interni in pelle"
                    className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Descrizione</label>
                  <textarea
                    rows={3}
                    value={formData.descrizione}
                    onChange={e => setFormData({...formData, descrizione: e.target.value})}
                    placeholder="Descrivi le condizioni generali dell'auto..."
                    className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Bottoni Azione Modale */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold transition-colors cursor-pointer"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Upload size={16} />
                  {saving ? 'Salvataggio...' : 'Salva Vettura'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  )
}
