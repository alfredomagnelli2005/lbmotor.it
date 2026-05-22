'use client'

import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { salvaAuto } from '../actions'

interface NuovaAutoFormProps {
  autoIniziale?: any // Usato se siamo in modalità modifica
}

export default function NuovaAutoForm({ autoIniziale }: NuovaAutoFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Prepariamo i valori predefiniti se stiamo modificando un'auto
  const { register, handleSubmit, reset } = useForm({
    defaultValues: autoIniziale ? {
      id: autoIniziale.id,
      marca: autoIniziale.brand,
      modello: autoIniziale.model,
      anno: autoIniziale.year,
      prezzo: autoIniziale.price,
      alimentazione: autoIniziale.fuel,
      cambio: autoIniziale.transmission,
      posti: autoIniziale.seats,
      colore: autoIniziale.color,
      chilometri: autoIniziale.km,
      contratto: autoIniziale.type,
      descrizione: autoIniziale.description,
      accessori: autoIniziale.features?.join(', '),
      image: autoIniziale.image,
      images: autoIniziale.images
    } : {}
  })

  const onSubmit = async (data: any) => {
    setIsSubmitting(true)

    const mainImageInput = document.getElementById('immaginePrincipale') as HTMLInputElement
    const galleryInput = document.getElementById('galleriaImmagini') as HTMLInputElement

    const mainFile = mainImageInput?.files?.[0] || undefined
    const galleryFiles = galleryInput?.files ? Array.from(galleryInput.files) : undefined

    const result = await salvaAuto(data, mainFile, galleryFiles)
    setIsSubmitting(false)

    if (result.success) {
      alert(autoIniziale ? 'Vettura modificata con successo!' : 'Vettura aggiunta con successo!')
      reset()
      router.push('/admin/auto')
      router.refresh()
    } else {
      alert(`Errore: ${result.error}`)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl mx-auto p-6 bg-dark-800 rounded-xl border border-dark-700 text-white">
      {/* Campo nascosto ID fondamentale per capire se è una modifica */}
      {autoIniziale && <input type="hidden" {...register('id')} />}

      <h2 className="text-xl font-bold text-gold-400">
        {autoIniziale ? `Modifica: ${autoIniziale.brand} ${autoIniziale.model}` : 'Dati Principali del Veicolo'}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300">Marca</label>
          <input type="text" {...register('marca', { required: true })} className="mt-1 w-full bg-dark-700 border border-dark-600 rounded p-2 text-white focus:outline-none focus:border-gold-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Modello</label>
          <input type="text" {...register('modello', { required: true })} className="mt-1 w-full bg-dark-700 border border-dark-600 rounded p-2 text-white focus:outline-none focus:border-gold-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Tipologia Contratto</label>
          <select {...register('contratto', { required: true })} className="mt-1 w-full bg-dark-700 border border-dark-600 rounded p-2 text-white focus:outline-none focus:border-gold-500">
            <option value="noleggio">Noleggio</option>
            <option value="vendita">Vendita</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300">Prezzo (€)</label>
          <input type="number" step="0.01" {...register('prezzo', { required: true })} className="mt-1 w-full bg-dark-700 border border-dark-600 rounded p-2 text-white focus:outline-none focus:border-gold-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Anno</label>
          <input type="number" {...register('anno', { required: true })} className="mt-1 w-full bg-dark-700 border border-dark-600 rounded p-2 text-white focus:outline-none focus:border-gold-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Chilometri</label>
          <input type="number" {...register('chilometri')} className="mt-1 w-full bg-dark-700 border border-dark-600 rounded p-2 text-white focus:outline-none focus:border-gold-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Alimentazione</label>
          <select {...register('alimentazione')} className="mt-1 w-full bg-dark-700 border border-dark-600 rounded p-2 text-white focus:outline-none focus:border-gold-500">
            <option value="Benzina">Benzina</option>
            <option value="Diesel">Diesel</option>
            <option value="Ibrida">Ibrida</option>
            <option value="Elettrica">Elettrica</option>
            <option value="GPL/Metano">GPL/Metano</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300">Tipo Cambio</label>
          <select {...register('cambio')} className="mt-1 w-full bg-dark-700 border border-dark-600 rounded p-2 text-white">
            <option value="Manuale">Manuale</option>
            <option value="Automatico">Automatico</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Posti</label>
          <input type="number" {...register('posti')} className="mt-1 w-full bg-dark-700 border border-dark-600 rounded p-2 text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Colore</label>
          <input type="text" {...register('colore')} className="mt-1 w-full bg-dark-700 border border-dark-600 rounded p-2 text-white" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300">Accessori (separati da virgola)</label>
        <input type="text" {...register('accessori')} placeholder="Sensori di parcheggio, Apple CarPlay, Cerchi in lega" className="mt-1 w-full bg-dark-700 border border-dark-600 rounded p-2 text-white focus:outline-none" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300">Descrizione Completa</label>
        <textarea rows={4} {...register('descrizione')} className="mt-1 w-full bg-dark-700 border border-dark-600 rounded p-2 text-white" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-dark-700 pt-4">
        <div>
          <label className="block text-sm font-medium text-gray-300">Immagine Principale</label>
          <input type="file" id="immaginePrincipale" accept="image/*" className="mt-1 block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gold-500 file:text-black hover:file:bg-gold-600 cursor-pointer" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Galleria Immagini Secondarie</label>
          <input type="file" id="galleriaImmagini" accept="image/*" multiple className="mt-1 block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-dark-600 file:text-white hover:file:bg-dark-500 cursor-pointer" />
        </div>
      </div>

      <div className="pt-4">
        <button type="submit" disabled={isSubmitting} className="w-full bg-gold-500 hover:bg-gold-600 text-black font-bold py-3 px-4 rounded transition-colors disabled:opacity-50">
          {isSubmitting ? 'Elaborazione in corso...' : autoIniziale ? 'Applica Modifiche' : 'Salva Vettura nel Database'}
        </button>
      </div>
    </form>
  )
}
