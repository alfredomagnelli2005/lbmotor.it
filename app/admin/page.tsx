'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import AdminUsersPanel from './AdminUsersPanel'
import {
  Car as CarIcon, Plus, LogOut, CheckCircle, XCircle,
  Edit3, Trash2, Eye, BarChart2, Users,
  Package, Phone, Mail, Calendar, AlertTriangle,
  MessageSquare, X, ShieldCheck, Search, RefreshCw
} from 'lucide-react'

// ─── CONFIGURAZIONE SUPABASE LATO CLIENT ────────────────────
const supabase = createSupabaseBrowserClient()

// ─── TIPI ───────────────────────────────────────────────────
type TabType = 'dashboard' | 'noleggio' | 'vendita' | 'aggiungi' | 'prenotazioni' | 'messaggi' | 'utenti'

async function compressImage(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(bitmap.width * scale))
  canvas.height = Math.max(1, Math.round(bitmap.height * scale))
  const context = canvas.getContext('2d')
  if (!context) {
    bitmap.close()
    throw new Error('Impossibile elaborare questa immagine nel browser.')
  }
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close()
  return canvas.toDataURL('image/jpeg', 0.78)
}

export default function AdminDashboard() {
  const router = useRouter()
  const [tab, setTab] = useState<TabType>('dashboard')
  const [isOwner, setIsOwner] = useState(false)
  const [messageQuery, setMessageQuery] = useState('')
  const [messageFilter, setMessageFilter] = useState<'tutti' | 'non-letti'>('tutti')
  const [bookingQuery, setBookingQuery] = useState('')
  const [dataLoading, setDataLoading] = useState(true)
  const [dataError, setDataError] = useState('')
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  // ─── STATI REALI ──────────────────────────────────────────
  const [carsNoleggio, setCarsNoleggio] = useState<any[]>([])
  const [carsVendita, setCarsVendita] = useState<any[]>([])
  const [prenotazioni, setPrenotazioni] = useState<any[]>([])
  const [messaggi, setMessaggi] = useState<any[]>([])

  const [newCarType, setNewCarType] = useState<'noleggio'|'vendita'>('noleggio')
  const [addSuccess, setAddSuccess] = useState(false)
  const [selectedMsg, setSelectedMsg] = useState<any | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [newCar, setNewCar] = useState({brand:'',model:'',year:new Date().getFullYear(),price:0,fuel:'Diesel',transmission:'Automatico',seats:5,color:'',description:'',image:'',km:0})
  const [mainImageFile, setMainImageFile] = useState<File | null>(null)
  const [galleryImageFiles, setGalleryImageFiles] = useState<File[]>([])
  const [savingCar, setSavingCar] = useState(false)
  const [imageInputVersion, setImageInputVersion] = useState(0)

  // ─── CARICAMENTO DATI E REALTIME DA SUPABASE ─────────────────────────
  const refreshDashboard = useCallback(async () => {
    setDataLoading(true)
    setDataError('')
    try {
      const [userResult, carsResult, bookingsResult, messagesResult] = await Promise.all([
        supabase.auth.getUser(),
        supabase.from('cars').select('*').order('created_at', { ascending: false }),
        supabase.from('prenotazioni').select('*').order('created_at', { ascending: false }),
        supabase.from('messaggi').select('*').order('created_at', { ascending: false }),
      ])
      setIsOwner(userResult.data.user?.app_metadata?.role === 'owner')
      const errors = [carsResult.error, bookingsResult.error, messagesResult.error].filter(Boolean)
      if (errors.length) setDataError(`Alcuni dati non sono stati caricati: ${errors.map(error => error?.message).join(' · ')}`)
      if (carsResult.data) {
        setCarsNoleggio(carsResult.data.filter((car: any) => car.type === 'noleggio'))
        setCarsVendita(carsResult.data.filter((car: any) => car.type === 'vendita'))
      }
      if (bookingsResult.data) setPrenotazioni(bookingsResult.data)
      if (messagesResult.data) setMessaggi(messagesResult.data)
      setLastUpdated(new Date())
    } catch (error) {
      setDataError(error instanceof Error ? error.message : 'Errore nel caricamento dei dati.')
    } finally {
      setDataLoading(false)
    }
  }, [])

  useEffect(() => {
    void refreshDashboard()

    // Ascolto in tempo reale per le prenotazioni
    const prenotazioniCanale = supabase
      .channel('realtime-prenotazioni')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'prenotazioni' },
        (payload) => {
          setPrenotazioni((current) => [payload.new, ...current]);
        }
      )
      .subscribe();

    const messaggiCanale = supabase
      .channel('realtime-messaggi')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messaggi' },
        (payload) => {
          setMessaggi(current => [payload.new, ...current.filter(message => message.id !== payload.new.id)])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(prenotazioniCanale);
      supabase.removeChannel(messaggiCanale);
    };
  }, [refreshDashboard]);

  const nonLetti = messaggi.filter(m => !m.letto).length
  const prenotazioniInAttesa = prenotazioni.length
  const disponibili = carsNoleggio.filter(c => c.available).length

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.replace('/admin/login')
    router.refresh()
  }

  // ─── AZIONI AL DATABASE ───────────────────────────────────

  const toggleAvailability = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase.from('cars').update({ available: !currentStatus }).eq('id', id)
    if (!error) {
      setCarsNoleggio(prev => prev.map(c => c.id === id ? {...c, available: !c.available} : c))
    }
  }

  const markRead = async (id: string) => {
    const { error } = await supabase.from('messaggi').update({ letto: true }).eq('id', id)
    if (!error) {
      setMessaggi(prev => prev.map(m => m.id === id ? {...m, letto: true} : m))
    }
  }

  const handleDeleteCar = async () => {
    if (!deleteConfirm) return
    const { error } = await supabase.from('cars').delete().eq('id', deleteConfirm)
    if (!error) {
      setCarsNoleggio(p => p.filter(c => c.id !== deleteConfirm))
      setCarsVendita(p => p.filter(c => c.id !== deleteConfirm))
      setDeleteConfirm(null)
    } else {
      alert("Errore durante l'eliminazione")
    }
  }

  const handleDeleteVendita = async (id: string) => {
    if (confirm('Sei sicuro di voler eliminare questa vettura?')) {
      const { error } = await supabase.from('cars').delete().eq('id', id)
      if (!error) {
        setCarsVendita(p => p.filter(c => c.id !== id))
      }
    }
  }

  const handleAddCar = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingCar(true)

    try {
      const mainImageUrl = mainImageFile ? await compressImage(mainImageFile) : newCar.image.trim()
      if (!mainImageUrl) throw new Error('Seleziona almeno una foto principale oppure inserisci un URL immagine.')
      const galleryUrls = await Promise.all(galleryImageFiles.map(compressImage))

    const carData = {
      brand: newCar.brand,
      model: newCar.model,
      year: newCar.year,
      price: newCar.price,
      fuel: newCar.fuel,
      transmission: newCar.transmission,
      seats: newCar.seats,
      color: newCar.color,
      description: newCar.description,
      km: newCar.km,
      type: newCarType,
      available: true,
      image: mainImageUrl,
      images: [mainImageUrl, ...galleryUrls]
    }

    const { data, error } = await supabase.from('cars').insert([carData]).select()

    if (!error && data) {
      if (newCarType === 'noleggio') setCarsNoleggio(p => [data[0], ...p])
      else setCarsVendita(p => [data[0], ...p])

      setAddSuccess(true)
      setNewCar({brand:'',model:'',year:new Date().getFullYear(),price:0,fuel:'Diesel',transmission:'Automatico',seats:5,color:'',description:'',image:'',km:0})
      setMainImageFile(null)
      setGalleryImageFiles([])
      setImageInputVersion(version => version + 1)
      setTimeout(() => setAddSuccess(false), 4000)
    } else {
      throw error || new Error('Salvataggio non riuscito.')
    }
    } catch (error: any) {
      alert("Errore nel salvataggio: " + (error?.message || error))
    } finally {
      setSavingCar(false)
    }
  }

  // ─── STILI COMUNI (Invariati) ───────────────────────────
  const s = {
    body: {fontFamily:"'Manrope', sans-serif"},
    display: {fontFamily:"'Manrope', sans-serif"},
    card: {background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:'4px'},
    goldCard: {background:'rgba(26,111,212,0.04)', border:'1px solid rgba(26,111,212,0.15)', borderRadius:'4px'},
    input: {background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)', color:'#f0f0f5', padding:'0.65rem 1rem', borderRadius:'3px', width:'100%', fontFamily:"'Manrope', sans-serif", fontSize:'0.875rem', outline:'none'},
    badge: (ok:boolean) => ({
      display:'inline-flex', alignItems:'center', gap:'5px', padding:'3px 10px', borderRadius:'2px', fontSize:'0.72rem', fontWeight:600,
      background: ok ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
      border: `1px solid ${ok ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
      color: ok ? '#22c55e' : '#ef4444',
    }),
    sideBtn: (active:boolean) => ({
      width:'100%', display:'flex', alignItems:'center', gap:'10px', padding:'10px 14px',
      borderRadius:'3px', cursor:'pointer', fontSize:'0.82rem', fontWeight: active ? 600 : 400, textAlign:'left' as const,
      background: active ? 'rgba(26,111,212,0.1)' : 'transparent',
      color: active ? '#1a6fd4' : '#666680',
      border: active ? '1px solid rgba(26,111,212,0.2)' : '1px solid transparent',
      transition:'all 0.2s',
    }),
  }

  // ─── COMPONENTE STAT CARD (Invariato) ───────────────────
  const StatCard = ({icon:Icon, label, val, sub, color, onClick}: any) => (
    <div onClick={onClick} role={onClick ? 'button' : undefined} tabIndex={onClick ? 0 : undefined} onKeyDown={onClick ? e => { if (e.key === 'Enter' || e.key === ' ') onClick() } : undefined} className="admin-stat-card" style={{...s.card, padding:'1.25rem', cursor: onClick ? 'pointer' : 'default'}}>
      <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1rem'}}>
        <div style={{width:40, height:40, borderRadius:'3px', display:'flex', alignItems:'center', justifyContent:'center', background:`${color}18`, border:`1px solid ${color}35`}}>
          <Icon size={18} color={color}/>
        </div>
        {sub !== undefined && (
          <span style={{fontSize:'0.7rem', color:'#555570', fontWeight:500}}>{sub}</span>
        )}
      </div>
      <div style={{...s.display, fontSize:'1.9rem', color, fontWeight:600, marginBottom:'2px'}}>{val}</div>
      <div style={{fontSize:'0.75rem', color:'#555570', fontWeight:500, letterSpacing:'0.04em'}}>{label}</div>
    </div>
  )

  const filteredMessages = messaggi.filter(message => {
    const query = messageQuery.trim().toLocaleLowerCase('it-IT')
    const matchesQuery = !query || [message.nome, message.email, message.oggetto, message.messaggio]
      .some(value => String(value || '').toLocaleLowerCase('it-IT').includes(query))
    return matchesQuery && (messageFilter === 'tutti' || !message.letto)
  })
  const filteredBookings = prenotazioni.filter(booking => {
    const query = bookingQuery.trim().toLocaleLowerCase('it-IT')
    const matchesQuery = !query || [booking.cliente, booking.email, booking.car_name, booking.telefono, booking.date_from]
      .some(value => String(value || '').toLocaleLowerCase('it-IT').includes(query))
    return matchesQuery
  })

  return (
    <div className="admin-shell" style={{minHeight:'100vh', display:'flex', background:'#07070d', ...s.body}}>

      {/* ─── SIDEBAR ─────────────────────────────────────── */}
      <aside className="admin-sidebar" style={{width:250, flexShrink:0, display:'flex', flexDirection:'column', background:'#0b0b16', borderRight:'1px solid rgba(255,255,255,0.05)', minHeight:'100vh'}}>
        <div style={{padding:'1.25rem 1rem', borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
          <div style={{display:'flex', alignItems:'center', gap:10}}>
            <svg width="30" height="30" viewBox="0 0 36 36" fill="none">
              <rect width="36" height="36" rx="3" fill="url(#al1)"/>
              <path d="M7 23h22v2.5a1 1 0 01-1 1H8a1 1 0 01-1-1V23z" fill="#07070d"/>
              <path d="M9.5 23l3.5-7.5h10l3.5 7.5H9.5z" fill="#07070d"/>
              <path d="M13 15.5l2-4.5h6l2 4.5H13z" fill="url(#al2)"/>
              <circle cx="13" cy="25" r="2.2" fill="#07070d" stroke="url(#al2)" strokeWidth="1.2"/>
              <circle cx="23" cy="25" r="2.2" fill="#07070d" stroke="url(#al2)" strokeWidth="1.2"/>
              <defs>
                <linearGradient id="al1" x1="0" y1="0" x2="36" y2="36"><stop stopColor="#1a6fd4"/><stop offset="1" stopColor="#2589ff"/></linearGradient>
                <linearGradient id="al2" x1="10" y1="10" x2="26" y2="26"><stop stopColor="#1a6fd4"/><stop offset="1" stopColor="#2589ff"/></linearGradient>
              </defs>
            </svg>
            <div>
              <div style={{...s.display, fontSize:'1rem', fontWeight:700, letterSpacing:'0.08em', color:'#f0f0f5'}}>LB <span style={{color: '#1a6fd4'}}>MOTORS</span></div>
              <div style={{fontSize:'0.65rem', color:'#444460', letterSpacing:'0.1em'}}>PANNELLO ADMIN</div>
            </div>
          </div>
        </div>

        <nav className="admin-nav" style={{padding:'0.75rem', display:'flex', flexDirection:'column', gap:2, flex:1}}>
          {[
            {id:'dashboard', label:'Dashboard', icon:BarChart2},
            {id:'noleggio', label:'Auto a Noleggio', icon:CarIcon},
            {id:'vendita', label:'Auto in Vendita', icon:Package},
            {id:'prenotazioni', label:'Prenotazioni', icon:Calendar, badge: prenotazioniInAttesa},
            {id:'messaggi', label:'Messaggi', icon:MessageSquare, badge: nonLetti},
            {id:'aggiungi', label:'Aggiungi Auto', icon:Plus},
            ...(isOwner ? [{id:'utenti', label:'Utenti Admin', icon:ShieldCheck}] : []),
          ].map(({id, label, icon:Icon, badge}: any) => (
            <button key={id} aria-current={tab === id ? 'page' : undefined} onClick={() => setTab(id as TabType)} style={s.sideBtn(tab===id)}>
              <Icon size={16} />
              <span style={{flex:1}}>{label}</span>
              {badge ? <span style={{background:'#ef4444', color:'white', borderRadius:'9999px', fontSize:'0.65rem', padding:'1px 7px', fontWeight:700}}>{badge}</span> : null}
            </button>
          ))}
        </nav>

        <div style={{padding:'0.75rem', borderTop:'1px solid rgba(255,255,255,0.05)', display:'flex', flexDirection:'column', gap:4}}>
          <Link href="/" style={{display:'flex', alignItems:'center', gap:8, padding:'9px 14px', color:'#444460', fontSize:'0.78rem', borderRadius:'3px'}}>
            <Eye size={14}/> Vedi il sito
          </Link>
          <button onClick={handleLogout} style={{display:'flex', alignItems:'center', gap:8, padding:'9px 14px', color:'#666680', fontSize:'0.78rem', borderRadius:'3px', border:'1px solid rgba(255,255,255,0.05)', cursor:'pointer', background:'transparent', width:'100%'}}>
            <LogOut size={14}/> Esci
          </button>
        </div>
      </aside>

      {/* ─── MAIN ───────────────────────────────────────── */}
      <main className="admin-main" style={{flex:1, padding:'2rem 2.5rem', overflowY:'auto'}}>
        <div className="admin-topbar">
          <div><span className="admin-eyebrow">LB MOTORS · GESTIONALE</span><div className="admin-topbar-title">{({ dashboard: 'Panoramica', noleggio: 'Flotta noleggio', vendita: 'Auto in vendita', aggiungi: 'Nuovo veicolo', prenotazioni: 'Prenotazioni', messaggi: 'Centro messaggi', utenti: 'Utenti admin' } as Record<TabType, string>)[tab]}</div></div>
          <div className="admin-topbar-actions"><span className="admin-live-dot" /> {lastUpdated ? `Aggiornato alle ${lastUpdated.toLocaleTimeString('it-IT', {hour:'2-digit', minute:'2-digit'})}` : 'Dati live'}<button className="admin-icon-button" type="button" onClick={() => void refreshDashboard()} disabled={dataLoading} aria-label="Aggiorna dati"><RefreshCw size={15} className={dataLoading ? 'admin-spin' : ''}/></button></div>
        </div>
        {dataError && <div className="admin-data-error" role="alert"><AlertTriangle size={16}/><span>{dataError}</span><button type="button" onClick={() => void refreshDashboard()}>Riprova</button></div>}

        {/* ════ DASHBOARD ════ */}
        {tab === 'dashboard' && (
          <div>
            <div style={{marginBottom:'2rem'}}>
              <h1 style={{...s.display, fontSize:'2.2rem', fontWeight:600, marginBottom:'4px'}}>Buongiorno!</h1>
              <p style={{color:'#666680', fontSize:'0.875rem'}}>Ecco un riepilogo di tutto quello che succede in LB Motors oggi.</p>
            </div>

            <div className="admin-stats-grid" style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'1rem', marginBottom:'2rem'}}>
              <StatCard icon={CarIcon} label="Auto disponibili ora" val={disponibili} color="#22c55e" onClick={() => setTab('noleggio')} sub={`di ${carsNoleggio.length} totali`}/>
              <StatCard icon={Calendar} label="Richieste prenotazione" val={prenotazioniInAttesa} color="#f59e0b" onClick={() => setTab('prenotazioni')} sub="da ricontattare"/>
              <StatCard icon={MessageSquare} label="Nuovi messaggi" val={nonLetti} color="#60a5fa" onClick={() => setTab('messaggi')} sub="non letti"/>
            </div>

            <div className="admin-panels-grid" style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem'}}>
              <div style={{...s.card, padding:'1.5rem'}}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.25rem'}}>
                  <h2 style={{...s.display, fontSize:'1.3rem', fontWeight:600}}>Ultime Prenotazioni</h2>
                  <button onClick={() => setTab('prenotazioni')} style={{fontSize:'0.72rem', color:'#1a6fd4', cursor:'pointer', background:'none', border:'none'}}>Vedi tutte →</button>
                </div>
                <div style={{display:'flex', flexDirection:'column', gap:8}}>
                  {prenotazioni.slice(0,3).map(p => (
                    <div key={p.id} style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 12px', background:'rgba(255,255,255,0.02)', borderRadius:'3px', border:'1px solid rgba(255,255,255,0.04)'}}>
                      <div>
                        <div style={{fontSize:'0.85rem', fontWeight:600, marginBottom:'2px'}}>{p.cliente}</div>
                        <div style={{fontSize:'0.72rem', color:'#555570'}}>{p.car_name || p.carName} · {p.date_from || p.dateFrom}</div>
                      </div>
                      <div style={{display:'flex', alignItems:'center', gap:10}}>
                        <span style={{fontSize:'0.85rem', fontWeight:700, color:'#1a6fd4'}}>€{p.prezzo_totale}</span>
                        <span style={s.badge(true)}>Da ricontattare</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{...s.card, padding:'1.5rem'}}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.25rem'}}>
                  <h2 style={{...s.display, fontSize:'1.3rem', fontWeight:600}}>Messaggi Recenti</h2>
                  <button onClick={() => setTab('messaggi')} style={{fontSize:'0.72rem', color:'#1a6fd4', cursor:'pointer', background:'none', border:'none'}}>Vedi tutti →</button>
                </div>
                <div style={{display:'flex', flexDirection:'column', gap:8}}>
                  {messaggi.slice(0,3).map(m => (
                    <div key={m.id} onClick={() => { setSelectedMsg(m); setTab('messaggi'); markRead(m.id) }}
                      style={{padding:'10px 12px', background: m.letto ? 'rgba(255,255,255,0.01)' : 'rgba(26,111,212,0.04)', borderRadius:'3px', border:`1px solid ${m.letto ? 'rgba(255,255,255,0.04)' : 'rgba(26,111,212,0.15)'}`, cursor:'pointer'}}>
                      <div style={{display:'flex', justifyContent:'space-between', marginBottom:'3px'}}>
                        <span style={{fontSize:'0.82rem', fontWeight: m.letto ? 400 : 700}}>{m.nome}</span>
                        {!m.letto && <span style={{fontSize:'0.62rem', background:'#1a6fd4', color:'#07070d', padding:'1px 6px', borderRadius:'9999px', fontWeight:700}}>NUOVO</span>}
                      </div>
                      <div style={{fontSize:'0.72rem', color:'#666680'}}>{m.messaggio ? m.messaggio.slice(0,60) : ''}...</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{...s.goldCard, padding:'1.5rem', marginTop:'1.5rem'}}>
              <h2 style={{...s.display, fontSize:'1.3rem', fontWeight:600, marginBottom:'1rem', color:'#1a6fd4'}}>Stato Flotta Noleggio</h2>
              <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(220px,1fr))', gap:'0.75rem'}}>
                {carsNoleggio.map(car => (
                  <div key={car.id} style={{display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 14px', background:'rgba(255,255,255,0.02)', borderRadius:'3px', border:'1px solid rgba(255,255,255,0.06)'}}>
                    <div>
                      <div style={{fontSize:'0.82rem', fontWeight:600}}>{car.brand}</div>
                      <div style={{fontSize:'0.7rem', color:'#555570'}}>{car.model}</div>
                    </div>
                    <button onClick={() => toggleAvailability(car.id, car.available)} style={{...s.badge(!!car.available), cursor:'pointer', border:'none', padding:'4px 10px'}}>
                      {car.available ? <><CheckCircle size={11}/>Libera</> : <><XCircle size={11}/>Occupata</>}
                    </button>
                  </div>
                ))}
              </div>
              <p style={{fontSize:'0.72rem', color:'#555570', marginTop:'0.75rem'}}>Clicca su una macchina per cambiarla da libera a occupata (e viceversa)</p>
            </div>
          </div>
        )}

        {/* ════ NOLEGGIO ════ */}
        {tab === 'noleggio' && (
          <div>
            <h1 style={{...s.display, fontSize:'2rem', fontWeight:600, marginBottom:'0.5rem'}}>Auto a Noleggio</h1>
            <p style={{color:'#666680', fontSize:'0.875rem', marginBottom:'1.5rem'}}>Gestisci la disponibilità di ogni veicolo. Clicca il pulsante verde/rosso per cambiarla istantaneamente.</p>
            <div style={{...s.card, overflow:'hidden'}}>
              <div className="admin-vehicle-header" style={{display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr 1fr', padding:'12px 16px', borderBottom:'1px solid rgba(255,255,255,0.05)', fontSize:'0.68rem', color:'#444460', fontWeight:600, letterSpacing:'0.08em', textTransform:'uppercase'}}>
                <span>Auto</span><span>Prezzo/giorno</span><span>Anno</span><span>Disponibilità</span><span>Azioni</span>
              </div>
              {carsNoleggio.map((car, i) => (
                <div className="admin-vehicle-row admin-vehicle-rental" key={car.id} style={{display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr 1fr', alignItems:'center', padding:'14px 16px', borderBottom: i<carsNoleggio.length-1 ? '1px solid rgba(255,255,255,0.04)' : 'none', background:'rgba(255,255,255,0.01)'}}>
                  <div style={{display:'flex', alignItems:'center', gap:10}}>
                    <img src={car.image} style={{width:48, height:36, objectFit:'cover', borderRadius:'2px'}} alt={car.model}/>
                    <div>
                      <div style={{fontSize:'0.85rem', fontWeight:600}}>{car.brand}</div>
                      <div style={{fontSize:'0.72rem', color:'#555570'}}>{car.model}</div>
                    </div>
                  </div>
                  <span style={{fontSize:'0.9rem', color:'#1a6fd4', fontWeight:600}}>€{car.price}</span>
                  <span style={{fontSize:'0.85rem', color:'#8888aa'}}>{car.year}</span>
                  <button onClick={() => toggleAvailability(car.id, car.available)}
                    style={{...s.badge(!!car.available), cursor:'pointer', border:'none', width:'fit-content'}}>
                    {car.available ? <><CheckCircle size={11}/>Disponibile</> : <><XCircle size={11}/>Occupata</>}
                  </button>
                  <div style={{display:'flex', gap:6}}>
                    <button onClick={() => setDeleteConfirm(car.id)} title="Elimina" style={{padding:'6px', border:'1px solid rgba(239,68,68,0.2)', borderRadius:'3px', background:'transparent', color:'#ef4444', cursor:'pointer'}}><Trash2 size={14}/></button>
                  </div>
                </div>
              ))}
            </div>
            {deleteConfirm && (
              <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:100}}>
                <div style={{background:'#10101c', border:'1px solid rgba(239,68,68,0.3)', borderRadius:'4px', padding:'2rem', maxWidth:360, textAlign:'center'}}>
                  <AlertTriangle size={36} color="#ef4444" style={{margin:'0 auto 1rem'}}/>
                  <h3 style={{...s.display, fontSize:'1.3rem', marginBottom:'0.5rem'}}>Sei sicuro?</h3>
                  <p style={{color:'#8888aa', fontSize:'0.875rem', marginBottom:'1.5rem'}}>Questa azione eliminerà l'auto definitivamente dal database. Non si può annullare.</p>
                  <div style={{display:'flex', gap:8, justifyContent:'center'}}>
                    <button onClick={() => setDeleteConfirm(null)} style={{padding:'0.6rem 1.2rem', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'2px', background:'transparent', color:'#8888aa', cursor:'pointer', fontFamily:"'Manrope',sans-serif"}}>Annulla</button>
                    <button onClick={handleDeleteCar}
                      style={{padding:'0.6rem 1.2rem', background:'#ef4444', border:'none', borderRadius:'2px', color:'white', cursor:'pointer', fontWeight:600, fontFamily:"'Manrope',sans-serif"}}>
                      Sì, elimina
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ════ VENDITA ════ */}
        {tab === 'vendita' && (
          <div>
            <h1 style={{...s.display, fontSize:'2rem', fontWeight:600, marginBottom:'0.5rem'}}>Auto in Vendita</h1>
            <p style={{color:'#666680', fontSize:'0.875rem', marginBottom:'1.5rem'}}>Gestisci gli annunci di vendita. Puoi aggiungere nuovi veicoli dal menu "Aggiungi Auto".</p>
            <div style={{...s.card, overflow:'hidden'}}>
              <div className="admin-vehicle-header" style={{display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr 1fr', padding:'12px 16px', borderBottom:'1px solid rgba(255,255,255,0.05)', fontSize:'0.68rem', color:'#444460', fontWeight:600, letterSpacing:'0.08em', textTransform:'uppercase'}}>
                <span>Auto</span><span>Prezzo</span><span>Anno</span><span>Chilometri</span><span>Azioni</span>
              </div>
              {carsVendita.map((car, i) => (
                <div className="admin-vehicle-row admin-vehicle-sale" key={car.id} style={{display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr 1fr', alignItems:'center', padding:'14px 16px', borderBottom: i<carsVendita.length-1 ? '1px solid rgba(255,255,255,0.04)' : 'none', background:'rgba(255,255,255,0.01)'}}>
                  <div style={{display:'flex', alignItems:'center', gap:10}}>
                    <img src={car.image} style={{width:48, height:36, objectFit:'cover', borderRadius:'2px'}} alt={car.model}/>
                    <div>
                      <div style={{fontSize:'0.85rem', fontWeight:600}}>{car.brand}</div>
                      <div style={{fontSize:'0.72rem', color:'#555570'}}>{car.model}</div>
                    </div>
                  </div>
                  <span style={{fontSize:'0.9rem', color:'#1a6fd4', fontWeight:600}}>€{car.price?.toLocaleString('it-IT')}</span>
                  <span style={{fontSize:'0.85rem', color:'#8888aa'}}>{car.year}</span>
                  <span style={{fontSize:'0.85rem', color:'#8888aa'}}>{car.km?.toLocaleString('it-IT')} km</span>
                  <div style={{display:'flex', gap:6}}>
                    <button onClick={() => handleDeleteVendita(car.id)} title="Elimina" style={{padding:'6px', border:'1px solid rgba(239,68,68,0.2)', borderRadius:'3px', background:'transparent', color:'#ef4444', cursor:'pointer'}}><Trash2 size={14}/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ════ PRENOTAZIONI ════ */}
{tab === 'prenotazioni' && (
  <div>
    <h1 style={{...s.display, fontSize:'2rem', fontWeight:600, marginBottom:'0.5rem'}}>Prenotazioni</h1>
    <p style={{color:'#666680', fontSize:'0.875rem', marginBottom:'1.5rem'}}>Richieste ricevute: contatta il cliente per verificare disponibilità e concordare i dettagli.</p>
    <div className="admin-message-toolbar">
      <label className="admin-search"><Search size={16}/><input value={bookingQuery} onChange={event => setBookingQuery(event.target.value)} placeholder="Cerca cliente, auto, email" aria-label="Cerca prenotazioni" /></label>
    </div>
    <div style={{display:'flex', flexDirection:'column', gap:12}}>
      {filteredBookings.length === 0 ? (
        <div style={{...s.card, padding:'2rem', textAlign:'center', color:'#666680'}}>
          {prenotazioni.length === 0 ? 'Nessuna prenotazione trovata.' : 'Nessuna prenotazione corrisponde ai filtri.'}
        </div>
      ) : (
        filteredBookings.map(p => {
          // Mappatura flessibile dei campi per evitare che errori di maiuscole/minuscole nascondano i dati
          const clienteNome = p.cliente || p.clienteNome || p.nome || p.name || "Cliente Anonimo";
          const telefonoNum = p.telefono || p.phone || "N/D";
          const emailIndirizzo = p.email || "N/D";
          const autoScelta = p.car_name || p.carName || p.auto || "Auto non specificata";
          const dataInizio = p.date_from || p.dateFrom || p.data_inizio || "N/D";
          const dataFine = p.date_to || p.dateTo || p.data_fine || "N/D";
          const totaleGiorni = p.giorni || p.days || 0;
          const prezzoTotale = p.prezzo_totale || p.prezzoTotale || p.total_price || p.prezzo || 0;

          return (
            <div key={p.id || p._id} style={{...s.card, padding:'1.25rem'}}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:12}}>
                <div style={{display:'flex', flexDirection:'column', gap:8}}>
                  <div style={{display:'flex', alignItems:'center', gap:10}}>
                    <span style={{fontSize:'1rem', fontWeight:700}}>{clienteNome}</span>
                    <span style={s.badge(true)}>Da ricontattare</span>
                  </div>
                  <div style={{display:'flex', gap:20, flexWrap:'wrap'}}>
                    <span style={{fontSize:'0.8rem', color:'#8888aa', display:'flex', alignItems:'center', gap:5}}><CarIcon size={13}/> {autoScelta}</span>
                    <span style={{fontSize:'0.8rem', color:'#8888aa', display:'flex', alignItems:'center', gap:5}}><Calendar size={13}/> {dataInizio} → {dataFine} ({totaleGiorni} {totaleGiorni===1?'giorno':'giorni'})</span>
                    <span style={{fontSize:'0.8rem', color:'#8888aa', display:'flex', alignItems:'center', gap:5}}><Phone size={13}/> {telefonoNum}</span>
                    <span style={{fontSize:'0.8rem', color:'#8888aa', display:'flex', alignItems:'center', gap:5}}><Mail size={13}/> {emailIndirizzo}</span>
                  </div>
                  {p.note && <div style={{fontSize:'0.78rem', color:'#1a6fd4', background:'rgba(26,111,212,0.06)', padding:'5px 10px', borderRadius:'2px'}}>{p.note}</div>}
                </div>
                <div style={{textAlign:'right'}}>
                  <div style={{fontSize:'0.72rem', color:'#555570', marginBottom:'3px'}}>Totale noleggio</div>
                  <div style={{fontSize:'1.1rem', fontWeight:700, color:'#f0f0f5'}}>€{prezzoTotale}</div>
                </div>
              </div>
              <div style={{marginTop:'1rem', paddingTop:'1rem', borderTop:'1px solid rgba(255,255,255,0.05)', display:'flex', gap:8, flexWrap:'wrap'}}>
                  <a href={`tel:${telefonoNum}`} style={{display:'flex', alignItems:'center', gap:6, padding:'7px 14px', background:'rgba(26,111,212,0.08)', border:'1px solid rgba(26,111,212,0.2)', borderRadius:'2px', color:'#1a6fd4', fontSize:'0.78rem', fontWeight:600}}>
                    <Phone size={13}/> Chiama il cliente
                  </a>
                  <a href={`mailto:${emailIndirizzo}?subject=Conferma prenotazione ${autoScelta}`} style={{display:'flex', alignItems:'center', gap:6, padding:'7px 14px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'2px', color:'#8888aa', fontSize:'0.78rem'}}>
                    <Mail size={13}/> Manda email
                  </a>
              </div>
            </div>
          );
        })
      )}
    </div>
  </div>
)}

        {/* ════ MESSAGGI ════ */}
        {tab === 'messaggi' && (
          <div className={`admin-messages-layout ${selectedMsg ? 'has-selection' : ''}`} style={{display:'grid', gridTemplateColumns: selectedMsg ? '1fr 1.2fr' : '1fr', gap:'1.5rem'}}>
            <div>
              <h1 style={{...s.display, fontSize:'2rem', fontWeight:600, marginBottom:'0.5rem'}}>Messaggi</h1>
              <div className="admin-message-toolbar">
                <label className="admin-search"><Search size={16}/><input value={messageQuery} onChange={event => setMessageQuery(event.target.value)} placeholder="Cerca nome, email o messaggio" aria-label="Cerca messaggi" /></label>
                <div className="admin-filter-pills" role="group" aria-label="Filtra messaggi">
                  <button className={messageFilter === 'tutti' ? 'active' : ''} onClick={() => setMessageFilter('tutti')}>Tutti <span>{messaggi.length}</span></button>
                  <button className={messageFilter === 'non-letti' ? 'active' : ''} onClick={() => setMessageFilter('non-letti')}>Da leggere <span>{nonLetti}</span></button>
                </div>
              </div>
              <div style={{display:'flex', flexDirection:'column', gap:8}}>
                {filteredMessages.length === 0 ? <div className="admin-empty-state">{messaggi.length ? 'Nessun messaggio corrisponde ai filtri.' : 'Non hai ancora ricevuto messaggi dal sito.'}</div> : filteredMessages.map(m => (
                  <div className="admin-message-card" role="button" tabIndex={0} key={m.id} onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setSelectedMsg(m); if (!m.letto) void markRead(m.id) } }} onClick={() => { setSelectedMsg(m); if (!m.letto) void markRead(m.id) }} aria-pressed={selectedMsg?.id === m.id}
                    style={{
                      ...s.card, padding:'1rem 1.25rem', cursor:'pointer',
                      background: selectedMsg?.id===m.id ? 'rgba(26,111,212,0.06)' : m.letto ? 'rgba(255,255,255,0.01)' : 'rgba(255,255,255,0.03)',
                      border: selectedMsg?.id===m.id ? '1px solid rgba(26,111,212,0.25)' : m.letto ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(26,111,212,0.12)',
                      textAlign:'left', width:'100%', color:'inherit', fontFamily:'inherit',
                    }}>
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'5px'}}>
                      <span style={{fontWeight: m.letto ? 500 : 700, fontSize:'0.88rem'}}>{m.nome}</span>
                      <div style={{display:'flex', alignItems:'center', gap:8}}>
                        <span style={{fontSize:'0.68rem', color:'#444460'}}>{new Date(m.created_at || m.data).toLocaleDateString()}</span>
                        {!m.letto && <span style={{background:'#1a6fd4', color:'#07070d', borderRadius:'9999px', fontSize:'0.6rem', padding:'1px 6px', fontWeight:700}}>NUOVO</span>}
                      </div>
                    </div>
                    <div style={{fontSize:'0.75rem', color:'#666680', marginBottom:'3px', fontWeight:600}}>{m.oggetto}</div>
                    <div style={{fontSize:'0.75rem', color:'#555570'}}>{m.messaggio ? m.messaggio.slice(0,80) : ''}...</div>
                  </div>
                ))}
              </div>
            </div>

            {selectedMsg && (
              <div style={{...s.card, padding:'1.5rem', position:'sticky', top:'1rem', height:'fit-content'}}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'1.25rem'}}>
                  <h2 style={{...s.display, fontSize:'1.3rem', fontWeight:600}}>{selectedMsg.oggetto}</h2>
                  <button onClick={() => setSelectedMsg(null)} style={{background:'none', border:'none', color:'#555570', cursor:'pointer'}}><X size={18}/></button>
                </div>
                <div style={{display:'flex', flexDirection:'column', gap:6, marginBottom:'1.25rem', padding:'1rem', background:'rgba(255,255,255,0.02)', borderRadius:'3px'}}>
                  <div style={{fontSize:'0.78rem', color:'#8888aa', display:'flex', alignItems:'center', gap:8}}><Users size={13}/> <strong style={{color:'#f0f0f5'}}>{selectedMsg.nome}</strong></div>
                  <div style={{fontSize:'0.78rem', color:'#8888aa', display:'flex', alignItems:'center', gap:8}}><Mail size={13}/> {selectedMsg.email}</div>
                  {selectedMsg.telefono && <div style={{fontSize:'0.78rem', color:'#8888aa', display:'flex', alignItems:'center', gap:8}}><Phone size={13}/> {selectedMsg.telefono}</div>}
                  <div style={{fontSize:'0.78rem', color:'#8888aa', display:'flex', alignItems:'center', gap:8}}><Calendar size={13}/> {new Date(selectedMsg.created_at || selectedMsg.data).toLocaleDateString()}</div>
                </div>
                <div style={{fontSize:'0.875rem', color:'#c0c0d0', lineHeight:1.8, marginBottom:'1.5rem', padding:'1rem', background:'rgba(255,255,255,0.02)', borderRadius:'3px', borderLeft:'3px solid rgba(26,111,212,0.4)'}}>
                  {selectedMsg.messaggio}
                </div>
                <div style={{display:'flex', flexDirection:'column', gap:8}}>
                  {selectedMsg.telefono && <a href={`tel:${selectedMsg.telefono}`}
                    style={{display:'flex', alignItems:'center', justifyContent:'center', gap:8, padding:'0.65rem', background:'rgba(26,111,212,0.08)', border:'1px solid rgba(26,111,212,0.25)', borderRadius:'2px', color:'#1a6fd4', fontSize:'0.82rem', fontWeight:600}}>
                    <Phone size={15}/> Chiama {selectedMsg.nome ? selectedMsg.nome.split(' ')[0] : 'Cliente'}
                  </a>}
                  <a href={`mailto:${selectedMsg.email}?subject=Re: ${selectedMsg.oggetto}`}
                    style={{display:'flex', alignItems:'center', justifyContent:'center', gap:8, padding:'0.65rem', background:'rgba(37,99,235,0.08)', border:'1px solid rgba(37,99,235,0.2)', borderRadius:'2px', color:'#60a5fa', fontSize:'0.82rem', fontWeight:600}}>
                    <Mail size={15}/> Rispondi via email
                  </a>
                  {selectedMsg.telefono && <a href={`https://wa.me/${selectedMsg.telefono.replace(/\D/g,'')}?text=${encodeURIComponent(`Ciao ${selectedMsg.nome ? selectedMsg.nome.split(' ')[0] : ''}! Ti rispondo riguardo: "${selectedMsg.oggetto}".`)}`} target="_blank" rel="noopener noreferrer"
                    style={{display:'flex', alignItems:'center', justifyContent:'center', gap:8, padding:'0.65rem', background:'rgba(37,211,102,0.08)', border:'1px solid rgba(37,211,102,0.2)', borderRadius:'2px', color:'#25d366', fontSize:'0.82rem', fontWeight:600}}>
                    Rispondi su WhatsApp
                  </a>}
                </div>
              </div>
            )}
          </div>
        )}

        {tab === 'utenti' && isOwner && <AdminUsersPanel />}

        {/* ════ AGGIUNGI AUTO ════ */}
        {tab === 'aggiungi' && (
          <div style={{maxWidth:680}}>
            <h1 style={{...s.display, fontSize:'2rem', fontWeight:600, marginBottom:'0.5rem'}}>Aggiungi un'Auto</h1>
            <p style={{color:'#666680', fontSize:'0.875rem', marginBottom:'1.5rem'}}>Compila il form per aggiungere un nuovo veicolo al catalogo del sito (direttamente sul DB).</p>

            {addSuccess && (
              <div style={{display:'flex', alignItems:'center', gap:10, padding:'1rem', background:'rgba(34,197,94,0.08)', border:'1px solid rgba(34,197,94,0.25)', borderRadius:'3px', marginBottom:'1.25rem'}}>
                <CheckCircle size={18} color="#22c55e"/>
                <div>
                  <div style={{fontWeight:600, color:'#22c55e', fontSize:'0.875rem'}}>Auto aggiunta con successo nel database!</div>
                  <div style={{fontSize:'0.78rem', color:'#555570'}}>Ora puoi vederla nella sezione corrispondente del sito.</div>
                </div>
              </div>
            )}

            {/* Tipo */}
            <div style={{...s.goldCard, padding:'1.25rem', marginBottom:'1.5rem'}}>
              <p style={{fontSize:'0.78rem', color:'#1a6fd4', fontWeight:600, marginBottom:'0.75rem'}}>Prima di tutto: dove vuoi aggiungere quest'auto?</p>
              <div style={{display:'flex', gap:10}}>
                {(['noleggio','vendita'] as const).map(t => (
                  <button key={t} type="button" onClick={() => setNewCarType(t)} style={{
                    flex:1, padding:'0.7rem', borderRadius:'2px', cursor:'pointer', fontSize:'0.875rem', fontWeight: newCarType===t ? 700 : 400,
                    background: newCarType===t ? 'linear-gradient(135deg, #1456a8, #1a6fd4)' : 'rgba(255,255,255,0.04)',
                    color: newCarType===t ? '#07070d' : '#8888aa',
                    border: newCarType===t ? 'none' : '1px solid rgba(255,255,255,0.08)',
                    fontFamily:"'Manrope',sans-serif",
                  }}>
                    {t === 'noleggio' ? 'Sezione Noleggio' : 'Sezione Vendita'}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleAddCar} style={{display:'flex', flexDirection:'column', gap:16}}>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:14}}>
                <div>
                  <label style={{fontSize:'0.72rem', color:'#8888aa', display:'block', marginBottom:6, fontWeight:500, letterSpacing:'0.07em', textTransform:'uppercase'}}>Marca *</label>
                  <input required style={s.input} placeholder="es. BMW" value={newCar.brand} onChange={e => setNewCar(p => ({...p, brand:e.target.value}))}/>
                </div>
                <div>
                  <label style={{fontSize:'0.72rem', color:'#8888aa', display:'block', marginBottom:6, fontWeight:500, letterSpacing:'0.07em', textTransform:'uppercase'}}>Modello *</label>
                  <input required style={s.input} placeholder="es. Serie 5 530d" value={newCar.model} onChange={e => setNewCar(p => ({...p, model:e.target.value}))}/>
                </div>
              </div>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:14}}>
                <div>
                  <label style={{fontSize:'0.72rem', color:'#8888aa', display:'block', marginBottom:6, fontWeight:500, letterSpacing:'0.07em', textTransform:'uppercase'}}>Anno *</label>
                  <input type="number" required style={s.input} value={newCar.year} onChange={e => setNewCar(p => ({...p, year:+e.target.value}))}/>
                </div>
                <div>
                  <label style={{fontSize:'0.72rem', color:'#8888aa', display:'block', marginBottom:6, fontWeight:500, letterSpacing:'0.07em', textTransform:'uppercase'}}>{newCarType==='noleggio' ? 'Prezzo/giorno (€) *' : 'Prezzo di vendita (€) *'}</label>
                  <input type="number" required style={s.input} value={newCar.price} onChange={e => setNewCar(p => ({...p, price:+e.target.value}))}/>
                </div>
                <div>
                  <label style={{fontSize:'0.72rem', color:'#8888aa', display:'block', marginBottom:6, fontWeight:500, letterSpacing:'0.07em', textTransform:'uppercase'}}>Posti *</label>
                  <input type="number" required style={s.input} value={newCar.seats} onChange={e => setNewCar(p => ({...p, seats:+e.target.value}))}/>
                </div>
              </div>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:14}}>
                <div>
                  <label style={{fontSize:'0.72rem', color:'#8888aa', display:'block', marginBottom:6, fontWeight:500, letterSpacing:'0.07em', textTransform:'uppercase'}}>Carburante</label>
                  <select style={{...s.input, cursor:'pointer'}} value={newCar.fuel} onChange={e => setNewCar(p => ({...p, fuel:e.target.value}))}>
                    {['Diesel','Benzina','Ibrido','Elettrico','GPL'].map(f => <option key={f} style={{background:'#0a0a14'}}>{f}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{fontSize:'0.72rem', color:'#8888aa', display:'block', marginBottom:6, fontWeight:500, letterSpacing:'0.07em', textTransform:'uppercase'}}>Cambio</label>
                  <select style={{...s.input, cursor:'pointer'}} value={newCar.transmission} onChange={e => setNewCar(p => ({...p, transmission:e.target.value}))}>
                    {['Automatico','Manuale'].map(t => <option key={t} style={{background:'#0a0a14'}}>{t}</option>)}
                  </select>
                </div>
              </div>
              {newCarType==='vendita' && (
                <div>
                  <label style={{fontSize:'0.72rem', color:'#8888aa', display:'block', marginBottom:6, fontWeight:500, letterSpacing:'0.07em', textTransform:'uppercase'}}>Chilometri</label>
                  <input type="number" style={s.input} value={newCar.km} onChange={e => setNewCar(p => ({...p, km:+e.target.value}))} placeholder="es. 45000"/>
                </div>
              )}
              <div>
                <label style={{fontSize:'0.72rem', color:'#8888aa', display:'block', marginBottom:6, fontWeight:500, letterSpacing:'0.07em', textTransform:'uppercase'}}>Colore</label>
                <input style={s.input} placeholder="es. Nero Metallizzato" value={newCar.color} onChange={e => setNewCar(p => ({...p, color:e.target.value}))}/>
              </div>
              <div>
                <label style={{fontSize:'0.72rem', color:'#8888aa', display:'block', marginBottom:6, fontWeight:500, letterSpacing:'0.07em', textTransform:'uppercase'}}>Foto principale *</label>
                <input key={`main-${imageInputVersion}`} type="file" accept="image/*" style={s.input} onChange={e => setMainImageFile(e.target.files?.[0] || null)}/>
                {mainImageFile && <p style={{fontSize:'0.7rem', color:'#8888aa', marginTop:4}}>{mainImageFile.name}</p>}
                <p style={{fontSize:'0.7rem', color:'#666680', marginTop:4}}>Oppure inserisci un URL immagine già online.</p>
                <input style={{...s.input, marginTop:8}} placeholder="https://..." value={newCar.image} onChange={e => setNewCar(p => ({...p, image:e.target.value}))}/>
              </div>
              <div>
                <label style={{fontSize:'0.72rem', color:'#8888aa', display:'block', marginBottom:6, fontWeight:500, letterSpacing:'0.07em', textTransform:'uppercase'}}>Altre immagini</label>
                <input key={`gallery-${imageInputVersion}`} type="file" accept="image/*" multiple style={s.input} onChange={e => setGalleryImageFiles(Array.from(e.target.files || []))}/>
                {galleryImageFiles.length > 0 && <p style={{fontSize:'0.7rem', color:'#8888aa', marginTop:4}}>{galleryImageFiles.length} immagini selezionate</p>}
              </div>
              <div>
                <label style={{fontSize:'0.72rem', color:'#8888aa', display:'block', marginBottom:6, fontWeight:500, letterSpacing:'0.07em', textTransform:'uppercase'}}>Descrizione *</label>
                <textarea required rows={4} style={{...s.input, resize:'none'}} placeholder="Descrivi l'auto: caratteristiche, storia, punti di forza..." value={newCar.description} onChange={e => setNewCar(p => ({...p, description:e.target.value}))}/>
              </div>
              <button type="submit" disabled={savingCar} style={{
                padding:'0.85rem', background:'linear-gradient(135deg, #1456a8, #1a6fd4)', border:'none', borderRadius:'2px',
                color:'#07070d', fontWeight:700, fontSize:'0.875rem', cursor:'pointer', fontFamily:"'Manrope',sans-serif",
                letterSpacing:'0.05em',
              }}>
                {savingCar ? 'Ottimizzazione immagini e salvataggio…' : 'Aggiungi Auto al Sito'}
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  )
}
