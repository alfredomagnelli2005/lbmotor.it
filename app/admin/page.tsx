'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { CARS_NOLEGGIO, CARS_VENDITA, Car } from '@/lib/data'
import {
 Car as CarIcon, Plus, LogOut, CheckCircle, XCircle,
 Edit3, Trash2, DollarSign, Eye, BarChart2, Users,
 Package, Phone, Mail, Calendar, AlertTriangle,
 TrendingUp, Clock, Star, MessageSquare, Bell, X
} from 'lucide-react'

// ─── TIPI ───────────────────────────────────────────────────
type TabType = 'dashboard' | 'noleggio' | 'vendita' | 'aggiungi' | 'prenotazioni' | 'messaggi'

// ─── DATI MOCK ──────────────────────────────────────────────
// TODO: Sostituire con fetch reale dal database

const MOCK_PRENOTAZIONI = [
 {id:'p1', carName:'BMW Serie 5 530d', cliente:'Mario Rossi', email:'mario@email.com', telefono:'+39 333 1111111', dateFrom:'2024-03-15', dateTo:'2024-03-18', giorni:3, prezzoTotale:360, acconto:108, pagato:true, note:''},
 {id:'p2', carName:'Mercedes Classe E', cliente:'Laura Bianchi', email:'laura@email.com', telefono:'+39 333 2222222', dateFrom:'2024-03-20', dateTo:'2024-03-25', giorni:5, prezzoTotale:650, acconto:195, pagato:false, note:'Richiede seggiolino bimbo'},
 {id:'p3', carName:'Porsche Cayenne', cliente:'Giovanni Ferrari', email:'gio@email.com', telefono:'+39 333 3333333', dateFrom:'2024-04-01', dateTo:'2024-04-03', giorni:2, prezzoTotale:560, acconto:168, pagato:true, note:'Cliente abituale'},
 {id:'p4', carName:'Audi Q5', cliente:'Francesca Esposito', email:'fra@email.com', telefono:'+39 333 4444444', dateFrom:'2024-04-10', dateTo:'2024-04-15', giorni:5, prezzoTotale:700, acconto:210, pagato:false, note:''},
]

const MOCK_MESSAGGI = [
 {id:'m1', nome:'Luca Martini', email:'luca@email.com', telefono:'+39 333 5555555', oggetto:'Informazioni Noleggio', messaggio:'Salve, vorrei sapere se la BMW è disponibile per la settimana di Pasqua. Grazie.', data:'2024-03-12', letto:false},
 {id:'m2', nome:'Sofia Romano', email:'sofia@email.com', telefono:'+39 333 6666666', oggetto:'Vendita Auto', messaggio:'Sono interessata alla Mercedes GLE. Posso venire a vederla domani mattina?', data:'2024-03-11', letto:false},
 {id:'m3', nome:'Andrea Conti', email:'andrea@email.com', telefono:'+39 333 7777777', oggetto:'Assistenza', messaggio:'Ho noleggiato la Porsche la settimana scorsa, tutto perfetto! Volevo ringraziarvi.', data:'2024-03-10', letto:true},
]

