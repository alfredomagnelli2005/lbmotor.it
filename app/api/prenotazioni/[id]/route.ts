// ============================================================
// API: /api/prenotazioni/[id]
// PATCH → aggiorna (es. segna come pagata)
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const db = await getDb()
    const body = await req.json()

    await db.collection('prenotazioni').updateOne(
      { _id: new ObjectId(params.id) },
      { $set: { ...body, updatedAt: new Date() } }
    )
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Errore del server' }, { status: 500 })
  }
}
