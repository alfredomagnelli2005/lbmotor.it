'use client'
import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { CARS_VENDITA, COMPANY_INFO } from '@/lib/data'
import { Calendar, Users, Fuel, Gauge, ArrowLeft, ChevronLeft, ChevronRight, Phone, Mail, MessageCircle } from 'lucide-react'

export default function VenditaDetail({ params }: { params: { id: string } }) {
  const car = CARS_VENDITA.find(c => c.id === params.id)
  if (!car) return <div style={{color:'white', padding:'10rem', textAlign:'center'}}>Auto non trovata</div>

  const [currentImg, setCurrentImg] = useState(0)
  const [contactMethod, setContactMethod] = useState<'whatsapp'|'phone'|'email'|null>(null)

  const whatsappMsg = encodeURIComponent(`Ciao! Sono interessato all'auto ${car.brand} ${car.model} (${car.year}) - €${car.price.toLocaleString('it-IT')} - pubblicata sul sito LB Motors.`)

  return (
    <>
      <Navbar />
      <main style={{background: '#08080e'}}>
        <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">
          <Link href="/vendita" className="inline-flex items-center gap-2 mb-10 text-xs uppercase tracking-widest transition-colors"
            style={{color: '#555570', letterSpacing: '0.12em'}}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#1a6fd4')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = '#555570')}
          >
            <ArrowLeft size={14} /> Torna alla Vendita
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* LEFT */}
            <div>
              {/* Gallery */}
              <div className="relative rounded-sm overflow-hidden mb-6" style={{aspectRatio: '16/10'}}>
                <img src={car.images[currentImg]} alt={car.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0" style={{background: 'linear-gradient(to top, rgba(8,8,14,0.5), transparent 60%)'}} />
                {car.images.length > 1 && (
                  <>
                    <button onClick={() => setCurrentImg(p => (p - 1 + car.images.length) % car.images.length)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-sm flex items-center justify-center"
                      style={{background: 'rgba(8,8,14,0.7)', border: '1px solid rgba(26,111,212,0.3)', color: '#1a6fd4'}}>
                      <ChevronLeft size={18} />
                    </button>
                    <button onClick={() => setCurrentImg(p => (p + 1) % car.images.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-sm flex items-center justify-center"
                      style={{background: 'rgba(8,8,14,0.7)', border: '1px solid rgba(26,111,212,0.3)', color: '#1a6fd4'}}>
                      <ChevronRight size={18} />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {car.images.length > 1 && (
                <div className="flex gap-2 mb-8">
                  {car.images.map((img, i) => (
                    <button key={i} onClick={() => setCurrentImg(i)}
                      className="flex-1 rounded-sm overflow-hidden transition-all"
                      style={{
                        aspectRatio: '16/9',
                        border: `1px solid ${currentImg === i ? '#1a6fd4' : 'rgba(255,255,255,0.06)'}`,
                        opacity: currentImg === i ? 1 : 0.5,
                      }}>
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              <div className="mb-2 text-xs uppercase tracking-widest" style={{color: '#1a6fd4', letterSpacing: '0.2em'}}>{car.brand}</div>
              <h1 className="text-5xl mb-3" style={{fontFamily: "'Playfair Display', serif", fontWeight: 500}}>{car.model}</h1>
              <div className="text-4xl mb-8" style={{fontFamily: "'Playfair Display', serif", color: '#1a6fd4'}}>
                €{car.price.toLocaleString('it-IT')}
              </div>

              <p className="leading-relaxed mb-8" style={{color: '#8888aa', lineHeight: 1.9}}>{car.description}</p>

              {/* Specs */}
              <div className="grid grid-cols-2 gap-3 mb-8">
                {[
                  {icon: Calendar, label: 'Anno', val: String(car.year)},
                  {icon: Users, label: 'Posti', val: `${car.seats} posti`},
                  {icon: Fuel, label: 'Carburante', val: car.fuel},
                  {icon: Gauge, label: 'Chilometri', val: car.km ? `${car.km.toLocaleString('it-IT')} km` : 'N/D'},
                  {icon: Gauge, label: 'Cambio', val: car.transmission},
                  {icon: Calendar, label: 'Colore', val: car.color},
                ].map(({icon:Icon, label, val}) => (
                  <div key={label} className="p-4 rounded-sm flex items-center gap-3"
                    style={{background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)'}}>
                    <Icon size={16} style={{color: '#1a6fd4'}} />
                    <div>
                      <div className="text-xs" style={{color: '#555570'}}>{label}</div>
                      <div className="text-sm font-medium">{val}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Features */}
              <div>
                <h3 className="text-lg mb-4" style={{fontFamily: "'Playfair Display', serif", color: '#1a6fd4'}}>Optional & Dotazioni</h3>
                <div className="flex flex-wrap gap-2">
                  {car.features.map(f => (
                    <span key={f} className="px-3 py-1.5 text-xs rounded-sm"
                      style={{background: 'rgba(26,111,212,0.07)', border: '1px solid rgba(26,111,212,0.2)', color: '#1a6fd4'}}>
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT: Contatto */}
            <div className="lg:sticky lg:top-28 self-start">
              <div className="rounded-sm p-8 glass" style={{border: '1px solid rgba(26,111,212,0.15)'}}>
                <h2 className="text-2xl mb-2" style={{fontFamily: "'Playfair Display', serif", fontWeight: 500}}>Ti interessa?</h2>
                <p className="text-sm mb-8" style={{color: '#8888aa'}}>
                  Contattaci per informazioni, preventivi o per fissare un appuntamento per visionare il veicolo.
                </p>

                <div className="flex flex-col gap-3">
                  {/* WhatsApp */}
                  <a
                    href={`https://wa.me/${COMPANY_INFO.whatsapp}?text=${whatsappMsg}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center gap-4 p-4 rounded-sm transition-all duration-300"
                    style={{background: 'rgba(37,211,102,0.08)', border: '1px solid rgba(37,211,102,0.3)', color: '#25d366'}}
                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(37,211,102,0.15)')}
                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(37,211,102,0.08)')}
                  >
                    <MessageCircle size={20} />
                    <div>
                      <div className="font-semibold text-sm">Scrivi su WhatsApp</div>
                      <div className="text-xs" style={{color: 'rgba(37,211,102,0.7)'}}>Risposta rapida</div>
                    </div>
                  </a>

                  {/* Phone */}
                  <a
                    href={`tel:${COMPANY_INFO.phone}`}
                    className="w-full flex items-center gap-4 p-4 rounded-sm transition-all duration-300"
                    style={{background: 'rgba(26,111,212,0.06)', border: '1px solid rgba(26,111,212,0.2)', color: '#1a6fd4'}}
                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(26,111,212,0.12)')}
                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(26,111,212,0.06)')}
                  >
                    <Phone size={20} />
                    <div>
                      <div className="font-semibold text-sm">Chiama Ora</div>
                      <div className="text-xs" style={{color: 'rgba(26,111,212,0.6)'}}>{COMPANY_INFO.phone}</div>
                    </div>
                  </a>

                  {/* Email */}
                  <a
                    href={`mailto:${COMPANY_INFO.email}?subject=Richiesta info ${car.brand} ${car.model}&body=${encodeURIComponent(`Buongiorno, sono interessato all'auto ${car.brand} ${car.model} (${car.year}) - €${car.price.toLocaleString('it-IT')}. Potrei avere maggiori informazioni?`)}`}
                    className="w-full flex items-center gap-4 p-4 rounded-sm transition-all duration-300"
                    style={{background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: '#8888aa'}}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'; (e.currentTarget as HTMLElement).style.color = '#f0f0f5' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)'; (e.currentTarget as HTMLElement).style.color = '#8888aa' }}
                  >
                    <Mail size={20} />
                    <div>
                      <div className="font-semibold text-sm">Invia una Email</div>
                      <div className="text-xs" style={{color: '#555570'}}>{COMPANY_INFO.email}</div>
                    </div>
                  </a>
                </div>

                <div className="mt-8 p-4 rounded-sm" style={{background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)'}}>
                  <p className="text-xs leading-relaxed" style={{color: '#555570', lineHeight: 1.8}}>
                    <span style={{color: '#1a6fd4'}}>Orari disponibilità:</span><br />
                    {COMPANY_INFO.orari}
                  </p>
                </div>

                {/* Price summary */}
                <div className="mt-6 pt-6" style={{borderTop: '1px solid rgba(255,255,255,0.06)'}}>
                  <div className="flex justify-between items-center">
                    <span style={{color: '#8888aa', fontSize: '0.85rem'}}>Prezzo di vendita</span>
                    <span className="text-2xl font-semibold" style={{fontFamily: "'Playfair Display', serif", color: '#1a6fd4'}}>
                      €{car.price.toLocaleString('it-IT')}
                    </span>
                  </div>
                  <p className="text-xs mt-2" style={{color: '#444460'}}>Prezzo trattabile. IVA inclusa. Passaggio di proprietà a carico dell'acquirente.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
