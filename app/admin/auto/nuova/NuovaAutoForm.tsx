'use client'

import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

// Inizializzazione del client Supabase lato client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

interface NuovaAutoFormProps {
  autoIniziale?: any // Contiene i dati se siamo in modalità modifica
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
    } : {
      contratto: 'noleggio',
      alimentazione: 'Benzina',
      cambio: 'Manuale'
    }
  })

  const onSubmit = async (data: any) => {
    setIsSubmitting(true)

    try {
      const mainImageInput = document.getElementById('immaginePrincipale') as HTMLInputElement
      const galleryInput = document.getElementById('galleriaImmagini') as HTMLInputElement

      const mainFile = mainImageInput?.files?.[0]
      const galleryFiles = galleryInput?.files ? Array.from(galleryInput.files) : []

      let mainImageUrl = autoIniziale?.image || ''
      let galleryUrls = autoIniziale?.images || []

      // 1. CARICAMENTO IMMAGINE PRINCIPALE (Se inserita)
      if (mainFile) {
        const fileExt = mainFile.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('auto-images')
          .upload(fileName, mainFile)

        if (uploadError) throw new Error(`Errore upload immagine principale: ${uploadError.message}`)

        const { data: publicUrlData } = supabase.storage
          .from('auto-images')
          .getPublicUrl(uploadData.path)

        mainImageUrl = publicUrlData.publicUrl
      }

      // 2. CARICAMENTO GALLERIA IMMAGINI (Se inserite)
      if (galleryFiles.length > 0) {
        const uploadedPaths: string[] = []
        for (const file of galleryFiles) {
          const fileExt = file.name.split('.').pop()
          const fileName = `${Math.random()}.${fileExt}`
          const { data: upData, error: upError } = await supabase.storage
            .from('auto-images')
            .upload(fileName, file)

          if (!upError && upData) {
            const { data: pUrl } = supabase.storage.from('auto-images').getPublicUrl(upData.path)
            uploadedPaths.push(pUrl.publicUrl)
          }
        }
        galleryUrls = autoIniziale ? [...galleryUrls, ...uploadedPaths] : uploadedPaths
      }

      // 3. STRUTTURAZIONE DATI PER TABELLA 'cars' DI SUPABASE
      const listaAccessori = data.accessori ? data.accessori.split(',').map((x: string) => x.trim()).filter(Boolean) : []

      const payloadCar = {
        brand: data.marca,
        model: data.modello,
        year: parseInt(data.anno) || new Date().getFullYear(),
        price: parseFloat(data.prezzo) || 0,
        fuel: data.alimentazione,
        transmission: data.cambio,
        seats: parseInt(data.posti) || 5,
        color: data.colore || '',
        km: parseInt(data.chilometri) || 0,
        type: data.contratto,
        description: data.descrizione || '',
        features: listaAccessori,
        image: mainImageUrl,
        images: galleryUrls,
        available: autoIniziale ? autoIniziale.available : true
      }

      // 4. SALVATAGGIO (UPDATE SE MODIFICA, INSERT SE NUOVA)
      if (autoIniziale?.id) {
        const { error } = await supabase
          .from('cars')
          .update(payloadCar)
          .eq('id', autoIniziale.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('cars')
          .insert([payloadCar])

        if (error) throw error
      }

      alert(autoIniziale ? 'Vettura modificata con successo!' : 'Vettura aggiunta con successo!')
      reset()
      router.push('/admin') // Ritorna alla dashboard principale
      router.refresh()

    } catch (err: any) {
      alert(`Errore durante il salvataggio: ${err.message || err}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl mx-auto p-6 bg-gray-900 rounded-xl border border-gray-800 text-white">
      {autoIniziale && <input type="hidden" {...register('id')} />}

      <h2 className="text-xl font-bold text-blue-400">
        {autoIniziale ? `Modifica: ${autoIniziale.brand} ${autoIniziale.model}` : 'Dati Principali del Veicolo'}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300">Marca</label>
          <input type="text" {...register('marca', { required: true })} className="mt-1 w-full bg-gray-800 border border-gray-700 rounded p-2 text-white focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Modello</label>
          <input type="text" {...register('modello', { required: true })} className="mt-1 w-full bg-gray-800 border border-gray-700 rounded p-2 text-white focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Tipologia Contratto</label>
          <select {...register('contratto', { required: true })} className="mt-1 w-full bg-gray-800 border border-gray-700 rounded p-2 text-white focus:outline-none focus:border-blue-500">
            <option value="noleggio">Noleggio</option>
            <option value="vendita">Vendita</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300">Prezzo (€)</label>
          <input type="number" step="0.01" {...register('prezzo', { required: true })} className="mt-1 w-full bg-gray-800 border border-gray-700 rounded p-2 text-white focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Anno</label>
          <input type="number" {...register('anno', { required: true })} className="mt-1 w-full bg-gray-800 border border-gray-700 rounded p-2 text-white focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Chilometri</label>
          <input type="number" {...register('chilometri')} className="mt-1 w-full bg-gray-800 border border-gray-700 rounded p-2 text-white focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Alimentazione</label>
          <select {...register('alimentazione')} className="mt-1 w-full bg-gray-800 border border-gray-700 rounded p-2 text-white focus:outline-none focus:border-blue-500">
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
          <select {...register('cambio')} className="mt-1 w-full bg-gray-800 border border-gray-700 rounded p-2 text-white">
            <option value="Manuale">Manuale</option>
            <option value="Automatico">Automatico</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Posti</label>
          <input type="number" {...register('posti')} className="mt-1 w-full bg-gray-800 border border-gray-700 rounded p-2 text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Colore</label>
          <input type="text" {...register('colore')} className="mt-1 w-full bg-gray-800 border border-gray-700 rounded p-2 text-white" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300">Accessori (separati da virgola)</label>
        <input type="text" {...register('accessori')} placeholder="Sensori di parcheggio, Apple CarPlay, Cerchi in lega" className="mt-1 w-full bg-gray-800 border border-gray-700 rounded p-2 text-white focus:outline-none focus:border-blue-500" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300">Descrizione Completa</label>
        <textarea rows={4} {...register('descrizione')} className="mt-1 w-full bg-gray-800 border border-gray-700 rounded p-2 text-white focus:outline-none focus:border-blue-500" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-800 pt-4">
        <div>
          <label className="block text-sm font-medium text-gray-300">Immagine Principale</label>
          <input type="file" id="immaginePrincipale" accept="image/*" className="mt-1 block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Galleria Immagini Secondarie</label>
          <input type="file" id="galleriaImmagini" accept="image/*" multiple className="mt-1 block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-700 file:text-white hover:file:bg-gray-600 cursor-pointer" />
        </div>
      </div>

      <div className="pt-4">
        <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded transition-colors disabled:opacity-50">
          {isSubmitting ? 'Elaborazione in corso...' : autoIniziale ? 'Applica Modifiche' : 'Salva Vettura nel Database'}
        </button>
      </div>
    </form>
  )
}
