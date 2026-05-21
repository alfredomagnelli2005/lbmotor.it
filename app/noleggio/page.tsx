import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CarCard from '@/components/CarCard'
import { CARS_NOLEGGIO } from '@/lib/data'
import { CheckCircle, XCircle, Filter } from 'lucide-react'

export default function NoleggioPage() {
  const available = CARS_NOLEGGIO.filter(c => c.available)
  const unavailable = CARS_NOLEGGIO.filter(c => !c.available)

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative pt-40 pb-24 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1400&q=80"
              alt="noleggio hero"
              className="w-full h-full object-cover"
              style={{filter: 'brightness(0.2)'}}
            />
            <div className="absolute inset-0" style={{background: 'linear-gradient(to bottom, rgba(8,8,14,0.4), rgba(8,8,14,1))'}} />
          </div>
          <div className="relative z-10 max-w-5xl mx-auto px-6">
            <p className="text-xs uppercase tracking-widest mb-4" style={{color: '#1a6fd4', letterSpacing: '0.2em'}}>Servizio Premium</p>
            <h1 className="text-6xl mb-6" style={{fontFamily: "'Playfair Display', serif", fontWeight: 500}}>Noleggio Auto</h1>
            <p className="max-w-xl leading-relaxed" style={{color: '#8888aa', lineHeight: 1.9}}>
              Scegli il veicolo che desideri, per il periodo che preferisci. Contratti trasparenti, 
              consegna inclusa e assistenza durante tutto il noleggio.
            </p>

            {/* Stats bar */}
            <div className="flex gap-12 mt-12 pt-12" style={{borderTop: '1px solid rgba(255,255,255,0.07)'}}>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle size={16} color="#22c55e" />
                  <span className="text-2xl font-semibold" style={{fontFamily: "'Playfair Display', serif", color: '#22c55e'}}>{available.length}</span>
                </div>
                <span className="text-xs uppercase tracking-widest" style={{color: '#555570', fontSize: '0.65rem'}}>Disponibili ora</span>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <XCircle size={16} color="#ef4444" />
                  <span className="text-2xl font-semibold" style={{fontFamily: "'Playfair Display', serif", color: '#ef4444'}}>{unavailable.length}</span>
                </div>
                <span className="text-xs uppercase tracking-widest" style={{color: '#555570', fontSize: '0.65rem'}}>Non disponibili</span>
              </div>
            </div>
          </div>
        </section>

        {/* Cars Grid */}
        <section className="py-16" style={{background: '#08080e'}}>
          <div className="max-w-7xl mx-auto px-6">
            {/* Info bar */}
            <div className="flex items-center justify-between mb-10 p-4 rounded-sm glass"
              style={{border: '1px solid rgba(26,111,212,0.1)'}}>
              <span className="text-sm" style={{color: '#8888aa'}}>
                <span style={{color: '#1a6fd4', fontWeight: 600}}>{CARS_NOLEGGIO.length}</span> veicoli in flotta
              </span>
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest" style={{color: '#555570', letterSpacing: '0.1em'}}>
                <Filter size={12} />
                <span>Tutti i veicoli</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {CARS_NOLEGGIO.map(car => (
                <CarCard key={car.id} car={car} type="noleggio" />
              ))}
            </div>

            {/* Terms notice */}
            <div className="mt-16 p-6 rounded-sm" style={{background: 'rgba(26,111,212,0.04)', border: '1px solid rgba(26,111,212,0.12)'}}>
              <h3 className="text-lg mb-3" style={{fontFamily: "'Playfair Display', serif", color: '#1a6fd4'}}>Informazioni Generali sul Noleggio</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm" style={{color: '#8888aa', lineHeight: 1.8}}>
                <div>
                  <p className="font-semibold mb-2" style={{color: '#f0f0f5', fontSize: '0.85rem'}}>Acconto richiesto</p>
                  <p>Per confermare la prenotazione è richiesto un acconto del 30% del totale. Il saldo verrà corrisposto al ritiro del veicolo.</p>
                </div>
                <div>
                  <p className="font-semibold mb-2" style={{color: '#f0f0f5', fontSize: '0.85rem'}}>Documenti necessari</p>
                  <p>Patente di guida valida, documento d'identità e carta di credito intestata al guidatore principale.</p>
                </div>
                <div>
                  <p className="font-semibold mb-2" style={{color: '#f0f0f5', fontSize: '0.85rem'}}>Copertura assicurativa</p>
                  <p>Tutti i veicoli sono dotati di polizza Kasko. I dettagli specifici sono indicati in ogni scheda vettura.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
