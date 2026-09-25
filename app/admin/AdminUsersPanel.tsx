'use client'

import { FormEvent, useCallback, useEffect, useState } from 'react'
import { MailPlus, RefreshCw, ShieldCheck, UserPlus } from 'lucide-react'

type AdminUser = {
  id: string
  email: string | null
  created_at: string
  invited_at: string | null
  last_sign_in_at: string | null
  role: 'owner' | 'admin'
}

export default function AdminUsersPanel() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const loadUsers = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/admin/users', { cache: 'no-store' })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Non riesco a caricare gli utenti.')
      setUsers(result.users)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Non riesco a caricare gli utenti.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { void loadUsers() }, [loadUsers])

  const inviteAdmin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSending(true)
    setError('')
    setNotice('')
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Invito non riuscito.')
      setEmail('')
      setNotice(`Invito inviato a ${result.email}. Potrà impostare la password dal link ricevuto.`)
      await loadUsers()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invito non riuscito.')
    } finally {
      setSending(false)
    }
  }

  return (
    <section className="admin-section">
      <div className="admin-section-heading">
        <div>
          <p className="admin-eyebrow">ACCESSI E RUOLI</p>
          <h1>Utenti amministratori</h1>
          <p>Invita collaboratori al gestionale. Solo il tuo account proprietario può gestire questi accessi.</p>
        </div>
        <div className="admin-owner-badge"><ShieldCheck size={16} /> Account proprietario</div>
      </div>

      <div className="admin-user-grid">
        <form className="admin-panel admin-invite-panel" onSubmit={inviteAdmin}>
          <div className="admin-panel-icon"><UserPlus size={19} /></div>
          <h2>Invita un amministratore</h2>
          <p>Invieremo un link sicuro all’indirizzo email. Il collaboratore potrà accedere dopo aver accettato l’invito.</p>
          <label htmlFor="admin-invite-email">Email</label>
          <input
            id="admin-invite-email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
            placeholder="nome@azienda.it"
            value={email}
            onChange={event => setEmail(event.target.value)}
          />
          {error && <p role="alert" className="admin-feedback admin-feedback-error">{error}</p>}
          {notice && <p role="status" className="admin-feedback admin-feedback-success">{notice}</p>}
          <button className="admin-primary-button" disabled={sending} type="submit">
            <MailPlus size={16} /> {sending ? 'Invio invito…' : 'Invia invito'}
          </button>
        </form>

        <div className="admin-panel admin-users-list">
          <div className="admin-panel-title-row">
            <div><h2>Accessi attivi</h2><p>{users.length} account con accesso al gestionale</p></div>
            <button className="admin-icon-button" type="button" onClick={() => void loadUsers()} disabled={loading} aria-label="Aggiorna elenco">
              <RefreshCw size={16} className={loading ? 'admin-spin' : ''} />
            </button>
          </div>
          {loading ? <p className="admin-empty-state">Caricamento utenti…</p> : users.length === 0 ? <p className="admin-empty-state">Nessun utente amministratore trovato.</p> : (
            <div className="admin-users-list-items">
              {users.map(user => (
                <div className="admin-user-row" key={user.id}>
                  <div className="admin-user-avatar">{(user.email || '?').slice(0, 1).toUpperCase()}</div>
                  <div className="admin-user-details"><strong>{user.email || 'Email non disponibile'}</strong><span>{user.last_sign_in_at ? `Ultimo accesso ${new Date(user.last_sign_in_at).toLocaleDateString('it-IT')}` : user.invited_at ? 'Invito inviato · in attesa' : 'Mai effettuato l’accesso'}</span></div>
                  <span className={`admin-role-badge ${user.role === 'owner' ? 'admin-role-owner' : ''}`}>{user.role === 'owner' ? 'Proprietario' : 'Admin'}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <p className="admin-security-note"><ShieldCheck size={15} /> I permessi vengono verificati anche sul server e in Supabase RLS. Gli admin invitati non possono aggiungere altri utenti.</p>
    </section>
  )
}
