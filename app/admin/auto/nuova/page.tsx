import { aggiungiAuto } from '../actions'

export default function NuovaAutoPage() {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-dark-800 rounded-lg shadow-md mt-10">
      <h1 className="text-2xl font-bold text-dark-900 dark:text-white mb-6">
        Aggiungi Nuova Auto
      </h1>

      <form action={aggiungiAuto} className="space-y-4">

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-dark-700 dark:text-gray-300">Marca</label>
            <input
              type="text"
              name="brand"
              required
              className="mt-1 w-full p-2 border border-gray-300 rounded focus:ring-primary-500 focus:border-primary-500 text-black"
              placeholder="es. Fiat"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-700 dark:text-gray-300">Modello</label>
            <input
              type="text"
              name="model"
              required
              className="mt-1 w-full p-2 border border-gray-300 rounded focus:ring-primary-500 focus:border-primary-500 text-black"
              placeholder="es. Panda"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-dark-700 dark:text-gray-300">Anno</label>
            <input
              type="number"
              name="year"
              required
              min="1900"
              max="2030"
              className="mt-1 w-full p-2 border border-gray-300 rounded focus:ring-primary-500 focus:border-primary-500 text-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-700 dark:text-gray-300">Prezzo (€)</label>
            <input
              type="number"
              name="price"
              step="0.01"
              required
              className="mt-1 w-full p-2 border border-gray-300 rounded focus:ring-primary-500 focus:border-primary-500 text-black"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-dark-700 dark:text-gray-300">Carburante</label>
            <select name="fuel" className="mt-1 w-full p-2 border border-gray-300 rounded focus:ring-primary-500 text-black">
              <option value="Benzina">Benzina</option>
              <option value="Diesel">Diesel</option>
              <option value="Elettrica">Elettrica</option>
              <option value="Ibrida">Ibrida</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-700 dark:text-gray-300">Tipo (Noleggio/Vendita)</label>
            <select name="type" className="mt-1 w-full p-2 border border-gray-300 rounded focus:ring-primary-500 text-black">
              <option value="noleggio">Noleggio</option>
              <option value="vendita">Vendita</option>
            </select>
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            Salva Auto
          </button>
        </div>
      </form>
    </div>
  )
}
