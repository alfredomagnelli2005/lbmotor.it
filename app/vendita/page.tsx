import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CarCard from '@/components/CarCard'
import { CARS_VENDITA } from '@/lib/data'

export default function VenditaPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="relative pt-40 pb-24 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1400&q=80"
              alt="vendita hero"
              className="w-full h-full object-cover"
              style={{filter: 'brightness(0.2)'}}
            />
            <div className="absolute inset-0" style={{background: 'linear-gradient(to bottom, rgba(8,8,14,0.4), rgba(8,8,14,1))'}} />
          </div>
          <div className="relative z-10 max-w-5xl mx-auto px-6">
            <p className="text-xs uppercase tracking-widest mb-4" style={{color: '#1a6fd4', letterSpacing: '0.2em'}}>Acquisto Certificato</p>
            <h1 className="text-6xl mb-6" style={{fontFamily: "'Playfair Display', serif", fontWeight: 500}}>Auto in Vendita</h1>
            <p className="max-w-xl leading-relaxed" style={{color: '#8888aa', lineHeight: 1.9}}>
              Una selezione di veicoli premium verificati e certificati. Ogni auto è controllata, 
              documentata e pronta per il trasferimento. Assistenza completa nelle pratiche burocratiche.
            </p>
            <div className="flex gap-8 mt-12 pt-12" style={{borderTop: '1px solid rgba(255,255,255,0.07)'}}>
              <div>
                <div className="text-3xl mb-1" style={{fontFamily: "'Playfair Display', serif", color: '#1a6fd4'}}>{CARS_VENDITA.length}</div>
                <div className="text-xs uppercase tracking-widest" style={{color: '#555570', fontSize: '0.65rem'}}>Veicoli disponibili</div>
              </div>
              <div>
                <div className="text-3xl mb-1" style={{fontFamily: "'Playfair Display', serif", color: '#1a6fd4'}}>100%</div>
                <div className="text-xs uppercase tracking-widest" style={{color: '#555570', fontSize: '0.65rem'}}>Certificati e verificati</div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16" style={{background: '#08080e'}}>
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {CARS_VENDITA.map(car => (
                <CarCard key={car.id} car={car} type="vendita" />
              ))}
            </div>

            {/* Garanzie */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {title: 'Tagliandi Certificati', desc: 'Ogni veicolo viene consegnato con libro tagliandi completo e verificato.'},
                {title: 'Nessuna Sorpresa', desc: 'Prezzi netti, zero costi nascosti. Supporto completo nel passaggio di proprietà.'},
                {title: 'Garanzia Post-Vendita', desc: 'Assistenza garantita nei 30 giorni successivi all\'acquisto per qualsiasi problema.'},
              ].map(({title, desc}) => (
                <div key={title} className="p-6 rounded-sm" style={{background: 'rgba(26,111,212,0.03)', border: '1px solid rgba(26,111,212,0.1)'}}>
                  <h3 className="text-base font-semibold mb-2" style={{color: '#1a6fd4'}}>{title}</h3>
                  <p className="text-sm leading-relaxed" style={{color: '#8888aa', lineHeight: 1.8}}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
