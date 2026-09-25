'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Car, Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'

const supabase = createSupabaseBrowserClient()

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

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
          <h1 className="text-3xl" style={{fontFamily: "'Playfair Display', serif", fontWeight: 500}}>
            LB <span style={{color: '#1a6fd4'}}>MOTORS</span>
          </h1>
          <p className="text-xs uppercase tracking-widest mt-2" style={{color: '#555570', letterSpacing: '0.15em'}}>Area Riservata</p>
        </div>

        {/* Card */}
        <div className="rounded-sm p-8 glass" style={{border: '1px solid rgba(26,111,212,0.2)', boxShadow: '0 40px 80px rgba(0,0,0,0.6)'}}>
          <h2 className="text-2xl mb-2" style={{fontFamily: "'Playfair Display', serif", fontWeight: 500}}>Accesso Admin</h2>
          <p className="text-sm mb-8" style={{color: '#555570'}}>Inserisci le tue credenziali per accedere al pannello di gestione.</p>

          {error && (
            <div className="flex items-center gap-2 p-4 rounded-sm mb-6"
              style={{background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)'}}>
              <AlertCircle size={16} color="#ef4444" />
              <span className="text-sm" style={{color: '#ef4444'}}>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div>
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
            </div>

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
                  placeholder="••••••••"
                />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{color: '#555570'}} onClick={() => setShowPass(!showPass)}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 mt-2"
              style={{opacity: loading ? 0.7 : 1}}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-transparent border-t-current rounded-full animate-spin" />
                  Accesso in corso...
                </>
              ) : (
                <>
                  <Lock size={15} /> Accedi
                </>
              )}
            </button>
          </form>

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
