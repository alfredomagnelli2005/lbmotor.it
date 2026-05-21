// ============================================================
// API: /api/messaggi
// GET  → tutti i messaggi
// POST → nuovo messaggio (dal form contattaci)
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'

export async function GET() {
  try {
    const db = await getDb()
    const messaggi = await db.collection('messaggi')
      .find({})
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json(
      messaggi.map(m => ({ ...m, id: m._id.toString(), _id: undefined }))
    )
  } catch (error) {
    return NextResponse.json({ error: 'Errore del server' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const db = await getDb()
    const body = await req.json()

    const messaggio = {
      ...body,
      letto: false,
      createdAt: new Date(),
      data: new Date().toISOString().split('T')[0],
    }

    const result = await db.collection('messaggi').insertOne(messaggio)
    return NextResponse.json({ id: result.insertedId.toString() }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Errore del server' }, { status: 500 })
  }
}
