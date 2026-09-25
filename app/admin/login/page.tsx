'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Car, Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'

const supabase = createSupabaseBrowserClient()

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [mode, setMode] = useState<'login' | 'setup'>('login')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('mode') !== 'setup') return
    setMode('setup')
    supabase.auth.getSession().then(({ data, error: sessionError }) => {
      if (sessionError || !data.session) {
        setError('Il link non è valido o è scaduto. Richiedi un nuovo link di accesso.')
      } else if (data.session.user.email) {
        setEmail(data.session.user.email)
      }
    })
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
      if (error) throw error
      router.replace('/admin')
      router.refresh()
    } catch {
      setError('Email o password non valide. Riprova.')
    } finally {
      setLoading(false)
    }
  }

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 8) {
      setError('La password deve contenere almeno 8 caratteri.')
      return
    }
    if (password !== passwordConfirm) {
      setError('Le password non corrispondono.')
      return
    }

    setLoading(true)
    setError('')
    const { error: updateError } = await supabase.auth.updateUser({ password })
    if (updateError) {
      setError('Non è stato possibile impostare la password. Richiedi un nuovo link e riprova.')
      setLoading(false)
      return
    }
    router.replace('/admin')
    router.refresh()
  }

  const handlePasswordRecovery = async () => {
    if (!email.trim()) {
      setError('Inserisci prima l’indirizzo email del tuo account.')
      return
    }
    setLoading(true)
    setError('')
    setNotice('')
    const { error: recoveryError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/admin/login?mode=setup`,
    })
    if (recoveryError) setError('Non è stato possibile inviare il link. Riprova tra poco.')
    else setNotice('Se l’indirizzo è registrato, riceverai un link per impostare la password.')
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{background: '#06060c'}}>
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1400&q=80"
          alt="bg"
          className="w-full h-full object-cover"
          style={{filter: 'brightness(0.07)'}}
        />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-sm mb-5"
            style={{background: 'linear-gradient(135deg, #1a6fd4, #2589ff)'}}>
            <Car size={26} color="#06060c" strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl" style={{fontFamily: "'Manrope', sans-serif", fontWeight: 500}}>
            LB <span style={{color: '#1a6fd4'}}>MOTORS</span>
          </h1>
          <p className="text-xs uppercase tracking-widest mt-2" style={{color: '#555570', letterSpacing: '0.15em'}}>Area Riservata</p>
        </div>

        {/* Card */}
        <div className="rounded-sm p-8 glass" style={{border: '1px solid rgba(26,111,212,0.2)', boxShadow: '0 40px 80px rgba(0,0,0,0.6)'}}>
          <h2 className="text-2xl mb-2" style={{fontFamily: "'Manrope', sans-serif", fontWeight: 500}}>{mode === 'setup' ? 'Imposta la password' : 'Accesso Admin'}</h2>
          <p className="text-sm mb-8" style={{color: '#555570'}}>{mode === 'setup' ? 'Scegli una password per accedere al gestionale.' : 'Inserisci le tue credenziali per accedere al pannello di gestione.'}</p>

          {error && (
            <div className="flex items-center gap-2 p-4 rounded-sm mb-6"
              style={{background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)'}}>
              <AlertCircle size={16} color="#ef4444" />
              <span className="text-sm" style={{color: '#ef4444'}}>{error}</span>
            </div>
          )}

          {notice && <p role="status" className="text-sm mb-5" style={{color:'#86d6a3'}}>{notice}</p>}

          <form onSubmit={mode === 'setup' ? handleSetPassword : handleLogin} className="flex flex-col gap-5">
            {mode === 'login' && <div>
            <label className="text-xs uppercase tracking-widest mb-2 block" style={{color: '#8888aa', letterSpacing: '0.12em'}}>Email</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{color: '#555570'}} />
                <input
                  type="email"
                  required
                  className="input-dark"
                  style={{paddingLeft: '2.5rem'}}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@lbmotor.it"
                />
              </div>
            </div>}

            <div>
              <label className="text-xs uppercase tracking-widest mb-2 block" style={{color: '#8888aa', letterSpacing: '0.12em'}}>Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{color: '#555570'}} />
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  className="input-dark"
                  style={{paddingLeft: '2.5rem', paddingRight: '3rem'}}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder={mode === 'setup' ? 'Almeno 8 caratteri' : '••••••••'}
                />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{color: '#555570'}} onClick={() => setShowPass(!showPass)}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {mode === 'setup' && <div>
              <label className="text-xs uppercase tracking-widest mb-2 block" style={{color: '#8888aa', letterSpacing: '0.12em'}}>Conferma password</label>
              <input
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                className="input-dark"
                value={passwordConfirm}
                onChange={event => setPasswordConfirm(event.target.value)}
                placeholder="Ripeti la password"
              />
            </div>}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 mt-2"
              style={{opacity: loading ? 0.7 : 1}}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-transparent border-t-current rounded-full animate-spin" />
                {mode === 'setup' ? 'Salvataggio...' : 'Accesso in corso...'}
                </>
              ) : (
                <>
                  <Lock size={15} /> {mode === 'setup' ? 'Imposta password e accedi' : 'Accedi'}
                </>
              )}
            </button>
          </form>

          {mode === 'login' && <button type="button" onClick={handlePasswordRecovery} disabled={loading} className="w-full text-center text-xs mt-5" style={{color:'#8bbdf0', background:'none', border:0, cursor:'pointer'}}>
            Password dimenticata? Invia link per reimpostarla
          </button>}

          <p className="text-center text-xs mt-6" style={{color: '#333348'}}>
             Area protetta — Accesso solo per personale autorizzato
          </p>
        </div>

        <p className="text-center text-xs mt-6" style={{color: '#333348'}}>
          © {new Date().getFullYear()} LB Motors S.r.l.
        </p>
      </div>
    </div>
  )
}
