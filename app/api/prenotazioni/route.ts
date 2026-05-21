// ============================================================
// API: /api/prenotazioni
// GET  → tutte le prenotazioni
// POST → nuova prenotazione
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'

export async function GET() {
  try {
    const db = await getDb()
    const prenotazioni = await db.collection('prenotazioni')
      .find({})
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json(
      prenotazioni.map(p => ({ ...p, id: p._id.toString(), _id: undefined }))
    )
  } catch (error) {
    return NextResponse.json({ error: 'Errore del server' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const db = await getDb()
    const body = await req.json()

    const prenotazione = {
      ...body,
      pagato: false,
      createdAt: new Date(),
    }

    const result = await db.collection('prenotazioni').insertOne(prenotazione)
    return NextResponse.json({ id: result.insertedId.toString() }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Errore del server' }, { status: 500 })
  }
}
