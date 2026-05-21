import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CarCard from '@/components/CarCard'
import { CARS_NOLEGGIO, CARS_VENDITA, COMPANY_INFO } from '@/lib/data'
import { ArrowRight, Star, Shield, Clock, Award, ChevronDown, Phone, Mail } from 'lucide-react'

export default function Home() {
  const featuredRental = CARS_NOLEGGIO.slice(0, 3)
  const featuredSale = CARS_VENDITA.slice(0, 3)

  return (
    <>
      <Navbar />
      <main>
        {/* HERO */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1600&q=80"
              alt="Hero car"
              className="w-full h-full object-cover"
              style={{filter: 'brightness(0.25)'}}
            />
            <div className="absolute inset-0" style={{background: 'linear-gradient(to bottom, rgba(8,8,14,0.3), rgba(8,8,14,0.7) 50%, rgba(8,8,14,1) 100%)'}} />
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-5xl mx-auto px-6 text-center" style={{paddingTop: '5rem'}}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-sm mb-8"
              style={{border: '1px solid rgba(26,111,212,0.3)', background: 'rgba(26,111,212,0.07)'}}>
              <Star size={12} style={{color: '#1a6fd4'}} fill="#1a6fd4" />
              <span className="text-xs uppercase tracking-widest" style={{color: '#1a6fd4', letterSpacing: '0.2em'}}>Premium Auto Experience</span>
              <Star size={12} style={{color: '#1a6fd4'}} fill="#1a6fd4" />
            </div>

            <h1 className="mb-6 leading-tight" style={{fontFamily: "'Playfair Display', serif", fontSize: 'clamp(3rem, 7vw, 5.5rem)', fontWeight: 500, color: '#f0f0f5', lineHeight: 1.1}}>
              L'auto perfetta,<br />
              <span style={{background: 'linear-gradient(135deg, #1a6fd4, #2589ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'}}>
                per ogni momento
              </span>
            </h1>

            <p className="max-w-xl mx-auto mb-10 text-base leading-relaxed" style={{color: '#8888aa', lineHeight: 1.9}}>
              Noleggio e vendita di veicoli premium. Selezione curata, assistenza dedicata
              e la massima trasparenza in ogni trattativa.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/noleggio" className="btn-primary">
                Noleggia Ora
              </Link>
              <Link href="/vendita" className="btn-outline">
                Vedi Auto in Vendita
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto mt-16 pt-16" style={{borderTop: '1px solid rgba(255,255,255,0.07)'}}>
              {[
                {num: '200+', label: 'Auto gestite'},
                {num: '98%', label: 'Clienti soddisfatti'},
                {num: '15+', label: 'Anni esperienza'},
              ].map(s => (
                <div key={s.num} className="text-center">
                  <div className="text-2xl font-semibold mb-1" style={{fontFamily: "'Playfair Display', serif", fontSize: '2rem', color: '#1a6fd4'}}>{s.num}</div>
                  <div className="text-xs uppercase tracking-widest" style={{color: '#555570', letterSpacing: '0.12em', fontSize: '0.65rem'}}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 animate-bounce">
            <span className="text-xs uppercase tracking-widest" style={{color: '#555570', fontSize: '0.6rem', letterSpacing: '0.2em'}}>Scorri</span>
            <ChevronDown size={16} style={{color: '#1a6fd4'}} />
          </div>
        </section>

        {/* FEATURES */}
        <section className="py-24" style={{background: '#0c0c16'}}>
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                {icon: Shield, title: 'Garanzia Totale', desc: 'Ogni veicolo è revisionato e certificato prima della consegna'},
                {icon: Clock, title: 'Disponibile 24/7', desc: 'Assistenza stradale e supporto clienti sempre attivi'},
                {icon: Award, title: 'Qualità Premium', desc: 'Selezione esclusiva dei migliori marchi automobilistici'},
                {icon: Star, title: 'Clienti al Centro', desc: 'Servizio personalizzato per ogni tua esigenza specifica'},
              ].map(({icon: Icon, title, desc}) => (
                <div key={title} className="p-6 rounded-sm glass text-center"
                  style={{border: '1px solid rgba(26,111,212,0.08)'}}>
                  <div className="w-12 h-12 rounded-sm mx-auto mb-5 flex items-center justify-center"
                    style={{background: 'rgba(26,111,212,0.08)', border: '1px solid rgba(26,111,212,0.2)'}}>
                    <Icon size={22} style={{color: '#1a6fd4'}} />
                  </div>
                  <h3 className="mb-2 text-lg" style={{fontFamily: "'Playfair Display', serif", fontWeight: 600}}>{title}</h3>
                  <p className="text-sm leading-relaxed" style={{color: '#666680', lineHeight: 1.7}}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AUTO IN NOLEGGIO */}
        <section className="py-24" style={{background: '#08080e'}}>
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-14">
              <div>
                <p className="text-xs uppercase tracking-widest mb-3" style={{color: '#1a6fd4', letterSpacing: '0.2em'}}>Il Nostro Parco Auto</p>
                <h2 className="text-5xl" style={{fontFamily: "'Playfair Display', serif", fontWeight: 500}}>
                  Auto in Noleggio
                </h2>
              </div>
              <Link href="/noleggio" className="flex items-center gap-2 mt-6 md:mt-0 text-sm uppercase tracking-widest transition-colors"
                style={{color: '#1a6fd4', letterSpacing: '0.1em', fontSize: '0.75rem'}}>
                Vedi tutto <ArrowRight size={16} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredRental.map(car => (
                <CarCard key={car.id} car={car} type="noleggio" />
              ))}
            </div>
          </div>
        </section>

        {/* DIVIDER BANNER */}
        <section className="relative py-24 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1400&q=80"
            alt="banner"
            className="absolute inset-0 w-full h-full object-cover"
            style={{filter: 'brightness(0.2)'}}
          />
          <div className="absolute inset-0" style={{background: 'linear-gradient(135deg, rgba(8,8,14,0.9), rgba(26,111,212,0.05))'}} />
          <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
            <p className="text-xs uppercase tracking-widest mb-4" style={{color: '#1a6fd4', letterSpacing: '0.2em'}}>Acquisto Sicuro</p>
            <h2 className="text-4xl md:text-5xl mb-6" style={{fontFamily: "'Playfair Display', serif", fontWeight: 500}}>
              Cerchi la tua auto perfetta?
            </h2>
            <p className="mb-8 leading-relaxed" style={{color: '#8888aa', lineHeight: 1.8}}>
              Ogni veicolo in vendita è verificato, certificato e pronto per il trasferimento di proprietà.
              Assistenza completa nella pratica burocratica.
            </p>
            <Link href="/vendita" className="btn-primary">
              Esplora la Vendita
            </Link>
          </div>
        </section>

        {/* AUTO IN VENDITA */}
        <section className="py-24" style={{background: '#08080e'}}>
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-14">
              <div>
                <p className="text-xs uppercase tracking-widest mb-3" style={{color: '#1a6fd4', letterSpacing: '0.2em'}}>Acquisto Diretto</p>
                <h2 className="text-5xl" style={{fontFamily: "'Playfair Display', serif", fontWeight: 500}}>
                  Auto in Vendita
                </h2>
              </div>
              <Link href="/vendita" className="flex items-center gap-2 mt-6 md:mt-0 text-sm uppercase tracking-widest transition-colors"
                style={{color: '#1a6fd4', letterSpacing: '0.1em', fontSize: '0.75rem'}}>
                Vedi tutto <ArrowRight size={16} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredSale.map(car => (
                <CarCard key={car.id} car={car} type="vendita" />
              ))}
            </div>
          </div>
        </section>

        {/* GALLERY SECTION */}
        <section className="py-24" style={{background: '#0c0c16'}}>
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-14">
              <p className="text-xs uppercase tracking-widest mb-3" style={{color: '#1a6fd4', letterSpacing: '0.2em'}}>La Nostra Flotta</p>
              <h2 className="text-5xl" style={{fontFamily: "'Playfair Display', serif", fontWeight: 500}}>Gallery</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=500&q=80',
                'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=500&q=80',
                'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500&q=80',
                'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=500&q=80',
                'https://images.unsplash.com/photo-1580414057403-c5f451f30e1c?w=500&q=80',
                'https://images.unsplash.com/photo-1617469767987-a5b6df52e33c?w=500&q=80',
                'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=500&q=80',
                'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=500&q=80',
              ].map((src, i) => (
                <div key={i} className="overflow-hidden rounded-sm" style={{aspectRatio: '4/3', border: '1px solid rgba(255,255,255,0.05)'}}>
                  <img src={src} alt={`Gallery ${i+1}`} className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA CONTATTI */}
        <section className="py-20" style={{background: '#08080e'}}>
          <div className="max-w-4xl mx-auto px-6 text-center">
            <p className="text-xs uppercase tracking-widest mb-4" style={{color: '#1a6fd4', letterSpacing: '0.2em'}}>Siamo qui per te</p>
            <h2 className="text-4xl mb-6" style={{fontFamily: "'Playfair Display', serif", fontWeight: 500}}>Hai domande? Contattaci</h2>
            <p className="mb-10 leading-relaxed" style={{color: '#8888aa'}}>Il nostro team è a tua disposizione per qualsiasi informazione su noleggio, acquisto o assistenza.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href={`tel:${COMPANY_INFO.phone}`} className="btn-primary flex items-center gap-2 justify-center">
                <Phone size={16} /> Chiamaci
              </a>
              <a href={`mailto:${COMPANY_INFO.email}`} className="btn-outline flex items-center gap-2 justify-center">
                <Mail size={16} /> Scrivici
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
