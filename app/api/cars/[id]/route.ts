// ============================================================
// API: /api/cars/[id]
// GET    → singola auto
// PATCH  → aggiorna campi (es. available: true/false)
// DELETE → elimina auto
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const db = await getDb()
    const car = await db.collection('cars').findOne({ _id: new ObjectId(params.id) })
    if (!car) return NextResponse.json({ error: 'Auto non trovata' }, { status: 404 })
    return NextResponse.json({ ...car, id: car._id.toString(), _id: undefined })
  } catch (error) {
    return NextResponse.json({ error: 'Errore del server' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const db = await getDb()
    const body = await req.json()

    await db.collection('cars').updateOne(
      { _id: new ObjectId(params.id) },
      { $set: { ...body, updatedAt: new Date() } }
    )
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Errore del server' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const db = await getDb()
    await db.collection('cars').deleteOne({ _id: new ObjectId(params.id) })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Errore del server' }, { status: 500 })
  }
}
