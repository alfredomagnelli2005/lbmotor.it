'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown, Menu, X } from 'lucide-react'

function LogoSVG() {
  return (
    <svg width="42" height="32" viewBox="0 0 42 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Car body */}
      <path d="M4 22h34v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3z" fill="url(#carBody)"/>
      {/* Car roof - sporty coupe shape */}
      <path d="M6 22L10 13h6l4-4h6l2 4h4l4 9H6z" fill="url(#carBody)"/>
      {/* Windshield */}
      <path d="M16 13l-3 9h14l-2-9H16z" fill="rgba(37,137,255,0.25)"/>
      {/* Speed line */}
      <path d="M1 20 Q6 18 12 19" stroke="url(#speedLine)" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      {/* Wheels */}
      <circle cx="12" cy="24" r="3.5" fill="#0a0a14" stroke="url(#wheelGrad)" strokeWidth="1.5"/>
      <circle cx="30" cy="24" r="3.5" fill="#0a0a14" stroke="url(#wheelGrad)" strokeWidth="1.5"/>
      <circle cx="12" cy="24" r="1.2" fill="url(#wheelGrad)"/>
      <circle cx="30" cy="24" r="1.2" fill="url(#wheelGrad)"/>
      <defs>
        <linearGradient id="carBody" x1="0" y1="13" x2="42" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1a6fd4"/>
          <stop offset="0.5" stopColor="#2589ff"/>
          <stop offset="1" stopColor="#1a6fd4"/>
        </linearGradient>
        <linearGradient id="speedLine" x1="0" y1="0" x2="12" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2589ff" stopOpacity="0"/>
          <stop offset="1" stopColor="#2589ff"/>
        </linearGradient>
        <linearGradient id="wheelGrad" x1="0" y1="0" x2="1" y2="1" gradientUnits="objectBoundingBox">
          <stop stopColor="#c0c8d8"/>
          <stop offset="1" stopColor="#8899aa"/>
        </linearGradient>
      </defs>
    </svg>
  )
}


export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [serviziOpen, setServiziOpen] = useState(false)
  const [leaveTimer, setLeaveTimer] = useState<ReturnType<typeof setTimeout> | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleEnter = () => {
    if (leaveTimer) clearTimeout(leaveTimer)
    setServiziOpen(true)
  }
  const handleLeave = () => {
    const t = setTimeout(() => setServiziOpen(false), 150)
    setLeaveTimer(t)
  }

  const linkStyle = (active: boolean) => ({
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    color: active ? '#1a6fd4' : '#9090b0',
    letterSpacing: '0.08em',
    fontSize: '0.72rem',
    fontWeight: 500 as const,
    textTransform: 'uppercase' as const,
    transition: 'color 0.2s',
  })

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? 'rgba(8,8,14,0.96)' : 'transparent',
        backdropFilter: scrolled ? 'blur(24px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(26,111,212,0.12)' : '1px solid transparent',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-20">

        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3">
          <LogoSVG />
          <span style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '1.3rem',
            fontWeight: 700,
            letterSpacing: '0.1em',
            color: '#f0f0f5',
          }}>
            LB <span style={{color: '#1a6fd4'}}>MOTORS</span>
          </span>
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" style={linkStyle(pathname === '/')}>Home</Link>

          {/* DROPDOWN SERVIZI */}
          <div className="relative" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
            <button
              className="flex items-center gap-1.5"
              style={linkStyle(pathname.startsWith('/noleggio') || pathname.startsWith('/vendita'))}
            >
              Servizi
              <ChevronDown
                size={13}
                style={{
                  transform: serviziOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.25s',
                }}
              />
            </button>

            {serviziOpen && (
              <>
                {/* Ponte invisibile che colma il gap tra bottone e menu */}
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: '-24px',
                  right: '-24px',
                  height: '14px',
                }}/>
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 12px)',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '190px',
                  background: 'rgba(9,9,18,0.99)',
                  border: '1px solid rgba(26,111,212,0.18)',
                  borderRadius: '2px',
                  boxShadow: '0 24px 60px rgba(0,0,0,0.7)',
                  overflow: 'hidden',
                }}>
                  {[
                    {href: '/noleggio', label: 'Noleggio Auto'},
                    {href: '/vendita', label: 'Vendita Auto'},
                  ].map((item, i) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      style={{
                        display: 'block',
                        padding: '14px 20px',
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        letterSpacing: '0.07em',
                        textTransform: 'uppercase' as const,
                        color: pathname === item.href ? '#1a6fd4' : '#8888aa',
                        borderBottom: i === 0 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.color = '#1a6fd4'
                        e.currentTarget.style.background = 'rgba(26,111,212,0.07)'
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.color = pathname === item.href ? '#1a6fd4' : '#8888aa'
                        e.currentTarget.style.background = 'transparent'
                      }}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>

          <Link href="/chi-siamo" style={linkStyle(pathname === '/chi-siamo')}>Chi Siamo</Link>
          <Link href="/contattaci" style={linkStyle(pathname === '/contattaci')}>Contattaci</Link>

          <Link
            href="/contattaci"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              background: 'linear-gradient(135deg, #1a6fd4, #2589ff)',
              color: '#08080e',
              padding: '0.6rem 1.4rem',
              borderRadius: '2px',
              fontSize: '0.72rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase' as const,
            }}
          >
            Richiedi Info
          </Link>
        </div>

        {/* MOBILE TOGGLE */}
        <button className="md:hidden" style={{color: '#1a6fd4'}} onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={24}/> : <Menu size={24}/>}
        </button>
      </div>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div
          className="md:hidden px-6 pb-8 pt-2"
          style={{background: 'rgba(8,8,14,0.99)', borderTop: '1px solid rgba(26,111,212,0.08)'}}
        >
          <div className="flex flex-col">
            {[
              {href: '/', label: 'Home'},
              {href: '/chi-siamo', label: 'Chi Siamo'},
              {href: '/contattaci', label: 'Contattaci'},
            ].map(l => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  padding: '1rem 0',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  textTransform: 'uppercase' as const,
                  letterSpacing: '0.1em',
                  color: '#8888aa',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                }}
              >
                {l.label}
              </Link>
            ))}
            <button
              onClick={() => setServiziOpen(!serviziOpen)}
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem 0',
                fontSize: '0.75rem',
                fontWeight: 500,
                textTransform: 'uppercase' as const,
                letterSpacing: '0.1em',
                color: '#8888aa',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                background: 'none',
                border: 'none',
                width: '100%',
                cursor: 'pointer',
                borderBottomColor: 'rgba(255,255,255,0.05)',
                borderBottomWidth: 1,
                borderBottomStyle: 'solid',
              }}
            >
              Servizi
              <ChevronDown size={13} style={{transform: serviziOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.25s'}}/>
            </button>
            {serviziOpen && (
              <div style={{paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column'}}>
                {[
                  {href: '/noleggio', label: 'Noleggio Auto'},
                  {href: '/vendita', label: 'Vendita Auto'},
                ].map(item => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => { setMobileOpen(false); setServiziOpen(false) }}
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      padding: '0.75rem 0',
                      fontSize: '0.72rem',
                      fontWeight: 500,
                      textTransform: 'uppercase' as const,
                      letterSpacing: '0.08em',
                      color: '#1a6fd4',
                      borderBottom: '1px solid rgba(255,255,255,0.03)',
                    }}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
