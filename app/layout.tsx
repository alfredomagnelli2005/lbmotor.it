import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LB Motors | Noleggio & Vendita Auto',
  description: 'Noleggio e vendita auto di lusso. Qualità, eleganza e affidabilità in ogni veicolo.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="it">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  )
}
