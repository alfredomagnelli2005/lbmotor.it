'use client'
import Link from 'next/link'
import { Car, Phone, Mail, MapPin, Instagram, Facebook, Linkedin } from 'lucide-react'
import { COMPANY_INFO } from '@/lib/data'

export default function Footer() {
  return (
    <footer style={{background: '#050508', borderTop: '1px solid rgba(26,111,212,0.1)'}}>
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-sm flex items-center justify-center" style={{background: 'linear-gradient(135deg, #1a6fd4, #2589ff)'}}>
                <Car size={18} color="#08080e" strokeWidth={2.5} />
              </div>
              <span style={{fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', fontWeight: 600, letterSpacing: '0.15em'}}>
                LB <span style={{color: '#1a6fd4'}}>MOTORS</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed" style={{color: '#666680', lineHeight: 1.8}}>
              Eccellenza nel noleggio e vendita di auto premium. Affidabilità, eleganza e servizio personalizzato.
            </p>
            <div className="flex gap-4 mt-6">
              {[Instagram, Facebook, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-sm flex items-center justify-center transition-all duration-300"
                  style={{border: '1px solid rgba(26,111,212,0.2)', color: '#666680'}}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#1a6fd4'; (e.currentTarget as HTMLElement).style.color = '#1a6fd4' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(26,111,212,0.2)'; (e.currentTarget as HTMLElement).style.color = '#666680' }}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-xs uppercase tracking-widest mb-6 font-semibold" style={{color: '#1a6fd4', letterSpacing: '0.2em'}}>Navigazione</h4>
            <div className="flex flex-col gap-3">
              {[
                {href:'/', label:'Home'},
                {href:'/noleggio', label:'Noleggio Auto'},
                {href:'/vendita', label:'Vendita Auto'},
                {href:'/chi-siamo', label:'Chi Siamo'},
                {href:'/contattaci', label:'Contattaci'},
              ].map(link => (
                <Link key={link.href} href={link.href} className="text-sm transition-colors duration-300" style={{color:'#666680'}}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#1a6fd4')}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = '#666680')}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Servizi */}
          <div>
            <h4 className="text-xs uppercase tracking-widest mb-6 font-semibold" style={{color: '#1a6fd4', letterSpacing: '0.2em'}}>Servizi</h4>
            <div className="flex flex-col gap-3">
              {['Noleggio Breve Termine','Noleggio Lungo Termine','Vendita Certificata','Assistenza Clienti','Transfer Aeroportuale','Consegna a Domicilio'].map(s => (
                <span key={s} className="text-sm" style={{color:'#666680'}}>{s}</span>
              ))}
            </div>
          </div>

          {/* Contatti */}
          <div>
            <h4 className="text-xs uppercase tracking-widest mb-6 font-semibold" style={{color: '#1a6fd4', letterSpacing: '0.2em'}}>Contatti</h4>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <MapPin size={16} style={{color:'#1a6fd4', marginTop: 2, flexShrink: 0}} />
                <span className="text-sm" style={{color:'#666680'}}>{COMPANY_INFO.address}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} style={{color:'#1a6fd4', flexShrink: 0}} />
                <a href={`tel:${COMPANY_INFO.phone}`} className="text-sm transition-colors" style={{color:'#666680'}}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#1a6fd4')}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = '#666680')}
                >{COMPANY_INFO.phone}</a>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={16} style={{color:'#1a6fd4', flexShrink: 0}} />
                <a href={`mailto:${COMPANY_INFO.email}`} className="text-sm transition-colors" style={{color:'#666680'}}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#1a6fd4')}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = '#666680')}
                >{COMPANY_INFO.email}</a>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-4 h-4 flex-shrink-0 mt-0.5" style={{color:'#1a6fd4'}}>
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1zm0 2c4.962 0 9 4.038 9 9s-4.038 9-9 9-9-4.038-9-9 4.038-9 9-9zm-.5 4v6.5l5.5 3.3-.8 1.3-6.2-3.7V7h1.5z"/></svg>
                </div>
                <span className="text-sm" style={{color:'#666680'}}>{COMPANY_INFO.orari}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="divider-gold w-full mt-12 mb-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs" style={{color:'#444460', letterSpacing:'0.05em'}}>
            © {new Date().getFullYear()} LB Motors S.r.l. — P.IVA {COMPANY_INFO.piva} — Tutti i diritti riservati
          </p>
          <div className="flex gap-6">
            {['Privacy Policy','Cookie Policy','Termini di Servizio'].map(t => (
              <a key={t} href="#" className="text-xs transition-colors" style={{color:'#444460', letterSpacing:'0.05em'}}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#1a6fd4')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = '#444460')}
              >{t}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