export default function AdminDashboard() {
 const router = useRouter()
 const [tab, setTab] = useState<TabType>('dashboard')
 const [carsNoleggio, setCarsNoleggio] = useState(CARS_NOLEGGIO.map(c => ({...c})))
 const [carsVendita, setCarsVendita] = useState(CARS_VENDITA.map(c => ({...c})))
 const [prenotazioni, setPrenotazioni] = useState(MOCK_PRENOTAZIONI)
 const [messaggi, setMessaggi] = useState(MOCK_MESSAGGI)
 const [newCarType, setNewCarType] = useState<'noleggio'|'vendita'>('noleggio')
 const [addSuccess, setAddSuccess] = useState(false)
 const [selectedMsg, setSelectedMsg] = useState<typeof MOCK_MESSAGGI[0] | null>(null)
 const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
 const [editingCar, setEditingCar] = useState<Car | null>(null)
 const [newCar, setNewCar] = useState({brand:'',model:'',year:new Date().getFullYear(),price:0,fuel:'Diesel',transmission:'Automatico',seats:5,color:'',description:'',image:'',km:0})

 useEffect(() => {
 if (typeof window !== 'undefined' && !sessionStorage.getItem('admin_auth')) {
 router.push('/admin/login')
 }
 }, [])

 const nonLetti = messaggi.filter(m => !m.letto).length
 const prenotazioniInAttesa = prenotazioni.filter(p => !p.pagato).length
 const incassoTotale = prenotazioni.filter(p => p.pagato).reduce((s, p) => s + p.acconto, 0)
 const disponibili = carsNoleggio.filter(c => c.available).length

 const handleLogout = () => { sessionStorage.removeItem('admin_auth'); router.push('/admin/login') }
 const toggleAvailability = (id: string) => {
 // TODO: await fetch(`/api/cars/${id}`, { method:'PATCH', body: JSON.stringify({available}) })
 setCarsNoleggio(prev => prev.map(c => c.id === id ? {...c, available: !c.available} : c))
 }
 const markRead = (id: string) => setMessaggi(prev => prev.map(m => m.id === id ? {...m, letto: true} : m))
 const handleAddCar = (e: React.FormEvent) => {
 e.preventDefault()
 const car: Car = {
 id: `${newCarType[0]}${Date.now()}`,
 name: `${newCar.brand} ${newCar.model}`,
 ...newCar, type: newCarType,
 images: [newCar.image || 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800'],
 features: [], available: true,
 }
 // TODO: await fetch('/api/cars', { method:'POST', body: JSON.stringify(car) })
 if (newCarType === 'noleggio') setCarsNoleggio(p => [...p, car])
 else setCarsVendita(p => [...p, car])
 setAddSuccess(true)
 setNewCar({brand:'',model:'',year:new Date().getFullYear(),price:0,fuel:'Diesel',transmission:'Automatico',seats:5,color:'',description:'',image:'',km:0})
 setTimeout(() => setAddSuccess(false), 4000)
 }

 // ─── STILI COMUNI ───────────────────────────────────────
 const s = {
 body: {fontFamily:"'Plus Jakarta Sans', sans-serif"},
 display: {fontFamily:"'Playfair Display', serif"},
 card: {background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:'4px'},
 goldCard: {background:'rgba(26,111,212,0.04)', border:'1px solid rgba(26,111,212,0.15)', borderRadius:'4px'},
 input: {background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)', color:'#f0f0f5', padding:'0.65rem 1rem', borderRadius:'3px', width:'100%', fontFamily:"'Plus Jakarta Sans', sans-serif", fontSize:'0.875rem', outline:'none'},
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

 // ─── COMPONENTE STAT CARD ────────────────────────────────
 const StatCard = ({icon:Icon, label, val, sub, color, onClick}: any) => (
 <div onClick={onClick} style={{...s.card, padding:'1.25rem', cursor: onClick ? 'pointer' : 'default'}}>
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

 return (
 <div style={{minHeight:'100vh', display:'flex', background:'#07070d', ...s.body}}>

 {/* ─── SIDEBAR ─────────────────────────────────────── */}
 <aside style={{width:230, flexShrink:0, display:'flex', flexDirection:'column', background:'#0b0b16', borderRight:'1px solid rgba(255,255,255,0.05)', minHeight:'100vh'}}>
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

 <nav style={{padding:'0.75rem', display:'flex', flexDirection:'column', gap:2, flex:1}}>
 {[
 {id:'dashboard', label:'Dashboard', icon:BarChart2},
 {id:'noleggio', label:'Auto a Noleggio', icon:CarIcon},
 {id:'vendita', label:'Auto in Vendita', icon:Package},
 {id:'prenotazioni', label:'Prenotazioni', icon:Calendar, badge: prenotazioniInAttesa},
 {id:'messaggi', label:'Messaggi', icon:MessageSquare, badge: nonLetti},
 {id:'aggiungi', label:'Aggiungi Auto', icon:Plus},
 ].map(({id, label, badge}) => (
 <button key={id} onClick={() => setTab(id as TabType)} style={s.sideBtn(tab===id)}>
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
 <main style={{flex:1, padding:'2rem 2.5rem', overflowY:'auto'}}>

 {/* ════ DASHBOARD ════ */}
 {tab === 'dashboard' && (
 <div>
 <div style={{marginBottom:'2rem'}}>
 <h1 style={{...s.display, fontSize:'2.2rem', fontWeight:600, marginBottom:'4px'}}>Buongiorno! </h1>
 <p style={{color:'#666680', fontSize:'0.875rem'}}>Ecco un riepilogo di tutto quello che succede in LB Motors oggi.</p>
 </div>

 {/* CARDS RIEPILOGO */}
 <div style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'1rem', marginBottom:'2rem'}}>
 <StatCard icon={CarIcon} label="Auto disponibili ora" val={disponibili} color="#22c55e" onClick={() => setTab('noleggio')} sub={`di ${carsNoleggio.length} totali`}/>
 <StatCard icon={DollarSign} label="Incassato (acconti)" val={`€${incassoTotale}`} color="#1a6fd4" />
 <StatCard icon={Calendar} label="Prenotazioni in attesa" val={prenotazioniInAttesa} color="#f59e0b" onClick={() => setTab('prenotazioni')} sub="da confermare"/>
 <StatCard icon={MessageSquare} label="Nuovi messaggi" val={nonLetti} color="#60a5fa" onClick={() => setTab('messaggi')} sub="non letti"/>
 </div>

 {/* 2 colonne: prenotazioni + messaggi recenti */}
 <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem'}}>

 {/* ULTIME PRENOTAZIONI */}
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
 <div style={{fontSize:'0.72rem', color:'#555570'}}>{p.carName} · {p.dateFrom}</div>
 </div>
 <div style={{display:'flex', alignItems:'center', gap:10}}>
 <span style={{fontSize:'0.85rem', fontWeight:700, color:'#1a6fd4'}}>€{p.acconto}</span>
 <span style={s.badge(p.pagato)}>{p.pagato ? 'Pagato' : 'Attesa'}</span>
 </div>
 </div>
 ))}
 </div>
 </div>

 {/* MESSAGGI RECENTI */}
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
 <div style={{fontSize:'0.72rem', color:'#666680'}}>{m.messaggio.slice(0,60)}...</div>
 </div>
 ))}
 </div>
 </div>
 </div>

 {/* STATO FLOTTA NOLEGGIO */}
 <div style={{...s.goldCard, padding:'1.5rem', marginTop:'1.5rem'}}>
 <h2 style={{...s.display, fontSize:'1.3rem', fontWeight:600, marginBottom:'1rem', color:'#1a6fd4'}}>Stato Flotta Noleggio</h2>
 <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(220px,1fr))', gap:'0.75rem'}}>
 {carsNoleggio.map(car => (
 <div key={car.id} style={{display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 14px', background:'rgba(255,255,255,0.02)', borderRadius:'3px', border:'1px solid rgba(255,255,255,0.06)'}}>
 <div>
 <div style={{fontSize:'0.82rem', fontWeight:600}}>{car.brand}</div>
 <div style={{fontSize:'0.7rem', color:'#555570'}}>{car.model}</div>
 </div>
 <button onClick={() => toggleAvailability(car.id)} style={{...s.badge(!!car.available), cursor:'pointer', border:'none', padding:'4px 10px'}}>
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
 <div style={{display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr 1fr', padding:'12px 16px', borderBottom:'1px solid rgba(255,255,255,0.05)', fontSize:'0.68rem', color:'#444460', fontWeight:600, letterSpacing:'0.08em', textTransform:'uppercase'}}>
 <span>Auto</span><span>Prezzo/giorno</span><span>Anno</span><span>Disponibilità</span><span>Azioni</span>
 </div>
 {carsNoleggio.map((car, i) => (
 <div key={car.id} style={{display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr 1fr', alignItems:'center', padding:'14px 16px', borderBottom: i<carsNoleggio.length-1 ? '1px solid rgba(255,255,255,0.04)' : 'none', background:'rgba(255,255,255,0.01)'}}>
 <div style={{display:'flex', alignItems:'center', gap:10}}>
 <img src={car.image} style={{width:48, height:36, objectFit:'cover', borderRadius:'2px'}} alt={car.name}/>
 <div>
 <div style={{fontSize:'0.85rem', fontWeight:600}}>{car.brand}</div>
 <div style={{fontSize:'0.72rem', color:'#555570'}}>{car.model}</div>
 </div>
 </div>
 <span style={{fontSize:'0.9rem', color:'#1a6fd4', fontWeight:600}}>€{car.price}</span>
 <span style={{fontSize:'0.85rem', color:'#8888aa'}}>{car.year}</span>
 <button onClick={() => toggleAvailability(car.id)}
 style={{...s.badge(!!car.available), cursor:'pointer', border:'none', width:'fit-content'}}>
 {car.available ? <><CheckCircle size={11}/>Disponibile</> : <><XCircle size={11}/>Occupata</>}
 </button>
 <div style={{display:'flex', gap:6}}>
 <button title="Modifica" style={{padding:'6px', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'3px', background:'transparent', color:'#8888aa', cursor:'pointer'}}><Edit3 size={14}/></button>
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
 <p style={{color:'#8888aa', fontSize:'0.875rem', marginBottom:'1.5rem'}}>Questa azione eliminerà l'auto definitivamente. Non si può annullare.</p>
 <div style={{display:'flex', gap:8, justifyContent:'center'}}>
 <button onClick={() => setDeleteConfirm(null)} style={{padding:'0.6rem 1.2rem', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'2px', background:'transparent', color:'#8888aa', cursor:'pointer', fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Annulla</button>
 <button onClick={() => { setCarsNoleggio(p => p.filter(c => c.id !== deleteConfirm)); setDeleteConfirm(null) }}
 style={{padding:'0.6rem 1.2rem', background:'#ef4444', border:'none', borderRadius:'2px', color:'white', cursor:'pointer', fontWeight:600, fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
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
 <div style={{display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr 1fr', padding:'12px 16px', borderBottom:'1px solid rgba(255,255,255,0.05)', fontSize:'0.68rem', color:'#444460', fontWeight:600, letterSpacing:'0.08em', textTransform:'uppercase'}}>
 <span>Auto</span><span>Prezzo</span><span>Anno</span><span>Chilometri</span><span>Azioni</span>
 </div>
 {carsVendita.map((car, i) => (
 <div key={car.id} style={{display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr 1fr', alignItems:'center', padding:'14px 16px', borderBottom: i<carsVendita.length-1 ? '1px solid rgba(255,255,255,0.04)' : 'none', background:'rgba(255,255,255,0.01)'}}>
 <div style={{display:'flex', alignItems:'center', gap:10}}>
 <img src={car.image} style={{width:48, height:36, objectFit:'cover', borderRadius:'2px'}} alt={car.name}/>
 <div>
 <div style={{fontSize:'0.85rem', fontWeight:600}}>{car.brand}</div>
 <div style={{fontSize:'0.72rem', color:'#555570'}}>{car.model}</div>
 </div>
 </div>
 <span style={{fontSize:'0.9rem', color:'#1a6fd4', fontWeight:600}}>€{car.price.toLocaleString('it-IT')}</span>
 <span style={{fontSize:'0.85rem', color:'#8888aa'}}>{car.year}</span>
 <span style={{fontSize:'0.85rem', color:'#8888aa'}}>{car.km?.toLocaleString('it-IT')} km</span>
 <div style={{display:'flex', gap:6}}>
 <button title="Modifica" style={{padding:'6px', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'3px', background:'transparent', color:'#8888aa', cursor:'pointer'}}><Edit3 size={14}/></button>
 <button title="Elimina" style={{padding:'6px', border:'1px solid rgba(239,68,68,0.2)', borderRadius:'3px', background:'transparent', color:'#ef4444', cursor:'pointer'}}><Trash2 size={14}/></button>
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
 <p style={{color:'#666680', fontSize:'0.875rem', marginBottom:'1.5rem'}}>Tutte le prenotazioni ricevute con i dati del cliente e lo stato del pagamento.</p>
 <div style={{display:'flex', flexDirection:'column', gap:12}}>
 {prenotazioni.map(p => (
 <div key={p.id} style={{...s.card, padding:'1.25rem'}}>
 <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:12}}>
 <div style={{display:'flex', flexDirection:'column', gap:8}}>
 <div style={{display:'flex', alignItems:'center', gap:10}}>
 <span style={{fontSize:'1rem', fontWeight:700}}>{p.cliente}</span>
 <span style={s.badge(p.pagato)}>{p.pagato ? <><CheckCircle size={11}/>Acconto pagato</> : <><Clock size={11}/>In attesa di pagamento</>}</span>
 </div>
 <div style={{display:'flex', gap:20, flexWrap:'wrap'}}>
 <span style={{fontSize:'0.8rem', color:'#8888aa', display:'flex', alignItems:'center', gap:5}}><CarIcon size={13}/> {p.carName}</span>
 <span style={{fontSize:'0.8rem', color:'#8888aa', display:'flex', alignItems:'center', gap:5}}><Calendar size={13}/> {p.dateFrom} → {p.dateTo} ({p.giorni} {p.giorni===1?'giorno':'giorni'})</span>
 <span style={{fontSize:'0.8rem', color:'#8888aa', display:'flex', alignItems:'center', gap:5}}><Phone size={13}/> {p.telefono}</span>
 <span style={{fontSize:'0.8rem', color:'#8888aa', display:'flex', alignItems:'center', gap:5}}><Mail size={13}/> {p.email}</span>
 </div>
 {p.note && <div style={{fontSize:'0.78rem', color:'#1a6fd4', background:'rgba(26,111,212,0.06)', padding:'5px 10px', borderRadius:'2px'}}>{p.note}</div>}
 </div>
 <div style={{textAlign:'right'}}>
 <div style={{fontSize:'0.72rem', color:'#555570', marginBottom:'3px'}}>Totale noleggio</div>
 <div style={{fontSize:'1.1rem', fontWeight:700, color:'#f0f0f5'}}>€{p.prezzoTotale}</div>
 <div style={{fontSize:'0.72rem', color:'#555570', marginTop:'4px'}}>Acconto ({30}%)</div>
 <div style={{fontSize:'1rem', fontWeight:700, color:'#1a6fd4'}}>€{p.acconto}</div>
 </div>
 </div>
 {!p.pagato && (
 <div style={{marginTop:'1rem', paddingTop:'1rem', borderTop:'1px solid rgba(255,255,255,0.05)', display:'flex', gap:8}}>
 <a href={`tel:${p.telefono}`} style={{display:'flex', alignItems:'center', gap:6, padding:'7px 14px', background:'rgba(26,111,212,0.08)', border:'1px solid rgba(26,111,212,0.2)', borderRadius:'2px', color:'#1a6fd4', fontSize:'0.78rem', fontWeight:600}}>
 <Phone size={13}/> Chiama il cliente
 </a>
 <a href={`mailto:${p.email}?subject=Conferma prenotazione ${p.carName}`} style={{display:'flex', alignItems:'center', gap:6, padding:'7px 14px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'2px', color:'#8888aa', fontSize:'0.78rem'}}>
 <Mail size={13}/> Manda email
 </a>
 <button onClick={() => setPrenotazioni(prev => prev.map(x => x.id===p.id ? {...x, pagato:true} : x))}
 style={{display:'flex', alignItems:'center', gap:6, padding:'7px 14px', background:'rgba(34,197,94,0.1)', border:'1px solid rgba(34,197,94,0.3)', borderRadius:'2px', color:'#22c55e', fontSize:'0.78rem', fontWeight:600, cursor:'pointer'}}>
 <CheckCircle size={13}/> Segna come pagato
 </button>
 </div>
 )}
 </div>
 ))}
 </div>
 </div>
 )}

 {/* ════ MESSAGGI ════ */}
 {tab === 'messaggi' && (
 <div style={{display:'grid', gridTemplateColumns: selectedMsg ? '1fr 1.2fr' : '1fr', gap:'1.5rem'}}>
 <div>
 <h1 style={{...s.display, fontSize:'2rem', fontWeight:600, marginBottom:'0.5rem'}}>Messaggi</h1>
 <p style={{color:'#666680', fontSize:'0.875rem', marginBottom:'1.5rem'}}>Messaggi ricevuti dal modulo contatti del sito.</p>
 <div style={{display:'flex', flexDirection:'column', gap:8}}>
 {messaggi.map(m => (
 <div key={m.id} onClick={() => { setSelectedMsg(m); markRead(m.id) }}
 style={{
 ...s.card, padding:'1rem 1.25rem', cursor:'pointer',
 background: selectedMsg?.id===m.id ? 'rgba(26,111,212,0.06)' : m.letto ? 'rgba(255,255,255,0.01)' : 'rgba(255,255,255,0.03)',
 border: selectedMsg?.id===m.id ? '1px solid rgba(26,111,212,0.25)' : m.letto ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(26,111,212,0.12)',
 }}>
 <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'5px'}}>
 <span style={{fontWeight: m.letto ? 500 : 700, fontSize:'0.88rem'}}>{m.nome}</span>
 <div style={{display:'flex', alignItems:'center', gap:8}}>
 <span style={{fontSize:'0.68rem', color:'#444460'}}>{m.data}</span>
 {!m.letto && <span style={{background:'#1a6fd4', color:'#07070d', borderRadius:'9999px', fontSize:'0.6rem', padding:'1px 6px', fontWeight:700}}>NUOVO</span>}
 </div>
 </div>
 <div style={{fontSize:'0.75rem', color:'#666680', marginBottom:'3px', fontWeight:600}}>{m.oggetto}</div>
 <div style={{fontSize:'0.75rem', color:'#555570'}}>{m.messaggio.slice(0,80)}...</div>
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
 <div style={{fontSize:'0.78rem', color:'#8888aa', display:'flex', alignItems:'center', gap:8}}><Phone size={13}/> {selectedMsg.telefono}</div>
 <div style={{fontSize:'0.78rem', color:'#8888aa', display:'flex', alignItems:'center', gap:8}}><Calendar size={13}/> {selectedMsg.data}</div>
 </div>
 <div style={{fontSize:'0.875rem', color:'#c0c0d0', lineHeight:1.8, marginBottom:'1.5rem', padding:'1rem', background:'rgba(255,255,255,0.02)', borderRadius:'3px', borderLeft:'3px solid rgba(26,111,212,0.4)'}}>
 {selectedMsg.messaggio}
 </div>
 <div style={{display:'flex', flexDirection:'column', gap:8}}>
 <a href={`tel:${selectedMsg.telefono}`}
 style={{display:'flex', alignItems:'center', justifyContent:'center', gap:8, padding:'0.65rem', background:'rgba(26,111,212,0.08)', border:'1px solid rgba(26,111,212,0.25)', borderRadius:'2px', color:'#1a6fd4', fontSize:'0.82rem', fontWeight:600}}>
 <Phone size={15}/> Chiama {selectedMsg.nome.split(' ')[0]}
 </a>
 <a href={`mailto:${selectedMsg.email}?subject=Re: ${selectedMsg.oggetto}`}
 style={{display:'flex', alignItems:'center', justifyContent:'center', gap:8, padding:'0.65rem', background:'rgba(37,99,235,0.08)', border:'1px solid rgba(37,99,235,0.2)', borderRadius:'2px', color:'#60a5fa', fontSize:'0.82rem', fontWeight:600}}>
 <Mail size={15}/> Rispondi via email
 </a>
 <a href={`https://wa.me/${selectedMsg.telefono.replace(/\D/g,'')}?text=${encodeURIComponent(`Ciao ${selectedMsg.nome.split(' ')[0]}! Ti rispondo riguardo: "${selectedMsg.oggetto}".`)}`} target="_blank" rel="noopener noreferrer"
 style={{display:'flex', alignItems:'center', justifyContent:'center', gap:8, padding:'0.65rem', background:'rgba(37,211,102,0.08)', border:'1px solid rgba(37,211,102,0.2)', borderRadius:'2px', color:'#25d366', fontSize:'0.82rem', fontWeight:600}}>
 Rispondi su WhatsApp
 </a>
 </div>
 </div>
 )}
 </div>
 )}

 {/* ════ AGGIUNGI AUTO ════ */}
 {tab === 'aggiungi' && (
 <div style={{maxWidth:680}}>
 <h1 style={{...s.display, fontSize:'2rem', fontWeight:600, marginBottom:'0.5rem'}}>Aggiungi un'Auto</h1>
 <p style={{color:'#666680', fontSize:'0.875rem', marginBottom:'1.5rem'}}>Compila il form per aggiungere un nuovo veicolo al catalogo del sito.</p>

 {addSuccess && (
 <div style={{display:'flex', alignItems:'center', gap:10, padding:'1rem', background:'rgba(34,197,94,0.08)', border:'1px solid rgba(34,197,94,0.25)', borderRadius:'3px', marginBottom:'1.25rem'}}>
 <CheckCircle size={18} color="#22c55e"/>
 <div>
 <div style={{fontWeight:600, color:'#22c55e', fontSize:'0.875rem'}}>Auto aggiunta con successo! </div>
 <div style={{fontSize:'0.78rem', color:'#555570'}}>Ora puoi vederla nella sezione corrispondente del sito.</div>
 </div>
 </div>
 )}

 {/* Tipo */}
 <div style={{...s.goldCard, padding:'1.25rem', marginBottom:'1.5rem'}}>
 <p style={{fontSize:'0.78rem', color:'#1a6fd4', fontWeight:600, marginBottom:'0.75rem'}}>Prima di tutto: dove vuoi aggiungere quest'auto?</p>
 <div style={{display:'flex', gap:10}}>
 {(['noleggio','vendita'] as const).map(t => (
 <button key={t} onClick={() => setNewCarType(t)} style={{
 flex:1, padding:'0.7rem', borderRadius:'2px', cursor:'pointer', fontSize:'0.875rem', fontWeight: newCarType===t ? 700 : 400,
 background: newCarType===t ? 'linear-gradient(135deg, #1456a8, #1a6fd4)' : 'rgba(255,255,255,0.04)',
 color: newCarType===t ? '#07070d' : '#8888aa',
 border: newCarType===t ? 'none' : '1px solid rgba(255,255,255,0.08)',
 fontFamily:"'Plus Jakarta Sans',sans-serif",
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
 <label style={{fontSize:'0.72rem', color:'#8888aa', display:'block', marginBottom:6, fontWeight:500, letterSpacing:'0.07em', textTransform:'uppercase'}}>Link foto (URL)</label>
 <input style={s.input} placeholder="https://..." value={newCar.image} onChange={e => setNewCar(p => ({...p, image:e.target.value}))}/>
 <p style={{fontSize:'0.7rem', color:'#444460', marginTop:4}}>Incolla un link diretto a una foto dell'auto (es. da Google Drive, Dropbox, o qualsiasi sito).</p>
 </div>
 <div>
 <label style={{fontSize:'0.72rem', color:'#8888aa', display:'block', marginBottom:6, fontWeight:500, letterSpacing:'0.07em', textTransform:'uppercase'}}>Descrizione *</label>
 <textarea required rows={4} style={{...s.input, resize:'none'}} placeholder="Descrivi l'auto: caratteristiche, storia, punti di forza..." value={newCar.description} onChange={e => setNewCar(p => ({...p, description:e.target.value}))}/>
 </div>
 <button type="submit" style={{
 padding:'0.85rem', background:'linear-gradient(135deg, #1456a8, #1a6fd4)', border:'none', borderRadius:'2px',
 color:'#07070d', fontWeight:700, fontSize:'0.875rem', cursor:'pointer', fontFamily:"'Plus Jakarta Sans',sans-serif",
 letterSpacing:'0.05em',
 }}>
 Aggiungi Auto al Sito
 </button>
 </form>
 </div>
 )}
 </main>
 </div>
 )
}
