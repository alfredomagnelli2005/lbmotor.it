import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request })
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anonKey) {
    return request.nextUrl.pathname === '/admin/login'
      ? response
      : NextResponse.redirect(new URL('/admin/login?error=config', request.url))
  }

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookies) {
        cookies.forEach(({ name, value }) => request.cookies.set(name, value))
        response = NextResponse.next({ request })
        cookies.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
      },
    },
  })
  const { data: { user } } = await supabase.auth.getUser()
  const isAdmin = user?.app_metadata?.role === 'admin'
  if (request.nextUrl.pathname === '/admin/login') {
    if (isAdmin) return NextResponse.redirect(new URL('/admin', request.url))
    return response
  }
  if (!isAdmin) return NextResponse.redirect(new URL('/admin/login', request.url))
  return response
}

export const config = { matcher: ['/admin/:path*'] }
