import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { COMPANY_INFO } from '@/lib/data'
import { Award, Users, Shield, Clock, ArrowRight } from 'lucide-react'

export default function ChiSiamo() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative pt-40 pb-24 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=1400&q=80"
              alt="chi siamo"
              className="w-full h-full object-cover"
              style={{filter: 'brightness(0.2)'}}
            />
            <div className="absolute inset-0" style={{background: 'linear-gradient(to bottom, rgba(8,8,14,0.3), rgba(8,8,14,1))'}} />
          </div>
          <div className="relative z-10 max-w-5xl mx-auto px-6">
            <p className="text-xs uppercase tracking-widest mb-4" style={{color: '#1a6fd4', letterSpacing: '0.2em'}}>La Nostra Storia</p>
            <h1 className="text-6xl mb-6" style={{fontFamily: "'Playfair Display', serif", fontWeight: 500}}>Chi Siamo</h1>
            <p className="max-w-xl leading-relaxed" style={{color: '#8888aa', lineHeight: 1.9}}>
              Da oltre 15 anni sinonimo di eccellenza nel settore automobilistico. 
              Una storia fatta di passione, professionalità e clienti soddisfatti.
            </p>
          </div>
        </section>

        {/* Story */}
        <section className="py-24" style={{background: '#08080e'}}>
          <div className="max-w-5xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div>
                <p className="text-xs uppercase tracking-widest mb-4" style={{color: '#1a6fd4', letterSpacing: '0.2em'}}>La Nostra Missione</p>
                <h2 className="text-4xl mb-6" style={{fontFamily: "'Playfair Display', serif", fontWeight: 500}}>
                  Più di un semplice noleggio
                </h2>
                <p className="leading-relaxed mb-6" style={{color: '#8888aa', lineHeight: 1.9}}>
                  LB Motors nasce dalla passione per l'automobile e dal desiderio di offrire un servizio che 
                  vada oltre le aspettative. Non siamo semplicemente un'agenzia di noleggio: siamo partner 
                  affidabili per ogni tua esigenza di mobilità.
                </p>
                <p className="leading-relaxed mb-8" style={{color: '#8888aa', lineHeight: 1.9}}>
                  Ogni veicolo della nostra flotta è selezionato con cura, mantenuto in perfetta efficienza 
                  e consegnato al cliente con la massima attenzione ai dettagli. La tua soddisfazione 
                  è la nostra priorità assoluta.
                </p>
                <Link href="/contattaci" className="flex items-center gap-2 text-sm uppercase tracking-widest" style={{color: '#1a6fd4', letterSpacing: '0.12em', fontSize: '0.75rem'}}>
                  Contattaci <ArrowRight size={16} />
                </Link>
              </div>
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=700&q=80"
                  alt="showroom"
                  className="w-full rounded-sm"
                  style={{border: '1px solid rgba(26,111,212,0.15)'}}
                />
                <div className="absolute -bottom-6 -left-6 p-5 rounded-sm"
                  style={{background: 'rgba(8,8,14,0.95)', border: '1px solid rgba(26,111,212,0.2)'}}>
                  <div className="text-3xl mb-1" style={{fontFamily: "'Playfair Display', serif", color: '#1a6fd4', fontWeight: 600}}>15+</div>
                  <div className="text-xs uppercase tracking-widest" style={{color: '#555570', fontSize: '0.65rem', letterSpacing: '0.12em'}}>Anni di esperienza</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-24" style={{background: '#0c0c16'}}>
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <p className="text-xs uppercase tracking-widest mb-4" style={{color: '#1a6fd4', letterSpacing: '0.2em'}}>I Nostri Valori</p>
              <h2 className="text-4xl" style={{fontFamily: "'Playfair Display', serif", fontWeight: 500}}>Cosa ci rende diversi</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {icon: Award, title: 'Eccellenza', desc: 'Standard qualitativi elevati in ogni aspetto del servizio, dalla selezione dei veicoli all\'assistenza post-noleggio.'},
                {icon: Shield, title: 'Trasparenza', desc: 'Prezzi chiari, contratti semplici e nessun costo nascosto. Saprai sempre esattamente cosa stai pagando.'},
                {icon: Users, title: 'Personalizzazione', desc: 'Ogni cliente è unico. Adattiamo i nostri servizi alle tue specifiche esigenze e preferenze.'},
                {icon: Clock, title: 'Affidabilità', desc: 'Puntualità nelle consegne, veicoli sempre in perfetto stato e supporto attivo durante tutto il noleggio.'},
              ].map(({icon:Icon, title, desc}) => (
                <div key={title} className="p-6 rounded-sm text-center" style={{border: '1px solid rgba(255,255,255,0.06)'}}>
                  <div className="w-14 h-14 rounded-sm mx-auto mb-6 flex items-center justify-center"
                    style={{background: 'linear-gradient(135deg, rgba(26,111,212,0.1), rgba(26,111,212,0.05))', border: '1px solid rgba(26,111,212,0.2)'}}>
                    <Icon size={24} style={{color: '#1a6fd4'}} />
                  </div>
                  <h3 className="text-xl mb-3" style={{fontFamily: "'Playfair Display', serif", fontWeight: 600}}>{title}</h3>
                  <p className="text-sm leading-relaxed" style={{color: '#666680', lineHeight: 1.8}}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Numbers */}
        <section className="py-20" style={{background: '#08080e'}}>
          <div className="max-w-5xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                {num: '200+', label: 'Auto gestite'},
                {num: '5.000+', label: 'Clienti serviti'},
                {num: '98%', label: 'Soddisfazione'},
                {num: '15+', label: 'Anni di attività'},
              ].map(({num, label}) => (
                <div key={label} className="text-center p-6 rounded-sm" style={{background: 'rgba(26,111,212,0.03)', border: '1px solid rgba(26,111,212,0.1)'}}>
                  <div className="text-4xl mb-2" style={{fontFamily: "'Playfair Display', serif", color: '#1a6fd4', fontWeight: 500}}>{num}</div>
                  <div className="text-xs uppercase tracking-widest" style={{color: '#555570', letterSpacing: '0.12em', fontSize: '0.65rem'}}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team placeholder */}
        <section className="py-24" style={{background: '#0c0c16'}}>
          <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-xs uppercase tracking-widest mb-4" style={{color: '#1a6fd4', letterSpacing: '0.2em'}}>Le persone</p>
            <h2 className="text-4xl mb-4" style={{fontFamily: "'Playfair Display', serif", fontWeight: 500}}>Il Nostro Team</h2>
            <p className="max-w-lg mx-auto mb-16" style={{color: '#8888aa', lineHeight: 1.8}}>
              Professionisti appassionati, pronti ad assisterti con competenza e disponibilità.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {name: 'Marco Esposito', role: 'Fondatore & CEO', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80'},
                {name: 'Laura Conti', role: 'Responsabile Noleggio', img: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=80'},
                {name: 'Davide Russo', role: 'Consulente Vendite', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80'},
              ].map(({name, role, img}) => (
                <div key={name} className="p-6 rounded-sm glass text-center" style={{border: '1px solid rgba(255,255,255,0.06)'}}>
                  <img src={img} alt={name} className="w-24 h-24 rounded-full mx-auto mb-5 object-cover"
                    style={{border: '2px solid rgba(26,111,212,0.3)'}} />
                  <h3 className="text-xl mb-1" style={{fontFamily: "'Playfair Display', serif", fontWeight: 600}}>{name}</h3>
                  <p className="text-xs uppercase tracking-widest" style={{color: '#1a6fd4', letterSpacing: '0.12em', fontSize: '0.65rem'}}>{role}</p>
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
