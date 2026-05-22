'use client'
import { useState, useEffect } from 'react'
import { notFound, useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { createClient } from '@supabase/supabase-js'
import { CheckCircle, XCircle, Calendar, Users, Fuel, Gauge, ArrowLeft, Shield, CreditCard, AlertCircle, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'

// Configurazione standard fallbacks se mancano dal DB
const DEFAULT_DEPOSIT_PERCENT = 30

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function NoleggioDetail({ params }: { params: { id: string } }) {
  const router = useRouter()

  // Stati per la gestione del caricamento dati auto dal DB
  const [car, setCar] = useState<any>(null)
  const [loadingCar, setLoadingCar] = useState(true)

  // Stati del flusso di prenotazione
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [currentImg, setCurrentImg] = useState(0)
  const [step, setStep] = useState<'info' | 'book' | 'payment'>('info')
  const [formData, setFormData] = useState({nome:'', cognome:'', email:'', telefono:'', note:''})
  const [submitting, setSubmitting] = useState(false)
  const [paymentDone, setPaymentDone] = useState(false)

  // 1. Recupero dell'auto in tempo reale al montaggio del componente
  useEffect(() => {
    async function fetchCar() {
      try {
        const { data, error } = await supabase
          .from('cars')
          .select('*')
          .eq('id', params.id)
          .eq('type', 'noleggio')
          .eq('available', true) // Carichiamo solo se l'auto è effettivamente disponibile a catalogo
          .maybeSingle()

        if (error || !data) {
          setCar(null)
        } else {
          setCar(data)
        }
      } catch (err) {
        console.error("Errore caricamento auto:", err)
      } finally {
        setLoadingCar(false)
      }
    }
    fetchCar()
  }, [params.id])

  if (loadingCar) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{background: '#08080e'}}>
        <Loader2 className="animate-spin" size={32} color="#1a6fd4" />
      </div>
    )
  }

  if (!car) return notFound()

  // Parsing sicuro delle immagini dal DB
  let carImages: string[] = []
  if (Array.isArray(car.images)) {
    carImages = car.images
  } else if (typeof car.images === 'string') {
    try {
      carImages = JSON.parse(car.images)
    } catch {
      carImages = [car.images || car.image]
    }
  } else {
    carImages = [car.image || 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800']
  }

  // Estrazione sicura dei termini contrattuali dinamici dal campo JSON del DB
  const contractTerms = typeof car.contract_terms === 'string'
    ? JSON.parse(car.contract_terms)
    : (car.contract_terms || null)

  const depositPercent = contractTerms?.depositoPercentuale || DEFAULT_DEPOSIT_PERCENT

  // Calcolo dinamico dei giorni e prezzi
  const calcDays = () => {
    if (!dateFrom || !dateTo) return 0
    const start = new Date(dateFrom)
    const end = new Date(dateTo)
    const diff = end.getTime() - start.getTime()
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)))
  }
  const days = calcDays()
  const totalPrice = days * (car.price || 0)
  const depositAmount = Math.round(totalPrice * (depositPercent / 100))

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault()
    setStep('payment')
  }

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      // Formattazione coerente dei dati per il database relazionale
      const nomeCompletoCliente = `${formData.nome} ${formData.cognome}`.trim()
      const nomeVettura = `${car.brand || ''} ${car.model || ''}`.trim()

      // Conversione esplicita in stringhe di data compatibili con PostgreSQL (YYYY-MM-DD)
      const formattedDateFrom = new Date(dateFrom).toISOString().split('T')[0]
      const formattedDateTo = new Date(dateTo).toISOString().split('T')[0]

      const { error } = await supabase
        .from('prenotazioni')
        .insert([
          {
            car_id: car.id,
            car_name: nomeVettura,
            cliente: nomeCompletoCliente,
            email: formData.email,
            telefono: formData.telefono,
            note: formData.note || null,
            date_from: formattedDateFrom,
            date_to: formattedDateTo,
            giorni: Number(days),
            prezzo_totale: Number(totalPrice),
            acconto: Number(depositAmount),
            pagato: false
          }
        ])

      if (error) {
        console.error("Dettaglio Errore Supabase API:", error)
        throw error
      }

      setPaymentDone(true)
    } catch (err: any) {
      alert(`Errore nel salvataggio: ${err.message || 'Controlla la console per i dettagli.'}`)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Navbar />
      <main style={{background: '#08080e'}}>
        <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">
          {/* Breadcrumb */}
          <Link href="/noleggio" className="inline-flex items-center gap-2 mb-10 text-xs uppercase tracking-widest transition-colors"
            style={{color: '#555570', letterSpacing: '0.12em'}}
          >
            <ArrowLeft size={14} /> Torna al Noleggio
          </Link>

          {paymentDone ? (
            /* SUCCESS PANEL */
            <div className="max-w-xl mx-auto text-center py-20">
              <div className="w-20 h-20 rounded-full mx-auto mb-8 flex items-center justify-center" style={{background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)'}}>
                <CheckCircle size={40} color="#22c55e" />
              </div>
              <h2 className="text-4xl mb-4" style={{fontFamily: "'Playfair Display', serif", fontWeight: 500}}>Richiesta Inviata!</h2>
              <p className="mb-2" style={{color: '#8888aa'}}>Il blocco del veicolo e l'acconto di <span style={{color: '#1a6fd4'}}>€{depositAmount}</span> sono stati registrati.</p>
              <p className="mb-8 text-sm" style={{color: '#555570'}}>Abbiamo preso in carico la tua pratica. Riceverai una mail di conferma a {formData.email} non appena l'admin verificherà i documenti.</p>
              <Link href="/noleggio" className="btn-primary">Torna al Catalogo</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              {/* LEFT: Car info */}
              <div>
                {/* Gallery */}
                <div className="relative rounded-sm overflow-hidden mb-8" style={{aspectRatio: '16/10'}}>
                  <img src={carImages[currentImg]} alt={car.model} className="w-full h-full object-cover" />
                  <div className="absolute inset-0" style={{background: 'linear-gradient(to top, rgba(8,8,14,0.5), transparent 60%)'}} />
                  {carImages.length > 1 && (
                    <>
                      <button type="button" onClick={() => setCurrentImg(p => (p - 1 + carImages.length) % carImages.length)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-sm flex items-center justify-center"
                        style={{background: 'rgba(8,8,14,0.7)', border: '1px solid rgba(26,111,212,0.3)', color: '#1a6fd4'}}>
                        <ChevronLeft size={18} />
                      </button>
                      <button type="button" onClick={() => setCurrentImg(p => (p + 1) % carImages.length)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-sm flex items-center justify-center"
                        style={{background: 'rgba(8,8,14,0.7)', border: '1px solid rgba(26,111,212,0.3)', color: '#1a6fd4'}}>
                        <ChevronRight size={18} />
                      </button>
                    </>
                  )}
                  {/* Availability badge */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-sm"
                    style={{background: car.available ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)', border: `1px solid ${car.available ? 'rgba(34,197,94,0.4)' : 'rgba(239,68,68,0.4)'}`}}>
                    {car.available ? <CheckCircle size={13} color="#22c55e" /> : <XCircle size={13} color="#ef4444" />}
                    <span className="text-sm font-medium" style={{color: car.available ? '#22c55e' : '#ef4444'}}>
                      {car.available ? 'Disponibile' : 'Non Disponibile'}
                    </span>
                  </div>
                </div>

                <div className="mb-2 text-xs uppercase tracking-widest" style={{color: '#1a6fd4', letterSpacing: '0.2em'}}>{car.brand}</div>
                <h1 className="text-5xl mb-2" style={{fontFamily: "'Playfair Display', serif", fontWeight: 500}}>{car.model}</h1>
                <div className="text-3xl mb-8" style={{fontFamily: "'Playfair Display', serif", color: '#1a6fd4'}}>
                  €{car.price}<span className="text-lg" style={{color: '#555570'}}>/giorno</span>
                </div>

                <p className="leading-relaxed mb-8" style={{color: '#8888aa', lineHeight: 1.9}}>{car.description}</p>

                {/* Specs */}
                <div className="grid grid-cols-2 gap-3 mb-8">
                  {[
                    {icon: Calendar, label: 'Anno', val: String(car.year || '-')},
                    {icon: Users, label: 'Posti', val: `${car.seats || 4} posti`},
                    {icon: Fuel, label: 'Carburante', val: car.fuel || '-'},
                    {icon: Gauge, label: 'Cambio', val: car.transmission || '-'},
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
                {car.features && (
                  <div className="mb-8">
                    <h3 className="text-lg mb-4" style={{fontFamily: "'Playfair Display', serif", color: '#1a6fd4'}}>Dotazioni</h3>
                    <div className="flex flex-wrap gap-2">
                      {(Array.isArray(car.features) ? car.features : JSON.parse(car.features || '[]')).map((f: string) => (
                        <span key={f} className="px-3 py-1.5 text-xs rounded-sm" style={{background: 'rgba(26,111,212,0.07)', border: '1px solid rgba(26,111,212,0.2)', color: '#1a6fd4'}}>
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contract Terms */}
                {contractTerms && (
                  <div className="rounded-sm p-6" style={{background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)'}}>
                    <h3 className="flex items-center gap-2 text-lg mb-5" style={{fontFamily: "'Playfair Display', serif", color: '#f0f0f5'}}>
                      <Shield size={18} style={{color: '#1a6fd4'}} /> Condizioni Contrattuali
                    </h3>
                    <div className="grid grid-cols-1 gap-3 text-sm" style={{color: '#8888aa'}}>
                      {[
                        {label: 'Acconto richiesto', val: `${depositPercent}% del totale`},
                        {label: 'Km inclusi/giorno', val: `${contractTerms.kmGiornalieriInclusi || 'Illimitati'} km`},
                        {label: 'Costo km extra', val: `€${contractTerms.costoPerkm || '0'}/km`},
                        {label: 'Età minima', val: `${contractTerms.etaMinima || '18'} anni`},
                        {label: 'Patente richiesta', val: contractTerms.patenteMinima || 'Patente B'},
                        {label: 'Assicurazione', val: contractTerms.assicurazione || 'Kasko inclusa'},
                        {label: 'Cancellazione', val: contractTerms.cancellazione || 'Gratuita'},
                      ].map(({label, val}) => (
                        <div key={label} className="flex justify-between gap-4 py-2" style={{borderBottom: '1px solid rgba(255,255,255,0.04)'}}>
                          <span style={{color: '#666680'}}>{label}</span>
                          <span style={{color: '#f0f0f5', textAlign: 'right', maxWidth: '55%'}}>{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* RIGHT SIDE: Interactive Form steps */}
              <div className="lg:sticky lg:top-28 self-start">
                <div className="rounded-sm p-8 glass" style={{border: '1px solid rgba(26,111,212,0.15)'}}>

                  {/* Progress Line Steps */}
                  <div className="flex items-center gap-3 mb-8">
                    {(['info','book','payment'] as const).map((s, i) => (
                      <div key={s} className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all"
                          style={{
                            background: step === s ? 'linear-gradient(135deg, #1a6fd4, #2589ff)' : 'rgba(255,255,255,0.05)',
                            color: step === s ? '#08080e' : '#555570',
                          }}>
                          {i + 1}
                        </div>
                        {i < 2 && <div className="flex-1 h-px" style={{background: 'rgba(255,255,255,0.08)', width: 24}} />}
                      </div>
                    ))}
                  </div>

                  {/* STEP 1: DATE PERIOD SELECTION */}
                  {step === 'info' && (
                    <>
                      <h2 className="text-2xl mb-6" style={{fontFamily: "'Playfair Display', serif", fontWeight: 500}}>Seleziona il Periodo</h2>
                      <div className="flex flex-col gap-4 mb-6">
                        <div>
                          <label className="text-xs uppercase tracking-widest mb-2 block" style={{color: '#8888aa', letterSpacing: '0.12em'}}>Data di Inizio</label>
                          <input type="date" className="input-dark" value={dateFrom} min={new Date().toISOString().split('T')[0]}
                            onChange={e => setDateFrom(e.target.value)} />
                        </div>
                        <div>
                          <label className="text-xs uppercase tracking-widest mb-2 block" style={{color: '#8888aa', letterSpacing: '0.12em'}}>Data di Fine</label>
                          <input type="date" className="input-dark" value={dateTo} min={dateFrom || new Date().toISOString().split('T')[0]}
                            onChange={e => setDateTo(e.target.value)} />
                        </div>
                      </div>

                      {days > 0 && (
                        <div className="rounded-sm p-5 mb-6" style={{background: 'rgba(26,111,212,0.04)', border: '1px solid rgba(26,111,212,0.15)'}}>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm" style={{color: '#8888aa'}}>€{car.price}/gg × {days} {days === 1 ? 'giorno' : 'giorni'}</span>
                            <span className="text-sm">€{totalPrice.toLocaleString('it-IT')}</span>
                          </div>
                          <div className="flex justify-between pt-3" style={{borderTop: '1px solid rgba(255,255,255,0.07)'}}>
                            <span className="text-sm font-semibold">Acconto richiesto ({depositPercent}%)</span>
                            <span className="font-bold" style={{color: '#1a6fd4', fontSize: '1.1rem'}}>€{depositAmount}</span>
                          </div>
                        </div>
                      )}

                      {!car.available && (
                        <div className="flex items-start gap-3 p-4 rounded-sm mb-6" style={{background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)'}}>
                          <AlertCircle size={16} color="#ef4444" style={{flexShrink:0, marginTop: 2}} />
                          <p className="text-sm" style={{color: '#ef4444'}}>Questo veicolo non è attualmente disponibile per queste date. Contatta l'assistenza per eccezioni.</p>
                        </div>
                      )}

                      <button
                        type="button"
                        className="btn-primary w-full text-center"
                        disabled={!dateFrom || !dateTo || days === 0 || !car.available}
                        onClick={() => setStep('book')}
                        style={{opacity: (!dateFrom || !dateTo || days === 0 || !car.available) ? 0.5 : 1}}
                      >
                        Continua con i Dati
                      </button>
                    </>
                  )}

                  {/* STEP 2: USER DETAILS */}
                  {step === 'book' && (
                    <form onSubmit={handleBook}>
                      <h2 className="text-2xl mb-6" style={{fontFamily: "'Playfair Display', serif", fontWeight: 500}}>I Tuoi Dati</h2>
                      <div className="flex flex-col gap-4 mb-6">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs uppercase tracking-widest mb-2 block" style={{color: '#8888aa', letterSpacing: '0.1em'}}>Nome</label>
                            <input type="text" required className="input-dark" value={formData.nome}
                              onChange={e => setFormData(p => ({...p, nome: e.target.value}))} placeholder="Mario" />
                          </div>
                          <div>
                            <label className="text-xs uppercase tracking-widest mb-2 block" style={{color: '#8888aa', letterSpacing: '0.1em'}}>Cognome</label>
                            <input type="text" required className="input-dark" value={formData.cognome}
                              onChange={e => setFormData(p => ({...p, cognome: e.target.value}))} placeholder="Rossi" />
                          </div>
                        </div>
                        <div>
                          <label className="text-xs uppercase tracking-widest mb-2 block" style={{color: '#8888aa', letterSpacing: '0.1em'}}>Email</label>
                          <input type="email" required className="input-dark" value={formData.email}
                            onChange={e => setFormData(p => ({...p, email: e.target.value}))} placeholder="mario@email.com" />
                        </div>
                        <div>
                          <label className="text-xs uppercase tracking-widest mb-2 block" style={{color: '#8888aa', letterSpacing: '0.1em'}}>Telefono</label>
                          <input type="tel" required className="input-dark" value={formData.telefono}
                            onChange={e => setFormData(p => ({...p, telefono: e.target.value}))} placeholder="+39 333 1234567" />
                        </div>
                        <div>
                          <label className="text-xs uppercase tracking-widest mb-2 block" style={{color: '#8888aa', letterSpacing: '0.1em'}}>Note (opzionale)</label>
                          <textarea rows={3} className="input-dark resize-none" value={formData.note}
                            onChange={e => setFormData(p => ({...p, note: e.target.value}))} placeholder="Richieste particolari..." />
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button type="button" onClick={() => setStep('info')} className="btn-outline flex-1">Indietro</button>
                        <button type="submit" className="btn-primary flex-1">Rivedi e Conferma</button>
                      </div>
                    </form>
                  )}

                  {/* STEP 3: ORDER CONFIRMATION / RECAP */}
                  {step === 'payment' && (
                    <form onSubmit={handlePayment}>
                      <h2 className="text-2xl mb-2" style={{fontFamily: "'Playfair Display', serif", fontWeight: 500}}>Riepilogo e Invio</h2>
                      <p className="text-sm mb-6" style={{color: '#8888aa'}}>Verifica i dettagli prima di registrare il blocco dell'auto.</p>

                      <div className="rounded-sm p-5 mb-6" style={{background: 'rgba(26,111,212,0.04)', border: '1px solid rgba(26,111,212,0.15)'}}>
                        <div className="flex justify-between mb-2 text-sm">
                          <span style={{color: '#8888aa'}}>Periodo</span>
                          <span>Dal {dateFrom} al {dateTo}</span>
                        </div>
                        <div className="flex justify-between mb-2 text-sm">
                          <span style={{color: '#8888aa'}}>Totale noleggio ({days} gg)</span>
                          <span>€{totalPrice.toLocaleString('it-IT')}</span>
                        </div>
                        <div className="flex justify-between font-semibold pt-3" style={{borderTop: '1px solid rgba(255,255,255,0.07)'}}>
                          <span>Acconto da versare</span>
                          <span style={{color: '#1a6fd4', fontSize: '1.2rem'}}>€{depositAmount}</span>
                        </div>
                      </div>

                      {/* Info Box — Spiegazione Saldo al ritiro */}
                      <div className="p-4 rounded-sm mb-6 text-sm" style={{background: 'rgba(37,99,235,0.07)', border: '1px solid rgba(37,99,235,0.2)', color: '#93c5fd'}}>
                        <div className="flex items-center gap-2 mb-1">
                          <CreditCard size={14} />
                          <span className="font-semibold">Nessun pagamento online richiesto</span>
                        </div>
                        <p style={{color: '#8888aa', fontSize: '0.8rem', lineHeight: 1.5}}>
                          L'acconto e il saldo verranno corrisposti direttamente al ritiro del veicolo o tramite bonifico bancario dopo il contatto telefonico di conferma con i nostri operatori.
                        </p>
                      </div>

                      <div className="flex gap-3">
                        <button type="button" disabled={submitting} onClick={() => setStep('book')} className="btn-outline flex-1">Indietro</button>
                        <button type="submit" disabled={submitting} className="btn-primary flex-1 flex items-center justify-center gap-2">
                          {submitting ? (
                            <>
                              <Loader2 className="animate-spin" size={16} /> Inviando...
                            </>
                          ) : (
                            `Invia Richiesta`
                          )}
                        </button>
                      </div>
                      <p className="text-center text-xs mt-4" style={{color: '#444460'}}>
                        Inviando la richiesta dichiari di accettare le condizioni di noleggio della vettura.
                      </p>
                    </form>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
