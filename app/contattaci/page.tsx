'use client'
import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { COMPANY_INFO } from '@/lib/data'
import { Phone, Mail, MapPin, Clock, MessageCircle, Send, CheckCircle } from 'lucide-react'

export default function Contattaci() {
  const [form, setForm] = useState({nome:'', email:'', telefono:'', oggetto:'', messaggio:''})
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Integrare invio email (es. Nodemailer, Resend, o EmailJS)
    // await fetch('/api/contact', { method:'POST', body: JSON.stringify(form) })
    setSent(true)
  }

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative pt-40 pb-24 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1400&q=80"
              alt="contattaci"
              className="w-full h-full object-cover"
              style={{filter: 'brightness(0.15)'}}
            />
            <div className="absolute inset-0" style={{background: 'linear-gradient(to bottom, rgba(8,8,14,0.4), rgba(8,8,14,1))'}} />
          </div>
          <div className="relative z-10 max-w-5xl mx-auto px-6">
            <p className="text-xs uppercase tracking-widest mb-4" style={{color: '#1a6fd4', letterSpacing: '0.2em'}}>Siamo qui per te</p>
            <h1 className="text-6xl mb-6" style={{fontFamily: "'Playfair Display', serif", fontWeight: 500}}>Contattaci</h1>
            <p className="max-w-xl leading-relaxed" style={{color: '#8888aa', lineHeight: 1.9}}>
              Hai domande su noleggio, acquisto o hai bisogno di assistenza? 
              Il nostro team è pronto a risponderti nel più breve tempo possibile.
            </p>
          </div>
        </section>

        <section className="py-20" style={{background: '#08080e'}}>
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              {/* LEFT: Form */}
              <div>
                <h2 className="text-3xl mb-8" style={{fontFamily: "'Playfair Display', serif", fontWeight: 500}}>Invia un messaggio</h2>
                
                {sent ? (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center"
                      style={{background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)'}}>
                      <CheckCircle size={32} color="#22c55e" />
                    </div>
                    <h3 className="text-2xl mb-3" style={{fontFamily: "'Playfair Display', serif"}}>Messaggio inviato!</h3>
                    <p style={{color: '#8888aa'}}>Ti risponderemo entro 24 ore lavorative.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs uppercase tracking-widest mb-2 block" style={{color: '#8888aa', letterSpacing: '0.1em'}}>Nome*</label>
                        <input type="text" required className="input-dark" value={form.nome} placeholder="Mario"
                          onChange={e => setForm(p => ({...p, nome: e.target.value}))} />
                      </div>
                      <div>
                        <label className="text-xs uppercase tracking-widest mb-2 block" style={{color: '#8888aa', letterSpacing: '0.1em'}}>Cognome</label>
                        <input type="text" className="input-dark" placeholder="Rossi"
                          onChange={e => setForm(p => ({...p, nome: e.target.value}))} />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs uppercase tracking-widest mb-2 block" style={{color: '#8888aa', letterSpacing: '0.1em'}}>Email*</label>
                      <input type="email" required className="input-dark" value={form.email} placeholder="mario@email.it"
                        onChange={e => setForm(p => ({...p, email: e.target.value}))} />
                    </div>
                    <div>
                      <label className="text-xs uppercase tracking-widest mb-2 block" style={{color: '#8888aa', letterSpacing: '0.1em'}}>Telefono</label>
                      <input type="tel" className="input-dark" value={form.telefono} placeholder="+39 333 1234567"
                        onChange={e => setForm(p => ({...p, telefono: e.target.value}))} />
                    </div>
                    <div>
                      <label className="text-xs uppercase tracking-widest mb-2 block" style={{color: '#8888aa', letterSpacing: '0.1em'}}>Oggetto*</label>
                      <select required className="input-dark" value={form.oggetto}
                        onChange={e => setForm(p => ({...p, oggetto: e.target.value}))}
                        style={{background: 'rgba(255,255,255,0.04)', cursor: 'pointer'}}>
                        <option value="" style={{background: '#0a0a14'}}>Seleziona un argomento</option>
                        <option value="noleggio" style={{background: '#0a0a14'}}>Informazioni Noleggio</option>
                        <option value="vendita" style={{background: '#0a0a14'}}>Informazioni Vendita</option>
                        <option value="prenotazione" style={{background: '#0a0a14'}}>Prenotazione Esistente</option>
                        <option value="assistenza" style={{background: '#0a0a14'}}>Assistenza & Supporto</option>
                        <option value="altro" style={{background: '#0a0a14'}}>Altro</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs uppercase tracking-widest mb-2 block" style={{color: '#8888aa', letterSpacing: '0.1em'}}>Messaggio*</label>
                      <textarea required rows={5} className="input-dark resize-none" value={form.messaggio}
                        placeholder="Descrivi la tua richiesta..."
                        onChange={e => setForm(p => ({...p, messaggio: e.target.value}))} />
                    </div>
                    <button type="submit" className="btn-primary flex items-center gap-2 justify-center">
                      <Send size={16} /> Invia Messaggio
                    </button>
                    <p className="text-xs" style={{color: '#444460'}}>
                      * Campi obbligatori. I tuoi dati saranno trattati secondo la nostra Privacy Policy.
                    </p>
                  </form>
                )}
              </div>

              {/* RIGHT: Info */}
              <div>
                <h2 className="text-3xl mb-8" style={{fontFamily: "'Playfair Display', serif", fontWeight: 500}}>Dove siamo</h2>
                
                <div className="flex flex-col gap-5 mb-10">
                  {[
                    {icon: MapPin, title: 'Indirizzo', val: COMPANY_INFO.address},
                    {icon: Phone, title: 'Telefono', val: COMPANY_INFO.phone, href: `tel:${COMPANY_INFO.phone}`},
                    {icon: Mail, title: 'Email', val: COMPANY_INFO.email, href: `mailto:${COMPANY_INFO.email}`},
                    {icon: Clock, title: 'Orari', val: COMPANY_INFO.orari},
                  ].map(({icon:Icon, title, val, href}) => (
                    <div key={title} className="flex items-start gap-4 p-5 rounded-sm"
                      style={{background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)'}}>
                      <div className="w-10 h-10 rounded-sm flex-shrink-0 flex items-center justify-center"
                        style={{background: 'rgba(26,111,212,0.08)', border: '1px solid rgba(26,111,212,0.2)'}}>
                        <Icon size={18} style={{color: '#1a6fd4'}} />
                      </div>
                      <div>
                        <div className="text-xs uppercase tracking-widest mb-1" style={{color: '#555570', fontSize: '0.65rem', letterSpacing: '0.12em'}}>{title}</div>
                        {href ? (
                          <a href={href} className="transition-colors" style={{color: '#f0f0f5', fontSize: '0.9rem'}}
                            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#1a6fd4')}
                            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = '#f0f0f5')}
                          >{val}</a>
                        ) : (
                          <p style={{color: '#f0f0f5', fontSize: '0.9rem', lineHeight: 1.6}}>{val}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* WhatsApp CTA */}
                <a
                  href={`https://wa.me/${COMPANY_INFO.whatsapp}?text=${encodeURIComponent('Ciao! Vorrei informazioni sui vostri servizi di noleggio e vendita auto.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-3 p-5 rounded-sm transition-all duration-300"
                  style={{background: 'rgba(37,211,102,0.07)', border: '1px solid rgba(37,211,102,0.25)', color: '#25d366'}}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(37,211,102,0.14)')}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(37,211,102,0.07)')}
                >
                  <MessageCircle size={22} />
                  <div className="text-left">
                    <div className="font-semibold">Contattaci su WhatsApp</div>
                    <div className="text-xs" style={{color: 'rgba(37,211,102,0.65)'}}>Risposta più rapida garantita</div>
                  </div>
                </a>

                {/* Map placeholder */}
                <div className="mt-8 rounded-sm overflow-hidden" style={{height: 220, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', display:'flex', alignItems:'center', justifyContent:'center'}}>
                  {/* TODO: Sostituire con Google Maps embed reale */}
                  {/* <iframe src="https://maps.google.com/maps?q=VIA+ROMA+123+ROMA&output=embed" width="100%" height="100%" style={{border:0}} /> */}
                  <div className="text-center p-8">
                    <MapPin size={32} style={{color: '#1a6fd4', margin: '0 auto 12px'}} />
                    <p className="text-sm" style={{color: '#555570'}}>Mappa Google Maps<br />
                      <span className="text-xs" style={{color: '#3a3a52'}}>(integrare con API Key reale)</span>
                    </p>
                  </div>
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
