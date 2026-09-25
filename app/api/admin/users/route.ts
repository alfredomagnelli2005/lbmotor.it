import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

async function getOwnerContext() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anonKey) return { response: NextResponse.json({ error: 'Configurazione Supabase mancante.' }, { status: 503 }) }

  const cookieStore = cookies()
  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: values => values.forEach(({ name, value, options }) => cookieStore.set(name, value, options)),
    },
  })
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || user?.app_metadata?.role !== 'owner') {
    return { response: NextResponse.json({ error: 'Non autorizzato.' }, { status: 403 }) }
  }

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceRoleKey) return { response: NextResponse.json({ error: 'Chiave amministrativa Supabase non configurata.' }, { status: 503 }) }

  const admin = createClient(url, serviceRoleKey, { auth: { autoRefreshToken: false, persistSession: false } })
  return { admin }
}

export async function GET() {
  const context = await getOwnerContext()
  if ('response' in context) return context.response

  const { data, error } = await context.admin.auth.admin.listUsers({ page: 1, perPage: 1000 })
  if (error) return NextResponse.json({ error: error.message }, { status: 502 })

  const users = data.users
    .filter(user => ['admin', 'owner'].includes(user.app_metadata?.role))
    .map(({ id, email, created_at, invited_at, last_sign_in_at, app_metadata }) => ({
      id, email, created_at, invited_at, last_sign_in_at, role: app_metadata?.role,
    }))
    .sort((a, b) => a.role === 'owner' ? -1 : b.role === 'owner' ? 1 : (a.email || '').localeCompare(b.email || ''))

  return NextResponse.json({ users })
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin')
  if (!origin || new URL(origin).origin !== request.nextUrl.origin) {
    return NextResponse.json({ error: 'Richiesta non autorizzata.' }, { status: 403 })
  }
  const context = await getOwnerContext()
  if ('response' in context) return context.response

  let email = ''
  try {
    const body = await request.json()
    email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  } catch {
    return NextResponse.json({ error: 'Richiesta non valida.' }, { status: 400 })
  }
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Inserisci un indirizzo email valido.' }, { status: 400 })
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin
  const { data, error } = await context.admin.auth.admin.inviteUserByEmail(email, {
    redirectTo: new URL('/admin/login', siteUrl).toString(),
  })
  if (error || !data.user) {
    return NextResponse.json({ error: error?.message || 'Invito non riuscito.' }, { status: 400 })
  }

  const { error: roleError } = await context.admin.auth.admin.updateUserById(data.user.id, {
    app_metadata: { ...data.user.app_metadata, role: 'admin' },
  })
  if (roleError) return NextResponse.json({ error: `Utente invitato ma ruolo non assegnato: ${roleError.message}` }, { status: 502 })

  return NextResponse.json({ success: true, email })
}
